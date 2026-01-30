
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { itemsService } from '../services/items';
import { WardrobeItem } from '../types';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [items, setItems] = useState<WardrobeItem[]>([]);
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    const loadItems = async () => {
      try {
        const data = await itemsService.getAll();
        setItems(data);
      } catch (error) {
        console.error("Failed to load items", error);
      }
    };

    loadItems();
  }, []);

  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleNotificationClick = () => {
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  return (
    <div className="flex flex-col overflow-x-hidden min-h-screen bg-pop-grey-2 pb-12">
      {showNotification && (
        <div className="fixed top-4 left-4 right-4 z-[100] animate-[bounce_1s_infinite]">
          <div className="bg-pop-orange border-4 border-black p-4 shadow-[6px_6px_0px_black] flex items-center justify-between">
            <p className="font-pop text-xs text-white uppercase italic">STASH ALERT: New trends detected!</p>
            <span className="material-symbols-outlined text-white">bolt</span>
          </div>
        </div>
      )}

      <header className="bg-klein-blue pt-12 pb-8 px-6 border-b-4 border-black shadow-lg relative z-20">
        <div className="flex items-center justify-between pb-6">
          <div className="flex items-center gap-3">
            <div className="size-14 rounded-full border-4 border-black overflow-hidden shadow-[4px_4px_0px_0px_rgba(255,139,80,1),-4px_-4px_0px_0px_rgba(238,192,219,1)] bg-pop-pink active-pop relative group">
              <img
                alt="Pop Art Cat Avatar"
                className="w-full h-full object-cover p-1 scale-110 group-hover:rotate-12 transition-transform"
                src="https://api.dicebear.com/9.x/big-ears-neutral/svg?seed=PopCat&backgroundColor=ff8b50,eec0db,002fa7"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-pop-pink font-black text-[8px] uppercase tracking-widest leading-none mb-1">STASH OWNER</span>
              <h1 className="font-pop text-white text-2xl tracking-tight uppercase leading-none italic">My Stash</h1>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleNotificationClick}
              className="flex size-11 items-center justify-center bg-pop-orange border-4 border-black active-pop shadow-[3px_3px_0px_black]"
            >
              <span className="material-symbols-outlined text-black font-bold">notifications</span>
            </button>
            <button
              onClick={() => navigate('/scanner')}
              className="flex size-11 items-center justify-center bg-white border-4 border-black active-pop shadow-[3px_3px_0px_black]"
            >
              <span className="material-symbols-outlined text-black font-bold">add</span>
            </button>
          </div>
        </div>
        <div className="relative">
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-14 bg-white border-4 border-black px-4 font-bold text-lg focus:outline-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] placeholder:text-gray-400 uppercase italic"
            placeholder="LOOKING FOR SOMETHING?"
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
            <span className="material-symbols-outlined font-black text-klein-blue">search</span>
          </div>
        </div>
      </header>

      <div className="px-4 pt-8">
        <div className="flex items-end justify-between mb-4">
          <h2 className="font-pop text-xl text-klein-blue bg-white px-3 py-1 comic-border inline-block transform -rotate-1 uppercase italic">New Drops</h2>
          <button
            onClick={() => navigate('/inventory')}
            className="font-black text-sm uppercase underline decoration-4 decoration-pop-pink underline-offset-4 hover:text-pop-orange transition-colors italic"
          >
            See All
          </button>
        </div>

        {filteredItems.length === 0 ? (
          <div className="bg-white comic-border p-8 text-center opacity-40 mb-6">
            <p className="font-pop text-xs uppercase italic">Stash is empty!</p>
          </div>
        ) : (
          <div className="flex overflow-x-auto no-scrollbar gap-5 pb-6 px-1">
            {filteredItems.slice(0, 5).map((item) => (
              <div key={item.id} className="flex-none w-40 group cursor-pointer" onClick={() => navigate(`/item-detail/${item.id}`)}>
                <div className="bg-white border-4 border-black aspect-[3/4] p-3 mb-2 flex items-center justify-center overflow-hidden shadow-[4px_4px_0px_black] group-hover:shadow-[6px_6px_0px_#FF8B50] transition-all">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-full h-full object-contain group-hover:scale-110 transition-transform"
                  />
                </div>
                <p className="font-pop text-[10px] text-black uppercase truncate italic leading-none">{item.name}</p>
                <p className="font-black text-[8px] text-gray-500 uppercase mt-1">{item.category}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="px-4 pt-4">
        <h2 className="font-pop text-xl text-klein-blue bg-white px-3 py-1 comic-border inline-block transform rotate-1 mb-6 uppercase italic">Categories</h2>
        <div className="grid grid-cols-2 gap-6 pb-20">
          {[
            { label: 'TOPS', count: filteredItems.filter(i => i.category === 'T-Shirts').length, icon: 'checkroom', color: 'halftone-pink', route: 'T-Shirts' },
            { label: 'BOTTOMS', count: filteredItems.filter(i => i.category === 'Jeans').length, icon: 'apparel', color: 'halftone-orange', route: 'Jeans' },
            { label: 'DRESSES', count: filteredItems.filter(i => i.category === 'Dresses').length, icon: 'dry_cleaning', color: 'halftone-orange', route: 'Dresses' },
            { label: 'OUTER', count: filteredItems.filter(i => i.category === 'Jackets').length, icon: 'severe_cold', color: 'halftone-pink', route: 'Jackets' },
          ].map((cat, i) => (
            <div
              key={i}
              onClick={() => navigate(`/category/${cat.route}`)}
              className={`relative comic-border ${cat.color} aspect-square group overflow-hidden cursor-pointer active-pop`}
            >
              <div className="absolute inset-0 bg-white/20 group-hover:bg-transparent transition-colors"></div>
              <div className="absolute bottom-3 left-3 right-3 bg-white border-2 border-black p-2 transform group-hover:-translate-y-1 transition-transform shadow-[2px_2px_0px_black]">
                <p className="font-pop text-sm leading-none italic uppercase">{cat.label}</p>
                <p className="font-black text-[9px] mt-1 text-gray-600 tracking-widest">{cat.count} PIECES</p>
              </div>
              <span className="material-symbols-outlined absolute top-4 right-4 text-black text-3xl group-hover:scale-125 transition-transform">{cat.icon}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
