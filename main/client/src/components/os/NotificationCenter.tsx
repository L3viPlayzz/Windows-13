import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Bell, Wifi, Volume2, Settings } from 'lucide-react';

interface Notification {
  id: string;
  title: string;
  message: string;
  icon: any;
  color: string;
  timestamp: Date;
}

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NotificationCenter({ isOpen, onClose }: NotificationCenterProps) {
  const [time, setTime] = useState(new Date());
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      title: 'Welcome to Windows 13',
      message: 'Your system is ready to go',
      icon: Bell,
      color: 'text-blue-400',
      timestamp: new Date(Date.now() - 5 * 60000)
    },
    {
      id: '2',
      title: 'WiFi Connected',
      message: 'Connected to secure network',
      icon: Wifi,
      color: 'text-green-400',
      timestamp: new Date(Date.now() - 10 * 60000)
    },
    {
      id: '3',
      title: 'Volume Adjusted',
      message: 'Volume set to 45%',
      icon: Volume2,
      color: 'text-yellow-400',
      timestamp: new Date(Date.now() - 15 * 60000)
    }
  ]);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

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
            className="fixed bottom-20 right-4 w-96 max-h-[75vh] p-6 rounded-2xl bg-white/85 dark:bg-[#1a1a1a]/95 backdrop-blur-3xl border border-white/40 dark:border-white/20 shadow-2xl z-[10001] text-foreground overflow-y-auto flex flex-col"
            data-testid="notification-center"
          >
            {/* Header with Time/Date */}
            <div className="mb-6 pb-6 border-b border-white/10">
              <h2 className="text-2xl font-bold text-foreground mb-2 font-display">
                {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </h2>
              <p className="text-sm text-muted-foreground">
                {time.toLocaleDateString([], { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>

            {/* Notifications Section */}
            <div>
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">Notifications</h3>
              
              {notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                  <Bell className="w-8 h-8 mb-2 opacity-50" />
                  <p className="text-sm">No notifications</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {notifications.map(notif => (
                    <motion.div
                      key={notif.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="p-3 bg-white/10 hover:bg-white/20 dark:bg-white/5 dark:hover:bg-white/10 rounded-lg border border-white/10 dark:border-white/10 transition-all group flex items-start justify-between gap-3"
                    >
                      <div className="flex items-start gap-3 flex-1">
                        <div className={`p-2 bg-white/10 rounded-lg mt-0.5 flex-shrink-0 ${notif.color}`}>
                          <notif.icon className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm text-foreground">{notif.title}</p>
                          <p className="text-xs text-muted-foreground mt-1">{notif.message}</p>
                          <p className="text-[10px] text-muted-foreground/70 mt-2">{formatTime(notif.timestamp)}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => removeNotification(notif.id)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-white/20 rounded flex-shrink-0"
                        data-testid={`button-close-notification-${notif.id}`}
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
