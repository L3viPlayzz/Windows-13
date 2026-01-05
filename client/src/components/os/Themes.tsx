import { Palette, Upload, Trash2, Check } from 'lucide-react';
import { useState, useRef } from 'react';
import { useSystemSettings, WallpaperOption } from '@/lib/SystemSettingsContext';

export function ThemesApp() {
  const { settings, wallpapers, setWallpaper, setAccentColor, addCustomWallpaper, removeCustomWallpaper } = useSystemSettings();
  const [notification, setNotification] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const accentColors = [
    { id: 'blue', value: '#3b82f6', name: 'Blue' },
    { id: 'purple', value: '#8b5cf6', name: 'Purple' },
    { id: 'pink', value: '#ec4899', name: 'Pink' },
    { id: 'orange', value: '#f97316', name: 'Orange' },
    { id: 'green', value: '#22c55e', name: 'Green' },
    { id: 'cyan', value: '#06b6d4', name: 'Cyan' },
    { id: 'red', value: '#ef4444', name: 'Red' },
    { id: 'yellow', value: '#eab308', name: 'Yellow' },
  ];

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(''), 2000);
  };

  const handleWallpaperSelect = (wallpaper: WallpaperOption) => {
    setWallpaper(wallpaper);
    showNotification(`Wallpaper changed to ${wallpaper.name}`);
  };

  const handleAccentColorSelect = (color: string) => {
    setAccentColor(color);
    showNotification('Accent color updated');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageUrl = event.target?.result as string;
        const name = file.name.replace(/\.[^/.]+$/, '');
        addCustomWallpaper(name, imageUrl);
        showNotification(`Added wallpaper: ${name}`);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveWallpaper = (id: string, name: string) => {
    removeCustomWallpaper(id);
    showNotification(`Removed wallpaper: ${name}`);
  };

  const getWallpaperPreviewStyle = (wallpaper: WallpaperOption) => {
    if (wallpaper.type === 'image' || wallpaper.type === 'custom') {
      return { backgroundImage: `url(${wallpaper.thumbnail || wallpaper.value})`, backgroundSize: 'cover', backgroundPosition: 'center' };
    }
    return { background: wallpaper.value };
  };

  return (
    <div className="h-full w-full bg-white dark:bg-[#1a1a1a] overflow-auto">
      {notification && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-in slide-in-from-top-2">
          {notification}
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileUpload}
      />

      <div className="p-8">
        <div className="flex items-center gap-3 mb-8">
          <Palette className="w-8 h-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-foreground">Themes & Wallpapers</h1>
        </div>

        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground">Wallpapers</h2>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition-colors"
            >
              <Upload className="w-4 h-4" /> Add Custom
            </button>
          </div>
          
          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {wallpapers.map(wallpaper => (
              <div key={wallpaper.id} className="relative group">
                <button
                  onClick={() => handleWallpaperSelect(wallpaper)}
                  className={`w-full aspect-video rounded-lg transition-all overflow-hidden ${
                    settings.wallpaper.id === wallpaper.id 
                      ? 'ring-2 ring-blue-500 ring-offset-2 ring-offset-background' 
                      : 'hover:ring-2 ring-white/30'
                  }`}
                  style={getWallpaperPreviewStyle(wallpaper)}
                >
                  {settings.wallpaper.id === wallpaper.id && (
                    <div className="absolute inset-0 bg-blue-500/20 flex items-center justify-center">
                      <Check className="w-6 h-6 text-white drop-shadow-lg" />
                    </div>
                  )}
                </button>
                <p className="text-xs text-center mt-2 text-muted-foreground truncate">{wallpaper.name}</p>
                {wallpaper.type === 'custom' && (
                  <button
                    onClick={() => handleRemoveWallpaper(wallpaper.id, wallpaper.name)}
                    className="absolute top-1 right-1 p-1 bg-red-500/80 hover:bg-red-500 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="w-3 h-3 text-white" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-[#2B2B2B] border border-zinc-200 dark:border-white/5 p-6 rounded-lg max-w-2xl">
          <h2 className="font-bold mb-4 text-foreground">Accent Color</h2>
          <div className="flex flex-wrap gap-3">
            {accentColors.map(color => (
              <button
                key={color.id}
                onClick={() => handleAccentColorSelect(color.value)}
                className={`w-10 h-10 rounded-full transition-all ${
                  settings.accentColor === color.value 
                    ? 'ring-2 ring-offset-2 ring-offset-background ring-white scale-110' 
                    : 'hover:scale-105'
                }`}
                style={{ backgroundColor: color.value }}
                title={color.name}
              >
                {settings.accentColor === color.value && (
                  <Check className="w-5 h-5 text-white mx-auto" />
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 bg-white dark:bg-[#2B2B2B] border border-zinc-200 dark:border-white/5 p-6 rounded-lg max-w-2xl">
          <h2 className="font-bold mb-4 text-foreground">Current Theme Preview</h2>
          <div 
            className="aspect-video rounded-lg shadow-lg overflow-hidden"
            style={getWallpaperPreviewStyle(settings.wallpaper)}
          >
            <div className="h-full w-full flex flex-col">
              <div className="flex-1" />
              <div className="h-10 bg-black/50 backdrop-blur-md flex items-center justify-center gap-2">
                <div className="w-6 h-6 rounded bg-white/20" />
                <div className="w-6 h-6 rounded bg-white/20" />
                <div className="w-6 h-6 rounded bg-white/20" />
              </div>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mt-3">
            Current: <span className="font-medium text-foreground">{settings.wallpaper.name}</span>
          </p>
        </div>
      </div>
    </div>
  );
}
