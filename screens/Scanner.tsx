
import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleGenAI } from "@google/genai";

const Scanner: React.FC = () => {
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [status, setStatus] = useState('READY TO SNAP');
  const [error, setError] = useState<string | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  const setupCamera = async () => {
    setError(null);
    setStatus('STARTING CAMERA...');
    try {
      const newStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      setStream(newStream);
      if (videoRef.current) {
        videoRef.current.srcObject = newStream;
      }
      setStatus('READY TO SNAP');
    } catch (err: any) {
      try {
        const fallbackStream = await navigator.mediaDevices.getUserMedia({ video: true });
        setStream(fallbackStream);
        if (videoRef.current) {
          videoRef.current.srcObject = fallbackStream;
        }
        setStatus('READY TO SNAP');
      } catch (fallbackErr: any) {
        setError(fallbackErr.message || 'CAMERA NOT FOUND');
        setStatus('CAMERA ERROR');
      }
    }
  };

  useEffect(() => {
    setupCamera();
    return () => {
      if (stream) {
        stream.getTracks().forEach(t => t.stop());
      }
    };
  }, []);

  const analyzeImage = async () => {
    if (!capturedImage) return;

    setIsAnalyzing(true);
    setStatus('ISOLATING GARMENT...');

    try {
      const base64Data = capturedImage.split(',')[1];
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

      const imagePart = {
        inlineData: {
          mimeType: 'image/jpeg',
          data: base64Data
        }
      };

      const textPart = {
        text: `Analyze this image. 
        1. Identify the clothing item. Provide its name, category (Tops, Bottoms, Outer, Dresses), colorway, and 3 style tags. Format this as a JSON object.
        2. Generate a new version of this exact garment isolated on a pure white background. Remove all background elements, humans, and distractions. Only the clothing should remain.`
      };

      // Using gemini-2.5-flash-image for image-to-image background removal and editing
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: { parts: [imagePart, textPart] },
        // Note: responseMimeType is not supported for gemini-2.5-flash-image
      });

      let extractedJson = {
        name: 'New Drop',
        category: 'Tops',
        colorway: 'Default',
        tags: ['Fresh']
      };
      let isolatedImageUrl = capturedImage;

      if (response.candidates && response.candidates[0].content.parts) {
        for (const part of response.candidates[0].content.parts) {
          if (part.text) {
            try {
              // Attempt to extract JSON if the model provided it in the text part
              const jsonMatch = part.text.match(/\{[\s\S]*\}/);
              if (jsonMatch) {
                extractedJson = JSON.parse(jsonMatch[0]);
              }
            } catch (e) {
              console.warn('Failed to parse text JSON', e);
            }
          }
          if (part.inlineData) {
            // Found the generated isolated image part
            isolatedImageUrl = `data:image/png;base64,${part.inlineData.data}`;
          }
        }
      }

      navigate('/item-detail/new', {
        state: {
          aiData: extractedJson,
          image: isolatedImageUrl
        }
      });
    } catch (err) {
      console.error('AI isolation failed:', err);
      setStatus('ZAP FAILED - RETRY?');
      setIsAnalyzing(false);
    }
  };

  const handleCapture = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const video = videoRef.current;

    const MAX_SIZE = 1024;
    let width = video.videoWidth;
    let height = video.videoHeight;

    if (width > height) {
      if (width > MAX_SIZE) {
        height *= MAX_SIZE / width;
        width = MAX_SIZE;
      }
    } else {
      if (height > MAX_SIZE) {
        width *= MAX_SIZE / height;
        height = MAX_SIZE;
      }
    }

    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, width, height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
      setCapturedImage(dataUrl);
      setStatus('REVIEW PHOTO');

      if (stream) {
        stream.getTracks().forEach(t => t.stop());
      }
    }
  };

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCapturedImage(reader.result as string);
        setStatus('REVIEW PHOTO');
        setError(null); // Clear any camera errors
        // Stop stream if active to save resources
        if (stream) {
          stream.getTracks().forEach(t => t.stop());
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRetake = () => {
    setCapturedImage(null);
    setIsAnalyzing(false);
    setupCamera();
  };

  return (
    <div className="relative h-screen bg-black overflow-hidden font-sans">
      {!capturedImage ? (
        <video ref={videoRef} autoPlay playsInline className="absolute inset-0 w-full h-full object-cover grayscale-[0.2] brightness-75" />
      ) : (
        <img src={capturedImage} className="absolute inset-0 w-full h-full object-cover" alt="Captured" />
      )}

      <canvas ref={canvasRef} className="hidden" />

      {/* Viewfinder Overlay */}
      <div className="absolute inset-0 flex items-center justify-center p-8 z-10 pointer-events-none">
        <div className={`w-full aspect-square max-w-[320px] border-[6px] relative shadow-[0_0_0_1000px_rgba(0,0,0,0.6)] ${capturedImage ? 'border-pop-pink' : 'border-pop-orange'}`}>
          <div className="absolute -top-1 -left-1 w-8 h-8 border-t-[8px] border-l-[8px] border-white"></div>
          <div className="absolute -top-1 -right-1 w-8 h-8 border-t-[8px] border-r-[8px] border-white"></div>
          <div className="absolute -bottom-1 -left-1 w-8 h-8 border-b-[8px] border-l-[8px] border-white"></div>
          <div className="absolute -bottom-1 -right-1 w-8 h-8 border-b-[8px] border-r-[8px] border-white"></div>

          {isAnalyzing && (
            <div className="absolute inset-0 bg-pop-pink/20 overflow-hidden">
              <div className="w-full h-2 bg-pop-orange absolute top-0 animate-[scan_1.5s_infinite] shadow-[0_0_15px_#FF8B50]" />
            </div>
          )}
        </div>
      </div>

      {error && (
        <div className="absolute inset-0 z-50 bg-black/90 flex flex-col items-center justify-center p-10 text-center">
          <div className="starburst size-24 mb-6 flex items-center justify-center">
            <span className="material-symbols-outlined text-white text-4xl">no_photography</span>
          </div>
          <h2 className="text-white font-pop text-2xl uppercase mb-4">Camera Error</h2>
          <p className="text-pop-pink font-bold text-sm mb-8">{error}</p>
          <div className="flex flex-col gap-4 w-full max-w-xs">
            <button
              onClick={setupCamera}
              className="w-full bg-pop-orange border-4 border-black px-8 py-3 font-pop text-lg shadow-[6px_6px_0px_white] active:translate-x-1 active:translate-y-1 active:shadow-none"
            >
              RETRY CAMERA
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full bg-white border-4 border-black px-8 py-3 font-pop text-lg shadow-[6px_6px_0px_white] active:translate-x-1 active:translate-y-1 active:shadow-none flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined">image</span>
              PICK FROM GALLERY
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="relative z-20 flex items-center p-6 justify-between bg-klein-blue border-b-4 border-black pt-12 shadow-lg">
        <button onClick={() => navigate('/')} className="text-white flex size-10 items-center justify-center bg-black border-2 border-white rounded-lg active-pop">
          <span className="material-symbols-outlined">close</span>
        </button>
        <div className="flex flex-col items-center">
          <h2 className="text-white text-2xl font-pop tracking-tight italic uppercase leading-none">STASH SCAN</h2>
          <p className="text-pop-pink text-[10px] font-black uppercase tracking-widest mt-1">{status}</p>
        </div>
        <div className="flex size-10 items-center justify-center bg-pop-orange border-2 border-black rounded-lg text-black">
          <span className="material-symbols-outlined font-bold">{capturedImage ? 'check' : 'blur_on'}</span>
        </div>
      </div>

      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        onChange={handleFileUpload}
        className="hidden"
      />

      {/* Controls Container */}
      <div className="absolute bottom-12 left-0 right-0 z-30 flex flex-col items-center gap-6">
        {!capturedImage ? (
          <div className="flex items-center gap-8">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex shrink-0 items-center justify-center rounded-full size-14 bg-white border-4 border-black active-pop shadow-[4px_4px_0px_rgba(0,0,0,0.5)]"
            >
              <span className="material-symbols-outlined text-black font-bold">image</span>
            </button>

            <button
              onClick={handleCapture}
              disabled={!!error}
              className={`relative flex shrink-0 items-center justify-center rounded-full size-24 border-4 border-black shadow-[0_0_30px_rgba(255,139,80,0.5)] transition-all ${!!error ? 'bg-gray-400 opacity-50' : 'bg-pop-orange active:scale-90 active:bg-pop-pink'}`}
            >
              <div className="size-16 border-4 border-black/20 rounded-full flex items-center justify-center">
                <div className="size-10 bg-white rounded-full"></div>
              </div>
              {!error && <div className="absolute -top-4 bg-white border-2 border-black px-2 py-0.5 font-comic text-xs uppercase shadow-sm">SNAP!</div>}
            </button>

            <div className="flex shrink-0 items-center justify-center rounded-full size-14 bg-white border-4 border-black opacity-30">
              <span className="material-symbols-outlined text-black font-bold">bolt</span>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-6 w-full px-8">
            <div className="flex gap-4 w-full justify-center">
              <button
                onClick={handleRetake}
                disabled={isAnalyzing}
                className="flex-1 bg-white border-4 border-black text-black font-pop py-4 shadow-[4px_4px_0px_black] active-pop flex items-center justify-center gap-2 uppercase italic text-sm"
              >
                <span className="material-symbols-outlined">refresh</span>
                RETAKE
              </button>

              <button
                onClick={analyzeImage}
                disabled={isAnalyzing}
                className={`flex-[2] bg-pop-orange border-4 border-black text-white font-pop py-4 shadow-[4px_4px_0px_black] active-pop flex items-center justify-center gap-3 uppercase italic text-lg ${isAnalyzing ? 'opacity-50 grayscale' : ''}`}
              >
                {isAnalyzing ? (
                  <span className="material-symbols-outlined animate-spin">refresh</span>
                ) : (
                  <span className="material-symbols-outlined">magic_button</span>
                )}
                {isAnalyzing ? 'ISOLATING...' : 'ZAP & ISOLATE'}
              </button>
            </div>
            <p className="text-white font-comic text-sm uppercase bg-black/50 px-4 py-1 rounded-full border border-white/20">Isolate garment & remove background!</p>
          </div>
        )}
      </div>

      <style>{`
        @keyframes scan {
          0% { top: -5% }
          50% { top: 100% }
          100% { top: -5% }
        }
      `}</style>
    </div>
  );
};

export default Scanner;
