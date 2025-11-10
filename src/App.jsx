import React, { useMemo, useState } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import VideoGrid from './components/VideoGrid';
import DJMixer from './components/DJMixer';

function App() {
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(null);

  const filtered = useMemo(() => {
    return query.trim() === '' ? null : query.toLowerCase();
  }, [query]);

  const handleOpen = (video) => {
    setSelected(video);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 text-gray-900">
      <Header query={query} onQueryChange={setQuery} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex gap-6 py-6">
          <Sidebar />
          <main className="flex-1 space-y-6">
            <section>
              <h2 className="text-lg font-semibold mb-4">Recommended</h2>
              <VideoGrid onOpen={handleOpen} />
            </section>

            <DJMixer />
          </main>
        </div>
      </div>

      {/* Lightweight modal to show chosen video details */}
      {selected && (
        <div
          className="fixed inset-0 z-30 bg-black/50 flex items-center justify-center p-4"
          onClick={() => setSelected(null)}
        >
          <div className="bg-white rounded-2xl max-w-3xl w-full overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="aspect-video bg-black">
              <img src={selected.thumb} alt={selected.title} className="w-full h-full object-cover" />
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-lg">{selected.title}</h3>
              <p className="text-gray-600 text-sm mt-1">{selected.channel} • {selected.views} • {selected.time}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
