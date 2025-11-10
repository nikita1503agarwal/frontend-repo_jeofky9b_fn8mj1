import React, { useEffect, useMemo, useState } from 'react';

const VideoCard = ({ video, onOpen }) => {
  const viewsText = useMemo(() => {
    if (!video.views) return null;
    const v = Number(video.views);
    if (isNaN(v)) return null;
    if (v >= 1_000_000) return `${(v/1_000_000).toFixed(1)}M views`;
    if (v >= 1_000) return `${(v/1_000).toFixed(1)}K views`;
    return `${v} views`;
  }, [video.views]);

  return (
    <button onClick={() => onOpen(video)} className="group text-left">
      <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-gray-100">
        <img
          src={video.thumb}
          alt={video.title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
        />
        {video.duration && (
          <span className="absolute bottom-2 right-2 text-xs font-semibold bg-black/80 text-white px-2 py-0.5 rounded">
            {video.duration}
          </span>
        )}
      </div>
      <div className="mt-3 flex gap-3">
        <div className="h-9 w-9 rounded-full bg-gradient-to-br from-red-500 to-orange-500 text-white flex items-center justify-center text-xs font-bold">
          {video.channel?.split(' ').map(w => w[0]).join('').slice(0,2)}
        </div>
        <div>
          <h3 className="line-clamp-2 font-semibold text-gray-900 leading-snug">{video.title}</h3>
          <p className="text-sm text-gray-500">{video.channel}</p>
          <p className="text-sm text-gray-500">{viewsText}</p>
        </div>
      </div>
    </button>
  );
};

const VideoGrid = ({ onOpen, items }) => {
  const list = items || [];
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
      {list.map((v) => (
        <VideoCard key={v.id} video={v} onOpen={onOpen} />
      ))}
    </div>
  );
};

export default VideoGrid;
