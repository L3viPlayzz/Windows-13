import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Moon, Sun, Wifi, Bluetooth, Monitor, Battery, Volume2, WifiOff, BatteryCharging, Plane, Bell, BellOff, Accessibility, MapPin, Lightbulb } from 'lucide-react';
import { cn } from '@/lib/utils';

interface QuickSettingsProps {
  isOpen: boolean;
  isDark: boolean;
  toggleTheme: () => void;
  onClose: () => void;
  onOpenSettings: () => void;
}

export function QuickSettings({ isOpen, isDark, toggleTheme, onClose, onOpenSettings }: QuickSettingsProps) {
  const [wifiEnabled, setWifiEnabled] = useState(true);
  const [bluetoothEnabled, setBluetoothEnabled] = useState(false);
  const [airplaneMode, setAirplaneMode] = useState(false);
  const [doNotDisturb, setDoNotDisturb] = useState(false);
  const [accessibility, setAccessibility] = useState(false);
  const [locationEnabled, setLocationEnabled] = useState(true);
  const [brightness, setBrightness] = useState(70);
  const [volume, setVolume] = useState(45);
  const [batteryLevel, setBatteryLevel] = useState<number | null>(null);
  const [isCharging, setIsCharging] = useState(false);
  const [notification, setNotification] = useState('');

  useEffect(() => {
    // @ts-ignore
    if (navigator.getBattery) {
      // @ts-ignore
      navigator.getBattery().then((battery) => {
        const updateBattery = () => {
          setBatteryLevel(Math.round(battery.level * 100));
          setIsCharging(battery.charging);
        };
        updateBattery();
        battery.addEventListener('levelchange', updateBattery);
        battery.addEventListener('chargingchange', updateBattery);
      });
    } else {
      setBatteryLevel(100);
    }
  }, []);

  // Apply real brightness control via CSS filter
  const applyBrightness = (level: number) => {
    const filter = `brightness(${Math.max(0.3, level / 100)})`; // Minimum 30% brightness
    document.documentElement.style.filter = filter;
    localStorage.setItem('brightness-level', level.toString());
  };

  // Apply real volume control
  const applyVolume = (level: number) => {
    // Store volume level for Web Audio API usage
    localStorage.setItem('volume-level', level.toString());
    // Show as percentage
    showNotif(`Volume: ${level}%`);
  };

  // Toggle location sharing
  const toggleLocation = () => {
    if (navigator.geolocation) {
      if (locationEnabled) {
        setLocationEnabled(false);
        showNotif('Location disabled');
      } else {
        navigator.geolocation.getCurrentPosition(
          () => {
            setLocationEnabled(true);
            showNotif('Location enabled');
          },
          () => {
            showNotif('Location permission denied');
          }
        );
      }
    }
  };

  const showNotif = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(''), 1500);
  };

  // Load brightness on mount
  useEffect(() => {
    const savedBrightness = localStorage.getItem('brightness-level');
    if (savedBrightness) {
      const level = Number(savedBrightness);
      setBrightness(level);
      applyBrightness(level);
    }
  }, []);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={onClose} />
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="fixed bottom-20 right-4 w-96 max-h-[75vh] p-6 rounded-2xl bg-white/85 dark:bg-[#1a1a1a]/95 backdrop-blur-3xl border border-white/40 dark:border-white/20 shadow-2xl z-[10001] text-foreground overflow-y-auto"
            data-testid="quick-settings-panel"
          >
            <div className="mb-4 pb-4 border-b border-white/10">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">Quick Toggles</h3>
              <div className="grid grid-cols-4 gap-3">
                <button onClick={() => { setWifiEnabled(!wifiEnabled); showNotif(wifiEnabled ? 'Wi-Fi off' : 'Wi-Fi on'); }} className={cn("aspect-square rounded-xl flex flex-col items-center justify-center gap-1.5 transition-all group active:scale-95 text-xs font-medium border", wifiEnabled ? 'bg-blue-500/20 border-blue-400/50 text-blue-600 dark:text-blue-400' : 'bg-white/5 border-white/10 hover:bg-white/10 text-foreground')}>
                  {wifiEnabled ? <Wifi className="w-5 h-5" /> : <WifiOff className="w-5 h-5" />}
                  <span>Wi-Fi</span>
                </button>
                <button onClick={() => { setBluetoothEnabled(!bluetoothEnabled); showNotif(bluetoothEnabled ? 'Bluetooth off' : 'Bluetooth on'); }} className={cn("aspect-square rounded-xl flex flex-col items-center justify-center gap-1.5 transition-all group active:scale-95 text-xs font-medium border", bluetoothEnabled ? 'bg-blue-500/20 border-blue-400/50 text-blue-600 dark:text-blue-400' : 'bg-white/5 border-white/10 hover:bg-white/10 text-foreground')}>
                  <Bluetooth className="w-5 h-5" />
                  <span>BT</span>
                </button>
                <button onClick={() => { setAirplaneMode(!airplaneMode); showNotif(airplaneMode ? 'Airplane off' : 'Airplane on'); }} className={cn("aspect-square rounded-xl flex flex-col items-center justify-center gap-1.5 transition-all group active:scale-95 text-xs font-medium border", airplaneMode ? 'bg-orange-500/20 border-orange-400/50 text-orange-600 dark:text-orange-400' : 'bg-white/5 border-white/10 hover:bg-white/10 text-foreground')}>
                  <Plane className="w-5 h-5" />
                  <span>Airplane</span>
                </button>
                <button onClick={() => { setDoNotDisturb(!doNotDisturb); showNotif(doNotDisturb ? 'DND off' : 'DND on'); }} className={cn("aspect-square rounded-xl flex flex-col items-center justify-center gap-1.5 transition-all group active:scale-95 text-xs font-medium border", doNotDisturb ? 'bg-purple-500/20 border-purple-400/50 text-purple-600 dark:text-purple-400' : 'bg-white/5 border-white/10 hover:bg-white/10 text-foreground')}>
                  {doNotDisturb ? <BellOff className="w-5 h-5" /> : <Bell className="w-5 h-5" />}
                  <span>DND</span>
                </button>
                <button onClick={toggleLocation} className={cn("aspect-square rounded-xl flex flex-col items-center justify-center gap-1.5 transition-all group active:scale-95 text-xs font-medium border", locationEnabled ? 'bg-green-500/20 border-green-400/50 text-green-600 dark:text-green-400' : 'bg-white/5 border-white/10 hover:bg-white/10 text-foreground')}>
                  <MapPin className="w-5 h-5" />
                  <span>Location</span>
                </button>
                <button onClick={() => { setAccessibility(!accessibility); showNotif(accessibility ? 'A11y off' : 'A11y on'); }} className={cn("aspect-square rounded-xl flex flex-col items-center justify-center gap-1.5 transition-all group active:scale-95 text-xs font-medium border", accessibility ? 'bg-pink-500/20 border-pink-400/50 text-pink-600 dark:text-pink-400' : 'bg-white/5 border-white/10 hover:bg-white/10 text-foreground')}>
                  <Accessibility className="w-5 h-5" />
                  <span>A11y</span>
                </button>
                <button 
                  onClick={() => { toggleTheme(); showNotif(isDark ? 'Light mode' : 'Dark mode'); }}
                  className={cn("aspect-square rounded-xl flex flex-col items-center justify-center gap-1.5 transition-all group active:scale-95 text-xs font-medium border", isDark ? 'bg-slate-500/20 border-slate-400/50 text-slate-400' : 'bg-yellow-500/20 border-yellow-400/50 text-yellow-600')}
                >
                  {isDark ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                  <span>{isDark ? 'Dark' : 'Light'}</span>
                </button>
              </div>
            </div>

            <div className="space-y-4 mb-4 pb-4 border-b border-white/10">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Display & Sound</h3>
              <div className="space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Lightbulb className="w-4 h-4" />
                      <span>Brightness</span>
                    </div>
                    <span className="text-foreground font-bold text-sm">{brightness}%</span>
                  </div>
                  <input 
                    type="range" 
                    min="30" 
                    max="100" 
                    value={brightness}
                    onChange={(e) => { 
                      const level = Number(e.target.value);
                      setBrightness(level);
                      applyBrightness(level);
                      showNotif(`Brightness: ${level}%`);
                    }}
                    className="w-full h-2 bg-white/20 rounded-full cursor-pointer accent-blue-500 appearance-none"
                    style={{
                      background: `linear-gradient(to right, rgba(59, 130, 246, 0.5) 0%, rgba(59, 130, 246, 0.5) ${brightness}%, rgba(255, 255, 255, 0.2) ${brightness}%, rgba(255, 255, 255, 0.2) 100%)`
                    }}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Volume2 className="w-4 h-4" />
                      <span>Volume</span>
                    </div>
                    <span className="text-foreground font-bold text-sm">{volume}%</span>
                  </div>
                  <input 
                    type="range" 
                    min="0" 
                    max="100" 
                    value={volume}
                    onChange={(e) => { 
                      const level = Number(e.target.value);
                      setVolume(level);
                      applyVolume(level);
                    }}
                    className="w-full h-2 bg-white/20 rounded-full cursor-pointer accent-blue-500 appearance-none"
                    style={{
                      background: `linear-gradient(to right, rgba(59, 130, 246, 0.5) 0%, rgba(59, 130, 246, 0.5) ${volume}%, rgba(255, 255, 255, 0.2) ${volume}%, rgba(255, 255, 255, 0.2) 100%)`
                    }}
                  />
                </div>
              </div>
            </div>
            
            <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-muted-foreground font-medium">
                {isCharging ? <BatteryCharging className="w-4 h-4 text-green-500" /> : <Battery className="w-4 h-4" />}
                <span>{batteryLevel}%</span>
              </div>
              <button onClick={() => { onOpenSettings(); onClose(); }} className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors active:opacity-70 font-medium" data-testid="button-all-settings">All settings</button>
            </div>

            {notification && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute -top-12 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs px-3 py-1.5 rounded-lg shadow-lg whitespace-nowrap"
              >
                {notification}
              </motion.div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
