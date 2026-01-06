import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Folder, Chrome, Settings, Terminal, Calculator, Calendar, Mail, Clock, ChevronRight } from 'lucide-react';

interface App {
  id: string;
  name: string;
  icon: any;
  color: string;
}

interface AppLauncherProps {
  isOpen: boolean;
  onClose: () => void;
  onAppClick: (appId: string) => void;
}

const allApps: App[] = [
  { id: 'explorer', name: 'File Explorer', icon: Folder, color: 'text-yellow-400' },
  { id: 'browser', name: 'Edge', icon: Chrome, color: 'text-blue-400' },
  { id: 'settings', name: 'Settings', icon: Settings, color: 'text-gray-400' },
  { id: 'terminal', name: 'Terminal', icon: Terminal, color: 'text-slate-200' },
  { id: 'mail', name: 'Mail', icon: Mail, color: 'text-blue-500' },
  { id: 'clock', name: 'Clock', icon: Clock, color: 'text-blue-400' },
  { id: 'calculator', name: 'Calculator', icon: Calculator, color: 'text-cyan-600' },
  { id: 'calendar', name: 'Calendar', icon: Calendar, color: 'text-purple-400' },
];

const pinnedApps = allApps.slice(0, 4);
const moreApps = allApps.slice(4);

export function AppLauncher({ isOpen, onClose, onAppClick }: AppLauncherProps) {
  const [viewMode, setViewMode] = useState<'pinned' | 'all' | 'more'>('pinned');

  const handleAppClick = (appId: string) => {
    onAppClick(appId);
    onClose();
  };

  const getDisplayApps = () => {
    switch (viewMode) {
      case 'all':
        return allApps;
      case 'more':
        return moreApps;
      default:
        return pinnedApps;
    }
  };

  const displayApps = getDisplayApps();

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
            className="fixed bottom-20 right-4 w-80 max-h-[75vh] p-6 rounded-2xl bg-white/85 dark:bg-[#1a1a1a]/95 backdrop-blur-3xl border border-white/40 dark:border-white/20 shadow-2xl z-[10001] text-foreground overflow-y-auto"
            data-testid="app-launcher"
          >
            <div className="space-y-4">
              {viewMode === 'pinned' && (
                <>
                  <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Pinned</h3>
                  
                  <div className="grid grid-cols-4 gap-3">
                    {displayApps.map(app => (
                      <motion.button
                        key={app.id}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleAppClick(app.id)}
                        className="flex flex-col items-center justify-center gap-2 p-3 rounded-xl hover:bg-white/20 dark:hover:bg-white/10 transition-all active:scale-95"
                        data-testid={`app-launcher-${app.id}`}
                      >
                        <div className={`p-3 bg-white/10 rounded-lg ${app.color}`}>
                          <app.icon className="w-5 h-5" />
                        </div>
                        <span className="text-xs font-medium text-center leading-tight">{app.name}</span>
                      </motion.button>
                    ))}
                  </div>

                  <button
                    onClick={() => setViewMode('all')}
                    className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-white/20 dark:hover:bg-white/10 transition-colors text-sm font-medium text-muted-foreground hover:text-foreground"
                    data-testid="button-all-apps"
                  >
                    <span>All apps</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => setViewMode('more')}
                    className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-white/20 dark:hover:bg-white/10 transition-colors text-sm font-medium text-muted-foreground hover:text-foreground"
                    data-testid="button-more"
                  >
                    <span>More</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </>
              )}

              {viewMode === 'all' && (
                <>
                  <button
                    onClick={() => setViewMode('pinned')}
                    className="flex items-center justify-between w-full text-sm font-medium text-muted-foreground hover:text-foreground p-2 mb-2"
                    data-testid="button-back-from-all"
                  >
                    <span>← All apps</span>
                  </button>
                  <div className="grid grid-cols-4 gap-3">
                    {displayApps.map(app => (
                      <motion.button
                        key={app.id}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleAppClick(app.id)}
                        className="flex flex-col items-center justify-center gap-2 p-3 rounded-xl hover:bg-white/20 dark:hover:bg-white/10 transition-all active:scale-95"
                        data-testid={`app-launcher-${app.id}`}
                      >
                        <div className={`p-3 bg-white/10 rounded-lg ${app.color}`}>
                          <app.icon className="w-5 h-5" />
                        </div>
                        <span className="text-xs font-medium text-center leading-tight">{app.name}</span>
                      </motion.button>
                    ))}
                  </div>
                </>
              )}

              {viewMode === 'more' && (
                <>
                  <button
                    onClick={() => setViewMode('pinned')}
                    className="flex items-center justify-between w-full text-sm font-medium text-muted-foreground hover:text-foreground p-2 mb-2"
                    data-testid="button-back-from-more"
                  >
                    <span>← More</span>
                  </button>
                  <div className="grid grid-cols-4 gap-3">
                    {displayApps.map(app => (
                      <motion.button
                        key={app.id}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleAppClick(app.id)}
                        className="flex flex-col items-center justify-center gap-2 p-3 rounded-xl hover:bg-white/20 dark:hover:bg-white/10 transition-all active:scale-95"
                        data-testid={`app-launcher-${app.id}`}
                      >
                        <div className={`p-3 bg-white/10 rounded-lg ${app.color}`}>
                          <app.icon className="w-5 h-5" />
                        </div>
                        <span className="text-xs font-medium text-center leading-tight">{app.name}</span>
                      </motion.button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
