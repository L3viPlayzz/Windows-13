import { useState } from 'react';
import { useSystemSettings } from '@/lib/SystemSettingsContext';
import { 
  Download, 
  Check, 
  Star, 
  Search,
  Loader2,
  Trash2,
  Gamepad2,
  Newspaper,
  Cloud,
  Palette,
  Music,
  Video,
  Camera,
  MessageSquare,
  FileText,
  Code,
  Compass,
  Timer,
  BookOpen,
  Dumbbell,
  ChefHat,
  Plane,
  Wallet,
  ShoppingCart,
} from 'lucide-react';

interface StoreApp {
  id: string;
  name: string;
  icon: string;
  color: string;
  description: string;
  size: string;
  rating: number;
  category: string;
  publisher: string;
}

const availableApps: StoreApp[] = [
  { id: 'notes', name: 'Notes', icon: 'FileText', color: 'text-yellow-500', description: 'Quick notes and reminders', size: '12 MB', rating: 4.5, category: 'Productivity', publisher: 'Microsoft' },
  { id: 'weather', name: 'Weather', icon: 'Cloud', color: 'text-blue-400', description: 'Real-time weather forecasts', size: '25 MB', rating: 4.7, category: 'Utilities', publisher: 'Microsoft' },
  { id: 'paint', name: 'Paint', icon: 'Palette', color: 'text-purple-500', description: 'Digital drawing canvas', size: '45 MB', rating: 4.3, category: 'Creative', publisher: 'Microsoft' },
  { id: 'podcast', name: 'Podcasts', icon: 'Music', color: 'text-pink-500', description: 'Listen to your favorite shows', size: '38 MB', rating: 4.6, category: 'Entertainment', publisher: 'Microsoft' },
  { id: 'movies', name: 'Movies & TV', icon: 'Video', color: 'text-red-500', description: 'Watch movies and TV shows', size: '56 MB', rating: 4.4, category: 'Entertainment', publisher: 'Microsoft' },
  { id: 'photos', name: 'Photos', icon: 'Camera', color: 'text-green-500', description: 'View and edit your photos', size: '42 MB', rating: 4.5, category: 'Creative', publisher: 'Microsoft' },
  { id: 'chat', name: 'Teams Chat', icon: 'MessageSquare', color: 'text-indigo-500', description: 'Chat with friends and colleagues', size: '89 MB', rating: 4.2, category: 'Social', publisher: 'Microsoft' },
  { id: 'code-editor', name: 'Code Editor', icon: 'Code', color: 'text-cyan-500', description: 'Lightweight code editor', size: '67 MB', rating: 4.8, category: 'Developer', publisher: 'Microsoft' },
  { id: 'maps', name: 'Maps', icon: 'Compass', color: 'text-orange-500', description: 'Navigate and explore', size: '78 MB', rating: 4.4, category: 'Utilities', publisher: 'Microsoft' },
  { id: 'timer', name: 'Timer & Clock', icon: 'Timer', color: 'text-teal-500', description: 'Timers, alarms, and world clock', size: '8 MB', rating: 4.6, category: 'Utilities', publisher: 'Microsoft' },
  { id: 'reader', name: 'Reader', icon: 'BookOpen', color: 'text-amber-600', description: 'E-book and PDF reader', size: '34 MB', rating: 4.5, category: 'Productivity', publisher: 'Microsoft' },
  { id: 'fitness', name: 'Fitness', icon: 'Dumbbell', color: 'text-lime-500', description: 'Track your workouts', size: '29 MB', rating: 4.3, category: 'Health', publisher: 'Microsoft' },
  { id: 'recipes', name: 'Recipes', icon: 'ChefHat', color: 'text-rose-500', description: 'Cooking ideas and recipes', size: '22 MB', rating: 4.7, category: 'Lifestyle', publisher: 'Microsoft' },
  { id: 'travel', name: 'Travel', icon: 'Plane', color: 'text-sky-500', description: 'Plan your next adventure', size: '48 MB', rating: 4.4, category: 'Travel', publisher: 'Microsoft' },
  { id: 'wallet', name: 'Wallet', icon: 'Wallet', color: 'text-emerald-500', description: 'Manage your finances', size: '18 MB', rating: 4.2, category: 'Finance', publisher: 'Microsoft' },
  { id: 'shop', name: 'Shop', icon: 'ShoppingCart', color: 'text-violet-500', description: 'Online shopping', size: '35 MB', rating: 4.5, category: 'Shopping', publisher: 'Microsoft' },
  { id: 'news', name: 'News', icon: 'Newspaper', color: 'text-slate-500', description: 'Stay updated with news', size: '28 MB', rating: 4.3, category: 'News', publisher: 'Microsoft' },
  { id: 'games', name: 'Games Hub', icon: 'Gamepad2', color: 'text-fuchsia-500', description: 'Play casual games', size: '120 MB', rating: 4.6, category: 'Games', publisher: 'Microsoft' },
];

const iconComponents: Record<string, any> = {
  FileText, Cloud, Palette, Music, Video, Camera, MessageSquare, Code, 
  Compass, Timer, BookOpen, Dumbbell, ChefHat, Plane, Wallet, ShoppingCart,
  Newspaper, Gamepad2,
};

const categories = ['All', 'Productivity', 'Entertainment', 'Creative', 'Utilities', 'Social', 'Developer', 'Games'];

export function AppStore() {
  const { installedApps, installApp, uninstallApp, isAppInstalled } = useSystemSettings();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [installingApps, setInstallingApps] = useState<Set<string>>(new Set());
  const [selectedApp, setSelectedApp] = useState<StoreApp | null>(null);

  const filteredApps = availableApps.filter(app => {
    const matchesSearch = app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          app.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || app.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleInstall = async (app: StoreApp) => {
    setInstallingApps(prev => new Set(prev).add(app.id));
    
    await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));
    
    installApp({
      id: app.id,
      name: app.name,
      icon: app.icon,
      color: app.color,
      description: app.description,
      size: app.size,
    });
    
    setInstallingApps(prev => {
      const next = new Set(prev);
      next.delete(app.id);
      return next;
    });
  };

  const handleUninstall = (appId: string) => {
    uninstallApp(appId);
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map(i => (
          <Star 
            key={i} 
            className={`w-3 h-3 ${i <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-zinc-300'}`} 
          />
        ))}
        <span className="text-xs text-muted-foreground ml-1">{rating}</span>
      </div>
    );
  };

  if (selectedApp) {
    const IconComponent = iconComponents[selectedApp.icon];
    const installed = isAppInstalled(selectedApp.id);
    const installing = installingApps.has(selectedApp.id);

    return (
      <div className="h-full flex flex-col bg-background p-6">
        <button 
          onClick={() => setSelectedApp(null)}
          className="text-sm text-blue-500 hover:underline mb-4 self-start"
        >
          ← Back to Store
        </button>
        
        <div className="flex gap-6 mb-6">
          <div className={`w-24 h-24 rounded-2xl bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-zinc-800 dark:to-zinc-900 flex items-center justify-center ${selectedApp.color}`}>
            {IconComponent && <IconComponent className="w-12 h-12" />}
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold mb-1">{selectedApp.name}</h1>
            <p className="text-sm text-muted-foreground mb-2">{selectedApp.publisher}</p>
            {renderStars(selectedApp.rating)}
            <div className="flex gap-4 mt-4">
              {installed ? (
                <button
                  onClick={() => handleUninstall(selectedApp.id)}
                  className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Uninstall
                </button>
              ) : (
                <button
                  onClick={() => handleInstall(selectedApp)}
                  disabled={installing}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg font-medium flex items-center gap-2"
                >
                  {installing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Installing...
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4" />
                      Install
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="font-medium mb-2">Description</h3>
            <p className="text-sm text-muted-foreground">{selectedApp.description}</p>
          </div>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-3 bg-zinc-100 dark:bg-zinc-800 rounded-lg">
              <div className="text-lg font-bold">{selectedApp.size}</div>
              <div className="text-xs text-muted-foreground">Size</div>
            </div>
            <div className="p-3 bg-zinc-100 dark:bg-zinc-800 rounded-lg">
              <div className="text-lg font-bold">{selectedApp.category}</div>
              <div className="text-xs text-muted-foreground">Category</div>
            </div>
            <div className="p-3 bg-zinc-100 dark:bg-zinc-800 rounded-lg">
              <div className="text-lg font-bold">{selectedApp.rating}</div>
              <div className="text-xs text-muted-foreground">Rating</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-background">
      <div className="p-4 border-b border-zinc-200 dark:border-white/10">
        <h1 className="text-xl font-bold mb-4">Microsoft Store</h1>
        
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search apps..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-zinc-100 dark:bg-zinc-800 rounded-lg border-0 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                selectedCategory === cat 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-auto p-4">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredApps.map(app => {
            const IconComponent = iconComponents[app.icon];
            const installed = isAppInstalled(app.id);
            const installing = installingApps.has(app.id);

            return (
              <div
                key={app.id}
                className="p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer group"
                onClick={() => setSelectedApp(app)}
              >
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br from-white to-zinc-100 dark:from-zinc-700 dark:to-zinc-800 flex items-center justify-center mb-3 ${app.color} group-hover:scale-105 transition-transform`}>
                  {IconComponent && <IconComponent className="w-7 h-7" />}
                </div>
                <h3 className="font-medium text-sm mb-1 truncate">{app.name}</h3>
                <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{app.description}</p>
                {renderStars(app.rating)}
                <div className="mt-3" onClick={(e) => e.stopPropagation()}>
                  {installed ? (
                    <div className="flex items-center gap-1 text-green-500 text-xs font-medium">
                      <Check className="w-3 h-3" />
                      Installed
                    </div>
                  ) : (
                    <button
                      onClick={() => handleInstall(app)}
                      disabled={installing}
                      className="w-full py-1.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg text-xs font-medium flex items-center justify-center gap-1"
                    >
                      {installing ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : (
                        <>
                          <Download className="w-3 h-3" />
                          Get
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {filteredApps.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <Search className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p>No apps found</p>
          </div>
        )}
      </div>
    </div>
  );
}
