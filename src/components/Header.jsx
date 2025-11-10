import React, { useState, useEffect } from 'react';
import { Menu, Search, Music2, Settings } from 'lucide-react';

const Header = ({ query, onQueryChange, onSearch }) => {
  const [local, setLocal] = useState(query || '');

  useEffect(() => {
    setLocal(query || '');
  }, [query]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch?.(local.trim());
  };

  return (
    <header className="sticky top-0 z-20 bg-white/80 backdrop-blur border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button className="p-2 rounded-lg hover:bg-gray-100" aria-label="Open menu">
            <Menu className="w-5 h-5 text-gray-700" />
          </button>
          <div className="flex items-center gap-2 font-semibold text-gray-900">
            <Music2 className="w-6 h-6 text-red-600" />
            <span className="">YouMix</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 max-w-2xl mx-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              value={local}
              onChange={(e) => setLocal(e.target.value)}
              placeholder="Search videos, bands, vibes..."
              className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>
        </form>

        <div className="flex items-center gap-2">
          <button className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-full bg-gray-100 hover:bg-gray-200 text-sm font-medium text-gray-700">
            <Settings className="w-4 h-4" />
            Preferences
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
