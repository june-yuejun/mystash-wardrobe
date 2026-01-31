
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { itemsService } from '../services/items';
import { WardrobeItem } from '../types';

const CategoryDetail: React.FC = () => {
  const { categoryName } = useParams();
  const navigate = useNavigate();
  const [items, setItems] = useState<WardrobeItem[]>([]);

  useEffect(() => {
    const loadItems = async () => {
      try {
        const allItems = await itemsService.getAll();
        setItems(allItems.filter(
          item => {
            const cat = item.category.toLowerCase();
            const target = categoryName?.toLowerCase();

            if (target === 'tops' || target === 'top') {
              return cat === 'tops' || cat === 'top' || cat === 't-shirts' || cat === 't-shirt' || cat === 'shirts' || cat === 'shirt' || cat === 'blouse' || cat === 'sweater';
            }
            if (target === 'bottoms' || target === 'bottom') {
              return cat === 'bottoms' || cat === 'bottom' || cat === 'jeans' || cat === 'pants' || cat === 'shorts' || cat === 'skirt' || cat === 'trousers';
            }
            if (target === 'outer') {
              return cat === 'outer' || cat === 'jackets' || cat === 'jacket' || cat === 'coat' || cat === 'cardigan' || cat === 'blazer';
            }
            if (target === 'dresses') {
              return cat === 'dresses' || cat === 'dress' || cat === 'gown';
            }
            return cat === target;
          }
        ));
      } catch (error) {
        console.error("Failed to load items", error);
      }
    };

    loadItems();
  }, [categoryName]);

  const getThemeColor = () => {
    switch (categoryName?.toLowerCase()) {
      case 'tops': return 'halftone-pink';
      case 'bottoms': return 'halftone-orange';
      case 'outer': return 'halftone-pink';
      case 'dresses': return 'halftone-orange';
      default: return 'halftone-blue';
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-pop-grey-2">
      <header className="sticky top-0 z-30 flex items-center bg-klein-blue p-6 border-b-4 border-black justify-between shadow-lg pt-12">
        <button
          onClick={() => navigate('/')}
          className="bg-white text-black border-2 border-black flex size-10 shrink-0 items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active-pop"
        >
          <span className="material-symbols-outlined font-black">arrow_back</span>
        </button>
        <div className="flex flex-col items-center">
          <h2 className="font-pop text-white text-2xl uppercase italic leading-none tracking-tight">
            {categoryName}
          </h2>
          <p className="text-pop-pink text-[10px] font-black uppercase tracking-widest mt-1">
            {items.length} PIECES
          </p>
        </div>
        <div className="size-10"></div>
      </header>

      <div className={`flex-1 p-6 overflow-y-auto no-scrollbar pb-32 ${getThemeColor()}`}>
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 bg-white comic-border opacity-60">
            <span className="material-symbols-outlined text-6xl">inventory_2</span>
            <p className="font-pop text-xs uppercase mt-4 italic">Empty stash section!</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-6">
            {items.map((item) => (
              <div
                key={item.id}
                onClick={() => navigate(`/item-detail/${item.id}`)}
                className="bg-white comic-border p-3 flex flex-col group cursor-pointer active-pop"
              >
                <div className="aspect-[3/4] overflow-hidden mb-3 relative bg-pop-grey-2 flex items-center justify-center border-b-2 border-black">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-full h-full object-contain group-hover:scale-110 transition-transform"
                  />
                </div>
                <h3 className="font-pop text-[10px] text-black uppercase truncate mb-1 italic leading-none">{item.name}</h3>
                <div className="flex items-center justify-between">
                  <span className="text-[8px] font-black text-gray-500 uppercase">{item.colorway}</span>
                  <span className="material-symbols-outlined text-sm text-klein-blue group-hover:translate-x-1 transition-transform">arrow_forward</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="fixed bottom-[90px] left-0 right-0 max-w-md mx-auto p-4 bg-white border-t-4 border-black z-40">
        <button
          onClick={() => navigate('/scanner')}
          className="w-full bg-pop-orange border-4 border-black text-white font-pop text-lg py-4 shadow-[6px_6px_0px_black] active-pop flex items-center justify-center gap-3"
        >
          <span className="material-symbols-outlined font-black">add_a_photo</span>
          <span>ADD {categoryName?.toUpperCase()}</span>
        </button>
      </div>
    </div>
  );
};

export default CategoryDetail;
