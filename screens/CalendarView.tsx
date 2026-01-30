
import React from 'react';

const CalendarView: React.FC = () => {
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const month = "October 2023";

  return (
    <div className="flex flex-col min-h-screen bg-pop-grey-2">
      <div className="bg-klein-blue pt-12 pb-6 px-6 border-b-4 border-black relative overflow-hidden">
        <div className="absolute inset-0 halftone-blue opacity-30"></div>
        <div className="relative flex items-center justify-between">
          <button className="bg-white border-4 border-black p-2 rounded-lg flex items-center justify-center active-pop">
            <span className="material-symbols-outlined text-black font-bold">arrow_back_ios_new</span>
          </button>
          <h1 className="text-white text-3xl font-extrabold tracking-tighter uppercase italic font-display">{month}</h1>
          <button className="bg-white border-4 border-black p-2 rounded-lg flex items-center justify-center active-pop">
            <span className="material-symbols-outlined text-black font-bold">arrow_forward_ios</span>
          </button>
        </div>
      </div>

      <div className="flex-1 px-4 pt-6 pb-24">
        <div className="grid grid-cols-7 mb-4">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
            <div key={d} className="text-center text-klein-blue font-extrabold text-xs uppercase">{d}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {/* Padding days */}
          <div className="aspect-square bg-pop-grey-1 border-2 border-black rounded-lg"></div>
          <div className="aspect-square bg-pop-grey-1 border-2 border-black rounded-lg"></div>
          <div className="aspect-square bg-pop-grey-1 border-2 border-black rounded-lg"></div>
          
          {days.map(day => (
            <div key={day} className={`aspect-square border-2 border-black rounded-lg p-1 relative overflow-hidden group cursor-pointer ${day === 5 ? 'bg-white z-10' : 'bg-white'}`}>
              {day === 5 && (
                 <div className="absolute inset-[-4px] starburst z-[-1]"></div>
              )}
              <span className={`text-xs font-bold ${day === 5 ? 'text-black' : ''}`}>{day}</span>
              {[2, 5, 7, 11, 17, 21, 24].includes(day) && (
                <div className="absolute inset-0 flex items-center justify-center mt-2">
                   <div className="w-8 h-8 rounded-full bg-pop-pink border border-black overflow-hidden flex items-center justify-center shadow-[2px_2px_0px_black]">
                     <img src={`https://picsum.photos/seed/${day}/50/50`} className="w-full h-full object-cover" />
                   </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Detail Bottom Sheet */}
      <div className="fixed bottom-24 left-0 right-0 max-w-md mx-auto z-20 px-4">
        <div className="bg-white border-4 border-black rounded-t-2xl p-6 shadow-[-8px_-8px_0px_rgba(0,0,0,1)]">
           <div className="flex flex-col items-center mb-6">
              <div className="w-12 h-1.5 bg-pop-grey-1 rounded-full border border-black"></div>
           </div>
           <div className="flex gap-6 items-start">
             <div className="relative w-28 h-28 shrink-0">
               <div className="absolute inset-0 bg-pop-pink border-4 border-black rounded-lg rotate-[-3deg]"></div>
               <img 
                 src="https://lh3.googleusercontent.com/aida-public/AB6AXuD1ok1rEG0NSq6XZr20otYzOGiV8z_-Olu0_F5s9MkkUkHZa5HmpKeXcQnaeUZMFYsq__nWU209qu8MgLnj1cA5pKCJVasuKm2NAQavDx2fph94i6WpXSqwR-ZQiNMueRmxXw2Q0QiWRvzzyaFiTmFZAb8M6wnGV9s7oB9S4Lx5Wqcik7De9p63Wzjhl_8dHRsc915KTEfEVtMZcY-PV5DsxrzdkMDWOKVmZHsdxPbC39WE4C6OUKmScVX7fN2x4mOCHOJh6qJQ-rBu" 
                 className="relative w-full h-full object-cover border-4 border-black rounded-lg shadow-[4px_4px_0px_black] rotate-[2deg]"
               />
             </div>
             <div className="flex-1 pt-2">
               <div className="bg-pop-grey-2 border-4 border-black p-3 rounded-lg relative">
                 <div className="absolute left-[-10px] top-4 w-4 h-4 bg-pop-grey-2 border-l-4 border-b-4 border-black rotate-45"></div>
                 <p className="text-xs font-black uppercase text-klein-blue">Thursday, Oct 5</p>
                 <h3 className="text-lg font-pop tracking-tight leading-tight uppercase italic">Vintage Pop Ensemble</h3>
                 <p className="text-[10px] font-medium text-slate-600">Pink Halftone Dress & Orange Scarf</p>
               </div>
             </div>
           </div>
           <div className="mt-8 flex gap-4">
              <button className="flex-1 bg-klein-blue text-white font-black py-4 px-6 rounded-xl border-4 border-black shadow-[4px_4px_0px_black] active-pop uppercase tracking-widest text-sm flex items-center justify-center gap-2">
                <span className="material-symbols-outlined">refresh</span>
                Change Outfit
              </button>
              <button className="bg-white text-black font-black p-4 rounded-xl border-4 border-black shadow-[4px_4px_0px_black] active-pop">
                <span className="material-symbols-outlined font-bold">favorite</span>
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarView;
