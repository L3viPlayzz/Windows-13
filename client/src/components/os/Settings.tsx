import { useState, useEffect, useRef } from 'react';
import { useSystemSettings } from '@/lib/SystemSettingsContext';
import { 
  User, 
  Monitor, 
  Palette, 
  AppWindow, 
  Gamepad2, 
  Accessibility, 
  Search, 
  Wifi, 
  Bluetooth, 
  Globe, 
  Volume2, 
  Battery, 
  HardDrive,
  Shield,
  RefreshCcw,
  Info,
  WifiOff,
  BatteryCharging,
  BatteryWarning,
  Moon,
  ScanFace,
  Lock,
  Download,
  CheckCircle2,
  Loader2,
  AlertCircle,
  Upload,
  Trash2,
  Image as ImageIcon,
  Check,
  ChevronLeft,
  Sun,
  Zap,
  Bell,
  BellOff,
  Eye,
  EyeOff,
  MousePointer,
  Keyboard,
  Printer,
  Headphones,
  Speaker,
  Mic,
  MicOff,
  Plane,
  Signal,
  Clock,
  Languages,
  MapPin,
  Key,
  UserCog,
  Mail,
  Cloud,
  Smartphone,
  Laptop,
  Tv,
  Camera,
  Joystick,
  Sparkles,
  Type,
  Contrast,
  VolumeX,
  Play,
  Pause,
  SkipForward,
  Power,
  Cpu,
  MemoryStick,
  Thermometer,
  Gauge,
  Folder,
  FileText,
  Trash,
  Archive,
  X,
  LucideIcon
} from 'lucide-react';

const categories = [
  { id: 'system', name: 'System', icon: Monitor, sub: 'Display, sound, notifications, power' },
  { id: 'bluetooth', name: 'Bluetooth & devices', icon: Bluetooth, sub: 'Bluetooth, printers, mouse' },
  { id: 'network', name: 'Network & internet', icon: Globe, sub: 'Wi-Fi, airplane mode, VPN' },
  { id: 'personalization', name: 'Personalization', icon: Palette, sub: 'Background, lock screen, colors' },
  { id: 'apps', name: 'Apps', icon: AppWindow, sub: 'Installed apps, default apps, startup' },
  { id: 'accounts', name: 'Accounts', icon: User, sub: 'Your accounts, email, sync, work' },
  { id: 'security', name: 'Privacy & Security', icon: Shield, sub: 'Windows Hello, face recognition, privacy' },
  { id: 'gaming', name: 'Gaming', icon: Gamepad2, sub: 'Game Mode, captures, Xbox Game Bar' },
  { id: 'accessibility', name: 'Accessibility', icon: Accessibility, sub: 'Text size, visual effects, narrator' },
  { id: 'update', name: 'Windows Update', icon: RefreshCcw, sub: 'Updates, recovery, backup' },
];

interface SettingsAppProps {
  onUpdate?: () => void;
}

interface SubSectionProps {
  onBack: () => void;
  showNotification: (msg: string) => void;
}

function ToggleSwitch({ enabled, onChange, color = 'blue' }: { enabled: boolean; onChange: () => void; color?: string }) {
  const colorClasses: Record<string, string> = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    red: 'bg-red-500',
    orange: 'bg-orange-500',
    purple: 'bg-purple-500',
  };
  
  return (
    <button
      onClick={onChange}
      className={`relative w-12 h-6 rounded-full transition-colors ${enabled ? colorClasses[color] : 'bg-zinc-300 dark:bg-zinc-600'}`}
    >
      <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${enabled ? 'left-6' : 'left-0.5'}`} />
    </button>
  );
}

function Slider({ value, onChange, min = 0, max = 100 }: { value: number; onChange: (v: number) => void; min?: number; max?: number }) {
  return (
    <input 
      type="range" 
      min={min} 
      max={max} 
      value={value} 
      onChange={(e) => onChange(Number(e.target.value))} 
      className="w-full h-2 bg-zinc-300 dark:bg-zinc-600 rounded-lg appearance-none cursor-pointer accent-blue-500" 
    />
  );
}

function SubSectionHeader({ title, subtitle, icon: Icon, onBack }: { title: string; subtitle: string; icon: LucideIcon; onBack: () => void }) {
  return (
    <div className="mb-6">
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
        Back
      </button>
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-blue-600 rounded-md flex items-center justify-center text-white">
          <Icon className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-xl font-semibold">{title}</h1>
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        </div>
      </div>
    </div>
  );
}

function SettingCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-white dark:bg-[#2B2B2B] border border-zinc-200 dark:border-white/5 p-4 rounded-lg ${className}`}>
      {children}
    </div>
  );
}

function SettingRow({ icon: Icon, title, desc, onClick, rightElement }: { 
  icon: LucideIcon; 
  title: string; 
  desc: string; 
  onClick?: () => void;
  rightElement?: React.ReactNode;
}) {
  return (
    <button 
      onClick={onClick}
      className="w-full flex items-center gap-4 p-4 bg-white dark:bg-[#2B2B2B] border border-zinc-200 dark:border-white/5 rounded-lg hover:bg-zinc-50 dark:hover:bg-[#323232] active:scale-[0.99] transition-all text-left group"
    >
      <div className="p-2 bg-zinc-100 dark:bg-white/5 rounded-full text-zinc-500 dark:text-zinc-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
        <Icon className="w-5 h-5" />
      </div>
      <div className="flex-1">
        <div className="text-sm font-medium">{title}</div>
        <div className="text-xs text-muted-foreground">{desc}</div>
      </div>
      {rightElement || <div className="text-muted-foreground text-lg opacity-50 group-hover:opacity-100 transition-opacity">›</div>}
    </button>
  );
}

function DisplaySubSection({ onBack, showNotification }: SubSectionProps) {
  const [brightness, setBrightness] = useState(80);
  const [nightLight, setNightLight] = useState(false);
  const [nightLightStrength, setNightLightStrength] = useState(50);
  const [autoHDR, setAutoHDR] = useState(true);
  const [scaling, setScaling] = useState(100);
  const [resolution, setResolution] = useState('1920 x 1080');
  const [refreshRate, setRefreshRate] = useState('60 Hz');

  return (
    <div className="space-y-4 animate-in slide-in-from-right-4 duration-300">
      <SubSectionHeader title="Display" subtitle="Brightness, night light, scale and resolution" icon={Monitor} onBack={onBack} />
      
      <SettingCard>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <Sun className="w-5 h-5 text-yellow-500" />
            <div>
              <div className="text-sm font-medium">Brightness</div>
              <div className="text-xs text-muted-foreground">{brightness}%</div>
            </div>
          </div>
        </div>
        <Slider value={brightness} onChange={(v) => { setBrightness(v); showNotification(`Brightness: ${v}%`); }} />
      </SettingCard>

      <SettingCard>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Moon className="w-5 h-5 text-orange-400" />
            <div>
              <div className="text-sm font-medium">Night light</div>
              <div className="text-xs text-muted-foreground">Reduce blue light to help you sleep</div>
            </div>
          </div>
          <ToggleSwitch enabled={nightLight} onChange={() => { setNightLight(!nightLight); showNotification(nightLight ? 'Night light off' : 'Night light on'); }} color="orange" />
        </div>
        {nightLight && (
          <div className="mt-4 pt-4 border-t border-zinc-200 dark:border-white/10">
            <div className="text-sm mb-2">Strength: {nightLightStrength}%</div>
            <Slider value={nightLightStrength} onChange={(v) => setNightLightStrength(v)} />
          </div>
        )}
      </SettingCard>

      <SettingCard>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-purple-500" />
            <div>
              <div className="text-sm font-medium">Auto HDR</div>
              <div className="text-xs text-muted-foreground">Automatically improve supported games</div>
            </div>
          </div>
          <ToggleSwitch enabled={autoHDR} onChange={() => { setAutoHDR(!autoHDR); showNotification(autoHDR ? 'Auto HDR disabled' : 'Auto HDR enabled'); }} color="purple" />
        </div>
      </SettingCard>

      <SettingCard>
        <h3 className="font-medium mb-4">Scale & layout</h3>
        <div className="space-y-4">
          <div>
            <label className="text-sm text-muted-foreground">Scale</label>
            <select 
              value={scaling}
              onChange={(e) => { setScaling(Number(e.target.value)); showNotification(`Scale changed to ${e.target.value}%`); }}
              className="w-full mt-1 p-2 bg-zinc-100 dark:bg-zinc-800 rounded-md border-0 text-sm"
            >
              <option value={100}>100% (Recommended)</option>
              <option value={125}>125%</option>
              <option value={150}>150%</option>
              <option value={175}>175%</option>
            </select>
          </div>
          <div>
            <label className="text-sm text-muted-foreground">Display resolution</label>
            <select 
              value={resolution}
              onChange={(e) => { setResolution(e.target.value); showNotification(`Resolution changed to ${e.target.value}`); }}
              className="w-full mt-1 p-2 bg-zinc-100 dark:bg-zinc-800 rounded-md border-0 text-sm"
            >
              <option>1920 x 1080</option>
              <option>2560 x 1440</option>
              <option>3840 x 2160</option>
              <option>1280 x 720</option>
            </select>
          </div>
          <div>
            <label className="text-sm text-muted-foreground">Refresh rate</label>
            <select 
              value={refreshRate}
              onChange={(e) => { setRefreshRate(e.target.value); showNotification(`Refresh rate changed to ${e.target.value}`); }}
              className="w-full mt-1 p-2 bg-zinc-100 dark:bg-zinc-800 rounded-md border-0 text-sm"
            >
              <option>60 Hz</option>
              <option>120 Hz</option>
              <option>144 Hz</option>
              <option>240 Hz</option>
            </select>
          </div>
        </div>
      </SettingCard>
    </div>
  );
}

function SoundSubSection({ onBack, showNotification }: SubSectionProps) {
  const [masterVolume, setMasterVolume] = useState(80);
  const [systemSounds, setSystemSounds] = useState(50);
  const [appVolumes, setAppVolumes] = useState<Record<string, number>>({
    'Microsoft Edge': 100,
    'Spotify': 75,
    'Discord': 60,
    'Games': 100,
  });
  const [inputDevice, setInputDevice] = useState('Default Microphone');
  const [outputDevice, setOutputDevice] = useState('Speakers (High Definition Audio)');
  const [micMuted, setMicMuted] = useState(false);
  const [spatialSound, setSpatialSound] = useState(false);

  return (
    <div className="space-y-4 animate-in slide-in-from-right-4 duration-300">
      <SubSectionHeader title="Sound" subtitle="Volume, input and output devices" icon={Volume2} onBack={onBack} />
      
      <SettingCard>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <Speaker className="w-5 h-5 text-blue-500" />
            <div>
              <div className="text-sm font-medium">Master Volume</div>
              <div className="text-xs text-muted-foreground">{masterVolume}%</div>
            </div>
          </div>
          <button onClick={() => { setMasterVolume(masterVolume === 0 ? 80 : 0); showNotification(masterVolume === 0 ? 'Sound unmuted' : 'Sound muted'); }}>
            {masterVolume === 0 ? <VolumeX className="w-5 h-5 text-red-500" /> : <Volume2 className="w-5 h-5 text-blue-500" />}
          </button>
        </div>
        <Slider value={masterVolume} onChange={(v) => { setMasterVolume(v); showNotification(`Volume: ${v}%`); }} />
      </SettingCard>

      <SettingCard>
        <h3 className="font-medium mb-4">Output device</h3>
        <select 
          value={outputDevice}
          onChange={(e) => { setOutputDevice(e.target.value); showNotification(`Output: ${e.target.value}`); }}
          className="w-full p-2 bg-zinc-100 dark:bg-zinc-800 rounded-md border-0 text-sm"
        >
          <option>Speakers (High Definition Audio)</option>
          <option>Headphones (Bluetooth)</option>
          <option>HDMI Audio</option>
          <option>USB Audio Device</option>
        </select>
      </SettingCard>

      <SettingCard>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Mic className="w-5 h-5 text-green-500" />
            <div>
              <div className="text-sm font-medium">Input device</div>
              <div className="text-xs text-muted-foreground">{micMuted ? 'Muted' : 'Active'}</div>
            </div>
          </div>
          <ToggleSwitch enabled={!micMuted} onChange={() => { setMicMuted(!micMuted); showNotification(micMuted ? 'Microphone unmuted' : 'Microphone muted'); }} color="green" />
        </div>
        <select 
          value={inputDevice}
          onChange={(e) => { setInputDevice(e.target.value); showNotification(`Input: ${e.target.value}`); }}
          className="w-full p-2 bg-zinc-100 dark:bg-zinc-800 rounded-md border-0 text-sm"
        >
          <option>Default Microphone</option>
          <option>Headset Microphone</option>
          <option>USB Microphone</option>
          <option>Webcam Microphone</option>
        </select>
      </SettingCard>

      <SettingCard>
        <h3 className="font-medium mb-4">App volume</h3>
        <div className="space-y-4">
          {Object.entries(appVolumes).map(([app, vol]) => (
            <div key={app}>
              <div className="flex justify-between text-sm mb-1">
                <span>{app}</span>
                <span className="text-muted-foreground">{vol}%</span>
              </div>
              <Slider 
                value={vol} 
                onChange={(v) => { 
                  setAppVolumes(prev => ({ ...prev, [app]: v })); 
                  showNotification(`${app} volume: ${v}%`); 
                }} 
              />
            </div>
          ))}
        </div>
      </SettingCard>

      <SettingCard>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Headphones className="w-5 h-5 text-purple-500" />
            <div>
              <div className="text-sm font-medium">Spatial sound</div>
              <div className="text-xs text-muted-foreground">Windows Sonic for Headphones</div>
            </div>
          </div>
          <ToggleSwitch enabled={spatialSound} onChange={() => { setSpatialSound(!spatialSound); showNotification(spatialSound ? 'Spatial sound off' : 'Spatial sound on'); }} color="purple" />
        </div>
      </SettingCard>
    </div>
  );
}

function NotificationsSubSection({ onBack, showNotification }: SubSectionProps) {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [doNotDisturb, setDoNotDisturb] = useState(false);
  const [showOnLockScreen, setShowOnLockScreen] = useState(true);
  const [playSound, setPlaySound] = useState(true);
  const [appNotifications, setAppNotifications] = useState<Record<string, boolean>>({
    'Mail': true,
    'Calendar': true,
    'Microsoft Store': true,
    'Xbox': false,
    'Settings': true,
    'Browser': true,
  });

  return (
    <div className="space-y-4 animate-in slide-in-from-right-4 duration-300">
      <SubSectionHeader title="Notifications" subtitle="Manage notification settings for apps" icon={Bell} onBack={onBack} />
      
      <SettingCard>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Bell className="w-5 h-5 text-blue-500" />
            <div>
              <div className="text-sm font-medium">Notifications</div>
              <div className="text-xs text-muted-foreground">Allow apps to send notifications</div>
            </div>
          </div>
          <ToggleSwitch enabled={notificationsEnabled} onChange={() => { setNotificationsEnabled(!notificationsEnabled); showNotification(notificationsEnabled ? 'Notifications disabled' : 'Notifications enabled'); }} />
        </div>
      </SettingCard>

      <SettingCard>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <BellOff className="w-5 h-5 text-orange-500" />
            <div>
              <div className="text-sm font-medium">Do not disturb</div>
              <div className="text-xs text-muted-foreground">Silence all notifications</div>
            </div>
          </div>
          <ToggleSwitch enabled={doNotDisturb} onChange={() => { setDoNotDisturb(!doNotDisturb); showNotification(doNotDisturb ? 'Do not disturb off' : 'Do not disturb on'); }} color="orange" />
        </div>
      </SettingCard>

      <SettingCard>
        <h3 className="font-medium mb-4">Notification behavior</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm">Show on lock screen</span>
            <ToggleSwitch enabled={showOnLockScreen} onChange={() => setShowOnLockScreen(!showOnLockScreen)} />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm">Play notification sounds</span>
            <ToggleSwitch enabled={playSound} onChange={() => setPlaySound(!playSound)} />
          </div>
        </div>
      </SettingCard>

      <SettingCard>
        <h3 className="font-medium mb-4">App notifications</h3>
        <div className="space-y-3">
          {Object.entries(appNotifications).map(([app, enabled]) => (
            <div key={app} className="flex items-center justify-between py-2 border-b border-zinc-100 dark:border-white/5 last:border-0">
              <span className="text-sm">{app}</span>
              <ToggleSwitch 
                enabled={enabled} 
                onChange={() => { 
                  setAppNotifications(prev => ({ ...prev, [app]: !prev[app] })); 
                  showNotification(`${app} notifications ${enabled ? 'disabled' : 'enabled'}`);
                }} 
              />
            </div>
          ))}
        </div>
      </SettingCard>
    </div>
  );
}

function PowerSubSection({ onBack, showNotification }: SubSectionProps) {
  const [batteryLevel, setBatteryLevel] = useState<number | null>(null);
  const [isCharging, setIsCharging] = useState(false);
  const [powerMode, setPowerMode] = useState('balanced');
  const [batterySaver, setBatterySaver] = useState(false);
  const [screenTimeout, setScreenTimeout] = useState('10');
  const [sleepTimeout, setSleepTimeout] = useState('30');

  useEffect(() => {
    // @ts-ignore
    if (navigator.getBattery) {
      // @ts-ignore
      navigator.getBattery().then((battery) => {
        setBatteryLevel(Math.round(battery.level * 100));
        setIsCharging(battery.charging);
        battery.addEventListener('levelchange', () => setBatteryLevel(Math.round(battery.level * 100)));
        battery.addEventListener('chargingchange', () => setIsCharging(battery.charging));
      });
    } else {
      setBatteryLevel(85);
    }
  }, []);

  return (
    <div className="space-y-4 animate-in slide-in-from-right-4 duration-300">
      <SubSectionHeader title="Power & battery" subtitle="Battery status and power settings" icon={Battery} onBack={onBack} />
      
      <SettingCard>
        <div className="flex items-center gap-4 mb-4">
          {isCharging ? <BatteryCharging className="w-8 h-8 text-green-500" /> : <Battery className="w-8 h-8 text-blue-500" />}
          <div>
            <div className="text-2xl font-bold">{batteryLevel}%</div>
            <div className="text-sm text-muted-foreground">{isCharging ? 'Charging' : 'On battery'}</div>
          </div>
        </div>
        <div className="w-full h-3 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
          <div 
            className={`h-full rounded-full transition-all ${isCharging ? 'bg-green-500' : batteryLevel && batteryLevel < 20 ? 'bg-red-500' : 'bg-blue-500'}`}
            style={{ width: `${batteryLevel}%` }}
          />
        </div>
      </SettingCard>

      <SettingCard>
        <h3 className="font-medium mb-4">Power mode</h3>
        <div className="space-y-2">
          {[
            { id: 'saver', name: 'Best power efficiency', desc: 'Reduces performance for longer battery life', icon: Battery },
            { id: 'balanced', name: 'Balanced', desc: 'Balance between performance and battery', icon: Gauge },
            { id: 'performance', name: 'Best performance', desc: 'Maximum performance, uses more power', icon: Zap },
          ].map((mode) => (
            <button
              key={mode.id}
              onClick={() => { setPowerMode(mode.id); showNotification(`Power mode: ${mode.name}`); }}
              className={`w-full p-3 rounded-lg flex items-center gap-3 transition-colors ${
                powerMode === mode.id 
                  ? 'bg-blue-500/10 border-2 border-blue-500' 
                  : 'bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700'
              }`}
            >
              <mode.icon className={`w-5 h-5 ${powerMode === mode.id ? 'text-blue-500' : 'text-muted-foreground'}`} />
              <div className="text-left">
                <div className="text-sm font-medium">{mode.name}</div>
                <div className="text-xs text-muted-foreground">{mode.desc}</div>
              </div>
              {powerMode === mode.id && <Check className="w-5 h-5 text-blue-500 ml-auto" />}
            </button>
          ))}
        </div>
      </SettingCard>

      <SettingCard>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <BatteryWarning className="w-5 h-5 text-yellow-500" />
            <div>
              <div className="text-sm font-medium">Battery saver</div>
              <div className="text-xs text-muted-foreground">Limit background activity</div>
            </div>
          </div>
          <ToggleSwitch enabled={batterySaver} onChange={() => { setBatterySaver(!batterySaver); showNotification(batterySaver ? 'Battery saver off' : 'Battery saver on'); }} color="orange" />
        </div>
      </SettingCard>

      <SettingCard>
        <h3 className="font-medium mb-4">Screen and sleep</h3>
        <div className="space-y-4">
          <div>
            <label className="text-sm text-muted-foreground">Turn off screen after</label>
            <select 
              value={screenTimeout}
              onChange={(e) => { setScreenTimeout(e.target.value); showNotification(`Screen timeout: ${e.target.value} minutes`); }}
              className="w-full mt-1 p-2 bg-zinc-100 dark:bg-zinc-800 rounded-md border-0 text-sm"
            >
              <option value="5">5 minutes</option>
              <option value="10">10 minutes</option>
              <option value="15">15 minutes</option>
              <option value="30">30 minutes</option>
              <option value="never">Never</option>
            </select>
          </div>
          <div>
            <label className="text-sm text-muted-foreground">Sleep after</label>
            <select 
              value={sleepTimeout}
              onChange={(e) => { setSleepTimeout(e.target.value); showNotification(`Sleep timeout: ${e.target.value} minutes`); }}
              className="w-full mt-1 p-2 bg-zinc-100 dark:bg-zinc-800 rounded-md border-0 text-sm"
            >
              <option value="15">15 minutes</option>
              <option value="30">30 minutes</option>
              <option value="60">1 hour</option>
              <option value="120">2 hours</option>
              <option value="never">Never</option>
            </select>
          </div>
        </div>
      </SettingCard>
    </div>
  );
}

function StorageSubSection({ onBack, showNotification }: SubSectionProps) {
  const [storageUsed, setStorageUsed] = useState(156.8);
  const [storageTotal] = useState(512);
  const [storageSense, setStorageSense] = useState(true);
  const [tempFiles, setTempFiles] = useState(2.4);
  const [downloads, setDownloads] = useState(8.7);
  const [recycleBin, setRecycleBin] = useState(1.2);

  const storageCategories = [
    { name: 'System & reserved', size: 45.2, color: 'bg-blue-500' },
    { name: 'Apps & features', size: 62.4, color: 'bg-green-500' },
    { name: 'Documents', size: 24.8, color: 'bg-yellow-500' },
    { name: 'Pictures', size: 18.2, color: 'bg-purple-500' },
    { name: 'Other', size: 6.2, color: 'bg-zinc-500' },
  ];

  return (
    <div className="space-y-4 animate-in slide-in-from-right-4 duration-300">
      <SubSectionHeader title="Storage" subtitle="Manage disk space and storage settings" icon={HardDrive} onBack={onBack} />
      
      <SettingCard>
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-sm text-muted-foreground">Local Disk (C:)</div>
            <div className="text-2xl font-bold">{storageUsed} GB used</div>
            <div className="text-sm text-muted-foreground">{(storageTotal - storageUsed).toFixed(1)} GB free of {storageTotal} GB</div>
          </div>
          <HardDrive className="w-10 h-10 text-blue-500" />
        </div>
        <div className="w-full h-4 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden flex">
          {storageCategories.map((cat, i) => (
            <div 
              key={i}
              className={`h-full ${cat.color}`}
              style={{ width: `${(cat.size / storageTotal) * 100}%` }}
            />
          ))}
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2">
          {storageCategories.map((cat, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${cat.color}`} />
              <span className="text-xs">{cat.name}: {cat.size} GB</span>
            </div>
          ))}
        </div>
      </SettingCard>

      <SettingCard>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-blue-500" />
            <div>
              <div className="text-sm font-medium">Storage Sense</div>
              <div className="text-xs text-muted-foreground">Automatically free up space</div>
            </div>
          </div>
          <ToggleSwitch enabled={storageSense} onChange={() => { setStorageSense(!storageSense); showNotification(storageSense ? 'Storage Sense off' : 'Storage Sense on'); }} />
        </div>
      </SettingCard>

      <SettingCard>
        <h3 className="font-medium mb-4">Cleanup recommendations</h3>
        <div className="space-y-3">
          <button 
            onClick={() => { setTempFiles(0); showNotification('Temporary files cleaned'); }}
            className="w-full flex items-center justify-between p-3 rounded-lg bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
          >
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-orange-500" />
              <div className="text-left">
                <div className="text-sm font-medium">Temporary files</div>
                <div className="text-xs text-muted-foreground">{tempFiles} GB</div>
              </div>
            </div>
            <Trash2 className="w-5 h-5 text-muted-foreground" />
          </button>
          <button 
            onClick={() => { setDownloads(0); showNotification('Downloads folder cleaned'); }}
            className="w-full flex items-center justify-between p-3 rounded-lg bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Download className="w-5 h-5 text-blue-500" />
              <div className="text-left">
                <div className="text-sm font-medium">Downloads folder</div>
                <div className="text-xs text-muted-foreground">{downloads} GB</div>
              </div>
            </div>
            <Trash2 className="w-5 h-5 text-muted-foreground" />
          </button>
          <button 
            onClick={() => { setRecycleBin(0); showNotification('Recycle bin emptied'); }}
            className="w-full flex items-center justify-between p-3 rounded-lg bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Trash className="w-5 h-5 text-red-500" />
              <div className="text-left">
                <div className="text-sm font-medium">Recycle Bin</div>
                <div className="text-xs text-muted-foreground">{recycleBin} GB</div>
              </div>
            </div>
            <Trash2 className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>
      </SettingCard>
    </div>
  );
}

function BluetoothDevicesSubSection({ onBack, showNotification }: SubSectionProps) {
  const [bluetoothEnabled, setBluetoothEnabled] = useState(true);
  const [discoverable, setDiscoverable] = useState(false);
  const [pairedDevices, setPairedDevices] = useState([
    { id: 1, name: 'AirPods Pro', type: 'headphones', connected: true },
    { id: 2, name: 'Magic Mouse', type: 'mouse', connected: false },
    { id: 3, name: 'Logitech Keyboard', type: 'keyboard', connected: true },
  ]);
  const [scanning, setScanning] = useState(false);
  const [nearbyDevices, setNearbyDevices] = useState<string[]>([]);

  const scanForDevices = () => {
    setScanning(true);
    showNotification('Scanning for devices...');
    setTimeout(() => {
      setNearbyDevices(['Samsung TV', 'iPhone 15', 'JBL Speaker', 'Galaxy Watch']);
      setScanning(false);
      showNotification('Found 4 devices');
    }, 2000);
  };

  const toggleDeviceConnection = (id: number) => {
    setPairedDevices(prev => prev.map(d => {
      if (d.id === id) {
        showNotification(d.connected ? `Disconnected ${d.name}` : `Connected to ${d.name}`);
        return { ...d, connected: !d.connected };
      }
      return d;
    }));
  };

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case 'headphones': return Headphones;
      case 'mouse': return MousePointer;
      case 'keyboard': return Keyboard;
      default: return Bluetooth;
    }
  };

  return (
    <div className="space-y-4 animate-in slide-in-from-right-4 duration-300">
      <SubSectionHeader title="Bluetooth & devices" subtitle="Manage Bluetooth connections and devices" icon={Bluetooth} onBack={onBack} />
      
      <SettingCard>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Bluetooth className="w-5 h-5 text-blue-500" />
            <div>
              <div className="text-sm font-medium">Bluetooth</div>
              <div className="text-xs text-muted-foreground">{bluetoothEnabled ? 'On' : 'Off'}</div>
            </div>
          </div>
          <ToggleSwitch enabled={bluetoothEnabled} onChange={() => { setBluetoothEnabled(!bluetoothEnabled); showNotification(bluetoothEnabled ? 'Bluetooth off' : 'Bluetooth on'); }} />
        </div>
        {bluetoothEnabled && (
          <div className="flex items-center justify-between pt-4 border-t border-zinc-200 dark:border-white/10">
            <span className="text-sm">Make discoverable</span>
            <ToggleSwitch enabled={discoverable} onChange={() => { setDiscoverable(!discoverable); showNotification(discoverable ? 'Not discoverable' : 'Now discoverable'); }} />
          </div>
        )}
      </SettingCard>

      {bluetoothEnabled && (
        <>
          <SettingCard>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium">Paired devices</h3>
              <button
                onClick={scanForDevices}
                disabled={scanning}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-md text-sm font-medium transition-colors flex items-center gap-2"
              >
                {scanning ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                {scanning ? 'Scanning...' : 'Add device'}
              </button>
            </div>
            <div className="space-y-2">
              {pairedDevices.map((device) => {
                const Icon = getDeviceIcon(device.type);
                return (
                  <div key={device.id} className="flex items-center justify-between p-3 rounded-lg bg-zinc-100 dark:bg-zinc-800">
                    <div className="flex items-center gap-3">
                      <Icon className={`w-5 h-5 ${device.connected ? 'text-blue-500' : 'text-muted-foreground'}`} />
                      <div>
                        <div className="text-sm font-medium">{device.name}</div>
                        <div className="text-xs text-muted-foreground">{device.connected ? 'Connected' : 'Not connected'}</div>
                      </div>
                    </div>
                    <button
                      onClick={() => toggleDeviceConnection(device.id)}
                      className={`px-3 py-1 rounded-md text-xs font-medium ${
                        device.connected 
                          ? 'bg-zinc-200 dark:bg-zinc-700 text-foreground' 
                          : 'bg-blue-600 text-white'
                      }`}
                    >
                      {device.connected ? 'Disconnect' : 'Connect'}
                    </button>
                  </div>
                );
              })}
            </div>
          </SettingCard>

          {nearbyDevices.length > 0 && (
            <SettingCard>
              <h3 className="font-medium mb-4">Nearby devices</h3>
              <div className="space-y-2">
                {nearbyDevices.map((device, i) => (
                  <button
                    key={i}
                    onClick={() => { 
                      showNotification(`Pairing with ${device}...`);
                      setTimeout(() => showNotification(`Paired with ${device}`), 1500);
                    }}
                    className="w-full flex items-center justify-between p-3 rounded-lg bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Bluetooth className="w-5 h-5 text-muted-foreground" />
                      <span className="text-sm">{device}</span>
                    </div>
                    <span className="text-xs text-blue-500">Pair</span>
                  </button>
                ))}
              </div>
            </SettingCard>
          )}
        </>
      )}
    </div>
  );
}

function MouseKeyboardSubSection({ onBack, showNotification }: SubSectionProps) {
  const [pointerSpeed, setPointerSpeed] = useState(50);
  const [scrollLines, setScrollLines] = useState(3);
  const [enhancePointerPrecision, setEnhancePointerPrecision] = useState(true);
  const [primaryButton, setPrimaryButton] = useState('left');
  const [keyRepeatDelay, setKeyRepeatDelay] = useState(50);
  const [keyRepeatRate, setKeyRepeatRate] = useState(50);
  const [stickyKeys, setStickyKeys] = useState(false);
  const [filterKeys, setFilterKeys] = useState(false);

  return (
    <div className="space-y-4 animate-in slide-in-from-right-4 duration-300">
      <SubSectionHeader title="Mouse & Keyboard" subtitle="Pointer speed, scroll settings, keyboard" icon={MousePointer} onBack={onBack} />
      
      <SettingCard>
        <h3 className="font-medium mb-4 flex items-center gap-2">
          <MousePointer className="w-5 h-5 text-blue-500" />
          Mouse
        </h3>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>Pointer speed</span>
              <span className="text-muted-foreground">{pointerSpeed}%</span>
            </div>
            <Slider value={pointerSpeed} onChange={(v) => { setPointerSpeed(v); showNotification(`Pointer speed: ${v}%`); }} />
          </div>
          <div>
            <label className="text-sm">Scroll lines at a time</label>
            <select 
              value={scrollLines}
              onChange={(e) => { setScrollLines(Number(e.target.value)); showNotification(`Scroll: ${e.target.value} lines`); }}
              className="w-full mt-1 p-2 bg-zinc-100 dark:bg-zinc-800 rounded-md border-0 text-sm"
            >
              <option value={1}>1 line</option>
              <option value={3}>3 lines</option>
              <option value={5}>5 lines</option>
              <option value={10}>10 lines</option>
            </select>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm">Enhance pointer precision</span>
            <ToggleSwitch enabled={enhancePointerPrecision} onChange={() => setEnhancePointerPrecision(!enhancePointerPrecision)} />
          </div>
          <div>
            <label className="text-sm">Primary button</label>
            <div className="flex gap-2 mt-2">
              <button
                onClick={() => { setPrimaryButton('left'); showNotification('Primary button: Left'); }}
                className={`flex-1 p-2 rounded-md text-sm ${primaryButton === 'left' ? 'bg-blue-500 text-white' : 'bg-zinc-100 dark:bg-zinc-800'}`}
              >
                Left
              </button>
              <button
                onClick={() => { setPrimaryButton('right'); showNotification('Primary button: Right'); }}
                className={`flex-1 p-2 rounded-md text-sm ${primaryButton === 'right' ? 'bg-blue-500 text-white' : 'bg-zinc-100 dark:bg-zinc-800'}`}
              >
                Right
              </button>
            </div>
          </div>
        </div>
      </SettingCard>

      <SettingCard>
        <h3 className="font-medium mb-4 flex items-center gap-2">
          <Keyboard className="w-5 h-5 text-green-500" />
          Keyboard
        </h3>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>Repeat delay</span>
              <span className="text-muted-foreground">{keyRepeatDelay < 50 ? 'Short' : keyRepeatDelay > 50 ? 'Long' : 'Medium'}</span>
            </div>
            <Slider value={keyRepeatDelay} onChange={(v) => setKeyRepeatDelay(v)} />
          </div>
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>Repeat rate</span>
              <span className="text-muted-foreground">{keyRepeatRate < 50 ? 'Slow' : keyRepeatRate > 50 ? 'Fast' : 'Medium'}</span>
            </div>
            <Slider value={keyRepeatRate} onChange={(v) => setKeyRepeatRate(v)} />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm">Sticky Keys</div>
              <div className="text-xs text-muted-foreground">Press modifier keys one at a time</div>
            </div>
            <ToggleSwitch enabled={stickyKeys} onChange={() => { setStickyKeys(!stickyKeys); showNotification(stickyKeys ? 'Sticky Keys off' : 'Sticky Keys on'); }} />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm">Filter Keys</div>
              <div className="text-xs text-muted-foreground">Ignore brief or repeated keystrokes</div>
            </div>
            <ToggleSwitch enabled={filterKeys} onChange={() => { setFilterKeys(!filterKeys); showNotification(filterKeys ? 'Filter Keys off' : 'Filter Keys on'); }} />
          </div>
        </div>
      </SettingCard>
    </div>
  );
}

function PrintersSubSection({ onBack, showNotification }: SubSectionProps) {
  const [printers, setPrinters] = useState([
    { id: 1, name: 'HP LaserJet Pro', status: 'Ready', isDefault: true },
    { id: 2, name: 'Microsoft Print to PDF', status: 'Ready', isDefault: false },
    { id: 3, name: 'Brother MFC-L2710DW', status: 'Offline', isDefault: false },
  ]);
  const [scanning, setScanning] = useState(false);

  const setDefaultPrinter = (id: number) => {
    setPrinters(prev => prev.map(p => {
      if (p.id === id) {
        showNotification(`${p.name} set as default`);
        return { ...p, isDefault: true };
      }
      return { ...p, isDefault: false };
    }));
  };

  const scanForPrinters = () => {
    setScanning(true);
    showNotification('Scanning for printers...');
    setTimeout(() => {
      setScanning(false);
      showNotification('Scan complete');
    }, 2000);
  };

  return (
    <div className="space-y-4 animate-in slide-in-from-right-4 duration-300">
      <SubSectionHeader title="Printers & scanners" subtitle="Add and manage printers" icon={Printer} onBack={onBack} />
      
      <SettingCard>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium">Printers</h3>
          <button
            onClick={scanForPrinters}
            disabled={scanning}
            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-md text-sm font-medium transition-colors flex items-center gap-2"
          >
            {scanning ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            Add printer
          </button>
        </div>
        <div className="space-y-2">
          {printers.map((printer) => (
            <div key={printer.id} className="flex items-center justify-between p-3 rounded-lg bg-zinc-100 dark:bg-zinc-800">
              <div className="flex items-center gap-3">
                <Printer className={`w-5 h-5 ${printer.status === 'Ready' ? 'text-green-500' : 'text-muted-foreground'}`} />
                <div>
                  <div className="text-sm font-medium flex items-center gap-2">
                    {printer.name}
                    {printer.isDefault && <span className="text-xs bg-blue-500 text-white px-1.5 py-0.5 rounded">Default</span>}
                  </div>
                  <div className="text-xs text-muted-foreground">{printer.status}</div>
                </div>
              </div>
              {!printer.isDefault && (
                <button
                  onClick={() => setDefaultPrinter(printer.id)}
                  className="px-3 py-1 rounded-md text-xs font-medium bg-zinc-200 dark:bg-zinc-700 hover:bg-zinc-300 dark:hover:bg-zinc-600"
                >
                  Set as default
                </button>
              )}
            </div>
          ))}
        </div>
      </SettingCard>
    </div>
  );
}

function WifiSubSection({ onBack, showNotification }: SubSectionProps) {
  const [wifiEnabled, setWifiEnabled] = useState(true);
  const [connectedNetwork, setConnectedNetwork] = useState('Home Network');
  const [networks, setNetworks] = useState([
    { id: 1, name: 'Home Network', signal: 4, secured: true, connected: true },
    { id: 2, name: 'Coffee Shop WiFi', signal: 3, secured: false, connected: false },
    { id: 3, name: 'Neighbor_5G', signal: 2, secured: true, connected: false },
    { id: 4, name: 'Office Network', signal: 1, secured: true, connected: false },
  ]);
  const [scanning, setScanning] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [connectingTo, setConnectingTo] = useState<string | null>(null);

  const connectToNetwork = (network: typeof networks[0]) => {
    if (network.secured && !network.connected) {
      setConnectingTo(network.name);
      setShowPassword(true);
    } else {
      performConnect(network.name);
    }
  };

  const performConnect = (networkName: string) => {
    setNetworks(prev => prev.map(n => ({
      ...n,
      connected: n.name === networkName
    })));
    setConnectedNetwork(networkName);
    setShowPassword(false);
    setPasswordInput('');
    setConnectingTo(null);
    showNotification(`Connected to ${networkName}`);
  };

  const scanNetworks = () => {
    setScanning(true);
    showNotification('Scanning for networks...');
    setTimeout(() => {
      setScanning(false);
      showNotification('Scan complete');
    }, 2000);
  };

  const getSignalBars = (signal: number) => {
    return (
      <div className="flex gap-0.5 items-end h-4">
        {[1, 2, 3, 4].map(i => (
          <div 
            key={i} 
            className={`w-1 rounded-sm ${i <= signal ? 'bg-current' : 'bg-zinc-300 dark:bg-zinc-600'}`}
            style={{ height: `${i * 25}%` }}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-4 animate-in slide-in-from-right-4 duration-300">
      <SubSectionHeader title="Wi-Fi" subtitle="Manage wireless network connections" icon={Wifi} onBack={onBack} />
      
      <SettingCard>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {wifiEnabled ? <Wifi className="w-5 h-5 text-blue-500" /> : <WifiOff className="w-5 h-5 text-muted-foreground" />}
            <div>
              <div className="text-sm font-medium">Wi-Fi</div>
              <div className="text-xs text-muted-foreground">{wifiEnabled ? `Connected to ${connectedNetwork}` : 'Off'}</div>
            </div>
          </div>
          <ToggleSwitch enabled={wifiEnabled} onChange={() => { setWifiEnabled(!wifiEnabled); showNotification(wifiEnabled ? 'Wi-Fi off' : 'Wi-Fi on'); }} />
        </div>
      </SettingCard>

      {wifiEnabled && (
        <>
          <SettingCard>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium">Available networks</h3>
              <button
                onClick={scanNetworks}
                disabled={scanning}
                className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-md transition-colors"
              >
                <RefreshCcw className={`w-4 h-4 ${scanning ? 'animate-spin' : ''}`} />
              </button>
            </div>
            <div className="space-y-2">
              {networks.map((network) => (
                <button
                  key={network.id}
                  onClick={() => connectToNetwork(network)}
                  className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors ${
                    network.connected 
                      ? 'bg-blue-500/10 border border-blue-500' 
                      : 'bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={network.connected ? 'text-blue-500' : 'text-muted-foreground'}>
                      {getSignalBars(network.signal)}
                    </div>
                    <div className="text-left">
                      <div className="text-sm font-medium flex items-center gap-2">
                        {network.name}
                        {network.secured && <Lock className="w-3 h-3 text-muted-foreground" />}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {network.connected ? 'Connected' : network.secured ? 'Secured' : 'Open'}
                      </div>
                    </div>
                  </div>
                  {network.connected && <Check className="w-5 h-5 text-blue-500" />}
                </button>
              ))}
            </div>
          </SettingCard>

          {showPassword && (
            <SettingCard>
              <h3 className="font-medium mb-4">Connect to {connectingTo}</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-muted-foreground">Network security key</label>
                  <input
                    type="password"
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    className="w-full mt-1 p-2 bg-zinc-100 dark:bg-zinc-800 rounded-md border-0 text-sm"
                    placeholder="Enter password"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => { setShowPassword(false); setConnectingTo(null); }}
                    className="flex-1 p-2 bg-zinc-200 dark:bg-zinc-700 rounded-md text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => performConnect(connectingTo!)}
                    className="flex-1 p-2 bg-blue-600 text-white rounded-md text-sm"
                  >
                    Connect
                  </button>
                </div>
              </div>
            </SettingCard>
          )}
        </>
      )}
    </div>
  );
}

function VpnSubSection({ onBack, showNotification }: SubSectionProps) {
  const [vpnConnections, setVpnConnections] = useState([
    { id: 1, name: 'Work VPN', server: 'vpn.company.com', connected: false },
    { id: 2, name: 'NordVPN', server: 'us-east.nordvpn.com', connected: false },
  ]);
  const [connecting, setConnecting] = useState<number | null>(null);

  const toggleVpn = (id: number) => {
    const vpn = vpnConnections.find(v => v.id === id);
    if (!vpn) return;
    
    if (vpn.connected) {
      setVpnConnections(prev => prev.map(v => v.id === id ? { ...v, connected: false } : v));
      showNotification(`Disconnected from ${vpn.name}`);
    } else {
      setConnecting(id);
      showNotification(`Connecting to ${vpn.name}...`);
      setTimeout(() => {
        setVpnConnections(prev => prev.map(v => ({
          ...v,
          connected: v.id === id
        })));
        setConnecting(null);
        showNotification(`Connected to ${vpn.name}`);
      }, 1500);
    }
  };

  return (
    <div className="space-y-4 animate-in slide-in-from-right-4 duration-300">
      <SubSectionHeader title="VPN" subtitle="Virtual private network connections" icon={Shield} onBack={onBack} />
      
      <SettingCard>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium">VPN connections</h3>
          <button
            onClick={() => showNotification('Add VPN connection...')}
            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium"
          >
            Add VPN
          </button>
        </div>
        <div className="space-y-2">
          {vpnConnections.map((vpn) => (
            <div key={vpn.id} className={`flex items-center justify-between p-3 rounded-lg ${
              vpn.connected ? 'bg-green-500/10 border border-green-500' : 'bg-zinc-100 dark:bg-zinc-800'
            }`}>
              <div className="flex items-center gap-3">
                <Shield className={`w-5 h-5 ${vpn.connected ? 'text-green-500' : 'text-muted-foreground'}`} />
                <div>
                  <div className="text-sm font-medium">{vpn.name}</div>
                  <div className="text-xs text-muted-foreground">{vpn.server}</div>
                </div>
              </div>
              <button
                onClick={() => toggleVpn(vpn.id)}
                disabled={connecting === vpn.id}
                className={`px-3 py-1.5 rounded-md text-sm font-medium ${
                  vpn.connected 
                    ? 'bg-red-500 text-white hover:bg-red-600' 
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                } disabled:opacity-50`}
              >
                {connecting === vpn.id ? 'Connecting...' : vpn.connected ? 'Disconnect' : 'Connect'}
              </button>
            </div>
          ))}
        </div>
      </SettingCard>
    </div>
  );
}

function InstalledAppsSubSection({ onBack, showNotification }: SubSectionProps) {
  const [apps, setApps] = useState([
    { id: 1, name: 'Microsoft Edge', size: '245 MB', publisher: 'Microsoft' },
    { id: 2, name: 'Visual Studio Code', size: '312 MB', publisher: 'Microsoft' },
    { id: 3, name: 'Spotify', size: '189 MB', publisher: 'Spotify AB' },
    { id: 4, name: 'Discord', size: '156 MB', publisher: 'Discord Inc.' },
    { id: 5, name: 'Steam', size: '634 MB', publisher: 'Valve' },
    { id: 6, name: 'VLC Media Player', size: '98 MB', publisher: 'VideoLAN' },
  ]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('name');

  const filteredApps = apps
    .filter(app => app.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'size') return parseInt(b.size) - parseInt(a.size);
      return 0;
    });

  const uninstallApp = (id: number) => {
    const app = apps.find(a => a.id === id);
    showNotification(`Uninstalling ${app?.name}...`);
    setTimeout(() => {
      setApps(prev => prev.filter(a => a.id !== id));
      showNotification(`${app?.name} uninstalled`);
    }, 1000);
  };

  return (
    <div className="space-y-4 animate-in slide-in-from-right-4 duration-300">
      <SubSectionHeader title="Installed apps" subtitle="Manage and uninstall applications" icon={AppWindow} onBack={onBack} />
      
      <SettingCard>
        <div className="flex gap-2 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search apps..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-zinc-100 dark:bg-zinc-800 rounded-md border-0 text-sm"
            />
          </div>
          <select 
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="p-2 bg-zinc-100 dark:bg-zinc-800 rounded-md border-0 text-sm"
          >
            <option value="name">Sort by name</option>
            <option value="size">Sort by size</option>
          </select>
        </div>
        <div className="space-y-2">
          {filteredApps.map((app) => (
            <div key={app.id} className="flex items-center justify-between p-3 rounded-lg bg-zinc-100 dark:bg-zinc-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white font-bold">
                  {app.name[0]}
                </div>
                <div>
                  <div className="text-sm font-medium">{app.name}</div>
                  <div className="text-xs text-muted-foreground">{app.publisher} • {app.size}</div>
                </div>
              </div>
              <button
                onClick={() => uninstallApp(app.id)}
                className="px-3 py-1.5 bg-red-500/10 text-red-500 hover:bg-red-500/20 rounded-md text-sm font-medium"
              >
                Uninstall
              </button>
            </div>
          ))}
        </div>
      </SettingCard>
    </div>
  );
}

function DefaultAppsSubSection({ onBack, showNotification }: SubSectionProps) {
  const [defaults, setDefaults] = useState({
    browser: 'Microsoft Edge',
    email: 'Mail',
    music: 'Spotify',
    video: 'Movies & TV',
    photos: 'Photos',
    maps: 'Maps',
    pdf: 'Microsoft Edge',
  });

  const options: Record<string, string[]> = {
    browser: ['Microsoft Edge', 'Chrome', 'Firefox', 'Brave'],
    email: ['Mail', 'Outlook', 'Thunderbird'],
    music: ['Spotify', 'Windows Media Player', 'VLC', 'iTunes'],
    video: ['Movies & TV', 'VLC', 'Windows Media Player'],
    photos: ['Photos', 'Paint', 'Photoshop'],
    maps: ['Maps', 'Google Maps'],
    pdf: ['Microsoft Edge', 'Adobe Acrobat', 'Foxit Reader'],
  };

  return (
    <div className="space-y-4 animate-in slide-in-from-right-4 duration-300">
      <SubSectionHeader title="Default apps" subtitle="Choose default applications" icon={AppWindow} onBack={onBack} />
      
      <SettingCard>
        <div className="space-y-4">
          {Object.entries(defaults).map(([key, value]) => (
            <div key={key}>
              <label className="text-sm text-muted-foreground capitalize">{key}</label>
              <select 
                value={value}
                onChange={(e) => { 
                  setDefaults(prev => ({ ...prev, [key]: e.target.value })); 
                  showNotification(`Default ${key}: ${e.target.value}`);
                }}
                className="w-full mt-1 p-2 bg-zinc-100 dark:bg-zinc-800 rounded-md border-0 text-sm"
              >
                {options[key].map(opt => (
                  <option key={opt}>{opt}</option>
                ))}
              </select>
            </div>
          ))}
        </div>
      </SettingCard>
    </div>
  );
}

function StartupAppsSubSection({ onBack, showNotification }: SubSectionProps) {
  const [startupApps, setStartupApps] = useState([
    { id: 1, name: 'Microsoft OneDrive', impact: 'Low', enabled: true },
    { id: 2, name: 'Spotify', impact: 'Medium', enabled: true },
    { id: 3, name: 'Discord', impact: 'High', enabled: false },
    { id: 4, name: 'Steam', impact: 'High', enabled: false },
    { id: 5, name: 'Slack', impact: 'Medium', enabled: true },
  ]);

  const toggleApp = (id: number) => {
    setStartupApps(prev => prev.map(app => {
      if (app.id === id) {
        showNotification(`${app.name} ${app.enabled ? 'disabled' : 'enabled'} at startup`);
        return { ...app, enabled: !app.enabled };
      }
      return app;
    }));
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'Low': return 'text-green-500';
      case 'Medium': return 'text-yellow-500';
      case 'High': return 'text-red-500';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <div className="space-y-4 animate-in slide-in-from-right-4 duration-300">
      <SubSectionHeader title="Startup apps" subtitle="Apps that run when you sign in" icon={Zap} onBack={onBack} />
      
      <SettingCard>
        <p className="text-sm text-muted-foreground mb-4">
          These apps start when you sign in. Disabling high-impact apps can speed up your startup time.
        </p>
        <div className="space-y-2">
          {startupApps.map((app) => (
            <div key={app.id} className="flex items-center justify-between p-3 rounded-lg bg-zinc-100 dark:bg-zinc-800">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white text-sm font-bold">
                  {app.name[0]}
                </div>
                <div>
                  <div className="text-sm font-medium">{app.name}</div>
                  <div className={`text-xs ${getImpactColor(app.impact)}`}>
                    {app.impact} impact
                  </div>
                </div>
              </div>
              <ToggleSwitch enabled={app.enabled} onChange={() => toggleApp(app.id)} />
            </div>
          ))}
        </div>
      </SettingCard>
    </div>
  );
}

function AccountInfoSubSection({ onBack, showNotification, onNavigate }: SubSectionProps & { onNavigate?: (section: string) => void }) {
  const { settings, setUserName, setProfilePicture } = useSystemSettings();
  const [name, setName] = useState(settings.userName);
  const [editing, setEditing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const saveName = () => {
    setUserName(name);
    setEditing(false);
    showNotification('Name updated');
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        showNotification('Image must be less than 2MB');
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        setProfilePicture(imageUrl);
        showNotification('Profile picture updated');
      };
      reader.readAsDataURL(file);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemovePicture = () => {
    setProfilePicture(null);
    showNotification('Profile picture removed');
  };

  return (
    <div className="space-y-4 animate-in slide-in-from-right-4 duration-300">
      <SubSectionHeader title="Your info" subtitle="Manage your account information" icon={User} onBack={onBack} />
      
      <SettingCard>
        <div className="flex items-center gap-4 mb-6">
          <div className="relative group">
            {settings.profilePicture ? (
              <img 
                src={settings.profilePicture} 
                alt="Profile" 
                className="w-20 h-20 rounded-full object-cover border-2 border-white/20"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white text-2xl font-bold">
                {settings.userInitials}
              </div>
            )}
            <div className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="p-1.5 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
                title="Upload picture"
              >
                <Upload className="w-4 h-4 text-white" />
              </button>
              {settings.profilePicture && (
                <button
                  onClick={handleRemovePicture}
                  className="p-1.5 bg-red-500/50 hover:bg-red-500/70 rounded-full transition-colors"
                  title="Remove picture"
                >
                  <Trash2 className="w-4 h-4 text-white" />
                </button>
              )}
            </div>
          </div>
          <input 
            ref={fileInputRef}
            type="file" 
            accept="image/*" 
            onChange={handleFileUpload} 
            className="hidden" 
          />
          <div>
            <h3 className="text-xl font-semibold">{settings.userName}</h3>
            <p className="text-sm text-muted-foreground">Local Account</p>
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="text-sm text-blue-500 hover:underline mt-1"
            >
              Change picture
            </button>
          </div>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="text-sm text-muted-foreground">Display name</label>
            {editing ? (
              <div className="flex gap-2 mt-1">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="flex-1 p-2 bg-zinc-100 dark:bg-zinc-800 rounded-md border-0 text-sm"
                />
                <button onClick={saveName} className="px-3 py-2 bg-blue-600 text-white rounded-md text-sm">Save</button>
                <button onClick={() => setEditing(false)} className="px-3 py-2 bg-zinc-200 dark:bg-zinc-700 rounded-md text-sm">Cancel</button>
              </div>
            ) : (
              <div className="flex items-center justify-between mt-1 p-2 bg-zinc-100 dark:bg-zinc-800 rounded-md">
                <span className="text-sm">{settings.userName}</span>
                <button onClick={() => setEditing(true)} className="text-sm text-blue-500">Edit</button>
              </div>
            )}
          </div>
        </div>
      </SettingCard>

      <SettingCard>
        <h3 className="font-medium mb-4">Account settings</h3>
        <div className="space-y-2">
          <button 
            onClick={() => onNavigate?.('sign-in-options')}
            className="w-full flex items-center justify-between p-3 rounded-lg bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700"
          >
            <span className="text-sm">Sign-in options</span>
            <span className="text-muted-foreground">›</span>
          </button>
          <button 
            onClick={() => showNotification('Family & other users settings available in full Windows')}
            className="w-full flex items-center justify-between p-3 rounded-lg bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700"
          >
            <span className="text-sm">Family & other users</span>
            <span className="text-muted-foreground">›</span>
          </button>
        </div>
      </SettingCard>
    </div>
  );
}

function SignInOptionsSubSection({ onBack, showNotification }: SubSectionProps) {
  const [pinEnabled, setPinEnabled] = useState(true);
  const [passwordEnabled, setPasswordEnabled] = useState(true);
  const [faceEnabled, setFaceEnabled] = useState(true);

  return (
    <div className="space-y-4 animate-in slide-in-from-right-4 duration-300">
      <SubSectionHeader title="Sign-in options" subtitle="Password, PIN, Windows Hello" icon={Lock} onBack={onBack} />
      
      <SettingCard>
        <h3 className="font-medium mb-4">Ways to sign in</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 rounded-lg bg-zinc-100 dark:bg-zinc-800">
            <div className="flex items-center gap-3">
              <ScanFace className="w-5 h-5 text-green-500" />
              <div>
                <div className="text-sm font-medium">Windows Hello Face</div>
                <div className="text-xs text-muted-foreground">Sign in with your face</div>
              </div>
            </div>
            <ToggleSwitch enabled={faceEnabled} onChange={() => { setFaceEnabled(!faceEnabled); showNotification(faceEnabled ? 'Face recognition disabled' : 'Face recognition enabled'); }} color="green" />
          </div>
          
          <div className="flex items-center justify-between p-3 rounded-lg bg-zinc-100 dark:bg-zinc-800">
            <div className="flex items-center gap-3">
              <Key className="w-5 h-5 text-blue-500" />
              <div>
                <div className="text-sm font-medium">PIN</div>
                <div className="text-xs text-muted-foreground">Quick sign-in with a PIN</div>
              </div>
            </div>
            <ToggleSwitch enabled={pinEnabled} onChange={() => { setPinEnabled(!pinEnabled); showNotification(pinEnabled ? 'PIN disabled' : 'PIN enabled'); }} />
          </div>
          
          <div className="flex items-center justify-between p-3 rounded-lg bg-zinc-100 dark:bg-zinc-800">
            <div className="flex items-center gap-3">
              <Lock className="w-5 h-5 text-orange-500" />
              <div>
                <div className="text-sm font-medium">Password</div>
                <div className="text-xs text-muted-foreground">Traditional password sign-in</div>
              </div>
            </div>
            <ToggleSwitch enabled={passwordEnabled} onChange={() => { setPasswordEnabled(!passwordEnabled); showNotification(passwordEnabled ? 'Password disabled' : 'Password enabled'); }} color="orange" />
          </div>
        </div>
      </SettingCard>

      <SettingCard>
        <button 
          onClick={async () => {
            localStorage.removeItem('windows_hello_enrolled_face');
            showNotification('Face enrollment cleared! Re-enroll on next login.');
          }}
          className="w-full p-3 bg-red-500/10 text-red-500 hover:bg-red-500/20 rounded-lg text-sm font-medium"
        >
          Reset Windows Hello Face Data
        </button>
      </SettingCard>
    </div>
  );
}

function PrivacyDashboardSubSection({ onBack, showNotification }: SubSectionProps) {
  const [locationAccess, setLocationAccess] = useState(true);
  const [cameraAccess, setCameraAccess] = useState(true);
  const [microphoneAccess, setMicrophoneAccess] = useState(true);
  const [notificationsAccess, setNotificationsAccess] = useState(true);
  const [diagnosticData, setDiagnosticData] = useState('optional');

  return (
    <div className="space-y-4 animate-in slide-in-from-right-4 duration-300">
      <SubSectionHeader title="Privacy dashboard" subtitle="Manage your privacy settings" icon={Shield} onBack={onBack} />
      
      <SettingCard>
        <h3 className="font-medium mb-4">App permissions</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 rounded-lg bg-zinc-100 dark:bg-zinc-800">
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-blue-500" />
              <div>
                <div className="text-sm font-medium">Location</div>
                <div className="text-xs text-muted-foreground">Allow apps to access your location</div>
              </div>
            </div>
            <ToggleSwitch enabled={locationAccess} onChange={() => { setLocationAccess(!locationAccess); showNotification(locationAccess ? 'Location access off' : 'Location access on'); }} />
          </div>
          
          <div className="flex items-center justify-between p-3 rounded-lg bg-zinc-100 dark:bg-zinc-800">
            <div className="flex items-center gap-3">
              <Camera className="w-5 h-5 text-green-500" />
              <div>
                <div className="text-sm font-medium">Camera</div>
                <div className="text-xs text-muted-foreground">Allow apps to access your camera</div>
              </div>
            </div>
            <ToggleSwitch enabled={cameraAccess} onChange={() => { setCameraAccess(!cameraAccess); showNotification(cameraAccess ? 'Camera access off' : 'Camera access on'); }} color="green" />
          </div>
          
          <div className="flex items-center justify-between p-3 rounded-lg bg-zinc-100 dark:bg-zinc-800">
            <div className="flex items-center gap-3">
              <Mic className="w-5 h-5 text-purple-500" />
              <div>
                <div className="text-sm font-medium">Microphone</div>
                <div className="text-xs text-muted-foreground">Allow apps to access your microphone</div>
              </div>
            </div>
            <ToggleSwitch enabled={microphoneAccess} onChange={() => { setMicrophoneAccess(!microphoneAccess); showNotification(microphoneAccess ? 'Microphone access off' : 'Microphone access on'); }} color="purple" />
          </div>
          
          <div className="flex items-center justify-between p-3 rounded-lg bg-zinc-100 dark:bg-zinc-800">
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5 text-orange-500" />
              <div>
                <div className="text-sm font-medium">Notifications</div>
                <div className="text-xs text-muted-foreground">Allow apps to send notifications</div>
              </div>
            </div>
            <ToggleSwitch enabled={notificationsAccess} onChange={() => { setNotificationsAccess(!notificationsAccess); showNotification(notificationsAccess ? 'Notifications off' : 'Notifications on'); }} color="orange" />
          </div>
        </div>
      </SettingCard>

      <SettingCard>
        <h3 className="font-medium mb-4">Diagnostic data</h3>
        <div className="space-y-2">
          {['required', 'optional'].map((option) => (
            <button
              key={option}
              onClick={() => { setDiagnosticData(option); showNotification(`Diagnostic data: ${option}`); }}
              className={`w-full p-3 rounded-lg flex items-center justify-between ${
                diagnosticData === option 
                  ? 'bg-blue-500/10 border border-blue-500' 
                  : 'bg-zinc-100 dark:bg-zinc-800'
              }`}
            >
              <div className="text-left">
                <div className="text-sm font-medium capitalize">{option} diagnostic data</div>
                <div className="text-xs text-muted-foreground">
                  {option === 'required' ? 'Send only essential data' : 'Send additional data to help improve Windows'}
                </div>
              </div>
              {diagnosticData === option && <Check className="w-5 h-5 text-blue-500" />}
            </button>
          ))}
        </div>
      </SettingCard>
    </div>
  );
}

function GameModeSubSection({ onBack, showNotification }: SubSectionProps) {
  const [gameMode, setGameMode] = useState(true);
  const [gameBar, setGameBar] = useState(true);
  const [captureEnabled, setCaptureEnabled] = useState(true);
  const [recordInBackground, setRecordInBackground] = useState(false);
  const [audioQuality, setAudioQuality] = useState('128');
  const [videoQuality, setVideoQuality] = useState('720p');

  return (
    <div className="space-y-4 animate-in slide-in-from-right-4 duration-300">
      <SubSectionHeader title="Game Mode" subtitle="Optimize your PC for gaming" icon={Gamepad2} onBack={onBack} />
      
      <SettingCard>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Zap className="w-5 h-5 text-yellow-500" />
            <div>
              <div className="text-sm font-medium">Game Mode</div>
              <div className="text-xs text-muted-foreground">Optimizes your PC for games</div>
            </div>
          </div>
          <ToggleSwitch enabled={gameMode} onChange={() => { setGameMode(!gameMode); showNotification(gameMode ? 'Game Mode off' : 'Game Mode on'); }} color="orange" />
        </div>
        <p className="text-xs text-muted-foreground">
          When Game Mode is on, Windows prioritizes your gaming experience by preventing Windows Update from performing driver installations and sending restart notifications.
        </p>
      </SettingCard>

      <SettingCard>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Joystick className="w-5 h-5 text-green-500" />
            <div>
              <div className="text-sm font-medium">Xbox Game Bar</div>
              <div className="text-xs text-muted-foreground">Record clips, chat, and more</div>
            </div>
          </div>
          <ToggleSwitch enabled={gameBar} onChange={() => { setGameBar(!gameBar); showNotification(gameBar ? 'Game Bar off' : 'Game Bar on'); }} color="green" />
        </div>
      </SettingCard>

      <SettingCard>
        <h3 className="font-medium mb-4">Captures</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm">Background recording</span>
            <ToggleSwitch enabled={recordInBackground} onChange={() => { setRecordInBackground(!recordInBackground); showNotification(recordInBackground ? 'Background recording off' : 'Background recording on'); }} />
          </div>
          <div>
            <label className="text-sm text-muted-foreground">Video quality</label>
            <select 
              value={videoQuality}
              onChange={(e) => { setVideoQuality(e.target.value); showNotification(`Video quality: ${e.target.value}`); }}
              className="w-full mt-1 p-2 bg-zinc-100 dark:bg-zinc-800 rounded-md border-0 text-sm"
            >
              <option value="720p">720p (30 fps)</option>
              <option value="1080p">1080p (30 fps)</option>
              <option value="1080p60">1080p (60 fps)</option>
              <option value="4k">4K (30 fps)</option>
            </select>
          </div>
          <div>
            <label className="text-sm text-muted-foreground">Audio quality</label>
            <select 
              value={audioQuality}
              onChange={(e) => { setAudioQuality(e.target.value); showNotification(`Audio quality: ${e.target.value} kbps`); }}
              className="w-full mt-1 p-2 bg-zinc-100 dark:bg-zinc-800 rounded-md border-0 text-sm"
            >
              <option value="96">96 kbps</option>
              <option value="128">128 kbps</option>
              <option value="192">192 kbps</option>
              <option value="320">320 kbps</option>
            </select>
          </div>
        </div>
      </SettingCard>
    </div>
  );
}

function AccessibilityDisplaySubSection({ onBack, showNotification }: SubSectionProps) {
  const [textSize, setTextSize] = useState(100);
  const [highContrast, setHighContrast] = useState(false);
  const [colorFilters, setColorFilters] = useState(false);
  const [filterType, setFilterType] = useState('grayscale');
  const [transparencyEffects, setTransparencyEffects] = useState(true);
  const [animationEffects, setAnimationEffects] = useState(true);

  return (
    <div className="space-y-4 animate-in slide-in-from-right-4 duration-300">
      <SubSectionHeader title="Display" subtitle="Text size, contrast, and visual effects" icon={Eye} onBack={onBack} />
      
      <SettingCard>
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="text-sm font-medium">Text size</div>
            <div className="text-xs text-muted-foreground">{textSize}%</div>
          </div>
        </div>
        <Slider value={textSize} onChange={(v) => { setTextSize(v); showNotification(`Text size: ${v}%`); }} min={100} max={225} />
        <p className="text-xs text-muted-foreground mt-2" style={{ fontSize: `${textSize / 100}em` }}>
          Sample text at current size
        </p>
      </SettingCard>

      <SettingCard>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Contrast className="w-5 h-5 text-yellow-500" />
            <div>
              <div className="text-sm font-medium">High contrast</div>
              <div className="text-xs text-muted-foreground">Increase color contrast</div>
            </div>
          </div>
          <ToggleSwitch enabled={highContrast} onChange={() => { setHighContrast(!highContrast); showNotification(highContrast ? 'High contrast off' : 'High contrast on'); }} color="orange" />
        </div>
      </SettingCard>

      <SettingCard>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Palette className="w-5 h-5 text-purple-500" />
            <div>
              <div className="text-sm font-medium">Color filters</div>
              <div className="text-xs text-muted-foreground">Apply color filters for color blindness</div>
            </div>
          </div>
          <ToggleSwitch enabled={colorFilters} onChange={() => { setColorFilters(!colorFilters); showNotification(colorFilters ? 'Color filters off' : 'Color filters on'); }} color="purple" />
        </div>
        {colorFilters && (
          <select 
            value={filterType}
            onChange={(e) => { setFilterType(e.target.value); showNotification(`Filter: ${e.target.value}`); }}
            className="w-full p-2 bg-zinc-100 dark:bg-zinc-800 rounded-md border-0 text-sm"
          >
            <option value="grayscale">Grayscale</option>
            <option value="inverted">Inverted</option>
            <option value="deuteranopia">Deuteranopia (Green-blind)</option>
            <option value="protanopia">Protanopia (Red-blind)</option>
            <option value="tritanopia">Tritanopia (Blue-blind)</option>
          </select>
        )}
      </SettingCard>

      <SettingCard>
        <h3 className="font-medium mb-4">Visual effects</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm">Transparency effects</div>
              <div className="text-xs text-muted-foreground">Show transparent backgrounds</div>
            </div>
            <ToggleSwitch enabled={transparencyEffects} onChange={() => { setTransparencyEffects(!transparencyEffects); showNotification(transparencyEffects ? 'Transparency off' : 'Transparency on'); }} />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm">Animation effects</div>
              <div className="text-xs text-muted-foreground">Show animations in Windows</div>
            </div>
            <ToggleSwitch enabled={animationEffects} onChange={() => { setAnimationEffects(!animationEffects); showNotification(animationEffects ? 'Animations off' : 'Animations on'); }} />
          </div>
        </div>
      </SettingCard>
    </div>
  );
}

function NarratorSubSection({ onBack, showNotification }: SubSectionProps) {
  const [narratorEnabled, setNarratorEnabled] = useState(false);
  const [voice, setVoice] = useState('Microsoft David');
  const [speed, setSpeed] = useState(50);
  const [pitch, setPitch] = useState(50);
  const [volume, setVolume] = useState(100);

  return (
    <div className="space-y-4 animate-in slide-in-from-right-4 duration-300">
      <SubSectionHeader title="Narrator" subtitle="Screen reader for visual accessibility" icon={Volume2} onBack={onBack} />
      
      <SettingCard>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Volume2 className="w-5 h-5 text-blue-500" />
            <div>
              <div className="text-sm font-medium">Narrator</div>
              <div className="text-xs text-muted-foreground">Screen reader that describes what's on screen</div>
            </div>
          </div>
          <ToggleSwitch enabled={narratorEnabled} onChange={() => { setNarratorEnabled(!narratorEnabled); showNotification(narratorEnabled ? 'Narrator off' : 'Narrator on'); }} />
        </div>
      </SettingCard>

      {narratorEnabled && (
        <>
          <SettingCard>
            <h3 className="font-medium mb-4">Voice settings</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-muted-foreground">Voice</label>
                <select 
                  value={voice}
                  onChange={(e) => { setVoice(e.target.value); showNotification(`Voice: ${e.target.value}`); }}
                  className="w-full mt-1 p-2 bg-zinc-100 dark:bg-zinc-800 rounded-md border-0 text-sm"
                >
                  <option>Microsoft David</option>
                  <option>Microsoft Zira</option>
                  <option>Microsoft Mark</option>
                </select>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Speed</span>
                  <span className="text-muted-foreground">{speed}%</span>
                </div>
                <Slider value={speed} onChange={(v) => setSpeed(v)} />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Pitch</span>
                  <span className="text-muted-foreground">{pitch}%</span>
                </div>
                <Slider value={pitch} onChange={(v) => setPitch(v)} />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Volume</span>
                  <span className="text-muted-foreground">{volume}%</span>
                </div>
                <Slider value={volume} onChange={(v) => setVolume(v)} />
              </div>
            </div>
          </SettingCard>

          <SettingCard>
            <button 
              onClick={() => {
                const utterance = new SpeechSynthesisUtterance('Hello, I am the Windows Narrator');
                speechSynthesis.speak(utterance);
                showNotification('Testing narrator...');
              }}
              className="w-full p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium flex items-center justify-center gap-2"
            >
              <Play className="w-4 h-4" />
              Test Narrator
            </button>
          </SettingCard>
        </>
      )}
    </div>
  );
}

function MagnifierSubSection({ onBack, showNotification }: SubSectionProps) {
  const [magnifierEnabled, setMagnifierEnabled] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(200);
  const [zoomIncrement, setZoomIncrement] = useState(100);
  const [followMouse, setFollowMouse] = useState(true);
  const [followKeyboard, setFollowKeyboard] = useState(true);

  return (
    <div className="space-y-4 animate-in slide-in-from-right-4 duration-300">
      <SubSectionHeader title="Magnifier" subtitle="Zoom in on screen content" icon={Search} onBack={onBack} />
      
      <SettingCard>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Search className="w-5 h-5 text-blue-500" />
            <div>
              <div className="text-sm font-medium">Magnifier</div>
              <div className="text-xs text-muted-foreground">Enlarge part of the screen</div>
            </div>
          </div>
          <ToggleSwitch enabled={magnifierEnabled} onChange={() => { setMagnifierEnabled(!magnifierEnabled); showNotification(magnifierEnabled ? 'Magnifier off' : 'Magnifier on'); }} />
        </div>
      </SettingCard>

      {magnifierEnabled && (
        <>
          <SettingCard>
            <h3 className="font-medium mb-4">Zoom settings</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Zoom level</span>
                  <span className="text-muted-foreground">{zoomLevel}%</span>
                </div>
                <Slider value={zoomLevel} onChange={(v) => { setZoomLevel(v); showNotification(`Zoom: ${v}%`); }} min={100} max={400} />
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Zoom increment</label>
                <select 
                  value={zoomIncrement}
                  onChange={(e) => { setZoomIncrement(Number(e.target.value)); showNotification(`Increment: ${e.target.value}%`); }}
                  className="w-full mt-1 p-2 bg-zinc-100 dark:bg-zinc-800 rounded-md border-0 text-sm"
                >
                  <option value={25}>25%</option>
                  <option value={50}>50%</option>
                  <option value={100}>100%</option>
                  <option value={200}>200%</option>
                </select>
              </div>
            </div>
          </SettingCard>

          <SettingCard>
            <h3 className="font-medium mb-4">Follow behavior</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Follow mouse pointer</span>
                <ToggleSwitch enabled={followMouse} onChange={() => setFollowMouse(!followMouse)} />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Follow keyboard focus</span>
                <ToggleSwitch enabled={followKeyboard} onChange={() => setFollowKeyboard(!followKeyboard)} />
              </div>
            </div>
          </SettingCard>
        </>
      )}
    </div>
  );
}

export function SettingsApp({ onUpdate }: SettingsAppProps = {}) {
  const { settings, wallpapers, setWallpaper, setAccentColor, setDarkMode: setSystemDarkMode, addCustomWallpaper, removeCustomWallpaper } = useSystemSettings();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [activeCategory, setActiveCategory] = useState('system');
  const [activeSubSection, setActiveSubSection] = useState<string | null>(null);
  const [notification, setNotification] = useState('');
  
  const [updateStatus, setUpdateStatus] = useState<'idle' | 'checking' | 'available' | 'downloading' | 'ready' | 'uptodate'>('idle');
  const [updateProgress, setUpdateProgress] = useState(0);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);
  const [availableUpdate, setAvailableUpdate] = useState<{ name: string; size: string; version: string } | null>(null);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(''), 2000);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        showNotification('Image must be less than 5MB');
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        const name = file.name.replace(/\.[^/.]+$/, '');
        addCustomWallpaper(name, imageUrl);
        showNotification(`Added "${name}" to wallpapers`);
      };
      reader.readAsDataURL(file);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const checkForUpdates = () => {
    setUpdateStatus('checking');
    setUpdateProgress(0);
    let progress = 0;
    const checkInterval = setInterval(() => {
      progress += Math.random() * 15 + 5;
      if (progress >= 100) {
        clearInterval(checkInterval);
        setUpdateProgress(100);
        const hasUpdate = Math.random() > 0.3;
        setTimeout(() => {
          if (hasUpdate) {
            setUpdateStatus('available');
            setAvailableUpdate({
              name: 'Windows 13 Cumulative Update',
              size: '847 MB',
              version: `KB${Math.floor(Math.random() * 9000000 + 1000000)}`
            });
          } else {
            setUpdateStatus('uptodate');
          }
          setLastChecked(new Date());
        }, 500);
      } else {
        setUpdateProgress(Math.min(progress, 99));
      }
    }, 200);
  };

  const downloadUpdate = () => {
    setUpdateStatus('downloading');
    setUpdateProgress(0);
    let progress = 0;
    const downloadInterval = setInterval(() => {
      progress += Math.random() * 8 + 2;
      if (progress >= 100) {
        clearInterval(downloadInterval);
        setUpdateProgress(100);
        setTimeout(() => {
          setUpdateStatus('ready');
          showNotification('Update ready to install');
        }, 500);
      } else {
        setUpdateProgress(Math.min(progress, 99));
      }
    }, 300);
  };

  const installUpdate = () => {
    if (onUpdate) {
      onUpdate();
    } else {
      showNotification('Update will be installed on next restart');
    }
  };

  const renderSubSection = () => {
    const subSectionProps = { onBack: () => setActiveSubSection(null), showNotification };
    
    switch (activeSubSection) {
      case 'display': return <DisplaySubSection {...subSectionProps} />;
      case 'sound': return <SoundSubSection {...subSectionProps} />;
      case 'notifications': return <NotificationsSubSection {...subSectionProps} />;
      case 'power': return <PowerSubSection {...subSectionProps} />;
      case 'storage': return <StorageSubSection {...subSectionProps} />;
      case 'bluetooth-devices': return <BluetoothDevicesSubSection {...subSectionProps} />;
      case 'mouse-keyboard': return <MouseKeyboardSubSection {...subSectionProps} />;
      case 'printers': return <PrintersSubSection {...subSectionProps} />;
      case 'wifi': return <WifiSubSection {...subSectionProps} />;
      case 'vpn': return <VpnSubSection {...subSectionProps} />;
      case 'installed-apps': return <InstalledAppsSubSection {...subSectionProps} />;
      case 'default-apps': return <DefaultAppsSubSection {...subSectionProps} />;
      case 'startup-apps': return <StartupAppsSubSection {...subSectionProps} />;
      case 'account-info': return <AccountInfoSubSection {...subSectionProps} onNavigate={(section) => setActiveSubSection(section)} />;
      case 'sign-in-options': return <SignInOptionsSubSection {...subSectionProps} />;
      case 'privacy-dashboard': return <PrivacyDashboardSubSection {...subSectionProps} />;
      case 'game-mode': return <GameModeSubSection {...subSectionProps} />;
      case 'accessibility-display': return <AccessibilityDisplaySubSection {...subSectionProps} />;
      case 'narrator': return <NarratorSubSection {...subSectionProps} />;
      case 'magnifier': return <MagnifierSubSection {...subSectionProps} />;
      default: return null;
    }
  };

  const renderContent = () => {
    if (activeSubSection) {
      return renderSubSection();
    }

    switch (activeCategory) {
      case 'system':
        return (
          <div className="space-y-4 animate-in slide-in-from-right-4 duration-300">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 bg-blue-600 rounded-md flex items-center justify-center text-white">
                <Monitor className="w-7 h-7" />
              </div>
              <div>
                <h1 className="text-xl font-semibold">System</h1>
                <p className="text-sm text-muted-foreground">Display, sound, notifications, power</p>
              </div>
            </div>

            <div className="space-y-2">
              <SettingRow icon={Monitor} title="Display" desc="Brightness, night light, scale and resolution" onClick={() => setActiveSubSection('display')} />
              <SettingRow icon={Volume2} title="Sound" desc="Volume, output, input, app volume" onClick={() => setActiveSubSection('sound')} />
              <SettingRow icon={Bell} title="Notifications" desc="Alerts from apps and system" onClick={() => setActiveSubSection('notifications')} />
              <SettingRow icon={Battery} title="Power & battery" desc="Sleep, battery usage, battery saver" onClick={() => setActiveSubSection('power')} />
              <SettingRow icon={HardDrive} title="Storage" desc="Storage space, drives, cleanup" onClick={() => setActiveSubSection('storage')} />
            </div>
          </div>
        );

      case 'bluetooth':
        return (
          <div className="space-y-4 animate-in slide-in-from-right-4 duration-300">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 bg-cyan-600 rounded-md flex items-center justify-center text-white">
                <Bluetooth className="w-7 h-7" />
              </div>
              <div>
                <h1 className="text-xl font-semibold">Bluetooth & devices</h1>
                <p className="text-sm text-muted-foreground">Bluetooth, printers, mouse, keyboard</p>
              </div>
            </div>

            <div className="space-y-2">
              <SettingRow icon={Bluetooth} title="Bluetooth" desc="Paired devices, discover new devices" onClick={() => setActiveSubSection('bluetooth-devices')} />
              <SettingRow icon={MousePointer} title="Mouse & keyboard" desc="Pointer speed, scroll, keyboard settings" onClick={() => setActiveSubSection('mouse-keyboard')} />
              <SettingRow icon={Printer} title="Printers & scanners" desc="Add, remove, and manage printers" onClick={() => setActiveSubSection('printers')} />
            </div>
          </div>
        );

      case 'network':
        return (
          <div className="space-y-4 animate-in slide-in-from-right-4 duration-300">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 bg-green-600 rounded-md flex items-center justify-center text-white">
                <Globe className="w-7 h-7" />
              </div>
              <div>
                <h1 className="text-xl font-semibold">Network & internet</h1>
                <p className="text-sm text-muted-foreground">Wi-Fi, airplane mode, VPN</p>
              </div>
            </div>

            <div className="space-y-2">
              <SettingRow icon={Wifi} title="Wi-Fi" desc="Connect to wireless networks" onClick={() => setActiveSubSection('wifi')} />
              <SettingRow icon={Shield} title="VPN" desc="Virtual private network connections" onClick={() => setActiveSubSection('vpn')} />
              <SettingRow icon={Plane} title="Airplane mode" desc="Turn off all wireless communication" onClick={() => showNotification('Airplane mode toggled')} />
            </div>
          </div>
        );

      case 'personalization':
        const customWallpapers = wallpapers.filter(w => w.type === 'custom');
        const defaultWallpapers = wallpapers.filter(w => w.type !== 'custom');
        
        return (
          <div className="space-y-4 animate-in slide-in-from-right-4 duration-300">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 bg-purple-600 rounded-md flex items-center justify-center text-white">
                <Palette className="w-7 h-7" />
              </div>
              <div>
                <h1 className="text-xl font-semibold">Personalization</h1>
                <p className="text-sm text-muted-foreground">Background, colors, themes</p>
              </div>
            </div>

            <SettingCard>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-medium">Current Background</h3>
                  <p className="text-xs text-muted-foreground">{settings.wallpaper.name}</p>
                </div>
                <div 
                  className="w-24 h-14 rounded-lg border border-zinc-300 dark:border-zinc-600 overflow-hidden"
                  style={{
                    background: settings.wallpaper.type === 'custom' 
                      ? `url(${settings.wallpaper.value}) center/cover`
                      : settings.wallpaper.value
                  }}
                />
              </div>
            </SettingCard>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">Choose your background</h3>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  <Upload className="w-4 h-4" />
                  Upload
                </button>
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
              </div>

              {customWallpapers.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Your uploads</p>
                  <div className="grid grid-cols-4 gap-3">
                    {customWallpapers.map(wp => (
                      <div 
                        key={wp.id}
                        className={`relative aspect-video rounded-lg cursor-pointer overflow-hidden group ${
                          settings.wallpaper.id === wp.id ? 'ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-zinc-900' : 'hover:ring-2 hover:ring-zinc-400'
                        }`}
                        onClick={() => { setWallpaper(wp); showNotification(`Background: "${wp.name}"`); }}
                      >
                        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${wp.value})` }} />
                        {settings.wallpaper.id === wp.id && (
                          <div className="absolute top-1 right-1 bg-blue-600 rounded-full p-0.5">
                            <Check className="w-3 h-3 text-white" />
                          </div>
                        )}
                        <button
                          onClick={(e) => { e.stopPropagation(); removeCustomWallpaper(wp.id); showNotification(`Removed "${wp.name}"`); }}
                          className="absolute bottom-1 right-1 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Preset backgrounds</p>
                <div className="grid grid-cols-4 gap-3">
                  {defaultWallpapers.map(wp => (
                    <div 
                      key={wp.id}
                      className={`relative aspect-video rounded-lg cursor-pointer overflow-hidden ${
                        settings.wallpaper.id === wp.id ? 'ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-zinc-900' : 'hover:ring-2 hover:ring-zinc-400'
                      }`}
                      style={{ background: wp.value }}
                      onClick={() => { setWallpaper(wp); showNotification(`Background: "${wp.name}"`); }}
                    >
                      {settings.wallpaper.id === wp.id && (
                        <div className="absolute top-1 right-1 bg-blue-600 rounded-full p-0.5">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <SettingCard>
              <h3 className="font-medium mb-4">Accent Color</h3>
              <div className="flex flex-wrap gap-2">
                {['#3b82f6', '#ef4444', '#22c55e', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4', '#f97316'].map(color => (
                  <button
                    key={color}
                    onClick={() => { setAccentColor(color); showNotification('Accent color changed'); }}
                    className={`w-8 h-8 rounded-full ${settings.accentColor === color ? 'ring-2 ring-offset-2 ring-blue-500 dark:ring-offset-zinc-900' : ''}`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </SettingCard>

            <SettingCard>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Dark Mode</h3>
                  <p className="text-xs text-muted-foreground">Use dark colors for windows and menus</p>
                </div>
                <ToggleSwitch 
                  enabled={settings.isDarkMode} 
                  onChange={() => { setSystemDarkMode(!settings.isDarkMode); showNotification(settings.isDarkMode ? 'Light mode' : 'Dark mode'); }}
                />
              </div>
            </SettingCard>
          </div>
        );

      case 'apps':
        return (
          <div className="space-y-4 animate-in slide-in-from-right-4 duration-300">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 bg-indigo-600 rounded-md flex items-center justify-center text-white">
                <AppWindow className="w-7 h-7" />
              </div>
              <div>
                <h1 className="text-xl font-semibold">Apps</h1>
                <p className="text-sm text-muted-foreground">Installed apps, default apps, startup</p>
              </div>
            </div>

            <div className="space-y-2">
              <SettingRow icon={AppWindow} title="Installed apps" desc="Manage, uninstall, repair applications" onClick={() => setActiveSubSection('installed-apps')} />
              <SettingRow icon={AppWindow} title="Default apps" desc="Set default browser, email, player" onClick={() => setActiveSubSection('default-apps')} />
              <SettingRow icon={Zap} title="Startup" desc="Manage startup applications" onClick={() => setActiveSubSection('startup-apps')} />
            </div>
          </div>
        );

      case 'accounts':
        return (
          <div className="space-y-4 animate-in slide-in-from-right-4 duration-300">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 bg-pink-600 rounded-md flex items-center justify-center text-white">
                <User className="w-7 h-7" />
              </div>
              <div>
                <h1 className="text-xl font-semibold">Accounts</h1>
                <p className="text-sm text-muted-foreground">Your accounts, email, sync, work</p>
              </div>
            </div>

            <SettingCard className="mb-4">
              <div className="flex items-center gap-4">
                {settings.profilePicture ? (
                  <img 
                    src={settings.profilePicture} 
                    alt="Profile" 
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold">
                    {settings.userInitials}
                  </div>
                )}
                <div>
                  <div className="font-medium">{settings.userName}</div>
                  <div className="text-xs text-muted-foreground">Local Account</div>
                </div>
              </div>
            </SettingCard>

            <div className="space-y-2">
              <SettingRow icon={User} title="Your info" desc="Name, picture, account settings" onClick={() => setActiveSubSection('account-info')} />
              <SettingRow icon={Lock} title="Sign-in options" desc="PIN, password, face recognition" onClick={() => setActiveSubSection('sign-in-options')} />
              <SettingRow icon={Mail} title="Email & accounts" desc="Manage email and other accounts" onClick={() => showNotification('Email accounts feature available in full Windows')} />
              <SettingRow icon={Cloud} title="Sync settings" desc="Sync your settings across devices" onClick={() => showNotification('Sync settings feature available in full Windows')} />
            </div>
          </div>
        );

      case 'security':
        return (
          <div className="space-y-4 animate-in slide-in-from-right-4 duration-300">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 bg-green-600 rounded-md flex items-center justify-center text-white">
                <Shield className="w-7 h-7" />
              </div>
              <div>
                <h1 className="text-xl font-semibold">Privacy & Security</h1>
                <p className="text-sm text-muted-foreground">Windows Hello, face recognition, privacy</p>
              </div>
            </div>

            <div className="space-y-2">
              <SettingRow icon={Lock} title="Sign-in options" desc="PIN, password, face recognition" onClick={() => setActiveSubSection('sign-in-options')} />
              <SettingRow icon={Shield} title="Privacy dashboard" desc="Manage your privacy settings" onClick={() => setActiveSubSection('privacy-dashboard')} />
              <SettingRow icon={ScanFace} title="Windows Hello" desc="Face recognition" onClick={() => setActiveSubSection('sign-in-options')} />
            </div>
          </div>
        );

      case 'gaming':
        return (
          <div className="space-y-4 animate-in slide-in-from-right-4 duration-300">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 bg-red-600 rounded-md flex items-center justify-center text-white">
                <Gamepad2 className="w-7 h-7" />
              </div>
              <div>
                <h1 className="text-xl font-semibold">Gaming</h1>
                <p className="text-sm text-muted-foreground">Game Mode, captures, Xbox Game Bar</p>
              </div>
            </div>

            <div className="space-y-2">
              <SettingRow icon={Zap} title="Game Mode" desc="Optimize your PC for gaming" onClick={() => setActiveSubSection('game-mode')} />
              <SettingRow icon={Joystick} title="Xbox Game Bar" desc="Record and share gaming clips" onClick={() => setActiveSubSection('game-mode')} />
              <SettingRow icon={Gamepad2} title="Game Controller" desc="Configure game controllers" onClick={() => showNotification('Game Controller settings available in full Windows')} />
            </div>
          </div>
        );

      case 'accessibility':
        return (
          <div className="space-y-4 animate-in slide-in-from-right-4 duration-300">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 bg-teal-600 rounded-md flex items-center justify-center text-white">
                <Accessibility className="w-7 h-7" />
              </div>
              <div>
                <h1 className="text-xl font-semibold">Accessibility</h1>
                <p className="text-sm text-muted-foreground">Text size, visual effects, narrator</p>
              </div>
            </div>

            <div className="space-y-2">
              <SettingRow icon={Eye} title="Display" desc="Text size, color filters, contrast" onClick={() => setActiveSubSection('accessibility-display')} />
              <SettingRow icon={Volume2} title="Narrator" desc="Screen reader for accessibility" onClick={() => setActiveSubSection('narrator')} />
              <SettingRow icon={Search} title="Magnifier" desc="Zoom in on screen content" onClick={() => setActiveSubSection('magnifier')} />
            </div>
          </div>
        );

      case 'update':
        return (
          <div className="space-y-4 animate-in slide-in-from-right-4 duration-300">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 bg-blue-500 rounded-md flex items-center justify-center text-white">
                <RefreshCcw className="w-7 h-7" />
              </div>
              <div>
                <h1 className="text-xl font-semibold">Windows Update</h1>
                <p className="text-sm text-muted-foreground">
                  {updateStatus === 'uptodate' && "You're up to date"}
                  {updateStatus === 'idle' && "Check for the latest updates"}
                  {updateStatus === 'checking' && "Checking for updates..."}
                  {updateStatus === 'available' && "Updates are available"}
                  {updateStatus === 'downloading' && "Downloading updates..."}
                  {updateStatus === 'ready' && "Ready to install"}
                </p>
              </div>
            </div>

            {updateStatus === 'idle' && (
              <SettingCard>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center">
                    <RefreshCcw className="w-6 h-6 text-blue-500" />
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold">Check for updates</div>
                    <div className="text-sm text-muted-foreground">
                      {lastChecked ? `Last checked: ${lastChecked.toLocaleTimeString()}` : "Click to check for new updates"}
                    </div>
                  </div>
                  <button onClick={checkForUpdates} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium">
                    Check for updates
                  </button>
                </div>
              </SettingCard>
            )}

            {(updateStatus === 'checking' || updateStatus === 'downloading') && (
              <SettingCard>
                <div className="flex items-center gap-4 mb-4">
                  <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
                  <div>
                    <div className="font-semibold">{updateStatus === 'checking' ? 'Checking for updates...' : 'Downloading updates...'}</div>
                    <div className="text-sm text-muted-foreground">{Math.round(updateProgress)}%</div>
                  </div>
                </div>
                <div className="w-full h-2 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 transition-all" style={{ width: `${updateProgress}%` }} />
                </div>
              </SettingCard>
            )}

            {updateStatus === 'uptodate' && (
              <SettingCard>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6 text-green-500" />
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-green-600">You're up to date</div>
                    <div className="text-sm text-muted-foreground">Last checked: {lastChecked?.toLocaleTimeString()}</div>
                  </div>
                  <button onClick={checkForUpdates} className="px-4 py-2 bg-zinc-200 dark:bg-zinc-700 rounded-md text-sm font-medium">
                    Check again
                  </button>
                </div>
              </SettingCard>
            )}

            {updateStatus === 'available' && availableUpdate && (
              <SettingCard>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-orange-500/20 rounded-full flex items-center justify-center">
                    <Download className="w-6 h-6 text-orange-500" />
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold">{availableUpdate.name}</div>
                    <div className="text-sm text-muted-foreground">{availableUpdate.version} • {availableUpdate.size}</div>
                  </div>
                  <button onClick={downloadUpdate} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium">
                    Download & install
                  </button>
                </div>
              </SettingCard>
            )}

            {updateStatus === 'ready' && (
              <SettingCard>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6 text-green-500" />
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold">Update ready to install</div>
                    <div className="text-sm text-muted-foreground">Restart your device to complete</div>
                  </div>
                  <button onClick={installUpdate} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium">
                    Restart now
                  </button>
                </div>
              </SettingCard>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="h-full w-full flex bg-zinc-50 dark:bg-[#202020] text-foreground overflow-hidden">
      {notification && (
        <div className="fixed top-4 right-4 z-50 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg animate-in slide-in-from-top-2 duration-200">
          {notification}
        </div>
      )}

      <div className="w-72 bg-white/50 dark:bg-[#1a1a1a]/50 backdrop-blur-md border-r border-zinc-200 dark:border-white/5 overflow-y-auto">
        <div className="p-4">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Find a setting"
              className="w-full pl-10 pr-4 py-2 bg-zinc-100 dark:bg-zinc-800 rounded-lg text-sm outline-none border-0 focus:ring-2 ring-blue-500"
            />
          </div>

          <nav className="space-y-1">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => { setActiveCategory(cat.id); setActiveSubSection(null); }}
                className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors ${
                  activeCategory === cat.id && !activeSubSection
                    ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400' 
                    : 'hover:bg-zinc-100 dark:hover:bg-zinc-800'
                }`}
              >
                <cat.icon className={`w-5 h-5 ${activeCategory === cat.id && !activeSubSection ? 'text-blue-500' : 'text-muted-foreground'}`} />
                <div>
                  <div className="text-sm font-medium">{cat.name}</div>
                  <div className="text-xs text-muted-foreground truncate max-w-[180px]">{cat.sub}</div>
                </div>
              </button>
            ))}
          </nav>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {renderContent()}
      </div>
    </div>
  );
}
