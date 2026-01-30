
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { itemsService } from '../services/items';
import { WardrobeItem } from '../types';

const Inventory: React.FC = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState<WardrobeItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const loadItems = async () => {
      try {
        const data = await itemsService.getAll();
        setItems(data);
      } catch (error) {
        console.error('Failed to load items:', error);
        // Fallback or error handling could go here. 
        // For now, we leave the list empty or show a toast if we had one.
      }
    };

    loadItems();
    // Remove the storage event listener as we are now server-side state
  }, []);

  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="flex flex-col min-h-screen bg-pop-grey-1">
      <header className="sticky top-0 z-50 bg-white border-b-4 border-black px-6 pt-12 pb-6 shadow-md">
        <div className="flex items-center justify-between mb-4">
          <button onClick={() => navigate('/')} className="size-11 border-4 border-black bg-white flex items-center justify-center shadow-[3px_3px_0px_black] active-pop">
            <span className="material-symbols-outlined font-black">arrow_back</span>
          </button>
          <h1 className="text-3xl font-pop text-klein-blue uppercase leading-none italic -rotate-1">MY STASH</h1>
          <button onClick={() => navigate('/scanner')} className="size-11 bg-pop-orange border-4 border-black flex items-center justify-center shadow-[3px_3px_0px_black] active-pop">
            <span className="material-symbols-outlined font-black text-white">add</span>
          </button>
        </div>

        <div className="relative">
          <input
            className="w-full h-12 bg-white border-4 border-black px-4 font-bold text-sm focus:outline-none shadow-[4px_4px_0px_black] placeholder:text-gray-300 uppercase italic"
            placeholder="FILTER PIECES..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-klein-blue">search</span>
        </div>
      </header>

      <main className="flex-1 p-4 grid grid-cols-2 gap-4 pb-32 overflow-y-auto no-scrollbar">
        {filteredItems.length === 0 ? (
          <div className="col-span-2 bg-white border-4 border-black border-dashed p-12 text-center opacity-40">
            <p className="font-pop uppercase text-xs italic">Zero items found!</p>
          </div>
        ) : filteredItems.map((item, idx) => (
          <div
            key={item.id}
            onClick={() => navigate(`/item-detail/${item.id}`)}
            className={`bg-white border-4 border-black p-3 relative group active-pop transition-transform hover:scale-105 ${idx % 2 === 0 ? 'rotate-1' : '-rotate-1'}`}
          >
            <div className="absolute inset-0 halftone-blue opacity-[0.03] pointer-events-none"></div>
            <div className="aspect-square bg-pop-grey-2 border-2 border-black mb-3 flex items-center justify-center overflow-hidden">
              <img src={item.imageUrl} className="w-full h-full object-contain p-2" alt={item.name} />
            </div>
            <div className="bg-black text-white px-2 py-0.5 inline-block mb-1">
              <p className="text-[8px] font-black uppercase tracking-widest leading-none">{item.category}</p>
            </div>
            <h3 className="font-pop text-[10px] uppercase italic truncate leading-none">{item.name}</h3>
          </div>
        ))}
      </main>
    </div>
  );
};

export default Inventory;
