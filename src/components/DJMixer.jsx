import React, { useEffect, useRef, useState } from 'react';
import { Play, Pause, Volume2, Shuffle, Repeat, SlidersHorizontal } from 'lucide-react';

// A lightweight web-audio based DJ-style mixer with 3 bands (low, mid, high)
// Loads demo loops per genre and lets users mix between two decks with EQ controls
const demoBanks = {
  Rock: {
    left: 'https://cdn.pixabay.com/download/audio/2022/03/16/audio_4c3f38b1c6.mp3?filename=rock-beat-201778.mp3',
    right: 'https://cdn.pixabay.com/download/audio/2021/12/22/audio_0eab696648.mp3?filename=rock-music-amp-109861.mp3',
  },
  Jazz: {
    left: 'https://cdn.pixabay.com/download/audio/2022/03/09/audio_4f78ad6eb0.mp3?filename=smooth-jazz-201190.mp3',
    right: 'https://cdn.pixabay.com/download/audio/2022/07/25/audio_2a0fca0b5f.mp3?filename=jazzy-118173.mp3',
  },
  EDM: {
    left: 'https://cdn.pixabay.com/download/audio/2021/11/08/audio_0103a8d7d7.mp3?filename=edm-11367.mp3',
    right: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_0de2c8850b.mp3?filename=edm-dance-201690.mp3',
  },
};

const BandKnob = ({ label, value, onChange }) => {
  return (
    <div className="flex flex-col items-center">
      <input
        type="range"
        min="-12"
        max="12"
        step="0.5"
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-24 accent-red-600"
      />
      <span className="text-xs mt-1 text-gray-600">{label}</span>
    </div>
  );
};

const Deck = ({ context, label, url, playing, gains, setGains, volume }) => {
  const sourceRef = useRef(null);
  const gainNodeRef = useRef(null);
  const filtersRef = useRef({ low: null, mid: null, high: null });
  const startedRef = useRef(false);
  const [loaded, setLoaded] = useState(false);

  // Initialize audio graph
  useEffect(() => {
    if (!context) return;

    const gainNode = context.createGain();
    gainNode.gain.value = 0; // start muted until playing

    const low = context.createBiquadFilter();
    low.type = 'lowshelf';
    low.frequency.value = 200;
    low.gain.value = gains.low;

    const mid = context.createBiquadFilter();
    mid.type = 'peaking';
    mid.Q.value = 1;
    mid.frequency.value = 1000;
    mid.gain.value = gains.mid;

    const high = context.createBiquadFilter();
    high.type = 'highshelf';
    high.frequency.value = 4000;
    high.gain.value = gains.high;

    low.connect(mid);
    mid.connect(high);
    high.connect(gainNode);
    gainNode.connect(context.destination);

    gainNodeRef.current = gainNode;
    filtersRef.current = { low, mid, high };

    return () => {
      gainNode.disconnect();
      high.disconnect();
      mid.disconnect();
      low.disconnect();
    };
  }, [context]);

  // Load buffer and create source
  useEffect(() => {
    if (!context || !url) return;
    let isMounted = true;

    const load = async () => {
      try {
        const res = await fetch(url);
        const arr = await res.arrayBuffer();
        const buf = await context.decodeAudioData(arr);
        if (!isMounted) return;

        const source = context.createBufferSource();
        source.buffer = buf;
        source.loop = true;
        source.connect(filtersRef.current.low);
        sourceRef.current = source;
        setLoaded(true);
        startedRef.current = false;
      } catch (e) {
        console.error('Audio load error', e);
      }
    };

    load();

    return () => {
      isMounted = false;
      try {
        sourceRef.current?.stop();
      } catch {}
      sourceRef.current = null;
      setLoaded(false);
      startedRef.current = false;
    };
  }, [context, url]);

  // Start playback once when requested
  useEffect(() => {
    if (!context || !loaded) return;
    if (playing && !startedRef.current) {
      try {
        sourceRef.current?.start(0);
        startedRef.current = true;
      } catch {}
    }
  }, [playing, loaded, context]);

  // React to EQ and volume changes
  useEffect(() => {
    if (!filtersRef.current.low) return;
    filtersRef.current.low.gain.value = gains.low;
    filtersRef.current.mid.gain.value = gains.mid;
    filtersRef.current.high.gain.value = gains.high;
  }, [gains]);

  // Apply volume (includes crossfader and play state from parent)
  useEffect(() => {
    if (!gainNodeRef.current) return;
    gainNodeRef.current.gain.value = playing ? volume : 0;
  }, [volume, playing]);

  return (
    <div className="rounded-xl border border-gray-200 p-4 bg-white/70">
      <div className="flex items-center justify-between mb-3">
        <span className="font-semibold text-gray-800">{label}</span>
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium bg-gray-100 text-gray-700">
          {playing ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          {playing ? 'Armed' : 'Ready'}
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex gap-4">
          <BandKnob label="Low" value={gains.low} onChange={(v) => setGains((s) => ({ ...s, low: v }))} />
          <BandKnob label="Mid" value={gains.mid} onChange={(v) => setGains((s) => ({ ...s, mid: v }))} />
          <BandKnob label="High" value={gains.high} onChange={(v) => setGains((s) => ({ ...s, high: v }))} />
        </div>
        <div className="flex items-center gap-2 ml-auto">
          <Volume2 className="w-4 h-4 text-gray-600" />
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            readOnly
            className="w-28 accent-red-600 opacity-80"
          />
        </div>
      </div>
      <div className="mt-3 text-xs text-gray-500">{loaded ? 'Ready' : 'Loading...'}</div>
    </div>
  );
};

const Crossfader = ({ value, onChange }) => (
  <div className="flex items-center gap-3">
    <span className="text-xs text-gray-600">Left</span>
    <input
      type="range"
      min="0"
      max="1"
      step="0.01"
      value={value}
      onChange={(e) => onChange(parseFloat(e.target.value))}
      className="w-64 accent-red-600"
    />
    <span className="text-xs text-gray-600">Right</span>
  </div>
);

const DJMixer = () => {
  const [queryBank, setQueryBank] = useState('Rock');
  const [ctx, setCtx] = useState(null);
  const [leftArmed, setLeftArmed] = useState(false);
  const [rightArmed, setRightArmed] = useState(false);
  const [leftG, setLeftG] = useState({ low: 0, mid: 0, high: 0 });
  const [rightG, setRightG] = useState({ low: 0, mid: 0, high: 0 });
  const [leftUserVol, setLeftUserVol] = useState(0.9);
  const [rightUserVol, setRightUserVol] = useState(0.9);
  const [xf, setXf] = useState(0.5);

  useEffect(() => {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const c = new AudioCtx();
    setCtx(c);
    return () => {
      try { c.close(); } catch {}
    };
  }, []);

  // Equal-power crossfade factors
  const leftFade = Math.cos(xf * 0.5 * Math.PI);
  const rightFade = Math.cos((1 - xf) * 0.5 * Math.PI);

  return (
    <section className="rounded-2xl border border-gray-200 bg-white/70 p-4 sm:p-6">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-gray-900 flex items-center gap-2">
          <SlidersHorizontal className="w-5 h-5 text-red-600" />
          DJ Mixer
        </h2>
        <div className="flex items-center gap-3">
          <select
            value={queryBank}
            onChange={(e) => setQueryBank(e.target.value)}
            className="px-3 py-1.5 rounded-lg border border-gray-200 text-sm"
          >
            {Object.keys(demoBanks).map((k) => (
              <option key={k} value={k}>{k}</option>
            ))}
          </select>
          <button className="px-3 py-1.5 rounded-lg bg-gray-900 text-white text-sm inline-flex items-center gap-2" onClick={() => {
            // Simple swap for variety
            const keys = Object.keys(demoBanks);
            const idx = (keys.indexOf(queryBank) + 1) % keys.length;
            setQueryBank(keys[idx]);
          }}>
            <Shuffle className="w-4 h-4" />
            Shuffle Loops
          </button>
          <button className="px-3 py-1.5 rounded-lg bg-gray-100 text-gray-800 text-sm inline-flex items-center gap-2">
            <Repeat className="w-4 h-4" />
            Loop On
          </button>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setLeftArmed((s) => !s)}
              className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${leftArmed ? 'bg-red-600 text-white' : 'bg-gray-900 text-white'}`}
            >
              {leftArmed ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              {leftArmed ? 'Pause' : 'Play'}
            </button>
            <div className="flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-gray-600" />
              <input type="range" min="0" max="1" step="0.01" value={leftUserVol} onChange={(e) => setLeftUserVol(parseFloat(e.target.value))} className="w-28 accent-red-600" />
            </div>
          </div>
          <Deck
            context={ctx}
            label={`Left · ${queryBank}`}
            url={demoBanks[queryBank].left}
            playing={leftArmed}
            gains={leftG}
            setGains={setLeftG}
            volume={leftUserVol * leftFade}
          />
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setRightArmed((s) => !s)}
              className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${rightArmed ? 'bg-red-600 text-white' : 'bg-gray-900 text-white'}`}
            >
              {rightArmed ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              {rightArmed ? 'Pause' : 'Play'}
            </button>
            <div className="flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-gray-600" />
              <input type="range" min="0" max="1" step="0.01" value={rightUserVol} onChange={(e) => setRightUserVol(parseFloat(e.target.value))} className="w-28 accent-red-600" />
            </div>
          </div>
          <Deck
            context={ctx}
            label={`Right · ${queryBank}`}
            url={demoBanks[queryBank].right}
            playing={rightArmed}
            gains={rightG}
            setGains={setRightG}
            volume={rightUserVol * rightFade}
          />
        </div>
      </div>

      <div className="mt-6 flex items-center justify-center">
        <Crossfader value={xf} onChange={setXf} />
      </div>
      <p className="mt-3 text-center text-xs text-gray-500">Tip: Press play on both decks and use the crossfader + EQ bands to blend genres.</p>
    </section>
  );
};

export default DJMixer;
