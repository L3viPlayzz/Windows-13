import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Wifi, Volume2, Battery, ChevronUp, WifiOff, BatteryCharging, BatteryWarning, Download } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

interface TaskbarProps {
  toggleStart: (e: any) => void;
  isStartOpen: boolean;
  openWindows: any[];
  activeWindowId: string;
  pinnedApps: any[];
  onWindowClick: (id: string) => void;
  onQuickSettingsClick: () => void;
  onTimeClick?: () => void;
  onChevronClick?: () => void;
}

export function Taskbar({ toggleStart, isStartOpen, openWindows, activeWindowId, pinnedApps = [], onWindowClick, onQuickSettingsClick, onTimeClick, onChevronClick }: TaskbarProps) {
  const [time, setTime] = useState(new Date());
  const [batteryLevel, setBatteryLevel] = useState<number | null>(null);
  const [isCharging, setIsCharging] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [notification, setNotification] = useState('');
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);

    // Network Status
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Battery Status API
    // @ts-ignore - Battery API is not in standard TS types yet
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
        // Fallback for simulation
        setBatteryLevel(100);
    }

    // PWA Install
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    const handleInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      clearInterval(timer);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('beforeinstallprompt', handleInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleQuickSettings = () => {
    onQuickSettingsClick();
  };

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsInstalled(true);
      }
      setDeferredPrompt(null);
    } else {
      window.open(window.location.href, '_blank');
    }
  };

  return (
    <div className="fixed bottom-4 left-4 right-4 h-14 flex justify-center z-[9999] pointer-events-none">
      {/* Dock Container - Enable pointer events for children */}
      <div className="pointer-events-auto relative flex items-center h-full bg-white/60 dark:bg-[#1a1a1a]/60 backdrop-blur-2xl border border-white/20 dark:border-white/10 rounded-2xl shadow-2xl px-2 gap-2">
        
        {/* Start Button */}
        <button 
          onClick={toggleStart}
          className="p-2 rounded-xl hover:bg-white/20 transition-colors active:scale-95 relative group"
        >
          <div className="w-6 h-6 grid grid-cols-2 gap-0.5 group-hover:gap-1 transition-all duration-300">
            <div className="bg-[#0078D4] rounded-[2px] shadow-sm" />
            <div className="bg-[#0078D4] rounded-[2px] shadow-sm" />
            <div className="bg-[#0078D4] rounded-[2px] shadow-sm" />
            <div className="bg-[#0078D4] rounded-[2px] shadow-sm" />
          </div>
          {isStartOpen && (
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-blue-400 rounded-full" />
          )}
        </button>

        <div className="w-px h-8 bg-white/10 mx-1" />

        {/* Pinned Apps */}
        {pinnedApps.map((app: any) => (
          <button
            key={app.id}
            onClick={(e) => {
              e.stopPropagation();
              onWindowClick(app.id);
            }}
            className={`
              relative p-2.5 rounded-xl transition-all duration-200 group hover:bg-white/10 hover:-translate-y-1
              ${activeWindowId === app.id ? 'bg-white/10' : ''}
            `}
          >
            <app.icon className={`w-6 h-6 ${app.color}`} />
            {openWindows.find((w: any) => w.id === app.id)?.isOpen && !openWindows.find((w: any) => w.id === app.id)?.isMinimised && (
              <motion.div 
                layoutId="active-indicator"
                className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-white/50 rounded-full"
              />
            )}
            {/* Tooltip */}
            <div className="absolute -top-12 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-black/80 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none backdrop-blur-md whitespace-nowrap font-display">
              {app.title}
            </div>
          </button>
        ))}

        {openWindows.length > 0 && pinnedApps.length > 0 && <div className="w-px h-8 bg-white/10 mx-1" />}

        {/* Open Apps not in pinned */}
        {openWindows.filter((win: any) => win.isOpen && !pinnedApps.find((p: any) => p.id === win.id)).map((win: any) => (
          <button
            key={win.id}
            onClick={(e) => {
              e.stopPropagation();
              onWindowClick(win.id);
            }}
            className={`
              relative p-2.5 rounded-xl transition-all duration-200 group hover:bg-white/10 hover:-translate-y-1
              ${activeWindowId === win.id && !win.isMinimised ? 'bg-white/10' : ''}
            `}
          >
            <win.icon className={`w-6 h-6 ${win.color}`} />
            {!win.isMinimised && (
              <motion.div 
                layoutId="active-indicator"
                className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-white/50 rounded-full"
              />
            )}
            {/* Tooltip */}
            <div className="absolute -top-12 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-black/80 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none backdrop-blur-md whitespace-nowrap font-display">
              {win.title}
            </div>
          </button>
        ))}

        <div className="w-px h-8 bg-white/10 mx-1" />

        {/* System Tray */}
        <div className="flex items-center gap-1 px-2">
          {!isInstalled && (
            <button 
              onClick={(e) => { e.stopPropagation(); handleInstall(); }}
              className="p-2 hover:bg-blue-500/30 rounded-lg transition-colors group relative"
              data-testid="button-install-app"
              title="Install App"
            >
              <Download className="w-4 h-4 text-blue-400" />
              <div className="absolute -top-12 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-black/80 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none backdrop-blur-md whitespace-nowrap font-display">
                Install App
              </div>
            </button>
          )}
          <button 
            onClick={(e) => { e.stopPropagation(); onChevronClick?.(); }}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors hidden sm:block"
            data-testid="button-chevron-up"
          >
            <ChevronUp className="w-4 h-4 text-muted-foreground" />
          </button>
          
          <button 
            onClick={(e) => { e.stopPropagation(); handleQuickSettings(); }}
            className="flex items-center gap-2 px-3 py-2 hover:bg-blue-500/30 rounded-lg transition-colors h-9 text-foreground active:scale-95 active:bg-blue-500/40 bg-white/5 border border-white/10 hover:border-blue-400/50"
            data-testid="button-quick-settings"
          >
            {isOnline ? <Wifi className="w-4 h-4" /> : <WifiOff className="w-4 h-4 text-muted-foreground" />}
            <Volume2 className="w-4 h-4" />
            <div className="flex items-center gap-1">
               {isCharging ? (
                 <BatteryCharging className="w-4 h-4" />
               ) : batteryLevel !== null && batteryLevel < 20 ? (
                 <BatteryWarning className="w-4 h-4 text-red-500" />
               ) : (
                 <Battery className="w-4 h-4" />
               )}
               {batteryLevel !== null && <span className="text-[10px] font-medium hidden sm:block">{batteryLevel}%</span>}
            </div>
          </button>

          <button 
            onClick={(e) => { e.stopPropagation(); onTimeClick?.(); }}
            className="flex flex-col items-end px-2 hover:bg-white/10 rounded-lg transition-colors h-9 justify-center min-w-[80px] active:scale-95 active:bg-white/20"
            data-testid="button-time-date"
          >
            <span className="text-xs font-medium leading-none font-display text-foreground">{time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            <span className="text-[10px] text-muted-foreground leading-none mt-0.5 font-display">{time.toLocaleDateString()}</span>
          </button>
        </div>

      </div>

      {/* Notification */}
      {notification && (
        <div className="absolute bottom-16 right-6 bg-blue-600 text-white text-xs px-3 py-1.5 rounded-lg shadow-lg animate-in fade-in slide-in-from-bottom-2 pointer-events-none">
          {notification}
        </div>
      )}
    </div>
  );
}
