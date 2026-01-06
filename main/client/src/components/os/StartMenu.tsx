import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Power, 
  Settings, 
  Folder, 
  Chrome, 
  Terminal,
  Calculator,
  Calendar,
  Mail,
  Clock,
  Moon,
  Lock,
  RefreshCcw,
  Download,
  Activity,
  Store,
  Trash2,
  FileText,
  Cloud,
  Palette,
  Music,
  Video,
  Camera,
  MessageSquare,
  Code,
  Compass,
  Timer,
  BookOpen,
  Dumbbell,
  ChefHat,
  Plane,
  Wallet,
  ShoppingCart,
  Newspaper,
  Gamepad2,
  ChevronLeft,
  LucideIcon,
} from 'lucide-react';
import { ProfileEditor } from './ProfileEditor';
import { useSystemSettings, InstalledApp } from '@/lib/SystemSettingsContext';

const iconComponents: Record<string, LucideIcon> = {
  FileText, Cloud, Palette, Music, Video, Camera, MessageSquare, Code, 
  Compass, Timer, BookOpen, Dumbbell, ChefHat, Plane, Wallet, ShoppingCart,
  Newspaper, Gamepad2, Settings, Folder, Chrome, Terminal, Calculator, Calendar,
  Mail, Clock, Store, Activity,
};

interface StartMenuProps {
  isOpen: boolean;
  toggle: () => void;
  onAppClick: (appId: string) => void;
  onPowerAction: (action: 'sleep' | 'shutdown' | 'restart' | 'update') => void;
  onLock: () => void;
  userProfile: { name: string; initials: string; profilePicture: string | null };
  onUpdateProfile: (name: string, initials: string, profilePicture: string | null) => void;
}

export function StartMenu({ isOpen, toggle, onAppClick, onPowerAction, onLock, userProfile, onUpdateProfile }: StartMenuProps) {
  const [search, setSearch] = useState('');
  const [showPowerMenu, setShowPowerMenu] = useState(false);
  const [showProfileEditor, setShowProfileEditor] = useState(false);
  const [showAllApps, setShowAllApps] = useState(false);
  const [showInstalledApps, setShowInstalledApps] = useState(false);
  const { installedApps, uninstallApp } = useSystemSettings();

  const pinnedApps = [
    { id: 'browser', name: 'Edge', icon: Chrome, color: 'text-blue-500' },
    { id: 'explorer', name: 'Files', icon: Folder, color: 'text-yellow-500' },
    { id: 'settings', name: 'Settings', icon: Settings, color: 'text-gray-500' },
    { id: 'terminal', name: 'Terminal', icon: Terminal, color: 'text-slate-200' },
    { id: 'mail', name: 'Mail', icon: Mail, color: 'text-blue-400' },
    { id: 'store', name: 'Store', icon: Store, color: 'text-cyan-500' },
  ];

  const allSystemApps = [
    { id: 'browser', name: 'Edge', icon: Chrome, color: 'text-blue-500' },
    { id: 'explorer', name: 'Files', icon: Folder, color: 'text-yellow-500' },
    { id: 'settings', name: 'Settings', icon: Settings, color: 'text-gray-500' },
    { id: 'terminal', name: 'Terminal', icon: Terminal, color: 'text-slate-200' },
    { id: 'mail', name: 'Mail', icon: Mail, color: 'text-blue-400' },
    { id: 'clock', name: 'Clock', icon: Clock, color: 'text-blue-400' },
    { id: 'calculator', name: 'Calculator', icon: Calculator, color: 'text-cyan-600' },
    { id: 'calendar', name: 'Calendar', icon: Calendar, color: 'text-purple-500' },
    { id: 'store', name: 'Microsoft Store', icon: Store, color: 'text-cyan-500' },
    { id: 'powermonitor', name: 'Power Monitor', icon: Activity, color: 'text-green-400' },
  ];

  const filteredApps = search 
    ? [...allSystemApps, ...installedApps.map(app => ({
        id: app.id,
        name: app.name,
        icon: iconComponents[app.icon] || Settings,
        color: app.color,
      }))].filter(app => app.name.toLowerCase().includes(search.toLowerCase()))
    : [];

  const handleUninstall = (appId: string) => {
    uninstallApp(appId);
  };

  const renderInstalledAppsView = () => (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-3 mb-4">
        <button 
          onClick={() => setShowInstalledApps(false)}
          className="p-2 hover:bg-white/10 rounded-lg transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <h2 className="text-lg font-semibold">Installed Apps</h2>
      </div>
      
      {installedApps.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground">
          <Store className="w-12 h-12 mb-4 opacity-50" />
          <p className="text-sm">No apps installed yet</p>
          <p className="text-xs mt-1">Visit the Microsoft Store to download apps</p>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto space-y-2 pr-2">
          {installedApps.map((app) => {
            const IconComponent = iconComponents[app.icon] || Settings;
            return (
              <div 
                key={app.id}
                className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors group"
              >
                <button
                  onClick={() => {
                    onAppClick(app.id);
                    toggle();
                  }}
                  className="flex items-center gap-3 flex-1"
                >
                  <div className={`w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center ${app.color}`}>
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-medium">{app.name}</div>
                    <div className="text-xs text-muted-foreground">{app.size}</div>
                  </div>
                </button>
                <button
                  onClick={() => handleUninstall(app.id)}
                  className="p-2 hover:bg-red-500/20 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                  title="Uninstall"
                >
                  <Trash2 className="w-4 h-4 text-red-400" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );

  const renderAllAppsView = () => (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-3 mb-4">
        <button 
          onClick={() => setShowAllApps(false)}
          className="p-2 hover:bg-white/10 rounded-lg transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <h2 className="text-lg font-semibold">All Apps</h2>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        <div className="mb-4">
          <h3 className="text-xs font-semibold text-muted-foreground mb-2 px-2">System Apps</h3>
          <div className="grid grid-cols-5 gap-2">
            {allSystemApps.map((app) => (
              <button 
                key={app.id} 
                onClick={() => {
                  onAppClick(app.id);
                  toggle();
                }}
                className="group flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-white/10 transition-colors"
              >
                <div className="w-10 h-10 bg-white/5 dark:bg-white/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
                  <app.icon className={`w-5 h-5 ${app.color}`} />
                </div>
                <span className="text-[10px] font-medium text-muted-foreground group-hover:text-foreground text-center leading-tight">{app.name}</span>
              </button>
            ))}
          </div>
        </div>

        {installedApps.length > 0 && (
          <div>
            <h3 className="text-xs font-semibold text-muted-foreground mb-2 px-2">Downloaded Apps</h3>
            <div className="grid grid-cols-5 gap-2">
              {installedApps.map((app) => {
                const IconComponent = iconComponents[app.icon] || Settings;
                return (
                  <button 
                    key={app.id} 
                    onClick={() => {
                      onAppClick(app.id);
                      toggle();
                    }}
                    className="group flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-white/10 transition-colors"
                  >
                    <div className={`w-10 h-10 bg-white/5 dark:bg-white/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm ${app.color}`}>
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-medium text-muted-foreground group-hover:text-foreground text-center leading-tight">{app.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderMainView = () => (
    <>
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input 
          type="text" 
          placeholder="Search for apps, settings, and documents"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-black/5 dark:bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 placeholder:text-muted-foreground/50 text-foreground"
        />
      </div>

      {search ? (
        <div className="flex-1 overflow-y-auto">
          <h3 className="text-xs font-semibold text-muted-foreground mb-2 px-2">Search Results</h3>
          {filteredApps.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">No apps found</p>
          ) : (
            <div className="grid grid-cols-6 gap-4">
              {filteredApps.map((app) => (
                <button 
                  key={app.id} 
                  onClick={() => {
                    onAppClick(app.id);
                    toggle();
                  }}
                  className="group flex flex-col items-center gap-2 p-2 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <div className="w-10 h-10 bg-white/5 dark:bg-white/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
                    <app.icon className={`w-5 h-5 ${app.color}`} />
                  </div>
                  <span className="text-[11px] font-medium text-muted-foreground group-hover:text-foreground">{app.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      ) : (
        <>
          <div className="mb-4">
            <div className="flex items-center justify-between mb-4 px-2">
              <h3 className="text-xs font-semibold text-muted-foreground">Pinned</h3>
              <button 
                onClick={() => setShowAllApps(true)}
                className="text-xs bg-white/5 hover:bg-white/10 px-2 py-1 rounded transition-colors"
              >
                All apps &gt;
              </button>
            </div>
            <div className="grid grid-cols-6 gap-4">
              {pinnedApps.map((app) => (
                <button 
                  key={app.name} 
                  onClick={() => {
                    onAppClick(app.id);
                    toggle();
                  }}
                  className="group flex flex-col items-center gap-2 p-2 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <div className="w-10 h-10 bg-white/5 dark:bg-white/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
                    <app.icon className={`w-5 h-5 ${app.color}`} />
                  </div>
                  <span className="text-[11px] font-medium text-muted-foreground group-hover:text-foreground">{app.name}</span>
                </button>
              ))}
            </div>
          </div>

          {installedApps.length > 0 && (
            <div className="mb-4">
              <div className="flex items-center justify-between mb-4 px-2">
                <h3 className="text-xs font-semibold text-muted-foreground">Installed Apps ({installedApps.length})</h3>
                <button 
                  onClick={() => setShowInstalledApps(true)}
                  className="text-xs bg-white/5 hover:bg-white/10 px-2 py-1 rounded transition-colors"
                >
                  Manage &gt;
                </button>
              </div>
              <div className="grid grid-cols-6 gap-4">
                {installedApps.slice(0, 6).map((app) => {
                  const IconComponent = iconComponents[app.icon] || Settings;
                  return (
                    <button 
                      key={app.id} 
                      onClick={() => {
                        onAppClick(app.id);
                        toggle();
                      }}
                      className="group flex flex-col items-center gap-2 p-2 rounded-lg hover:bg-white/10 transition-colors"
                    >
                      <div className={`w-10 h-10 bg-white/5 dark:bg-white/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm ${app.color}`}>
                        <IconComponent className="w-5 h-5" />
                      </div>
                      <span className="text-[11px] font-medium text-muted-foreground group-hover:text-foreground">{app.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <div className="flex-1">
            <div className="flex items-center justify-between mb-4 px-2">
              <h3 className="text-xs font-semibold text-muted-foreground">Recommended</h3>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {[
                { name: 'Project Proposal.docx', time: '2h ago', icon: Folder, color: 'text-blue-500' },
                { name: 'Q4 Financials.xlsx', time: '5h ago', icon: Folder, color: 'text-green-500' },
                { name: 'Design Assets', time: 'Yesterday', icon: Folder, color: 'text-purple-500' },
                { name: 'Meeting Notes.txt', time: 'Yesterday', icon: Folder, color: 'text-slate-500' },
              ].map((item, i) => (
                <button key={i} className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/10 transition-colors text-left group">
                  <div className={`w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center ${item.color}`}>
                    <item.icon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-medium font-display group-hover:text-primary transition-colors">{item.name}</div>
                    <div className="text-[10px] text-muted-foreground">Opened {item.time}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      <div className="mt-auto pt-4 border-t border-white/10 flex items-center justify-between px-2 relative">
        <button 
          onClick={() => setShowProfileEditor(true)}
          className="flex items-center gap-3 hover:bg-white/10 p-2 rounded-lg transition-colors"
        >
          {userProfile.profilePicture ? (
            <img 
              src={userProfile.profilePicture} 
              alt="Profile" 
              className="w-8 h-8 rounded-full object-cover shadow-inner"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white text-xs font-bold shadow-inner font-display">
              {userProfile.initials}
            </div>
          )}
          <div className="text-left">
            <div className="text-xs font-medium font-display text-foreground">{userProfile.name}</div>
          </div>
        </button>

        <div className="relative">
          <button 
            onClick={() => setShowPowerMenu(!showPowerMenu)}
            className={`p-2 rounded-lg transition-colors ${showPowerMenu ? 'bg-white/10 text-red-500' : 'hover:bg-white/10 text-foreground'}`}
          >
            <Power className="w-4 h-4" />
          </button>

          <AnimatePresence>
            {showPowerMenu && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute bottom-full right-0 mb-2 w-48 p-1 rounded-xl bg-white/90 dark:bg-[#1f1f1f]/95 backdrop-blur-xl border border-white/10 shadow-xl overflow-hidden z-50"
              >
                <button 
                  onClick={() => {
                    onLock();
                    setShowPowerMenu(false);
                  }}
                  className="w-full text-left px-3 py-2 text-sm hover:bg-black/5 dark:hover:bg-white/10 rounded-lg flex items-center gap-2 text-foreground"
                >
                  <Lock className="w-4 h-4" /> Lock
                </button>
                <button 
                  onClick={() => onPowerAction('sleep')}
                  className="w-full text-left px-3 py-2 text-sm hover:bg-black/5 dark:hover:bg-white/10 rounded-lg flex items-center gap-2 text-foreground"
                >
                  <Moon className="w-4 h-4" /> Sleep
                </button>
                <button 
                  onClick={() => onPowerAction('shutdown')}
                  className="w-full text-left px-3 py-2 text-sm hover:bg-black/5 dark:hover:bg-white/10 rounded-lg flex items-center gap-2 text-foreground"
                >
                  <Power className="w-4 h-4" /> Shut down
                </button>
                <button 
                  onClick={() => onPowerAction('restart')}
                  className="w-full text-left px-3 py-2 text-sm hover:bg-black/5 dark:hover:bg-white/10 rounded-lg flex items-center gap-2 text-foreground"
                >
                  <RefreshCcw className="w-4 h-4" /> Restart
                </button>
                <div className="my-1 border-t border-white/10" />
                <button 
                  onClick={() => onPowerAction('update')}
                  className="w-full text-left px-3 py-2 text-sm hover:bg-blue-500/20 rounded-lg flex items-center gap-2 text-blue-500"
                >
                  <Download className="w-4 h-4" /> Update and restart
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  );

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ y: 100, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 20, opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-20 left-1/2 -translate-x-1/2 w-[640px] h-[700px] rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/10 z-50 font-sans"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute inset-0 bg-white/80 dark:bg-[#1a1a1a]/85 backdrop-blur-3xl -z-10" />

            <div className="p-6 flex flex-col h-full">
              {showInstalledApps ? renderInstalledAppsView() : 
               showAllApps ? renderAllAppsView() : 
               renderMainView()}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <ProfileEditor 
        isOpen={showProfileEditor} 
        onClose={() => setShowProfileEditor(false)}
        currentName={userProfile.name}
        currentInitials={userProfile.initials}
        currentProfilePicture={userProfile.profilePicture}
        onSave={onUpdateProfile}
      />
    </>
  );
}
