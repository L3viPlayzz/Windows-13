import { MapPin, Navigation, Search, Plus, Minus } from 'lucide-react';
import { useState } from 'react';

export function MapsApp() {
  const [zoom, setZoom] = useState(12);
  const [searchInput, setSearchInput] = useState('');

  return (
    <div className="h-full w-full bg-white dark:bg-[#1a1a1a] flex flex-col">
      <div className="border-b border-zinc-200 dark:border-zinc-800 p-4 flex gap-2">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input type="text" value={searchInput} onChange={e => setSearchInput(e.target.value)} placeholder="Search location..." className="w-full pl-10 pr-4 py-2 bg-zinc-100 dark:bg-zinc-800 rounded-lg outline-none focus:ring-2 ring-blue-500/50" />
        </div>
        <button className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"><Navigation className="w-5 h-5" /></button>
      </div>

      <div className="flex-1 relative overflow-hidden bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-900/20 dark:to-cyan-900/20">
        <svg className="w-full h-full" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <rect width="100" height="100" fill="url(#mapGradient)" />
          <defs>
            <linearGradient id="mapGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#bfdbfe" />
              <stop offset="100%" stopColor="#a5f3fc" />
            </linearGradient>
          </defs>
          <path d="M 30 40 Q 50 20, 70 40 T 70 60" stroke="#3b82f6" strokeWidth="1" fill="none" opacity="0.5" />
          <circle cx="50" cy="50" r="3" fill="#dc2626" />
        </svg>
        
        <button className="absolute top-4 right-4 p-2 bg-white dark:bg-zinc-800 rounded-lg shadow hover:shadow-lg">
          <MapPin className="w-5 h-5 text-blue-600" />
        </button>

        <div className="absolute right-4 top-20 space-y-2 flex flex-col">
          <button onClick={() => setZoom(Math.min(20, zoom + 1))} className="p-2 bg-white dark:bg-zinc-800 rounded-lg shadow hover:shadow-lg">
            <Plus className="w-5 h-5" />
          </button>
          <button onClick={() => setZoom(Math.max(1, zoom - 1))} className="p-2 bg-white dark:bg-zinc-800 rounded-lg shadow hover:shadow-lg">
            <Minus className="w-5 h-5" />
          </button>
        </div>

        <div className="absolute bottom-4 left-4 bg-white dark:bg-zinc-800 p-3 rounded-lg shadow">
          <p className="text-sm font-semibold">Current Location</p>
          <p className="text-xs text-muted-foreground">San Francisco, CA</p>
          <p className="text-xs text-muted-foreground">Zoom: {zoom}x</p>
        </div>
      </div>
    </div>
  );
}
