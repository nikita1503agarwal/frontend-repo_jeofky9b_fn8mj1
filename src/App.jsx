import React, { useMemo, useState } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import VideoGrid from './components/VideoGrid';
import DJMixer from './components/DJMixer';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

function App() {
  const [query, setQuery] = useState('lofi mix');
  const [selected, setSelected] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleOpen = (video) => {
    setSelected(video);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const search = async (q) => {
    const term = (q ?? query).trim();
    if (!term) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${BACKEND_URL}/api/youtube/search?q=${encodeURIComponent(term)}`);
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      setItems(data.items || []);
      setQuery(term);
    } catch (e) {
      setError('Failed to fetch results.');
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    // initial search
    search(query);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 text-gray-900">
      <Header query={query} onQueryChange={setQuery} onSearch={search} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex gap-6 py-6">
          <Sidebar />
          <main className="flex-1 space-y-6">
            <section>
              <div className="flex items-end justify-between mb-4">
                <h2 className="text-lg font-semibold">Results for “{query}”</h2>
                {loading && <span className="text-sm text-gray-500">Loading…</span>}
              </div>
              {error && <div className="text-sm text-red-600 mb-3">{error}</div>}
              <VideoGrid onOpen={handleOpen} items={items} />
            </section>

            <DJMixer />
          </main>
        </div>
      </div>

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
              <p className="text-gray-600 text-sm mt-1">{selected.channel} • {selected.views ? `${Number(selected.views).toLocaleString()} views` : ''}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
