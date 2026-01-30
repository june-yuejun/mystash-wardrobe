
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';

const Navigation: React.FC = () => {
  const location = useLocation();
  const navItems = [
    { to: '/', icon: 'home', label: 'Home' },
    { to: '/catalog', icon: 'grid_view', label: 'Outfits' },
    { to: '/builder', icon: 'architecture', label: 'Builder' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white border-t-4 border-black px-4 py-4 flex justify-around items-center z-50 shadow-[0_-4px_0px_0px_rgba(0,0,0,0.05)]">
      {navItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 transition-colors ${
              isActive ? 'text-klein-blue' : 'text-gray-400'
            }`
          }
        >
          <span className={`material-symbols-outlined text-2xl ${location.pathname === item.to ? 'font-black' : ''}`}>
            {item.icon}
          </span>
          <span className="text-[10px] font-black uppercase">{item.label}</span>
        </NavLink>
      ))}
    </nav>
  );
};

export default Navigation;
