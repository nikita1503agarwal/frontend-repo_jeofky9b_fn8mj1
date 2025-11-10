import React from 'react';

const mockVideos = [
  {
    id: '1',
    title: 'Lo-Fi Indie Rock – Chill Session',
    channel: 'The Hazel Tones',
    views: '1.2M views',
    time: '2 days ago',
    thumb: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?q=80&w=1200&auto=format&fit=crop',
    duration: '12:36',
  },
  {
    id: '2',
    title: 'Synthwave Night Drive – DJ Set',
    channel: 'Neon Boulevard',
    views: '948K views',
    time: '1 week ago',
    thumb: 'https://images.unsplash.com/photo-1516280030429-27679b3dc9cf?q=80&w=1200&auto=format&fit=crop',
    duration: '58:22',
  },
  {
    id: '3',
    title: 'Jazz Funk Jam – Live Session',
    channel: 'Bluebird Collective',
    views: '312K views',
    time: '3 days ago',
    thumb: 'https://images.unsplash.com/photo-1517230878791-4d28214057c2?q=80&w=1200&auto=format&fit=crop',
    duration: '08:45',
  },
  {
    id: '4',
    title: 'Metal Fusion – Stadium Energy',
    channel: 'Crimson Forge',
    views: '2.3M views',
    time: '4 months ago',
    thumb: 'https://images.unsplash.com/photo-1464375117522-1311d7f0b5b6?q=80&w=1200&auto=format&fit=crop',
    duration: '04:21',
  },
  {
    id: '5',
    title: 'Afrobeat Sunrise – Dance Mix',
    channel: 'Golden Palm Crew',
    views: '723K views',
    time: '2 weeks ago',
    thumb: 'https://images.unsplash.com/photo-1511193311914-0346f16efe90?q=80&w=1200&auto=format&fit=crop',
    duration: '42:03',
  },
  {
    id: '6',
    title: 'Classical Piano – Deep Focus',
    channel: 'Nocturne Lab',
    views: '1.9M views',
    time: '1 month ago',
    thumb: 'https://images.unsplash.com/photo-1513889961551-628c1e19b793?q=80&w=1200&auto=format&fit=crop',
    duration: '1:21:10',
  },
];

const VideoCard = ({ video, onOpen }) => {
  return (
    <button onClick={() => onOpen(video)} className="group text-left">
      <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-gray-100">
        <img
          src={video.thumb}
          alt={video.title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
        />
        <span className="absolute bottom-2 right-2 text-xs font-semibold bg-black/80 text-white px-2 py-0.5 rounded">
          {video.duration}
        </span>
      </div>
      <div className="mt-3 flex gap-3">
        <div className="h-9 w-9 rounded-full bg-gradient-to-br from-red-500 to-orange-500 text-white flex items-center justify-center text-xs font-bold">
          {video.channel.split(' ').map(w => w[0]).join('').slice(0,2)}
        </div>
        <div>
          <h3 className="line-clamp-2 font-semibold text-gray-900 leading-snug">{video.title}</h3>
          <p className="text-sm text-gray-500">{video.channel}</p>
          <p className="text-sm text-gray-500">{video.views} • {video.time}</p>
        </div>
      </div>
    </button>
  );
};

const VideoGrid = ({ onOpen }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
      {mockVideos.map((v) => (
        <VideoCard key={v.id} video={v} onOpen={onOpen} />
      ))}
    </div>
  );
};

export default VideoGrid;
