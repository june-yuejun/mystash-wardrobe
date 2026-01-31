
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { itemsService } from '../services/items';
import { storageService } from '../services/storage';
import { WardrobeItem } from '../types';

const ItemDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const aiState = location.state as { aiData?: any, image?: string } | null;

  const [item, setItem] = useState<WardrobeItem | null>(null);
  const [name, setName] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [category, setCategory] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const loadItem = async () => {
      if (id === 'new' && aiState?.aiData) {
        setItem({
          id: 'new',
          name: aiState.aiData.name || 'New Item',
          category: aiState.aiData.category || 'Tops',
          colorway: aiState.aiData.colorway || 'Multi',
          season: ['Spring'],
          tags: aiState.aiData.style_tags || aiState.aiData.tags || ['Fresh'],
          imageUrl: aiState.image || '',
          createdAt: 'Just now'
        });
        setName(aiState.aiData.name || 'New Item');
        setCategory(aiState.aiData.category || 'Tops');
        setTags(aiState.aiData.style_tags || aiState.aiData.tags || ['Fresh']);
      } else if (id && id !== 'new') {
        const found = await itemsService.getById(id);
        if (found) {
          setItem(found);
          setName(found.name);
          setTags(found.tags || []);

          // Map legacy categories
          const lowerCat = found.category.toLowerCase();
          let mappedCategory = found.category;

          if (['t-shirts', 't-shirt', 'shirt', 'blouse', 'sweater', 'top'].includes(lowerCat)) mappedCategory = 'Tops';
          else if (['jeans', 'pants', 'shorts', 'skirt', 'trousers', 'bottomch'].includes(lowerCat)) mappedCategory = 'Bottoms';
          else if (['jackets', 'jacket', 'coat', 'blazer', 'outer'].includes(lowerCat)) mappedCategory = 'Outer';
          else if (['dresses', 'dress', 'gown'].includes(lowerCat)) mappedCategory = 'Dresses';

          setCategory(mappedCategory);
        } else {
          // Handle 404
          navigate('/');
        }
      }
    };

    loadItem();
  }, [id, aiState, navigate]);

  // Helper to convert base64 to File
  const urlToFile = async (url: string, filename: string) => {
    const res = await fetch(url);
    const blob = await res.blob();
    return new File([blob], filename, { type: 'image/png' });
  };

  const handleSave = async () => {
    if (!item) return;
    setIsSaving(true);

    try {
      let finalImageUrl = item.imageUrl;

      // If it's a new item with base64 image, upload it first
      if (id === 'new' && item.imageUrl.startsWith('data:')) {
        const file = await urlToFile(item.imageUrl, `item-${Date.now()}.png`);
        finalImageUrl = await storageService.uploadImage(file);
      }

      const itemData = {
        name,
        category,
        colorway: item.colorway, // We might want to allow editing this too?
        season: item.season,
        tags,
        imageUrl: finalImageUrl,
      };

      if (id === 'new') {
        await itemsService.create(itemData);
      } else {
        await itemsService.update(id!, itemData);
      }

      navigate('/', { replace: true });
    } catch (error) {
      console.error("Save failed", error);
      alert("Failed to save item. See console.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!item || id === 'new') return;
    if (!window.confirm("BAM! REMOVE THIS FROM YOUR STASH?")) return;

    setIsDeleting(true);

    try {
      await itemsService.delete(String(item.id));
      navigate('/', { replace: true });
    } catch (error) {
      console.error("Delete failed", error);
      alert("Delete failed.");
      setIsDeleting(false);
    }
  };

  if (!item) return <div className="h-screen bg-pop-grey-1 flex items-center justify-center font-pop italic">LOADING...</div>;

  return (
    <div className="flex flex-col bg-pop-grey-1 min-h-screen relative overflow-hidden">
      <header className="sticky top-0 z-50 flex items-center bg-pop-grey-2 p-4 border-b-4 border-black justify-between shadow-sm pt-12 shrink-0">
        <button onClick={() => navigate(-1)} className="bg-klein-blue text-white border-2 border-black flex size-10 shrink-0 items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active-pop">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h2 className="font-pop text-xl leading-tight uppercase tracking-tight flex-1 text-center italic truncate px-2">
          {id === 'new' ? 'New Drop' : 'Item Info'}
        </h2>
        <div className="size-10"></div>
      </header>

      <div className="flex-1 overflow-y-auto pb-48 no-scrollbar">
        <div className="p-6">
          <div className="w-full halftone-pink flex items-center justify-center overflow-hidden border-4 border-black min-h-[320px] relative shadow-[8px_8px_0px_black]">
            <img
              src={item.imageUrl}
              alt={name}
              className="max-h-[280px] object-contain drop-shadow-[10px_10px_0px_rgba(0,0,0,0.1)]"
            />
            {id === 'new' && (
              <div className="absolute top-4 left-4 bg-pop-orange text-black border-2 border-black px-4 py-1 font-pop text-[10px] uppercase -rotate-3 shadow-[4px_4px_0px_black]">
                AI READY
              </div>
            )}
          </div>
        </div>

        <div className="px-6 space-y-6 pb-20">
          <div className="space-y-2">
            <div className="inline-block bg-black text-white px-3 py-0.5 -rotate-1">
              <p className="font-black text-[10px] uppercase tracking-widest">Name</p>
            </div>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border-4 border-black bg-white h-14 px-4 text-lg font-pop focus:ring-0 focus:border-pop-orange uppercase italic"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="inline-block bg-klein-blue text-white border-2 border-black px-3 py-0.5 rotate-[-1deg]">
                <p className="font-pop text-[10px] uppercase">Category</p>
              </div>
              <div className="relative">
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="appearance-none flex w-full border-4 border-black bg-white h-14 px-4 text-xs font-extrabold focus:ring-0 uppercase italic"
                >
                  <option value="Tops">TOPS</option>
                  <option value="Bottoms">BOTTOMS</option>
                  <option value="Outer">OUTER</option>
                  <option value="Dresses">DRESSES</option>
                </select>
                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none font-black">expand_more</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="inline-block bg-klein-blue text-white border-2 border-black px-3 py-0.5 rotate-[1deg]">
                <p className="font-pop text-[10px] uppercase">Details</p>
              </div>
              <div className="flex items-center gap-2 border-4 border-black bg-white h-14 px-3 shadow-[2px_2px_0px_black]">
                <div className="size-4 border-2 border-black bg-pop-orange shrink-0"></div>
                <span className="font-extrabold text-[9px] uppercase truncate">{item.colorway}</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="inline-block bg-klein-blue text-white border-2 border-black px-3 py-0.5 rotate-[-1deg]">
              <p className="font-pop text-[10px] uppercase">Tags</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag, idx) => (
                <div key={`${tag}-${idx}`} className="flex items-center gap-2 px-3 py-1 bg-white border-2 border-black shadow-[2px_2px_0px_black] active:scale-95">
                  <span className="font-black text-[10px] uppercase italic">{tag}</span>
                  <span
                    onClick={() => setTags(prev => prev.filter((_, i) => i !== idx))}
                    className="material-symbols-outlined text-xs cursor-pointer hover:text-red-500 font-black"
                  >close</span>
                </div>
              ))}
            </div>
          </div>

          {id !== 'new' && (
            <div className="pt-6">
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className={`w-full bg-white border-4 border-black text-red-600 font-pop py-5 shadow-[4px_4px_0px_black] flex items-center justify-center gap-3 active-pop ${isDeleting ? 'opacity-50' : ''}`}
              >
                <span className="material-symbols-outlined text-xl">delete</span>
                <span className="font-black text-sm">{isDeleting ? 'REMOVING PIECE...' : 'REMOVE FROM STASH'}</span>
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="fixed bottom-[90px] left-0 right-0 max-w-md mx-auto p-4 bg-white/95 border-t-4 border-black z-40 shadow-[0_-8px_16px_rgba(0,0,0,0.1)]">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className={`w-full bg-pop-orange border-4 border-black text-white font-pop text-xl py-5 shadow-[6px_6px_0px_black] flex items-center justify-center gap-3 active-pop ${isSaving ? 'opacity-70 grayscale' : ''}`}
        >
          {isSaving ? (
            <span className="material-symbols-outlined animate-spin text-3xl">refresh</span>
          ) : (
            <>
              <span className="material-symbols-outlined font-black text-2xl">save</span>
              <span>{id === 'new' ? 'SAVE ITEM' : 'UPDATE ITEM'}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default ItemDetail;
