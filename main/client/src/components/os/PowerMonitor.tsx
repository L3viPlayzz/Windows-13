import { 
  Zap, Cpu, HardDrive, Wifi, Signal, Monitor, MemoryStick, 
  Thermometer, Fan, Activity, Gauge, CircuitBoard, Server,
  Download, Upload, Clock, Layers, Smartphone, ChevronRight,
  BarChart3, TrendingUp, Disc, Database, Microchip, Timer,
  Battery, BatteryCharging, Flame, Sparkles, Bolt, Rocket,
  Globe, Router, Cable, MonitorSmartphone, Crown, Diamond
} from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

interface BatteryManager {
  charging: boolean;
  chargingTime: number;
  dischargingTime: number;
  level: number;
  addEventListener: (type: string, listener: () => void) => void;
  removeEventListener: (type: string, listener: () => void) => void;
}

interface NetworkInformation {
  effectiveType: string;
  downlink: number;
  rtt: number;
  saveData: boolean;
  type?: string;
}

interface ProcessInfo {
  id: number;
  name: string;
  cpu: number;
  memory: number;
  status: 'running' | 'idle' | 'suspended';
  threads: number;
  priority: 'high' | 'normal' | 'low';
}

interface DiskInfo {
  name: string;
  total: number;
  used: number;
  type: 'NVMe Gen5' | 'NVMe Gen4' | 'SSD';
  readSpeed: number;
  writeSpeed: number;
  temperature: number;
}

interface GpuInfo {
  name: string;
  usage: number;
  temperature: number;
  vramUsed: number;
  vramTotal: number;
  fanSpeed: number;
  clockSpeed: number;
  powerDraw: number;
  shaderUnits: number;
  rayTracingCores: number;
}

interface CpuCoreData {
  usage: number;
  temperature: number;
  clockSpeed: number;
  voltage: number;
  power: number;
}

export function PowerMonitor() {
  const [battery, setBattery] = useState<number>(71);
  const [isCharging, setIsCharging] = useState(false);
  const [chargingTime, setChargingTime] = useState<number | null>(null);
  const [dischargingTime, setDischargingTime] = useState<number | null>(null);
  const [batteryHealth] = useState(93);
  const [batteryCycles] = useState(107);
  const [batteryCapacity] = useState(3685);
  const [batteryWattage] = useState(42);
  
  const [cpuCores] = useState(4);
  const [cpuThreads] = useState(4);
  const [deviceMemory] = useState(8);
  const [networkInfo, setNetworkInfo] = useState<NetworkInformation | null>(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [platform] = useState('ChromeOS');
  const [screenInfo, setScreenInfo] = useState({ width: 1920, height: 1080, colorDepth: 24, pixelRatio: 1, refreshRate: 60 });
  const [ramUsed, setRamUsed] = useState(3.2);
  const [chromeOsVersion] = useState('142.0.7444.147');
  const [activeTab, setActiveTab] = useState('overview');
  const [uptime, setUptime] = useState(0);
  
  const [cpuUsageHistory, setCpuUsageHistory] = useState<number[]>(Array(60).fill(0).map(() => Math.random() * 25 + 8));
  const [ramUsageHistory, setRamUsageHistory] = useState<number[]>(Array(60).fill(0).map(() => Math.random() * 15 + 30));
  const [gpuUsageHistory, setGpuUsageHistory] = useState<number[]>(Array(60).fill(0).map(() => Math.random() * 20 + 5));
  const [networkDownHistory, setNetworkDownHistory] = useState<number[]>(Array(60).fill(0).map(() => Math.random() * 200 + 300));
  const [networkUpHistory, setNetworkUpHistory] = useState<number[]>(Array(60).fill(0).map(() => Math.random() * 100 + 200));
  
  const [cpuTemp, setCpuTemp] = useState(38);
  const [cpuCoreData, setCpuCoreData] = useState<CpuCoreData[]>([]);
  const [totalCpuUsage, setTotalCpuUsage] = useState(18);
  const [cpuPackagePower, setCpuPackagePower] = useState(45);
  
  const [gpuInfo, setGpuInfo] = useState<GpuInfo>({
    name: 'Intel UHD Graphics',
    usage: 12,
    temperature: 35,
    vramUsed: 0.5,
    vramTotal: 4,
    fanSpeed: 0,
    clockSpeed: 750,
    powerDraw: 8,
    shaderUnits: 24,
    rayTracingCores: 0
  });
  
  const [disks, setDisks] = useState<DiskInfo[]>([
    { name: 'ChromeOS (eMMC)', total: 64, used: 22.4, type: 'SSD', readSpeed: 280, writeSpeed: 150, temperature: 38 }
  ]);
  
  const [processes, setProcesses] = useState<ProcessInfo[]>([
    { id: 1, name: 'ChromeOS System', cpu: 0.8, memory: 1.2, status: 'running', threads: 256, priority: 'high' },
    { id: 2, name: 'Windows 13 Simulator', cpu: 8.5, memory: 4.8, status: 'running', threads: 128, priority: 'high' },
    { id: 3, name: 'Chrome Browser', cpu: 5.2, memory: 8.4, status: 'running', threads: 312, priority: 'normal' },
    { id: 4, name: 'Linux Container', cpu: 2.1, memory: 2.4, status: 'running', threads: 64, priority: 'normal' },
    { id: 5, name: 'Android Runtime', cpu: 1.8, memory: 3.2, status: 'running', threads: 96, priority: 'normal' },
    { id: 6, name: 'GPU Compositor', cpu: 3.2, memory: 1.8, status: 'running', threads: 48, priority: 'high' },
    { id: 7, name: 'Wayland Server', cpu: 0.5, memory: 0.8, status: 'running', threads: 24, priority: 'high' },
    { id: 8, name: 'Audio Server', cpu: 0.3, memory: 0.4, status: 'running', threads: 16, priority: 'normal' },
    { id: 9, name: 'Network Manager', cpu: 0.2, memory: 0.3, status: 'running', threads: 12, priority: 'normal' },
    { id: 10, name: 'Power Manager', cpu: 0.1, memory: 0.2, status: 'running', threads: 8, priority: 'low' },
    { id: 11, name: 'Security Daemon', cpu: 0.4, memory: 0.6, status: 'running', threads: 32, priority: 'high' },
    { id: 12, name: 'Update Service', cpu: 0.1, memory: 0.3, status: 'idle', threads: 8, priority: 'low' }
  ]);

  const [downloadSpeed, setDownloadSpeed] = useState(450);
  const [uploadSpeed, setUploadSpeed] = useState(380);
  const [totalDownloaded, setTotalDownloaded] = useState(0);
  const [totalUploaded, setTotalUploaded] = useState(0);
  const [pingLatency, setPingLatency] = useState(3);

  const [fps, setFps] = useState(360);
  const [avgFps, setAvgFps] = useState(358);
  const [minFps, setMinFps] = useState(342);
  const [maxFps, setMaxFps] = useState(360);
  const [frameTime, setFrameTime] = useState(2.78);
  const [frameLimit] = useState(360);
  const [fpsHistory, setFpsHistory] = useState<number[]>(Array(60).fill(0).map(() => Math.random() * 18 + 342));
  const frameRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(performance.now());
  const fpsHistoryRef = useRef<number[]>([]);
  const fpsUpdateRef = useRef<number>(0);

  useEffect(() => {
    setScreenInfo({
      width: window.screen.width || 3840,
      height: window.screen.height || 2160,
      colorDepth: window.screen.colorDepth || 30,
      pixelRatio: window.devicePixelRatio || 2,
      refreshRate: 240
    });

    setCpuCoreData(Array(cpuCores).fill(0).map((_, i) => ({
      usage: Math.random() * 30 + 5,
      temperature: Math.round(Math.random() * 8 + 32),
      clockSpeed: Math.random() * 800 + 4800,
      voltage: Math.random() * 0.2 + 1.1,
      power: Math.random() * 8 + 2
    })));

    setNetworkInfo({
      effectiveType: '5g',
      downlink: 1000,
      rtt: 3,
      saveData: false,
      type: 'wifi'
    });

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    const getBattery = async () => {
      try {
        const nav = navigator as any;
        if (nav.getBattery) {
          const batteryManager = await nav.getBattery();
          const updateBatteryInfo = () => {
            setBattery(Math.round(batteryManager.level * 100));
            setIsCharging(batteryManager.charging);
            if (batteryManager.chargingTime && batteryManager.chargingTime !== Infinity) {
              setChargingTime(Math.round(batteryManager.chargingTime / 60));
            }
            if (batteryManager.dischargingTime && batteryManager.dischargingTime !== Infinity) {
              setDischargingTime(Math.round(batteryManager.dischargingTime / 60));
            }
          };
          updateBatteryInfo();
          batteryManager.addEventListener('levelchange', updateBatteryInfo);
          batteryManager.addEventListener('chargingchange', updateBatteryInfo);
          batteryManager.addEventListener('chargingtimechange', updateBatteryInfo);
          batteryManager.addEventListener('dischargingtimechange', updateBatteryInfo);
        }
      } catch (e) {
        console.log('Battery API not available');
      }
    };
    getBattery();

    const measureFps = () => {
      const now = performance.now();
      const delta = now - lastTimeRef.current;
      lastTimeRef.current = now;
      
      const currentFps = Math.min(360, Math.round(1000 / Math.max(delta, 2.78)));
      fpsHistoryRef.current.push(currentFps);
      if (fpsHistoryRef.current.length > 30) fpsHistoryRef.current.shift();
      
      fpsUpdateRef.current += delta;
      if (fpsUpdateRef.current >= 5000) {
        const history = fpsHistoryRef.current;
        const avg = Math.round(history.reduce((a, b) => a + b, 0) / history.length);
        setFps(Math.min(360, currentFps));
        setAvgFps(Math.min(360, avg));
        setMinFps(Math.min(...history));
        setMaxFps(Math.max(...history));
        setFrameTime(1000 / avg);
        setFpsHistory(prev => [...prev.slice(1), avg]);
        fpsUpdateRef.current = 0;
      }
      
      frameRef.current = requestAnimationFrame(measureFps);
    };
    frameRef.current = requestAnimationFrame(measureFps);

    const interval = setInterval(() => {
      setUptime(prev => prev + 1);
      
      const newCpuUsage = Math.random() * 12 + 12;
      setTotalCpuUsage(prev => prev * 0.7 + newCpuUsage * 0.3);
      setCpuUsageHistory(prev => [...prev.slice(1), newCpuUsage]);
      
      setCpuTemp(prev => {
        const change = (Math.random() - 0.5) * 2;
        return Math.round(Math.max(32, Math.min(55, prev + change)));
      });
      
      setCpuPackagePower(prev => {
        const change = (Math.random() - 0.5) * 5;
        return Math.max(25, Math.min(65, prev + change));
      });
      
      setCpuCoreData(prev => prev.map(core => ({
        usage: Math.max(3, Math.min(85, core.usage + (Math.random() - 0.5) * 15)),
        temperature: Math.round(Math.max(30, Math.min(60, core.temperature + (Math.random() - 0.5) * 2))),
        clockSpeed: Math.max(3200, Math.min(5800, core.clockSpeed + (Math.random() - 0.5) * 300)),
        voltage: Math.max(0.9, Math.min(1.4, core.voltage + (Math.random() - 0.5) * 0.05)),
        power: Math.max(1, Math.min(15, core.power + (Math.random() - 0.5) * 2))
      })));
      
      setRamUsed(prev => {
        const change = (Math.random() - 0.5) * 0.3;
        return Math.max(2.0, Math.min(6.5, prev + change));
      });
      setRamUsageHistory(prev => [...prev.slice(1), (ramUsed / deviceMemory) * 100]);
      
      setGpuInfo(prev => ({
        ...prev,
        usage: Math.max(5, Math.min(60, prev.usage + (Math.random() - 0.5) * 8)),
        temperature: Math.round(Math.max(28, Math.min(55, prev.temperature + (Math.random() - 0.5) * 2))),
        vramUsed: Math.max(1.5, Math.min(prev.vramTotal * 0.5, prev.vramUsed + (Math.random() - 0.5) * 0.5)),
        fanSpeed: Math.max(15, Math.min(60, prev.fanSpeed + (Math.random() - 0.5) * 3)),
        clockSpeed: Math.max(2400, Math.min(3200, prev.clockSpeed + (Math.random() - 0.5) * 100)),
        powerDraw: Math.max(20, Math.min(75, prev.powerDraw + (Math.random() - 0.5) * 8))
      }));
      setGpuUsageHistory(prev => [...prev.slice(1), gpuInfo.usage]);
      
      const newDownSpeed = Math.random() * 200 + 350;
      const newUpSpeed = Math.random() * 150 + 280;
      setDownloadSpeed(newDownSpeed);
      setUploadSpeed(newUpSpeed);
      setPingLatency(Math.round(Math.random() * 3 + 1));
      setNetworkDownHistory(prev => [...prev.slice(1), newDownSpeed]);
      setNetworkUpHistory(prev => [...prev.slice(1), newUpSpeed]);
      setTotalDownloaded(prev => prev + newDownSpeed * 0.125);
      setTotalUploaded(prev => prev + newUpSpeed * 0.125);
      
      
      setDisks(prev => prev.map(disk => ({
        ...disk,
        temperature: Math.round(Math.max(30, Math.min(50, disk.temperature + (Math.random() - 0.5) * 2)))
      })));
      
      setProcesses(prev => prev.map(p => ({
        ...p,
        cpu: Math.max(0.1, Math.min(15, p.cpu + (Math.random() - 0.5) * 1.5)),
        memory: Math.max(0.1, Math.min(12, p.memory + (Math.random() - 0.5) * 0.3))
      })).sort((a, b) => b.cpu - a.cpu));
      
    }, 1000);
    
    return () => {
      clearInterval(interval);
      cancelAnimationFrame(frameRef.current);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [deviceMemory, ramUsed, gpuInfo.usage, isCharging, cpuCores]);

  const formatUptime = (seconds: number) => {
    const days = Math.floor(seconds / 86400);
    const hrs = Math.floor((seconds % 86400) / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (days > 0) return `${days}d ${hrs}h ${mins}m`;
    return `${hrs}h ${mins}m ${secs}s`;
  };

  const formatBytes = (gb: number) => {
    if (gb < 1) return `${(gb * 1024).toFixed(0)} MB`;
    if (gb >= 1024) return `${(gb / 1024).toFixed(2)} TB`;
    return `${gb.toFixed(1)} GB`;
  };

  const formatSpeed = (mbps: number) => {
    if (mbps >= 1000) return `${(mbps / 1000).toFixed(2)} GB/s`;
    return `${mbps.toFixed(0)} MB/s`;
  };

  const getTempColor = (temp: number) => {
    if (temp < 45) return 'text-cyan-400';
    if (temp < 60) return 'text-green-400';
    if (temp < 75) return 'text-yellow-400';
    if (temp < 85) return 'text-orange-400';
    return 'text-red-400';
  };

  const getTempBgColor = (temp: number) => {
    if (temp < 45) return 'bg-cyan-500';
    if (temp < 60) return 'bg-green-500';
    if (temp < 75) return 'bg-yellow-500';
    if (temp < 85) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const getUsageColor = (usage: number) => {
    if (usage < 40) return 'bg-cyan-500';
    if (usage < 60) return 'bg-green-500';
    if (usage < 80) return 'bg-yellow-500';
    if (usage < 90) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const getUsageGradient = (usage: number) => {
    if (usage < 40) return 'from-cyan-500 to-blue-500';
    if (usage < 60) return 'from-green-500 to-emerald-500';
    if (usage < 80) return 'from-yellow-500 to-amber-500';
    return 'from-orange-500 to-red-500';
  };

  const MiniGraph = ({ data, color, height = 40, gradient = false }: { data: number[], color: string, height?: number, gradient?: boolean }) => {
    const max = Math.max(...data, 1);
    return (
      <div className="flex items-end gap-[2px]" style={{ height }}>
        {data.slice(-30).map((value, i) => (
          <div
            key={i}
            className={`flex-1 ${gradient ? `bg-gradient-to-t ${color}` : color} rounded-t-sm transition-all duration-300`}
            style={{ 
              height: `${Math.max(3, (value / max) * 100)}%`,
              opacity: 0.4 + (i / 30) * 0.6
            }}
          />
        ))}
      </div>
    );
  };

  const CircularProgress = ({ value, max, size = 80, strokeWidth = 8, color, label, sublabel, icon: Icon }: {
    value: number, max: number, size?: number, strokeWidth?: number, color: string, label: string, sublabel?: string, icon?: any
  }) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (value / max) * circumference;

    return (
      <div className="relative flex flex-col items-center">
        <svg width={size} height={size} className="-rotate-90">
          <defs>
            <linearGradient id={`gradient-${label}`} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={color} stopOpacity="0.3" />
              <stop offset="100%" stopColor={color} />
            </linearGradient>
          </defs>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            strokeWidth={strokeWidth}
            fill="none"
            className="stroke-gray-800"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            strokeWidth={strokeWidth}
            fill="none"
            stroke={`url(#gradient-${label})`}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-700 drop-shadow-lg"
            style={{ filter: `drop-shadow(0 0 6px ${color}40)` }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {Icon && <Icon className="w-4 h-4 mb-1 opacity-50" style={{ color }} />}
          <span className="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">{Math.round(value)}{max === 100 ? '%' : ''}</span>
        </div>
        <span className="text-xs text-gray-400 mt-2 font-medium">{label}</span>
        {sublabel && <span className="text-xs text-gray-500">{sublabel}</span>}
      </div>
    );
  };

  const StatCard = ({ icon: Icon, label, value, sublabel, color, trend }: {
    icon: any, label: string, value: string, sublabel?: string, color: string, trend?: 'up' | 'down' | 'stable'
  }) => (
    <div className={`bg-gradient-to-br ${color} border border-white/10 rounded-2xl p-4 backdrop-blur-xl relative overflow-hidden group hover:scale-[1.02] transition-all duration-300`}>
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="absolute -right-4 -bottom-4 opacity-5">
        <Icon className="w-24 h-24" />
      </div>
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-2">
          <div className="p-2 rounded-lg bg-white/10 backdrop-blur">
            <Icon className="w-4 h-4 text-white" />
          </div>
          <span className="text-xs font-medium text-gray-300 uppercase tracking-wider">{label}</span>
        </div>
        <div className="text-2xl font-bold text-white mb-1">{value}</div>
        {sublabel && <div className="text-xs text-gray-400">{sublabel}</div>}
      </div>
    </div>
  );

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Activity },
    { id: 'cpu', label: 'CPU', icon: Cpu },
    { id: 'gpu', label: 'GPU', icon: CircuitBoard },
    { id: 'memory', label: 'Memory', icon: MemoryStick },
    { id: 'storage', label: 'Storage', icon: HardDrive },
    { id: 'network', label: 'Network', icon: Globe },
    { id: 'battery', label: 'Battery', icon: Battery },
    { id: 'performance', label: 'Performance', icon: Rocket },
    { id: 'processes', label: 'Processes', icon: Layers }
  ];

  return (
    <div className="h-full w-full bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 overflow-hidden flex relative">
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl" />
      </div>
      
      <div className="w-56 bg-black/40 backdrop-blur-xl border-r border-white/10 p-3 flex flex-col relative z-10">
        <div className="flex items-center gap-3 p-4 mb-4 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-2xl border border-white/10">
          <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
            <Activity className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="font-bold text-white text-sm">System Monitor</span>
            <div className="text-xs text-gray-400">Ultra Edition</div>
          </div>
        </div>
        
        <div className="space-y-1">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all duration-300 ${
                activeTab === tab.id 
                  ? 'bg-gradient-to-r from-blue-600/30 to-purple-600/30 text-white border border-blue-500/30 shadow-lg shadow-blue-500/10' 
                  : 'text-gray-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? 'text-blue-400' : ''}`} />
              {tab.label}
            </button>
          ))}
        </div>
        
        <div className="mt-auto space-y-3">
          <div className="p-4 bg-gradient-to-br from-emerald-600/20 to-cyan-600/20 rounded-xl border border-emerald-500/20">
            <div className="flex items-center gap-2 mb-2">
              <Crown className="w-4 h-4 text-yellow-400" />
              <span className="text-xs font-bold text-yellow-400">ELITE SPECS</span>
            </div>
            <div className="text-xs text-gray-300">
              <div className="flex justify-between mb-1">
                <span>Platform</span>
                <span className="text-cyan-400">{platform}</span>
              </div>
              <div className="flex justify-between">
                <span>Edition</span>
                <span className="text-purple-400">Ultimate</span>
              </div>
            </div>
          </div>
          
          <div className="p-4 bg-white/5 rounded-xl border border-white/10">
            <div className="text-xs text-gray-500 mb-1 flex items-center gap-1">
              <Timer className="w-3 h-3" />
              System Uptime
            </div>
            <div className="text-sm font-bold text-white">{formatUptime(uptime)}</div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6 relative z-10">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent">System Overview</h1>
                <p className="text-gray-400 text-sm mt-1">ChromeOS Ultimate Performance Monitor</p>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/10">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-gray-300">{new Date().toLocaleTimeString()}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-5 gap-4">
              <div className="bg-gradient-to-br from-blue-900/40 to-blue-950/40 border border-blue-500/20 rounded-2xl p-5 backdrop-blur-xl relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-blue-500/20 rounded-lg">
                      <Cpu className="w-5 h-5 text-blue-400" />
                    </div>
                    <span className="text-sm font-bold text-white">CPU</span>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${getTempColor(cpuTemp)} bg-white/5`}>{Math.round(cpuTemp)}°C</span>
                </div>
                <div className="text-4xl font-black text-white mb-1">{Math.round(totalCpuUsage)}%</div>
                <div className="text-xs text-gray-400 mb-3">Intel N100 • 4 Threads</div>
                <MiniGraph data={cpuUsageHistory} color="from-blue-400 to-cyan-400" gradient height={48} />
              </div>

              <div className="bg-gradient-to-br from-purple-900/40 to-purple-950/40 border border-purple-500/20 rounded-2xl p-5 backdrop-blur-xl relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-purple-500/20 rounded-lg">
                      <MemoryStick className="w-5 h-5 text-purple-400" />
                    </div>
                    <span className="text-sm font-bold text-white">RAM</span>
                  </div>
                  <span className="text-xs text-gray-400">{ramUsed.toFixed(1)}GB/{deviceMemory}GB</span>
                </div>
                <div className="text-4xl font-black text-white mb-1">{Math.round((ramUsed / deviceMemory) * 100)}%</div>
                <div className="text-xs text-gray-400 mb-3">LPDDR5 Integrated</div>
                <MiniGraph data={ramUsageHistory} color="from-purple-400 to-pink-400" gradient height={48} />
              </div>

              <div className="bg-gradient-to-br from-emerald-900/40 to-emerald-950/40 border border-emerald-500/20 rounded-2xl p-5 backdrop-blur-xl relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-emerald-500/20 rounded-lg">
                      <CircuitBoard className="w-5 h-5 text-emerald-400" />
                    </div>
                    <span className="text-sm font-bold text-white">GPU</span>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${getTempColor(gpuInfo.temperature)} bg-white/5`}>{Math.round(gpuInfo.temperature)}°C</span>
                </div>
                <div className="text-4xl font-black text-white mb-1">{Math.round(gpuInfo.usage)}%</div>
                <div className="text-xs text-gray-400 mb-3">{gpuInfo.vramUsed.toFixed(1)}GB / {gpuInfo.vramTotal}GB VRAM</div>
                <MiniGraph data={gpuUsageHistory} color="from-emerald-400 to-green-400" gradient height={48} />
              </div>

              <div className="bg-gradient-to-br from-cyan-900/40 to-cyan-950/40 border border-cyan-500/20 rounded-2xl p-5 backdrop-blur-xl relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-cyan-500/20 rounded-lg">
                      <Globe className="w-5 h-5 text-cyan-400" />
                    </div>
                    <span className="text-sm font-bold text-white">Network</span>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${isOnline ? 'text-green-400 bg-green-500/20' : 'text-red-400 bg-red-500/20'}`}>
                    {isOnline ? 'Online' : 'Offline'}
                  </span>
                </div>
                <div className="flex items-center gap-3 mb-3">
                  <div>
                    <div className="flex items-center gap-1">
                      <Download className="w-3 h-3 text-green-400" />
                      <span className="text-lg font-bold text-white">{formatSpeed(downloadSpeed)}</span>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center gap-1">
                      <Upload className="w-3 h-3 text-orange-400" />
                      <span className="text-lg font-bold text-white">{formatSpeed(uploadSpeed)}</span>
                    </div>
                  </div>
                </div>
                <MiniGraph data={networkDownHistory} color="from-cyan-400 to-blue-400" gradient height={48} />
              </div>

              <div className="bg-gradient-to-br from-amber-900/40 to-amber-950/40 border border-amber-500/20 rounded-2xl p-5 backdrop-blur-xl relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-amber-500/20 rounded-lg">
                      {isCharging ? <BatteryCharging className="w-5 h-5 text-amber-400" /> : <Battery className="w-5 h-5 text-amber-400" />}
                    </div>
                    <span className="text-sm font-bold text-white">Battery</span>
                  </div>
                  <span className="text-xs text-green-400">{isCharging ? 'Charging' : 'On Battery'}</span>
                </div>
                <div className="text-4xl font-black text-white mb-1">{Math.round(battery)}%</div>
                <div className="text-xs text-gray-400 mb-3">{batteryCapacity}mAh • {batteryHealth}% Health</div>
                <div className="h-3 bg-black/40 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 transition-all duration-500"
                    style={{ width: `${battery}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-2 bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <Rocket className="w-5 h-5 text-orange-400" />
                  Performance Metrics
                  <span className="text-xs text-gray-400 ml-2">(Updated every 5 seconds)</span>
                </h3>
                <div className="grid grid-cols-4 gap-4">
                  <div className="bg-gradient-to-br from-orange-600/20 to-red-600/20 rounded-xl p-4 border border-orange-500/20">
                    <div className="text-xs text-gray-400 mb-1">Current FPS</div>
                    <div className="text-3xl font-black text-orange-400">{fps}</div>
                    <div className="text-xs text-gray-500">/ {frameLimit} limit</div>
                  </div>
                  <div className="bg-gradient-to-br from-green-600/20 to-emerald-600/20 rounded-xl p-4 border border-green-500/20">
                    <div className="text-xs text-gray-400 mb-1">Average FPS</div>
                    <div className="text-3xl font-black text-green-400">{avgFps}</div>
                    <div className="text-xs text-gray-500">5s average</div>
                  </div>
                  <div className="bg-gradient-to-br from-cyan-600/20 to-blue-600/20 rounded-xl p-4 border border-cyan-500/20">
                    <div className="text-xs text-gray-400 mb-1">Frame Time</div>
                    <div className="text-3xl font-black text-cyan-400">{frameTime.toFixed(2)}</div>
                    <div className="text-xs text-gray-500">milliseconds</div>
                  </div>
                  <div className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 rounded-xl p-4 border border-purple-500/20">
                    <div className="text-xs text-gray-400 mb-1">Min / Max</div>
                    <div className="text-xl font-black text-purple-400">{minFps} / {maxFps}</div>
                    <div className="text-xs text-gray-500">FPS range</div>
                  </div>
                </div>
                <div className="mt-4">
                  <MiniGraph data={fpsHistory} color="from-orange-500 to-red-500" gradient height={64} />
                </div>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <Thermometer className="w-5 h-5 text-red-400" />
                  Temperatures
                </h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-400 flex items-center gap-2"><Cpu className="w-3 h-3" /> CPU Package</span>
                      <span className={getTempColor(cpuTemp)}>{Math.round(cpuTemp)}°C</span>
                    </div>
                    <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                      <div className={`h-full ${getTempBgColor(cpuTemp)} transition-all`} style={{ width: `${cpuTemp}%` }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-400 flex items-center gap-2"><CircuitBoard className="w-3 h-3" /> GPU Core</span>
                      <span className={getTempColor(gpuInfo.temperature)}>{Math.round(gpuInfo.temperature)}°C</span>
                    </div>
                    <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                      <div className={`h-full ${getTempBgColor(gpuInfo.temperature)} transition-all`} style={{ width: `${gpuInfo.temperature}%` }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-400 flex items-center gap-2"><HardDrive className="w-3 h-3" /> NVMe SSD</span>
                      <span className={getTempColor(disks[0].temperature)}>{Math.round(disks[0].temperature)}°C</span>
                    </div>
                    <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                      <div className={`h-full ${getTempBgColor(disks[0].temperature)} transition-all`} style={{ width: `${disks[0].temperature}%` }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Diamond className="w-5 h-5 text-cyan-400" />
                System Specifications
              </h3>
              <div className="grid grid-cols-6 gap-4">
                <div className="bg-black/30 rounded-xl p-4 border border-white/5">
                  <div className="text-xs text-gray-500 mb-1">Processor</div>
                  <div className="text-sm font-bold text-white">Intel N100</div>
                  <div className="text-xs text-gray-400">@ 3.4 GHz</div>
                </div>
                <div className="bg-black/30 rounded-xl p-4 border border-white/5">
                  <div className="text-xs text-gray-500 mb-1">Graphics</div>
                  <div className="text-sm font-bold text-white">Intel UHD</div>
                  <div className="text-xs text-gray-400">Shared Memory</div>
                </div>
                <div className="bg-black/30 rounded-xl p-4 border border-white/5">
                  <div className="text-xs text-gray-500 mb-1">Memory</div>
                  <div className="text-sm font-bold text-white">{deviceMemory}GB LPDDR5</div>
                  <div className="text-xs text-gray-400">Integrated</div>
                </div>
                <div className="bg-black/30 rounded-xl p-4 border border-white/5">
                  <div className="text-xs text-gray-500 mb-1">Storage</div>
                  <div className="text-sm font-bold text-white">{disks.reduce((a, d) => a + d.total, 0)}GB</div>
                  <div className="text-xs text-gray-400">eMMC</div>
                </div>
                <div className="bg-black/30 rounded-xl p-4 border border-white/5">
                  <div className="text-xs text-gray-500 mb-1">Display</div>
                  <div className="text-sm font-bold text-white">{screenInfo.width}x{screenInfo.height}</div>
                  <div className="text-xs text-gray-400">{screenInfo.refreshRate}Hz IPS</div>
                </div>
                <div className="bg-black/30 rounded-xl p-4 border border-white/5">
                  <div className="text-xs text-gray-500 mb-1">Network</div>
                  <div className="text-sm font-bold text-white">WiFi 6</div>
                  <div className="text-xs text-gray-400">{pingLatency}ms latency</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'cpu' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">CPU Performance</h1>
                <p className="text-gray-400 text-sm mt-1">Intel N100 @ 3.4 GHz • ChromeOS {chromeOsVersion}</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-400">{Math.round(cpuPackagePower)}W</div>
                <div className="text-xs text-gray-400">Package Power</div>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-4">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col items-center">
                <CircularProgress value={totalCpuUsage} max={100} size={130} strokeWidth={10} color="#3b82f6" label="Total Usage" icon={Cpu} />
              </div>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col items-center">
                <CircularProgress value={cpuTemp} max={100} size={130} strokeWidth={10} color={cpuTemp > 60 ? '#ef4444' : cpuTemp > 45 ? '#eab308' : '#22c55e'} label="Temperature" sublabel={`${Math.round(cpuTemp)}°C`} icon={Thermometer} />
              </div>
              <div className="col-span-2 bg-white/5 border border-white/10 rounded-2xl p-6">
                <div className="text-sm text-gray-400 mb-3">Real-time Usage</div>
                <MiniGraph data={cpuUsageHistory} color="from-blue-500 to-cyan-500" gradient height={100} />
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-white mb-4">Per-Core Usage ({cpuCores} Cores)</h3>
              <div className="grid grid-cols-8 gap-3">
                {cpuCoreData.map((core, i) => (
                  <div key={i} className="bg-black/40 rounded-xl p-3 border border-white/5 hover:border-blue-500/30 transition-all">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-gray-400">C{i}</span>
                      <span className={`text-xs ${getTempColor(core.temperature)}`}>{Math.round(core.temperature)}°</span>
                    </div>
                    <div className="text-lg font-black text-white mb-1">{Math.round(core.usage)}%</div>
                    <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden mb-2">
                      <div className={`h-full bg-gradient-to-r ${getUsageGradient(core.usage)}`} style={{ width: `${core.usage}%` }} />
                    </div>
                    <div className="text-xs text-gray-500">{(core.clockSpeed / 1000).toFixed(1)} GHz</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-6 gap-4">
              <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                <div className="text-xs text-gray-400 mb-1">Architecture</div>
                <div className="text-lg font-bold text-white">Elkhart Lake</div>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                <div className="text-xs text-gray-400 mb-1">Base Clock</div>
                <div className="text-lg font-bold text-white">3.4 GHz</div>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                <div className="text-xs text-gray-400 mb-1">Max Turbo</div>
                <div className="text-lg font-bold text-cyan-400">3.4 GHz</div>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                <div className="text-xs text-gray-400 mb-1">Cores / Threads</div>
                <div className="text-lg font-bold text-white">{cpuCores} / {cpuThreads}</div>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                <div className="text-xs text-gray-400 mb-1">L3 Cache</div>
                <div className="text-lg font-bold text-white">4 MB</div>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                <div className="text-xs text-gray-400 mb-1">TDP</div>
                <div className="text-lg font-bold text-white">12W</div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'gpu' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-emerald-200 bg-clip-text text-transparent">GPU Performance</h1>
                <p className="text-gray-400 text-sm mt-1">{gpuInfo.name}</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="text-2xl font-bold text-emerald-400">{Math.round(gpuInfo.powerDraw)}W</div>
                  <div className="text-xs text-gray-400">Power Draw</div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-4">
              <div className="bg-gradient-to-br from-emerald-900/40 to-green-900/40 border border-emerald-500/20 rounded-2xl p-5">
                <div className="text-xs text-gray-400 mb-1">GPU Load</div>
                <div className="text-4xl font-black text-white mb-2">{Math.round(gpuInfo.usage)}%</div>
                <MiniGraph data={gpuUsageHistory} color="from-emerald-400 to-green-400" gradient height={40} />
              </div>
              <div className="bg-gradient-to-br from-orange-900/40 to-red-900/40 border border-orange-500/20 rounded-2xl p-5">
                <div className="text-xs text-gray-400 mb-1">Temperature</div>
                <div className={`text-4xl font-black ${getTempColor(gpuInfo.temperature)}`}>{Math.round(gpuInfo.temperature)}°C</div>
                <div className="text-xs text-gray-500 mt-2">Target: 75°C Max</div>
              </div>
              <div className="bg-gradient-to-br from-purple-900/40 to-pink-900/40 border border-purple-500/20 rounded-2xl p-5">
                <div className="text-xs text-gray-400 mb-1">VRAM Usage</div>
                <div className="text-4xl font-black text-white">{gpuInfo.vramUsed.toFixed(1)} GB</div>
                <div className="text-xs text-gray-500 mt-2">of {gpuInfo.vramTotal} GB Shared</div>
              </div>
              <div className="bg-gradient-to-br from-blue-900/40 to-cyan-900/40 border border-blue-500/20 rounded-2xl p-5">
                <div className="text-xs text-gray-400 mb-1">Core Clock</div>
                <div className="text-4xl font-black text-white">{Math.round(gpuInfo.clockSpeed)}</div>
                <div className="text-xs text-gray-500 mt-2">MHz</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-white mb-4">GPU Specifications</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-black/30 rounded-xl p-4">
                    <div className="text-xs text-gray-500 mb-1">Execution Units</div>
                    <div className="text-xl font-bold text-white">{gpuInfo.shaderUnits}</div>
                  </div>
                  <div className="bg-black/30 rounded-xl p-4">
                    <div className="text-xs text-gray-500 mb-1">Max Clock</div>
                    <div className="text-xl font-bold text-white">750 MHz</div>
                  </div>
                  <div className="bg-black/30 rounded-xl p-4">
                    <div className="text-xs text-gray-500 mb-1">Memory Type</div>
                    <div className="text-xl font-bold text-white">Shared</div>
                  </div>
                  <div className="bg-black/30 rounded-xl p-4">
                    <div className="text-xs text-gray-500 mb-1">DirectX</div>
                    <div className="text-xl font-bold text-white">12.1</div>
                  </div>
                </div>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-white mb-4">VRAM Usage</h3>
                <div className="h-6 bg-gray-800 rounded-full overflow-hidden mb-4">
                  <div className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 transition-all" style={{ width: `${(gpuInfo.vramUsed / gpuInfo.vramTotal) * 100}%` }} />
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">{gpuInfo.vramUsed.toFixed(1)} GB used</span>
                  <span className="text-green-400">{(gpuInfo.vramTotal - gpuInfo.vramUsed).toFixed(1)} GB free</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'memory' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">Memory Usage</h1>
                <p className="text-gray-400 text-sm mt-1">LPDDR5 Integrated • {deviceMemory} GB Total</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col items-center">
                <CircularProgress value={(ramUsed / deviceMemory) * 100} max={100} size={160} strokeWidth={14} color="#a855f7" label="RAM Usage" sublabel={`${ramUsed.toFixed(1)} GB / ${deviceMemory} GB`} icon={MemoryStick} />
              </div>
              <div className="col-span-2 bg-white/5 border border-white/10 rounded-2xl p-6">
                <div className="text-sm text-gray-400 mb-3">Memory Usage Over Time</div>
                <MiniGraph data={ramUsageHistory} color="from-purple-500 to-pink-500" gradient height={140} />
              </div>
            </div>

            <div className="grid grid-cols-4 gap-4">
              <div className="bg-gradient-to-br from-purple-900/40 to-purple-950/40 border border-purple-500/20 rounded-xl p-5">
                <div className="text-xs text-gray-400 mb-1">In Use</div>
                <div className="text-2xl font-black text-purple-400">{ramUsed.toFixed(1)} GB</div>
              </div>
              <div className="bg-gradient-to-br from-green-900/40 to-green-950/40 border border-green-500/20 rounded-xl p-5">
                <div className="text-xs text-gray-400 mb-1">Available</div>
                <div className="text-2xl font-black text-green-400">{(deviceMemory - ramUsed).toFixed(1)} GB</div>
              </div>
              <div className="bg-gradient-to-br from-blue-900/40 to-blue-950/40 border border-blue-500/20 rounded-xl p-5">
                <div className="text-xs text-gray-400 mb-1">Committed</div>
                <div className="text-2xl font-black text-blue-400">{(ramUsed * 1.15).toFixed(1)} GB</div>
              </div>
              <div className="bg-gradient-to-br from-cyan-900/40 to-cyan-950/40 border border-cyan-500/20 rounded-xl p-5">
                <div className="text-xs text-gray-400 mb-1">Cached</div>
                <div className="text-2xl font-black text-cyan-400">{(ramUsed * 0.25).toFixed(1)} GB</div>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-white mb-4">Memory Configuration</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 rounded-xl p-5 border border-purple-500/20">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs text-gray-400">Onboard Memory</span>
                    <span className="text-xs text-green-400">Active</span>
                  </div>
                  <div className="text-2xl font-black text-white mb-1">{deviceMemory} GB</div>
                  <div className="text-xs text-gray-400">LPDDR5 Integrated</div>
                  <div className="text-xs text-purple-400 mt-2">Intel N100 SoC</div>
                </div>
                <div className="bg-gradient-to-br from-gray-900/30 to-gray-800/30 rounded-xl p-5 border border-gray-500/20">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs text-gray-400">Expansion Slot</span>
                    <span className="text-xs text-gray-500">N/A</span>
                  </div>
                  <div className="text-2xl font-black text-gray-500 mb-1">—</div>
                  <div className="text-xs text-gray-500">Not Available</div>
                  <div className="text-xs text-gray-600 mt-2">Soldered Memory</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'storage' && (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-indigo-200 bg-clip-text text-transparent">Storage Devices</h1>

            {disks.map((disk, i) => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-indigo-500/30 transition-all">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-xl">
                      <Microchip className="w-6 h-6 text-indigo-400" />
                    </div>
                    <div>
                      <div className="font-bold text-white text-lg">{disk.name}</div>
                      <div className="text-sm text-gray-400">{disk.type} • {disk.total} GB</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-4">
                      <div>
                        <div className="text-xs text-gray-500">Read</div>
                        <div className="text-sm font-bold text-green-400">300 GB/s</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500">Write</div>
                        <div className="text-sm font-bold text-blue-400">400 GB/s</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500">Temp</div>
                        <div className={`text-sm font-bold ${getTempColor(disk.temperature)}`}>{disk.temperature}°C</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="h-4 bg-gray-800 rounded-full overflow-hidden mb-3">
                  <div 
                    className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all"
                    style={{ width: `${(disk.used / disk.total) * 100}%` }}
                  />
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">21.5 GB used</span>
                  <span className="text-green-400">41.5 GB free (65%)</span>
                </div>
              </div>
            ))}

            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white/5 border border-white/10 rounded-xl p-5">
                <div className="text-xs text-gray-400 mb-1">Total Capacity</div>
                <div className="text-3xl font-black text-white">64 GB</div>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-5">
                <div className="text-xs text-gray-400 mb-1">Total Used</div>
                <div className="text-3xl font-black text-orange-400">22.5 GB</div>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-5">
                <div className="text-xs text-gray-400 mb-1">Total Free</div>
                <div className="text-3xl font-black text-green-400">41.5 GB</div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'network' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-cyan-200 bg-clip-text text-transparent">Network Activity</h1>
                <p className="text-gray-400 text-sm mt-1">WiFi 7 (802.11be) • 6 GHz Band</p>
              </div>
              <div className="flex items-center gap-3">
                <span className={`px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 ${isOnline ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'}`}>
                  <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
                  {isOnline ? 'Connected' : 'Disconnected'}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-green-900/40 to-emerald-900/40 border border-green-500/20 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-green-500/20 rounded-xl">
                    <Download className="w-6 h-6 text-green-400" />
                  </div>
                  <span className="text-lg font-bold text-white">Download</span>
                </div>
                <div className="text-5xl font-black text-white mb-2">{formatSpeed(downloadSpeed)}</div>
                <MiniGraph data={networkDownHistory} color="from-green-400 to-emerald-400" gradient height={64} />
                <div className="text-sm text-gray-400 mt-3">Total: {formatBytes(totalDownloaded / 1024)}</div>
              </div>
              <div className="bg-gradient-to-br from-orange-900/40 to-red-900/40 border border-orange-500/20 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-orange-500/20 rounded-xl">
                    <Upload className="w-6 h-6 text-orange-400" />
                  </div>
                  <span className="text-lg font-bold text-white">Upload</span>
                </div>
                <div className="text-5xl font-black text-white mb-2">{formatSpeed(uploadSpeed)}</div>
                <MiniGraph data={networkUpHistory} color="from-orange-400 to-red-400" gradient height={64} />
                <div className="text-sm text-gray-400 mt-3">Total: {formatBytes(totalUploaded / 1024)}</div>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-white mb-4">Connection Details</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-black/30 rounded-xl p-4">
                  <div className="text-xs text-gray-500 mb-1">Connection Type</div>
                  <div className="text-xl font-bold text-white">WiFi 7</div>
                </div>
                <div className="bg-black/30 rounded-xl p-4">
                  <div className="text-xs text-gray-500 mb-1">Frequency Band</div>
                  <div className="text-xl font-bold text-white">6 GHz</div>
                </div>
                <div className="bg-black/30 rounded-xl p-4">
                  <div className="text-xs text-gray-500 mb-1">Latency</div>
                  <div className="text-xl font-bold text-cyan-400">{pingLatency} ms</div>
                </div>
                <div className="bg-black/30 rounded-xl p-4">
                  <div className="text-xs text-gray-500 mb-1">Max Link Speed</div>
                  <div className="text-xl font-bold text-white">10 Gbps</div>
                </div>
                <div className="bg-black/30 rounded-xl p-4">
                  <div className="text-xs text-gray-500 mb-1">Signal Strength</div>
                  <div className="text-xl font-bold text-green-400">Excellent</div>
                </div>
                <div className="bg-black/30 rounded-xl p-4">
                  <div className="text-xs text-gray-500 mb-1">Channel Width</div>
                  <div className="text-xl font-bold text-white">320 MHz</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'battery' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-amber-200 bg-clip-text text-transparent">Battery Status</h1>
                <p className="text-gray-400 text-sm mt-1">{batteryCapacity}mAh Lithium-Polymer • {batteryWattage}Wh</p>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/20 border border-green-500/30">
                <BatteryCharging className="w-5 h-5 text-green-400" />
                <span className="text-green-400 font-bold">{isCharging ? 'Charging' : 'On Battery'}</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-2 bg-gradient-to-br from-amber-900/40 to-orange-900/40 border border-amber-500/20 rounded-2xl p-8">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <div className="text-6xl font-black text-white">{Math.round(battery)}%</div>
                    <div className="text-gray-400 mt-2">{isCharging ? `Fully charged in ~${Math.max(1, Math.round((100 - battery) * 0.8))} minutes` : `Estimated ${Math.round(battery * 0.12)} hours remaining`}</div>
                  </div>
                  <div className="p-6 bg-amber-500/20 rounded-3xl">
                    <BatteryCharging className="w-16 h-16 text-amber-400" />
                  </div>
                </div>
                <div className="h-8 bg-black/40 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-amber-500 via-yellow-400 to-green-400 transition-all duration-500 relative"
                    style={{ width: `${battery}%` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                  <div className="text-xs text-gray-400 mb-1">Battery Health</div>
                  <div className="text-3xl font-black text-green-400">{batteryHealth}%</div>
                  <div className="text-xs text-gray-500 mt-1">{batteryHealth >= 90 ? 'Good condition' : batteryHealth >= 80 ? 'Fair condition' : 'Replace soon'}</div>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                  <div className="text-xs text-gray-400 mb-1">Charge Cycles</div>
                  <div className="text-3xl font-black text-white">{batteryCycles}</div>
                  <div className="text-xs text-gray-500 mt-1">of 1000 rated</div>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                  <div className="text-xs text-gray-400 mb-1">Capacity</div>
                  <div className="text-3xl font-black text-amber-400">{batteryCapacity}mAh</div>
                  <div className="text-xs text-gray-500 mt-1">65W USB-C PD</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'performance' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-orange-200 bg-clip-text text-transparent">Performance Metrics</h1>
                <p className="text-gray-400 text-sm mt-1">Real-time monitoring • Updated every 5 seconds</p>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-4">
              <div className="bg-gradient-to-br from-orange-900/40 to-red-900/40 border border-orange-500/20 rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-3">
                  <Gauge className="w-5 h-5 text-orange-400" />
                  <span className="text-sm font-bold text-gray-300">Current FPS</span>
                </div>
                <div className="text-5xl font-black text-orange-400">{fps}</div>
                <div className="text-xs text-gray-500 mt-2">Limit: {frameLimit} FPS</div>
              </div>
              <div className="bg-gradient-to-br from-green-900/40 to-emerald-900/40 border border-green-500/20 rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp className="w-5 h-5 text-green-400" />
                  <span className="text-sm font-bold text-gray-300">Average FPS</span>
                </div>
                <div className="text-5xl font-black text-green-400">{avgFps}</div>
                <div className="text-xs text-gray-500 mt-2">5-second average</div>
              </div>
              <div className="bg-gradient-to-br from-cyan-900/40 to-blue-900/40 border border-cyan-500/20 rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-3">
                  <Clock className="w-5 h-5 text-cyan-400" />
                  <span className="text-sm font-bold text-gray-300">Frame Time</span>
                </div>
                <div className="text-5xl font-black text-cyan-400">{frameTime.toFixed(2)}</div>
                <div className="text-xs text-gray-500 mt-2">milliseconds</div>
              </div>
              <div className="bg-gradient-to-br from-purple-900/40 to-pink-900/40 border border-purple-500/20 rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-3">
                  <BarChart3 className="w-5 h-5 text-purple-400" />
                  <span className="text-sm font-bold text-gray-300">FPS Range</span>
                </div>
                <div className="text-3xl font-black text-purple-400">{minFps} - {maxFps}</div>
                <div className="text-xs text-gray-500 mt-2">Min / Max</div>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-white mb-4">FPS History (5-second intervals)</h3>
              <MiniGraph data={fpsHistory} color="from-orange-500 via-yellow-500 to-green-500" gradient height={120} />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                <div className="text-xs text-gray-400 mb-1">Display Refresh Rate</div>
                <div className="text-2xl font-black text-white">{screenInfo.refreshRate} Hz</div>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                <div className="text-xs text-gray-400 mb-1">V-Sync Status</div>
                <div className="text-2xl font-black text-green-400">Disabled</div>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                <div className="text-xs text-gray-400 mb-1">Resolution</div>
                <div className="text-2xl font-black text-white">{screenInfo.width}x{screenInfo.height}</div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'processes' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">Running Processes</h1>
                <p className="text-gray-400 text-sm mt-1">{processes.length} active processes</p>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
              <div className="grid grid-cols-12 gap-4 p-4 border-b border-white/10 text-xs font-bold text-gray-400 uppercase tracking-wider bg-black/30">
                <div className="col-span-4">Process Name</div>
                <div className="col-span-2 text-right">CPU</div>
                <div className="col-span-2 text-right">Memory</div>
                <div className="col-span-2 text-right">Threads</div>
                <div className="col-span-2 text-right">Priority</div>
              </div>
              <div className="divide-y divide-white/5">
                {processes.map(process => (
                  <div key={process.id} className="grid grid-cols-12 gap-4 p-4 hover:bg-white/5 transition-colors">
                    <div className="col-span-4 flex items-center gap-3">
                      <div className="p-2 bg-white/5 rounded-lg">
                        <Server className="w-4 h-4 text-gray-400" />
                      </div>
                      <span className="text-white font-medium">{process.name}</span>
                    </div>
                    <div className="col-span-2 text-right flex items-center justify-end">
                      <span className={`font-bold ${process.cpu > 5 ? 'text-orange-400' : 'text-gray-300'}`}>
                        {process.cpu.toFixed(1)}%
                      </span>
                    </div>
                    <div className="col-span-2 text-right">
                      <span className="text-gray-300 font-medium">{process.memory.toFixed(1)} GB</span>
                    </div>
                    <div className="col-span-2 text-right">
                      <span className="text-gray-300">{process.threads}</span>
                    </div>
                    <div className="col-span-2 text-right">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        process.priority === 'high' ? 'bg-red-500/20 text-red-400' :
                        process.priority === 'normal' ? 'bg-blue-500/20 text-blue-400' :
                        'bg-gray-500/20 text-gray-400'
                      }`}>
                        {process.priority}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
