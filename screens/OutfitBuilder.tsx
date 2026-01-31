
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { itemsService } from '../services/items';
import { outfitsService } from '../services/outfits';
import { GoogleGenAI } from "@google/genai";
import { Outfit, WardrobeItem } from '../types';

const OutfitBuilder: React.FC = () => {
  const navigate = useNavigate();
  const [inventory, setInventory] = useState<WardrobeItem[]>([]);
  const [canvasItems, setCanvasItems] = useState<WardrobeItem[]>([]);

  // AI Suggesting state
  const [isAiSuggesting, setIsAiSuggesting] = useState(false);
  const [aiMessage, setAiMessage] = useState<string | null>(null);

  // Review & Save state
  const [isReviewing, setIsReviewing] = useState(false);
  const [reviewName, setReviewName] = useState('');
  const [reviewTags, setReviewTags] = useState<string[]>([]);
  const [isFinalizing, setIsFinalizing] = useState(false);

  useEffect(() => {
    const loadInventory = async () => {
      try {
        // Load items from backend
        const allItems = await itemsService.getAll();
        setInventory(allItems);

        // Default canvas if empty
        if (allItems.length >= 2 && canvasItems.length === 0) {
          setCanvasItems([allItems[0], allItems[1]]);
        }
      } catch (error) {
        console.error("Failed to load inventory", error);
      }
    };

    loadInventory();
  }, []);

  const getExistingTags = async () => {
    try {
      const allOutfits = await outfitsService.getAll();
      const tags = new Set<string>();
      allOutfits.forEach(o => o.tags.forEach(t => tags.add(t)));
      return Array.from(tags);
    } catch {
      return [];
    }
  };

  const askAiStylist = async () => {
    if (inventory.length === 0) return;
    setIsAiSuggesting(true);
    setAiMessage("POW! MIXING THE VIBES...");

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const simplifiedInventory = inventory.map(i => ({ id: i.id, name: i.name, tags: i.tags }));

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [{
          role: 'user',
          parts: [{ text: `You are a pop-art fashion expert. Given these items: ${JSON.stringify(simplifiedInventory)}, suggest a cool 2-4 item outfit. Return ONLY a JSON object with: outfitName, itemIds (array of strings), and styleReason (max 10 words).` }]
        }],
        config: { responseMimeType: "application/json" }
      });

      const result = JSON.parse(response.text || '{}');
      const suggestedItems = inventory.filter(i => result.itemIds?.map(id => String(id)).includes(String(i.id)));

      if (suggestedItems.length > 0) {
        setCanvasItems(suggestedItems);
        setAiMessage(`"${result.outfitName}" - ${result.styleReason}`);
      } else {
        setAiMessage("KABOOM! NO COMBO FOUND.");
      }
    } catch (err) {
      console.error(err);
      setAiMessage("ZZZT! STYLING ERROR.");
    } finally {
      setIsAiSuggesting(false);
      setTimeout(() => setAiMessage(null), 4000);
    }
  };

  const handleStartReview = async () => {
    if (canvasItems.length === 0) return;
    setIsReviewing(true);
    setReviewName("GENERATING NAME...");

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const itemNames = canvasItems.map(i => i.name).join(", ");
      const existingTags = await getExistingTags();

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [{
          role: 'user',
          parts: [{
            text: `I've built an outfit with these items: ${itemNames}. 
          Generate a punchy, short, 2-3 word pop-art inspired name for this look and 3 relevant fashion tags. 
          IMPORTANT: Try to reuse tags from this existing list if they fit the look: [${existingTags.join(", ")}]. 
          Only create a brand new tag if none of the existing ones match the vibe. 
          Return JSON: { "name": "...", "tags": ["tag1", "tag2", "tag3"] }` }]
        }],
        config: { responseMimeType: "application/json" }
      });

      const result = JSON.parse(response.text || '{}');
      setReviewName(result.name || "My New Look");
      setReviewTags(result.tags || ["Custom", "Fresh"]);
    } catch (err) {
      console.error("AI naming failed", err);
      setReviewName(`Look #${Math.floor(Math.random() * 1000)}`);
      setReviewTags(["Custom", "Style"]);
    }
  };

  const handleFinalSave = async () => {
    setIsFinalizing(true);

    try {
      const newOutfit: Omit<Outfit, 'id'> = {
        name: reviewName,
        items: canvasItems,
        tags: reviewTags,
        season: 'Any',
        year: new Date().getFullYear(),
        isFavorite: false
      };

      await outfitsService.create(newOutfit);

      setTimeout(() => {
        navigate('/catalog');
      }, 500);
    } catch (error) {
      console.error("Failed to save outfit", error);
      alert("Failed to save outfit!");
      setIsFinalizing(false);
    }
  };

  const addToCanvas = (item: WardrobeItem) => {
    if (canvasItems.length < 4) {
      setCanvasItems(prev => [...prev, item]);
    }
  };

  return (
    <div className="flex flex-col bg-pop-grey-2 min-h-screen relative overflow-hidden">
      {/* Review Overlay */}
      {isReviewing && (
        <div className="fixed inset-0 z-[100] bg-black/60 flex items-center justify-center p-6 animate-[fadeIn_0.3s_ease-out]">
          <div className="w-full max-w-sm bg-white border-4 border-black relative shadow-[12px_12px_0px_black] overflow-hidden flex flex-col">
            <div className="absolute top-0 right-0 p-4">
              <button onClick={() => setIsReviewing(false)} className="size-10 bg-black text-white flex items-center justify-center active-pop">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="halftone-pink p-8 border-b-4 border-black flex flex-col items-center">
              <div className="starburst size-24 mb-4 flex items-center justify-center -rotate-12">
                <span className="material-symbols-outlined text-white text-4xl">celebration</span>
              </div>
              <h2 className="font-pop text-2xl text-center uppercase italic leading-tight">Review Look</h2>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <label className="font-black text-[10px] uppercase tracking-widest text-gray-500 block mb-1">Catchy Name</label>
                <input
                  value={reviewName}
                  onChange={(e) => setReviewName(e.target.value)}
                  className="w-full h-14 border-4 border-black bg-white px-4 font-pop text-lg uppercase italic focus:ring-pop-orange"
                />
              </div>

              <div>
                <label className="font-black text-[10px] uppercase tracking-widest text-gray-500 block mb-1">Tags</label>
                <div className="flex flex-wrap gap-2">
                  {reviewTags.map((tag, i) => (
                    <span key={i} className="bg-pop-grey-2 border-2 border-black px-2 py-1 font-black text-[10px] uppercase flex items-center gap-1">
                      {tag}
                      <span onClick={() => setReviewTags(prev => prev.filter((_, idx) => idx !== i))} className="material-symbols-outlined text-xs cursor-pointer">close</span>
                    </span>
                  ))}
                  <button
                    onClick={() => {
                      const newTag = prompt("Add Tag:");
                      if (newTag && newTag.trim()) {
                        const normalized = newTag.trim().toUpperCase();
                        if (!reviewTags.includes(normalized)) {
                          setReviewTags(prev => [...prev, normalized]);
                        }
                      }
                    }}
                    className="border-2 border-black border-dashed px-2 py-1 font-black text-[10px] uppercase opacity-60"
                  >
                    + ADD
                  </button>
                </div>
              </div>

              <button
                onClick={handleFinalSave}
                disabled={isFinalizing}
                className={`w-full bg-pop-orange border-4 border-black py-4 font-pop text-xl text-white shadow-[6px_6px_0px_black] active-pop flex items-center justify-center gap-3 ${isFinalizing ? 'opacity-50' : ''}`}
              >
                {isFinalizing ? (
                  <span className="material-symbols-outlined animate-spin">refresh</span>
                ) : (
                  <>
                    <span className="material-symbols-outlined">bolt</span>
                    <span>SAVE TO ARCHIVE</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Builder UI */}
      <div className="sticky top-0 bg-white border-b-4 border-black p-4 pt-12 pb-4 justify-between z-30 flex items-center shadow-sm">
        <button onClick={() => navigate(-1)} className="text-klein-blue flex size-10 shrink-0 items-center justify-center active-pop">
          <span className="material-symbols-outlined text-[32px] font-bold">arrow_back</span>
        </button>
        <h1 className="text-black text-2xl font-pop uppercase tracking-tighter flex-1 text-center italic -rotate-1">BUILDER</h1>
        <button
          onClick={askAiStylist}
          disabled={isAiSuggesting}
          className={`flex items-center gap-1.5 px-3 py-1.5 bg-klein-blue text-white border-2 border-black font-pop uppercase text-[10px] shadow-[4px_4px_0px_black] active-pop shrink-0 ${isAiSuggesting ? 'opacity-50' : ''}`}
        >
          <span className={`material-symbols-outlined text-sm ${isAiSuggesting ? 'animate-spin' : ''}`}>magic_button</span>
          <span>AI VIBE</span>
        </button>
      </div>

      <div className="flex-1 relative p-4 flex flex-col">
        {aiMessage && (
          <div className="absolute top-4 left-4 right-4 z-50 animate-[pop_0.4s_ease-out]">
            <div className="bg-pop-pink border-4 border-black p-4 relative shadow-[8px_8px_0px_black]">
              <p className="font-comic text-sm uppercase text-black leading-tight">{aiMessage}</p>
              <div className="absolute -bottom-2 right-6 w-5 h-5 bg-pop-pink border-r-4 border-b-4 border-black rotate-45"></div>
            </div>
          </div>
        )}

        <div className="w-full flex-1 canvas-grid overflow-hidden rounded-2xl border-4 border-black relative bg-white min-h-[400px]">
          <div className="absolute top-4 left-4 z-20 flex gap-2">
            <button
              onClick={() => setCanvasItems([])}
              className="flex items-center gap-2 px-3 py-1.5 bg-white border-2 border-black text-black font-black uppercase text-[10px] active-pop shadow-[3px_3px_0px_black]"
            >
              <span className="material-symbols-outlined text-sm">delete_sweep</span>
              <span>Clear</span>
            </button>
          </div>

          <div className="relative w-full h-full p-8 flex flex-col items-center justify-center overflow-y-auto no-scrollbar">
            {canvasItems.length === 0 ? (
              <div className="text-center opacity-20 py-20">
                <span className="material-symbols-outlined text-8xl">grid_view</span>
                <p className="font-pop uppercase text-lg mt-2">Blank Slate</p>
                <p className="text-[12px] font-black italic">Pick pieces from your closet below</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-x-8 gap-y-12 p-4 pt-12">
                {canvasItems.map((item, idx) => (
                  <div
                    key={`${item.id}-${idx}`}
                    className={`w-32 sm:w-40 aspect-[3/4] bg-white border-4 border-black p-3 relative group transition-transform hover:scale-105 shadow-[6px_6px_0px_rgba(0,0,0,0.1)] ${idx % 2 === 0 ? '-rotate-2' : 'rotate-2'}`}
                  >
                    <div className="absolute inset-0 halftone-blue opacity-5"></div>
                    <img
                      src={item.imageUrl}
                      className="w-full h-full object-contain drop-shadow-md scale-110"
                      alt={item.name}
                    />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setCanvasItems(prev => prev.filter((_, i) => i !== idx));
                      }}
                      className="absolute -top-3 -right-3 size-8 bg-red-600 text-white rounded-full border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_black] active:scale-90 z-20"
                    >
                      <span className="material-symbols-outlined text-sm font-black">close</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-klein-blue border-t-4 border-black z-20 shadow-[0_-10px_30px_rgba(0,0,0,0.3)] flex flex-col h-[320px] pb-24 shrink-0">
        <div className="flex flex-col items-center py-3 shrink-0">
          <div className="h-1.5 w-16 rounded-full bg-white/30"></div>
          <p className="text-white font-pop uppercase text-[11px] mt-1 tracking-widest italic leading-none">Your Stashed Items</p>
        </div>

        <div className="flex-1 overflow-y-auto p-4 pt-0 bg-klein-blue no-scrollbar">
          <div className="grid grid-cols-4 gap-2">
            {inventory.map((item, i) => (
              <div
                key={`${item.id}-${i}`}
                onClick={() => addToCanvas(item)}
                className="group relative bg-white border-2 border-black p-2 aspect-square flex items-center justify-center hover:bg-pop-pink cursor-pointer active:scale-90 transition-all shadow-[3px_3px_0px_black]"
              >
                <img src={item.imageUrl} className="w-full h-full object-contain" alt={item.name} />
                <div className="absolute inset-0 bg-white/0 group-hover:bg-white/20 transition-colors"></div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 bg-white border-t-4 border-black shrink-0">
          <button
            disabled={canvasItems.length === 0}
            className="w-full bg-pop-orange border-4 border-black py-4 px-6 font-pop text-xl italic text-white shadow-[6px_6px_0px_black] active-pop flex items-center justify-center gap-3 disabled:opacity-50 disabled:grayscale disabled:shadow-none disabled:translate-x-0 disabled:translate-y-0"
            onClick={handleStartReview}
          >
            <span className="material-symbols-outlined font-black">check_circle</span>
            <span>REVIEW LOOK</span>
          </button>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes pop {
          0% { transform: scale(0.8) translateY(10px); opacity: 0; }
          100% { transform: scale(1) translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default OutfitBuilder;
