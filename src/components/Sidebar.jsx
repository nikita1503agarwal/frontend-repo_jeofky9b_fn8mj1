import React from 'react';
import { Home, Flame, Music2, Layers, Clock } from 'lucide-react';

const Item = ({ icon: Icon, label, active = false }) => (
  <button
    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm hover:bg-gray-100 ${
      active ? 'bg-gray-100 font-semibold' : 'text-gray-700'
    }`}
  >
    <Icon className="w-5 h-5" />
    <span>{label}</span>
  </button>
);

const Sidebar = () => {
  return (
    <aside className="hidden md:block w-64 shrink-0 border-r border-gray-200 bg-white/60">
      <div className="p-3 space-y-1">
        <Item icon={Home} label="Home" active />
        <Item icon={Flame} label="Trending" />
        <Item icon={Music2} label="Bands" />
        <Item icon={Layers} label="Playlists" />
        <Item icon={Clock} label="History" />
      </div>
    </aside>
  );
};

export default Sidebar;
