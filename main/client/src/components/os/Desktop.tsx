import { useState, useEffect, useMemo } from 'react';
import { Taskbar } from './Taskbar';
import { StartMenu } from './StartMenu';
import { Window } from './Window';
import { QuickSettings } from './QuickSettings';
import { Browser } from './Browser';
import { FileExplorer } from './FileExplorer';
import { TerminalApp } from './Terminal';
import { SettingsApp } from './Settings';
import { AuthSelector } from './AuthSelector';
import { StartupAnimation } from './StartupAnimation';
import { NotificationCenter } from './NotificationCenter';
import { AppLauncher } from './AppLauncher';
import { MailApp } from './Mail';
import { CalendarApp } from './Calendar';
import { CalculatorApp } from './Calculator';
import { ClockApp } from './Clock';
import { AppStore } from './AppStore';
import { NotesApp, WeatherApp, PaintApp, PhotosApp, MapsApp, ReaderApp, GamesHubApp, NewsApp } from './DownloadedApps';
import { PWAInstallPrompt } from './PWAInstall';
import { PowerMonitor } from './PowerMonitor';
import { useSystemSettings } from '@/lib/SystemSettingsContext';
import { useSoundEffects } from '@/lib/useSoundEffects';
import generatedWallpaper from '@assets/generated_images/abstract_futuristic_windows_13_wallpaper.png';
import { 
  Folder, 
  Chrome, 
  Settings, 
  Terminal, 
  Calculator,
  Calendar,
  Mail,
  Clock,
  Store,
  FileText,
  Cloud,
  Palette,
  Camera,
  Compass,
  BookOpen,
  Gamepad2,
  Music,
  Video,
  MessageSquare,
  Code,
  Timer,
  Dumbbell,
  ChefHat,
  Plane,
  Wallet,
  ShoppingCart,
  Newspaper,
  Activity,
  LucideIcon,
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

interface WindowState {
  id: string;
  title: string;
  icon: LucideIcon;
  isOpen: boolean;
  isMinimised: boolean;
  zIndex: number;
  color: string;
}

const iconMap: Record<string, LucideIcon> = {
  FileText, Cloud, Palette, Camera, Compass, BookOpen, Gamepad2,
  Folder, Chrome, Settings, Terminal, Calculator, Calendar, Mail, Clock, Store,
  Music, Video, MessageSquare, Code, Timer, Dumbbell, ChefHat, Plane, Wallet, ShoppingCart, Newspaper, Activity,
};

const restrictedAppsForGuest = ['explorer', 'settings', 'mail', 'terminal', 'photos'];

export function Desktop() {
  const { settings, setDarkMode, setUserName, setUserInitials, setProfilePicture, installedApps, isSaving } = useSystemSettings();
  const { playOpen, playClick, playStartup } = useSoundEffects();
  const [showStartup, setShowStartup] = useState(true);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isGuestMode, setIsGuestMode] = useState(false);
  const [startOpen, setStartOpen] = useState(false);
  const [quickSettingsOpen, setQuickSettingsOpen] = useState(false);
  const [notificationCenterOpen, setNotificationCenterOpen] = useState(false);
  const [appLauncherOpen, setAppLauncherOpen] = useState(false);
  const [powerState, setPowerState] = useState<'on' | 'sleep' | 'off' | 'restarting' | 'updating'>('on');
  const [updateProgress, setUpdateProgress] = useState(0);
  const [updateStage, setUpdateStage] = useState('');
  
  const [userProfile, setUserProfile] = useState({
    name: settings.userName,
    initials: settings.userInitials,
    profilePicture: settings.profilePicture
  });

  const isDark = settings.isDarkMode;
  const setIsDark = setDarkMode;

  useEffect(() => {
    setUserProfile({
      name: settings.userName,
      initials: settings.userInitials,
      profilePicture: settings.profilePicture
    });
  }, [settings.userName, settings.userInitials, settings.profilePicture]);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const getWallpaperStyle = () => {
    const { wallpaper } = settings;
    if (wallpaper.type === 'image' || wallpaper.type === 'custom') {
      return { backgroundImage: `url(${wallpaper.value})`, backgroundSize: 'cover', backgroundPosition: 'center' };
    }
    if (wallpaper.value.startsWith('linear-gradient') || wallpaper.value.startsWith('#')) {
      return { background: wallpaper.value };
    }
    return { backgroundImage: `url(${generatedWallpaper})` };
  };

  const startUpdate = () => {
    setPowerState('updating');
    setUpdateProgress(0);
    setUpdateStage('Preparing update...');
    
    const stages = [
      { progress: 5, stage: 'Downloading updates...' },
      { progress: 15, stage: 'Downloading updates... (1 of 3)' },
      { progress: 30, stage: 'Downloading updates... (2 of 3)' },
      { progress: 45, stage: 'Downloading updates... (3 of 3)' },
      { progress: 50, stage: 'Verifying downloads...' },
      { progress: 55, stage: 'Preparing to install...' },
      { progress: 60, stage: 'Installing updates... (1 of 3)' },
      { progress: 75, stage: 'Installing updates... (2 of 3)' },
      { progress: 85, stage: 'Installing updates... (3 of 3)' },
      { progress: 90, stage: 'Finalizing installation...' },
      { progress: 95, stage: 'Cleaning up...' },
      { progress: 100, stage: 'Update complete! Restarting...' },
    ];
    
    let index = 0;
    const interval = setInterval(() => {
      if (index < stages.length) {
        setUpdateProgress(stages[index].progress);
        setUpdateStage(stages[index].stage);
        index++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          setPowerState('restarting');
          setTimeout(() => {
            setShowStartup(true);
            setPowerState('on');
          }, 2000);
        }, 1500);
      }
    }, 800);
  };

  const baseWindows: WindowState[] = [
    { id: 'explorer', title: 'File Explorer', icon: Folder, isOpen: false, isMinimised: false, zIndex: 1, color: 'text-yellow-400' },
    { id: 'browser', title: 'Edge', icon: Chrome, isOpen: false, isMinimised: false, zIndex: 0, color: 'text-blue-400' },
    { id: 'settings', title: 'Settings', icon: Settings, isOpen: false, isMinimised: false, zIndex: 0, color: 'text-gray-400' },
    { id: 'terminal', title: 'Terminal', icon: Terminal, isOpen: false, isMinimised: false, zIndex: 2, color: 'text-slate-200' },
    { id: 'mail', title: 'Mail', icon: Mail, isOpen: false, isMinimised: false, zIndex: 0, color: 'text-blue-500' },
    { id: 'clock', title: 'Clock', icon: Clock, isOpen: false, isMinimised: false, zIndex: 0, color: 'text-blue-400' },
    { id: 'calculator', title: 'Calculator', icon: Calculator, isOpen: false, isMinimised: false, zIndex: 0, color: 'text-cyan-600' },
    { id: 'calendar', title: 'Calendar', icon: Calendar, isOpen: false, isMinimised: false, zIndex: 0, color: 'text-purple-400' },
    { id: 'store', title: 'Microsoft Store', icon: Store, isOpen: false, isMinimised: false, zIndex: 0, color: 'text-cyan-500' },
    { id: 'powermonitor', title: 'Power Monitor', icon: Activity, isOpen: false, isMinimised: false, zIndex: 0, color: 'text-green-400' },
  ];

  const [windows, setWindows] = useState<WindowState[]>(baseWindows);

  useEffect(() => {
    setWindows(prev => {
      const existingIds = new Set(prev.map(w => w.id));
      const newInstalledWindows = installedApps
        .filter(app => !existingIds.has(app.id))
        .map(app => ({
          id: app.id,
          title: app.name,
          icon: iconMap[app.icon] || Settings,
          isOpen: false,
          isMinimised: false,
          zIndex: 0,
          color: app.color,
        }));
      
      const installedIds = new Set(installedApps.map(a => a.id));
      const baseIds = new Set(baseWindows.map(w => w.id));
      const filtered = prev.filter(w => baseIds.has(w.id) || installedIds.has(w.id));
      
      return [...filtered, ...newInstalledWindows];
    });
  }, [installedApps]);

  const [activeWindowId, setActiveWindowId] = useState('');
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; appId: string } | null>(null);

  const pinnedApps = windows.filter(w => ['explorer', 'browser', 'settings', 'terminal', 'store'].includes(w.id));

  const bringToFront = (id: string) => {
    setActiveWindowId(id);
    setWindows(prev => {
      const maxZ = Math.max(...prev.map(w => w.zIndex));
      return prev.map(w => w.id === id ? { ...w, zIndex: maxZ + 1, isMinimised: false } : w);
    });
  };

  const toggleMinimize = (id: string) => {
    setWindows(prev => prev.map(w => {
      if (w.id === id) {
        if (w.isMinimised) {
          setTimeout(() => bringToFront(id), 0); 
          return { ...w, isMinimised: false };
        }
        return { ...w, isMinimised: true };
      }
      return w;
    }));
  };

  const closeWindow = (id: string) => {
    setWindows(prev => prev.map(w => w.id === id ? { ...w, isOpen: false } : w));
  };

  const openWindow = (id: string) => {
    if (isGuestMode && restrictedAppsForGuest.includes(id)) {
      return;
    }
    playOpen();
    setWindows(prev => {
      const exists = prev.find(w => w.id === id);
      if (exists) {
        return prev.map(w => w.id === id ? { ...w, isOpen: true, isMinimised: false } : w);
      }
      return prev;
    });
    bringToFront(id);
  };

  const launchApp = (appId: string) => {
    if (isGuestMode && restrictedAppsForGuest.includes(appId)) {
      return;
    }
    const existingWin = windows.find(w => w.id === appId);
    if (existingWin) {
      openWindow(appId);
    } else {
      const installedApp = installedApps.find(a => a.id === appId);
      if (installedApp) {
        playOpen();
        const newWin: WindowState = {
          id: appId,
          title: installedApp.name,
          icon: iconMap[installedApp.icon] || Settings,
          isOpen: true,
          isMinimised: false,
          zIndex: Math.max(...windows.map(w => w.zIndex)) + 1,
          color: installedApp.color,
        };
        setWindows(prev => [...prev, newWin]);
        setActiveWindowId(appId);
      }
    }
  };

  const handleTaskbarClick = (id: string) => {
    const win = windows.find(w => w.id === id);
    if (win?.isOpen) {
      if (activeWindowId === id && !win.isMinimised) {
        toggleMinimize(id);
      } else {
        bringToFront(id);
      }
    } else {
      openWindow(id);
    }
  };

  const handlePowerAction = (action: 'sleep' | 'shutdown' | 'restart' | 'update') => {
    if (action === 'update') {
      startUpdate();
    } else if (action === 'restart') {
      setPowerState('restarting');
      setTimeout(() => setPowerState('on'), 3000);
    } else {
      setPowerState(action === 'sleep' ? 'sleep' : 'off');
    }
  };

  const renderWindowContent = (id: string) => {
    if (isGuestMode && restrictedAppsForGuest.includes(id)) {
      return (
        <div className="h-full w-full flex flex-col items-center justify-center text-muted-foreground bg-background p-6">
          <div className="text-6xl mb-4">🔒</div>
          <h2 className="text-xl font-bold mb-2">Access Restricted</h2>
          <p className="text-sm text-center max-w-md">This app is not available in Guest Mode to protect account security</p>
        </div>
      );
    }

    switch (id) {
      case 'explorer':
        return <FileExplorer />;
      case 'browser':
        return <Browser />;
      case 'terminal':
        return <TerminalApp />;
      case 'settings':
        return <SettingsApp onUpdate={startUpdate} />;
      case 'mail':
        return <MailApp />;
      case 'calendar':
        return <CalendarApp />;
      case 'calculator':
        return <CalculatorApp />;
      case 'clock':
        return <ClockApp />;
      case 'store':
        return <AppStore />;
      case 'notes':
        return <NotesApp />;
      case 'weather':
        return <WeatherApp />;
      case 'paint':
        return <PaintApp />;
      case 'photos':
        return <PhotosApp />;
      case 'maps':
        return <MapsApp />;
      case 'reader':
        return <ReaderApp />;
      case 'games':
        return <GamesHubApp />;
      case 'news':
        return <NewsApp />;
      case 'powermonitor':
        return <PowerMonitor />;
      default:
        const app = installedApps.find(a => a.id === id);
        return (
          <div className="h-full w-full flex flex-col items-center justify-center text-muted-foreground bg-background p-6">
            <div className="text-6xl mb-4">📱</div>
            <h2 className="text-xl font-bold mb-2">{app?.name || id}</h2>
            <p className="text-sm text-center max-w-md">{app?.description || 'This app is ready to use!'}</p>
          </div>
        );
    }
  };

  if (showStartup) {
    return <StartupAnimation onComplete={() => { setShowStartup(false); }} />;
  }

  if (!isUnlocked) {
    return <AuthSelector onUnlock={(isGuest) => {
      setIsUnlocked(true);
      setIsGuestMode(isGuest === true);
    }} />;
  }

  if (powerState === 'off') {
    return (
      <div 
        className="h-screen w-screen bg-black flex items-center justify-center cursor-pointer"
        onClick={() => {
          setShowStartup(true);
          setPowerState('on');
        }}
      >
        <div className="text-white/30 text-sm">Click to power on</div>
      </div>
    );
  }

  if (powerState === 'sleep') {
    return (
      <div 
        className="h-screen w-screen bg-black flex items-center justify-center cursor-pointer"
        onClick={() => setPowerState('on')}
      >
        <div className="text-white/50 text-sm animate-pulse">Click to wake up</div>
      </div>
    );
  }

  if (powerState === 'restarting') {
    return (
      <div className="h-screen w-screen bg-black flex flex-col items-center justify-center gap-8">
         <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
         <div className="text-white font-display text-xl">Restarting...</div>
      </div>
    );
  }

  if (powerState === 'updating') {
    return (
      <div className="h-screen w-screen bg-[#0078d4] flex flex-col items-center justify-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center"
        >
          <div className="relative w-32 h-32 mb-8">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0"
            >
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="8" />
                <motion.circle
                  cx="50" cy="50" r="40" fill="none" stroke="white" strokeWidth="8" strokeLinecap="round"
                  strokeDasharray="251.2" strokeDashoffset={251.2 - (251.2 * updateProgress) / 100}
                  style={{ transition: 'stroke-dashoffset 0.5s ease' }}
                />
              </svg>
            </motion.div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-white text-2xl font-bold">{updateProgress}%</span>
            </div>
          </div>
          <motion.h1 initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="text-white text-2xl font-light mb-4">
            Working on updates
          </motion.h1>
          <motion.p initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }} className="text-white/80 text-sm mb-2">
            {updateStage}
          </motion.p>
          <motion.p initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }} className="text-white/60 text-xs">
            Don't turn off your computer
          </motion.p>
          <motion.div className="mt-8 flex gap-1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
            {[0, 1, 2].map((i) => (
              <motion.div key={i} className="w-2 h-2 bg-white rounded-full" animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }} />
            ))}
          </motion.div>
        </motion.div>
      </div>
    );
  }

  return (
    <div 
      className="h-screen w-screen overflow-hidden bg-cover bg-center select-none text-foreground"
      style={getWallpaperStyle()}
      onClick={() => {
        setStartOpen(false);
        setQuickSettingsOpen(false);
        setNotificationCenterOpen(false);
        setAppLauncherOpen(false);
      }}
    >
      {isSaving && (
        <div className="fixed top-4 right-4 z-[99999] bg-blue-600 text-white text-xs px-3 py-1.5 rounded-full flex items-center gap-2 shadow-lg">
          <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
          Saving...
        </div>
      )}

      {isGuestMode && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[99999] bg-orange-500 text-white text-xs px-4 py-2 rounded-full flex items-center gap-2 shadow-lg font-semibold">
          Guest Mode - Limited Access
        </div>
      )}

      <div 
        className="p-4 grid grid-flow-col grid-rows-[repeat(auto-fill,100px)] gap-4 w-fit h-full content-start"
        onClick={() => setContextMenu(null)}
      >
        {windows.map(win => (
          <button 
            key={win.id}
            onDoubleClick={() => openWindow(win.id)}
            onContextMenu={(e) => {
              e.preventDefault();
              setContextMenu({ x: e.clientX, y: e.clientY, appId: win.id });
            }}
            className="w-24 h-24 flex flex-col items-center justify-center gap-2 hover:bg-white/10 rounded-lg transition-colors group text-shadow-sm"
          >
            <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
              <win.icon className={`w-7 h-7 ${win.color}`} />
            </div>
            <span className="text-xs font-medium text-white drop-shadow-md">{win.title}</span>
          </button>
        ))}
      </div>

      {contextMenu && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.15 }}
          className="fixed z-[999999] bg-white/90 dark:bg-[#1a1a1a]/90 backdrop-blur-md border border-white/20 rounded-lg shadow-xl py-1 min-w-[160px]"
          style={{ top: contextMenu.y, left: contextMenu.x }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={() => { openWindow(contextMenu.appId); setContextMenu(null); }}
            className="w-full px-4 py-2 text-left text-sm hover:bg-blue-500/20 transition-colors text-foreground"
          >
            Open
          </button>
          <button
            onClick={() => { closeWindow(contextMenu.appId); setContextMenu(null); }}
            className="w-full px-4 py-2 text-left text-sm hover:bg-red-500/20 transition-colors text-foreground"
          >
            Close
          </button>
        </motion.div>
      )}

      {windows.map(win => (
        <Window
          key={win.id}
          id={win.id}
          title={win.title}
          isOpen={win.isOpen}
          isMinimised={win.isMinimised}
          zIndex={win.zIndex}
          onClose={() => closeWindow(win.id)}
          onMinimize={() => toggleMinimize(win.id)}
          onFocus={() => bringToFront(win.id)}
        >
          {renderWindowContent(win.id)}
        </Window>
      ))}

      <StartMenu 
        isOpen={startOpen} 
        toggle={() => setStartOpen(!startOpen)} 
        onAppClick={launchApp}
        onPowerAction={handlePowerAction}
        onLock={() => setIsUnlocked(false)}
        userProfile={userProfile}
        onUpdateProfile={(name, initials, profilePicture) => {
          setUserProfile({ name, initials, profilePicture });
          setUserName(name);
          setUserInitials(initials);
          setProfilePicture(profilePicture);
        }}
      />
      
      <QuickSettings 
        isOpen={quickSettingsOpen}
        onClose={() => setQuickSettingsOpen(false)}
        isDark={isDark}
        toggleTheme={() => setIsDark(!isDark)}
        onOpenSettings={() => openWindow('settings')}
      />

      <NotificationCenter
        isOpen={notificationCenterOpen}
        onClose={() => setNotificationCenterOpen(false)}
      />

      <AppLauncher
        isOpen={appLauncherOpen}
        onClose={() => setAppLauncherOpen(false)}
        onAppClick={launchApp}
      />

      <Taskbar 
        toggleStart={(e: any) => { e.stopPropagation(); playClick(); setStartOpen(!startOpen); }} 
        isStartOpen={startOpen}
        openWindows={windows}
        activeWindowId={activeWindowId}
        pinnedApps={pinnedApps}
        onWindowClick={handleTaskbarClick}
        onQuickSettingsClick={() => setQuickSettingsOpen(!quickSettingsOpen)}
        onTimeClick={() => { setNotificationCenterOpen(!notificationCenterOpen); setQuickSettingsOpen(false); }}
        onChevronClick={() => { setAppLauncherOpen(!appLauncherOpen); setQuickSettingsOpen(false); }}
      />

      <PWAInstallPrompt />
    </div>
  );
}
