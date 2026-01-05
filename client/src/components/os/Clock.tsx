import { useEffect, useState } from 'react';
import { Clock as ClockIcon, Timer, Bell, Plus, Trash2, Play, Pause, RotateCcw, Edit2, X, Check } from 'lucide-react';

interface Alarm {
  id: string;
  time: string;
  label: string;
  enabled: boolean;
}

export function ClockApp() {
  const [time, setTime] = useState(new Date());
  const [activeTab, setActiveTab] = useState<'clock' | 'timer' | 'stopwatch' | 'alarms'>('clock');
  
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerInput, setTimerInput] = useState({ hours: 0, minutes: 5, seconds: 0 });
  
  const [stopwatchMs, setStopwatchMs] = useState(0);
  const [stopwatchRunning, setStopwatchRunning] = useState(false);
  const [laps, setLaps] = useState<number[]>([]);
  
  const [alarms, setAlarms] = useState<Alarm[]>(() => {
    const saved = localStorage.getItem('windows13_alarms');
    return saved ? JSON.parse(saved) : [
      { id: '1', time: '07:00', label: 'Wake up', enabled: true },
      { id: '2', time: '09:00', label: 'Meeting', enabled: false },
    ];
  });
  const [newAlarmTime, setNewAlarmTime] = useState('08:00');
  const [editingAlarm, setEditingAlarm] = useState<string | null>(null);
  const [editLabel, setEditLabel] = useState('');

  useEffect(() => {
    localStorage.setItem('windows13_alarms', JSON.stringify(alarms));
  }, [alarms]);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (timerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds(prev => {
          if (prev <= 1) {
            setTimerRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerRunning, timerSeconds]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (stopwatchRunning) {
      interval = setInterval(() => {
        setStopwatchMs(prev => prev + 10);
      }, 10);
    }
    return () => clearInterval(interval);
  }, [stopwatchRunning]);

  const hours = time.getHours();
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();

  const hourDegrees = (hours % 12) * 30 + minutes * 0.5;
  const minuteDegrees = minutes * 6;
  const secondDegrees = seconds * 6;

  const startTimer = () => {
    const totalSeconds = timerInput.hours * 3600 + timerInput.minutes * 60 + timerInput.seconds;
    if (totalSeconds > 0) {
      setTimerSeconds(totalSeconds);
      setTimerRunning(true);
    }
  };

  const formatTimerDisplay = (secs: number) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const formatStopwatch = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    const centisecs = Math.floor((ms % 1000) / 10);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${centisecs.toString().padStart(2, '0')}`;
  };

  const addLap = () => {
    setLaps(prev => [...prev, stopwatchMs]);
  };

  const resetStopwatch = () => {
    setStopwatchRunning(false);
    setStopwatchMs(0);
    setLaps([]);
  };

  const addAlarm = () => {
    setAlarms(prev => [...prev, {
      id: Date.now().toString(),
      time: newAlarmTime,
      label: 'New Alarm',
      enabled: true
    }]);
  };

  const toggleAlarm = (id: string) => {
    setAlarms(prev => prev.map(a => a.id === id ? { ...a, enabled: !a.enabled } : a));
  };

  const deleteAlarm = (id: string) => {
    setAlarms(prev => prev.filter(a => a.id !== id));
  };

  const startEditAlarm = (alarm: Alarm) => {
    setEditingAlarm(alarm.id);
    setEditLabel(alarm.label);
  };

  const saveAlarmLabel = (id: string) => {
    setAlarms(prev => prev.map(a => a.id === id ? { ...a, label: editLabel } : a));
    setEditingAlarm(null);
    setEditLabel('');
  };

  return (
    <div className="h-full w-full bg-white dark:bg-[#1a1a1a] flex flex-col text-foreground overflow-hidden">
      <div className="border-b border-zinc-200 dark:border-zinc-800 flex">
        {[
          { id: 'clock', label: 'Clock', icon: ClockIcon },
          { id: 'timer', label: 'Timer', icon: Timer },
          { id: 'stopwatch', label: 'Stopwatch', icon: Timer },
          { id: 'alarms', label: 'Alarms', icon: Bell },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors ${
              activeTab === tab.id 
                ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50 dark:bg-blue-900/20' 
                : 'text-muted-foreground hover:bg-zinc-100 dark:hover:bg-zinc-800'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-auto p-6">
        {activeTab === 'clock' && (
          <div className="flex flex-col items-center justify-center h-full">
            <h1 className="text-5xl font-bold mb-2 tabular-nums">{time.toLocaleTimeString('en-US')}</h1>
            <p className="text-muted-foreground mb-8">{time.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</p>

            <div className="relative w-56 h-56">
              <svg viewBox="0 0 200 200" className="w-full h-full">
                <circle cx="100" cy="100" r="95" fill="none" stroke="currentColor" strokeWidth="6" className="text-blue-600" />
                <circle cx="100" cy="100" r="88" fill="url(#clockGradient)" />
                
                <defs>
                  <linearGradient id="clockGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" className="text-blue-50 dark:text-blue-900/30" stopColor="currentColor" />
                    <stop offset="100%" className="text-blue-100 dark:text-blue-800/30" stopColor="currentColor" />
                  </linearGradient>
                </defs>

                {[...Array(12)].map((_, i) => {
                  const angle = (i * 30 - 90) * Math.PI / 180;
                  const x1 = 100 + Math.cos(angle) * 75;
                  const y1 = 100 + Math.sin(angle) * 75;
                  const x2 = 100 + Math.cos(angle) * (i % 3 === 0 ? 65 : 70);
                  const y2 = 100 + Math.sin(angle) * (i % 3 === 0 ? 65 : 70);
                  return (
                    <line 
                      key={i}
                      x1={x1} y1={y1} x2={x2} y2={y2}
                      stroke="currentColor"
                      strokeWidth={i % 3 === 0 ? 3 : 1.5}
                      strokeLinecap="round"
                      className={i % 3 === 0 ? "text-blue-600" : "text-gray-400"}
                    />
                  );
                })}

                {[...Array(12)].map((_, i) => {
                  const angle = (i * 30 - 90) * Math.PI / 180;
                  const x = 100 + Math.cos(angle) * 55;
                  const y = 100 + Math.sin(angle) * 55;
                  const hour = i === 0 ? 12 : i;
                  return (
                    <text
                      key={i}
                      x={x}
                      y={y}
                      textAnchor="middle"
                      dominantBaseline="central"
                      className="text-xs font-semibold fill-current text-gray-700 dark:text-gray-300"
                    >
                      {hour}
                    </text>
                  );
                })}

                <line
                  x1="100"
                  y1="100"
                  x2={100 + Math.cos((hourDegrees - 90) * Math.PI / 180) * 40}
                  y2={100 + Math.sin((hourDegrees - 90) * Math.PI / 180) * 40}
                  stroke="currentColor"
                  strokeWidth="5"
                  strokeLinecap="round"
                  className="text-gray-800 dark:text-white"
                />

                <line
                  x1="100"
                  y1="100"
                  x2={100 + Math.cos((minuteDegrees - 90) * Math.PI / 180) * 55}
                  y2={100 + Math.sin((minuteDegrees - 90) * Math.PI / 180) * 55}
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  className="text-gray-700 dark:text-gray-300"
                />

                <line
                  x1="100"
                  y1="100"
                  x2={100 + Math.cos((secondDegrees - 90) * Math.PI / 180) * 65}
                  y2={100 + Math.sin((secondDegrees - 90) * Math.PI / 180) * 65}
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  className="text-red-500"
                />

                <circle cx="100" cy="100" r="6" className="fill-blue-600" />
                <circle cx="100" cy="100" r="3" className="fill-white" />
              </svg>
            </div>

            <p className="text-sm text-muted-foreground mt-6">
              Timezone: {Intl.DateTimeFormat().resolvedOptions().timeZone}
            </p>
          </div>
        )}

        {activeTab === 'timer' && (
          <div className="flex flex-col items-center justify-center h-full">
            {timerRunning || timerSeconds > 0 ? (
              <>
                <div className="text-7xl font-mono font-bold mb-8 tabular-nums text-blue-600">
                  {formatTimerDisplay(timerSeconds)}
                </div>
                <div className="flex gap-4">
                  <button
                    onClick={() => setTimerRunning(!timerRunning)}
                    className={`px-8 py-3 rounded-full font-medium flex items-center gap-2 ${timerRunning ? 'bg-orange-500 hover:bg-orange-600' : 'bg-green-500 hover:bg-green-600'} text-white`}
                  >
                    {timerRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                    {timerRunning ? 'Pause' : 'Resume'}
                  </button>
                  <button
                    onClick={() => { setTimerRunning(false); setTimerSeconds(0); }}
                    className="px-8 py-3 rounded-full font-medium bg-red-500 hover:bg-red-600 text-white flex items-center gap-2"
                  >
                    <RotateCcw className="w-5 h-5" /> Reset
                  </button>
                </div>
              </>
            ) : (
              <>
                <p className="text-lg font-medium mb-6">Set Timer</p>
                <div className="flex gap-4 mb-8 items-center">
                  <div className="text-center">
                    <input
                      type="number"
                      min="0"
                      max="23"
                      value={timerInput.hours}
                      onChange={e => setTimerInput(prev => ({ ...prev, hours: Math.max(0, parseInt(e.target.value) || 0) }))}
                      className="w-20 h-20 text-4xl text-center bg-zinc-100 dark:bg-zinc-800 rounded-lg font-mono border-2 border-transparent focus:border-blue-500 outline-none"
                    />
                    <p className="text-xs text-muted-foreground mt-1">Hours</p>
                  </div>
                  <span className="text-4xl font-bold text-muted-foreground">:</span>
                  <div className="text-center">
                    <input
                      type="number"
                      min="0"
                      max="59"
                      value={timerInput.minutes}
                      onChange={e => setTimerInput(prev => ({ ...prev, minutes: Math.min(59, Math.max(0, parseInt(e.target.value) || 0)) }))}
                      className="w-20 h-20 text-4xl text-center bg-zinc-100 dark:bg-zinc-800 rounded-lg font-mono border-2 border-transparent focus:border-blue-500 outline-none"
                    />
                    <p className="text-xs text-muted-foreground mt-1">Minutes</p>
                  </div>
                  <span className="text-4xl font-bold text-muted-foreground">:</span>
                  <div className="text-center">
                    <input
                      type="number"
                      min="0"
                      max="59"
                      value={timerInput.seconds}
                      onChange={e => setTimerInput(prev => ({ ...prev, seconds: Math.min(59, Math.max(0, parseInt(e.target.value) || 0)) }))}
                      className="w-20 h-20 text-4xl text-center bg-zinc-100 dark:bg-zinc-800 rounded-lg font-mono border-2 border-transparent focus:border-blue-500 outline-none"
                    />
                    <p className="text-xs text-muted-foreground mt-1">Seconds</p>
                  </div>
                </div>
                <div className="flex gap-2 mb-6">
                  {[1, 5, 10, 15, 30].map(min => (
                    <button
                      key={min}
                      onClick={() => setTimerInput({ hours: 0, minutes: min, seconds: 0 })}
                      className="px-4 py-2 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-lg text-sm font-medium"
                    >
                      {min} min
                    </button>
                  ))}
                </div>
                <button
                  onClick={startTimer}
                  className="px-12 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-medium text-lg flex items-center gap-2"
                >
                  <Play className="w-5 h-5" /> Start Timer
                </button>
              </>
            )}
          </div>
        )}

        {activeTab === 'stopwatch' && (
          <div className="flex flex-col items-center justify-center h-full">
            <div className="text-7xl font-mono font-bold mb-8 tabular-nums">
              {formatStopwatch(stopwatchMs)}
            </div>
            <div className="flex gap-4 mb-8">
              <button
                onClick={() => setStopwatchRunning(!stopwatchRunning)}
                className={`px-8 py-3 rounded-full font-medium ${stopwatchRunning ? 'bg-orange-500 hover:bg-orange-600' : 'bg-green-500 hover:bg-green-600'} text-white flex items-center gap-2`}
              >
                {stopwatchRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                {stopwatchRunning ? 'Pause' : stopwatchMs > 0 ? 'Resume' : 'Start'}
              </button>
              {stopwatchRunning && (
                <button
                  onClick={addLap}
                  className="px-8 py-3 rounded-full font-medium bg-blue-500 hover:bg-blue-600 text-white"
                >
                  Lap
                </button>
              )}
              {(stopwatchMs > 0 && !stopwatchRunning) && (
                <button
                  onClick={resetStopwatch}
                  className="px-8 py-3 rounded-full font-medium bg-red-500 hover:bg-red-600 text-white flex items-center gap-2"
                >
                  <RotateCcw className="w-5 h-5" /> Reset
                </button>
              )}
            </div>
            
            {laps.length > 0 && (
              <div className="w-full max-w-sm bg-zinc-100 dark:bg-zinc-800 rounded-lg p-4 max-h-48 overflow-auto">
                <p className="text-sm font-medium mb-2">Laps ({laps.length})</p>
                {laps.map((lap, i) => {
                  const prevLap = i > 0 ? laps[i - 1] : 0;
                  const lapTime = lap - prevLap;
                  return (
                    <div key={i} className="flex justify-between py-2 border-b border-zinc-200 dark:border-zinc-700 last:border-0">
                      <span className="text-muted-foreground">Lap {i + 1}</span>
                      <span className="font-mono text-muted-foreground">+{formatStopwatch(lapTime)}</span>
                      <span className="font-mono font-medium">{formatStopwatch(lap)}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {activeTab === 'alarms' && (
          <div className="max-w-md mx-auto">
            <div className="flex items-center gap-2 mb-6">
              <input
                type="time"
                value={newAlarmTime}
                onChange={e => setNewAlarmTime(e.target.value)}
                className="flex-1 px-4 py-3 bg-zinc-100 dark:bg-zinc-800 rounded-lg text-lg border-2 border-transparent focus:border-blue-500 outline-none"
              />
              <button
                onClick={addAlarm}
                className="p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
              >
                <Plus className="w-6 h-6" />
              </button>
            </div>

            {alarms.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Bell className="w-16 h-16 mx-auto mb-4 opacity-30" />
                <p>No alarms set</p>
                <p className="text-sm">Add an alarm using the input above</p>
              </div>
            ) : (
              <div className="space-y-3">
                {alarms.map(alarm => (
                  <div 
                    key={alarm.id}
                    className={`flex items-center justify-between p-4 rounded-xl transition-colors ${alarm.enabled ? 'bg-blue-50 dark:bg-blue-900/20' : 'bg-zinc-100 dark:bg-zinc-800'}`}
                  >
                    <div className="flex-1">
                      <p className={`text-3xl font-bold tabular-nums ${alarm.enabled ? '' : 'text-muted-foreground'}`}>{alarm.time}</p>
                      {editingAlarm === alarm.id ? (
                        <div className="flex items-center gap-2 mt-1">
                          <input
                            type="text"
                            value={editLabel}
                            onChange={e => setEditLabel(e.target.value)}
                            className="flex-1 px-2 py-1 text-sm bg-white dark:bg-zinc-900 rounded border"
                            autoFocus
                            onKeyDown={e => e.key === 'Enter' && saveAlarmLabel(alarm.id)}
                          />
                          <button onClick={() => saveAlarmLabel(alarm.id)} className="p-1 text-green-600">
                            <Check className="w-4 h-4" />
                          </button>
                          <button onClick={() => setEditingAlarm(null)} className="p-1 text-red-500">
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <p className="text-sm text-muted-foreground">{alarm.label}</p>
                          <button onClick={() => startEditAlarm(alarm)} className="p-1 opacity-50 hover:opacity-100">
                            <Edit2 className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => toggleAlarm(alarm.id)}
                        className={`relative w-14 h-7 rounded-full transition-colors ${alarm.enabled ? 'bg-blue-600' : 'bg-zinc-300 dark:bg-zinc-600'}`}
                      >
                        <div className={`absolute top-0.5 w-6 h-6 bg-white rounded-full shadow transition-transform ${alarm.enabled ? 'left-7' : 'left-0.5'}`} />
                      </button>
                      <button
                        onClick={() => deleteAlarm(alarm.id)}
                        className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 rounded text-red-500"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}