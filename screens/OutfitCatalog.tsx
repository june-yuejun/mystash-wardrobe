
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { outfitsService } from '../services/outfits';
import { Outfit } from '../types';

const OutfitCatalog: React.FC = () => {
  const navigate = useNavigate();
  const [outfits, setOutfits] = useState<Outfit[]>([]);
  const [wornOutfitId, setWornOutfitId] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    const loadOutfits = async () => {
      try {
        const data = await outfitsService.getAll();
        setOutfits(data);
      } catch (error) {
        console.error('Failed to load outfits:', error);
      }
    };

    loadOutfits();
  }, []);

  // Dynamically generate filter options from existing tags
  const dynamicFilters = React.useMemo(() => {
    const tags = new Set<string>();
    outfits.forEach(o => o.tags.forEach(t => tags.add(t)));
    return ['All', ...Array.from(tags).sort()];
  }, [outfits]);

  const toggleFavorite = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const outfit = outfits.find(o => o.id === id);
    if (!outfit) return;

    // Optimistic update
    setOutfits(prev => prev.map(o =>
      o.id === id ? { ...o, isFavorite: !o.isFavorite } : o
    ));

    try {
      await outfitsService.update(id, { isFavorite: !outfit.isFavorite });
    } catch (error) {
      console.error('Failed to update favorite:', error);
      // Revert on error
      setOutfits(prev => prev.map(o =>
        o.id === id ? { ...o, isFavorite: !o.isFavorite } : o
      ));
      // Reload to ensure state is correct
      const data = await outfitsService.getAll();
      setOutfits(data);
    }
  };

  const deleteOutfit = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm("BAM! DELETE THIS LOOK?")) return;

    try {
      await outfitsService.delete(id);
      setOutfits(prev => prev.filter(o => o.id !== id));

      // Reset filter loop if needed (simplified check)
      if (activeFilter !== 'All') {
        // We can just keep the filter, if empty it shows empty state
      }
    } catch (error) {
      console.error('Failed to delete outfit:', error);
      alert("Failed to delete. Check console.");
    }
  };

  const handleWearToday = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setWornOutfitId(id);
    setTimeout(() => setWornOutfitId(null), 2500);
  };

  const filteredOutfits = outfits.filter(outfit => {
    const matchesFilter = activeFilter === 'All' || outfit.tags.includes(activeFilter);
    const matchesSearch = outfit.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      outfit.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="flex flex-col min-h-screen bg-pop-grey-1 pb-24">
      <header className="sticky top-0 z-50 bg-white border-b-4 border-black px-6 pt-12 pb-6 shadow-md">
        <div className="flex items-center justify-between mb-4">
          <div className="flex flex-col">
            <span className="text-pop-pink font-black text-[10px] uppercase tracking-widest leading-none">THE ARCHIVE</span>
            <h1 className="text-4xl font-pop text-klein-blue uppercase leading-none italic mt-1 -rotate-2">LOOKS</h1>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className={`size-12 border-4 border-black flex items-center justify-center shadow-[4px_4px_0px_black] active-pop ${isSearchOpen ? 'bg-pop-pink' : 'bg-white'}`}
            >
              <span className="material-symbols-outlined font-black">{isSearchOpen ? 'close' : 'search'}</span>
            </button>
            <button
              onClick={() => navigate('/builder')}
              className="size-12 bg-pop-orange text-white border-4 border-black flex items-center justify-center shadow-[4px_4px_0px_black] active-pop"
            >
              <span className="material-symbols-outlined font-black">add_box</span>
            </button>
          </div>
        </div>

        {isSearchOpen && (
          <div className="animate-[slideDown_0.3s_ease-out]">
            <input
              autoFocus
              className="w-full h-14 bg-white border-4 border-black px-4 font-bold text-lg focus:outline-none shadow-[4px_4px_0px_black] placeholder:text-gray-300 uppercase italic"
              placeholder="SEARCH TAGS..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        )}

        <div className="flex gap-2 mt-4 overflow-x-auto no-scrollbar pb-1">
          {dynamicFilters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`shrink-0 px-4 py-1.5 border-2 border-black font-pop uppercase italic text-[9px] shadow-[2px_2px_0px_black] active-pop transition-colors ${activeFilter === filter ? 'bg-klein-blue text-white' : 'bg-white text-black'}`}
            >
              {filter}
            </button>
          ))}
        </div>
      </header>

      <main className="flex-1 px-4 pt-8 space-y-12">
        {filteredOutfits.length === 0 ? (
          <div className="bg-white border-4 border-black border-dashed p-16 text-center opacity-40">
            <span className="material-symbols-outlined text-6xl mb-4">sentiment_dissatisfied</span>
            <p className="font-pop uppercase text-xs italic">No matching vibes found!</p>
          </div>
        ) : filteredOutfits.map((outfit, index) => (
          <div
            key={outfit.id}
            className={`relative transition-all duration-300 transform ${index % 2 === 0 ? '-rotate-1' : 'rotate-1'}`}
          >
            {/* Visual Halo for "Worn Today" */}
            {wornOutfitId === outfit.id && (
              <div className="absolute inset-[-12px] starburst bg-pop-orange opacity-40 animate-ping z-0"></div>
            )}

            <div className="bg-white border-4 border-black relative z-10 shadow-[10px_10px_0px_black] overflow-hidden">
              {/* Image Matrix */}
              <div className={`grid h-64 border-b-4 border-black bg-pop-grey-2 ${outfit.items.length > 1 ? 'grid-cols-2' : 'grid-cols-1'}`}>
                {outfit.items.slice(0, 4).map((item, i) => (
                  <div
                    key={`${outfit.id}-item-${i}`}
                    className={`flex items-center justify-center p-3 relative ${i === 0 && outfit.items.length > 1 ? 'border-r-4 border-black' : ''} ${i === 2 ? 'border-t-4 border-black' : ''}`}
                  >
                    <div className="absolute inset-0 halftone-blue opacity-5"></div>
                    <img
                      src={item.imageUrl}
                      className="max-h-full object-contain drop-shadow-lg scale-110"
                      alt={item.name}
                    />
                  </div>
                ))}
              </div>

              {/* Status Overlay */}
              {wornOutfitId === outfit.id && (
                <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/40 backdrop-blur-[2px]">
                  <div className="bg-white border-4 border-black px-8 py-3 rotate-[-5deg] shadow-[8px_8px_0px_#FF8B50] animate-[pop_0.4s_ease-out]">
                    <p className="font-pop text-2xl text-black italic leading-none">DRESSED!</p>
                  </div>
                </div>
              )}

              {/* Card Footer */}
              <div className="p-4 bg-white relative">
                <div className="absolute -top-6 left-4 bg-black text-white border-2 border-white px-4 py-1.5 shadow-[4px_4px_0px_#EEC0DB] -rotate-1">
                  <h3 className="font-pop text-sm uppercase italic tracking-tighter truncate max-w-[180px]">{outfit.name}</h3>
                </div>

                <div className="flex justify-between items-end mt-4">
                  <div className="flex flex-col gap-2">
                    <div className="flex flex-wrap gap-1">
                      {outfit.tags.map(t => (
                        <span key={t} className="bg-pop-grey-2 text-black font-black uppercase text-[7px] border border-black px-1.5 py-0.5">#{t}</span>
                      ))}
                    </div>
                    <p className="text-[9px] font-black text-klein-blue uppercase">{outfit.items.length} PIECES • {outfit.season}</p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={(e) => toggleFavorite(outfit.id, e)}
                      className={`size-10 border-4 border-black flex items-center justify-center shadow-[3px_3px_0px_black] active:scale-95 transition-all ${outfit.isFavorite ? 'bg-pop-pink' : 'bg-white'}`}
                    >
                      <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: outfit.isFavorite ? "'FILL' 1" : "'FILL' 0" }}>
                        favorite
                      </span>
                    </button>
                    <button
                      onClick={(e) => handleWearToday(outfit.id, e)}
                      className="bg-klein-blue text-white border-4 border-black px-6 py-2 font-pop uppercase italic text-[11px] shadow-[3px_3px_0px_black] active-pop"
                    >
                      WEAR
                    </button>
                    <button
                      onClick={(e) => deleteOutfit(outfit.id, e)}
                      className="size-10 border-4 border-black bg-white flex items-center justify-center shadow-[3px_3px_0px_black] active-pop text-red-600"
                    >
                      <span className="material-symbols-outlined text-xl">delete</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </main>

      <style>{`
        @keyframes pop {
          0% { transform: scale(0.5) rotate(-15deg); opacity: 0; }
          70% { transform: scale(1.1) rotate(5deg); }
          100% { transform: scale(1) rotate(-5deg); opacity: 1; }
        }
        @keyframes slideDown {
          from { transform: translateY(-10px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default OutfitCatalog;
