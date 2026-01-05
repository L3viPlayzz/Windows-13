import { ChevronLeft, ChevronRight, Plus, Trash2, Edit2, X, Clock, Calendar as CalendarIcon, Check } from 'lucide-react';
import { useState, useEffect } from 'react';

interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  color: string;
  description?: string;
}

const STORAGE_KEY = 'windows13_calendar_events';

const colorOptions = [
  { id: 'blue', bg: 'bg-blue-500', text: 'text-blue-500', light: 'bg-blue-100 dark:bg-blue-900/30' },
  { id: 'green', bg: 'bg-green-500', text: 'text-green-500', light: 'bg-green-100 dark:bg-green-900/30' },
  { id: 'red', bg: 'bg-red-500', text: 'text-red-500', light: 'bg-red-100 dark:bg-red-900/30' },
  { id: 'purple', bg: 'bg-purple-500', text: 'text-purple-500', light: 'bg-purple-100 dark:bg-purple-900/30' },
  { id: 'orange', bg: 'bg-orange-500', text: 'text-orange-500', light: 'bg-orange-100 dark:bg-orange-900/30' },
  { id: 'pink', bg: 'bg-pink-500', text: 'text-pink-500', light: 'bg-pink-100 dark:bg-pink-900/30' },
];

export function CalendarApp() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [showEventForm, setShowEventForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);
  const [newEvent, setNewEvent] = useState({
    title: '',
    time: '09:00',
    color: 'blue',
    description: '',
  });

  const today = new Date();

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setEvents(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load events');
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
  }, [events]);

  const daysInMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  const days = Array.from({ length: daysInMonth(currentDate) }, (_, i) => i + 1);

  const formatDateKey = (year: number, month: number, day: number) => {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  };

  const getEventsForDate = (day: number) => {
    const dateKey = formatDateKey(currentDate.getFullYear(), currentDate.getMonth(), day);
    return events.filter(e => e.date === dateKey);
  };

  const getEventsForSelectedDate = () => {
    if (!selectedDate) return [];
    const dateKey = formatDateKey(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate());
    return events.filter(e => e.date === dateKey).sort((a, b) => a.time.localeCompare(b.time));
  };

  const handleDayClick = (day: number) => {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    setSelectedDate(date);
  };

  const handleAddEvent = () => {
    if (!selectedDate || !newEvent.title.trim()) return;

    const dateKey = formatDateKey(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate());
    
    if (editingEvent) {
      setEvents(prev => prev.map(e => 
        e.id === editingEvent.id 
          ? { ...e, title: newEvent.title, time: newEvent.time, color: newEvent.color, description: newEvent.description }
          : e
      ));
      setEditingEvent(null);
    } else {
      const event: CalendarEvent = {
        id: `event_${Date.now()}`,
        title: newEvent.title,
        date: dateKey,
        time: newEvent.time,
        color: newEvent.color,
        description: newEvent.description,
      };
      setEvents(prev => [...prev, event]);
    }

    setNewEvent({ title: '', time: '09:00', color: 'blue', description: '' });
    setShowEventForm(false);
  };

  const handleDeleteEvent = (id: string) => {
    setEvents(prev => prev.filter(e => e.id !== id));
  };

  const handleEditEvent = (event: CalendarEvent) => {
    setEditingEvent(event);
    setNewEvent({
      title: event.title,
      time: event.time,
      color: event.color,
      description: event.description || '',
    });
    setShowEventForm(true);
  };

  const isToday = (day: number) => 
    today.getDate() === day && 
    today.getMonth() === currentDate.getMonth() && 
    today.getFullYear() === currentDate.getFullYear();

  const isSelected = (day: number) =>
    selectedDate?.getDate() === day &&
    selectedDate?.getMonth() === currentDate.getMonth() &&
    selectedDate?.getFullYear() === currentDate.getFullYear();

  const getColorClass = (colorId: string) => {
    return colorOptions.find(c => c.id === colorId) || colorOptions[0];
  };

  const selectedDateEvents = getEventsForSelectedDate();

  return (
    <div className="h-full w-full bg-white dark:bg-[#1a1a1a] flex text-foreground">
      <div className="flex-1 p-6 overflow-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}
              className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-bold min-w-[200px] text-center">
              {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </h2>
            <button 
              onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}
              className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
          <button 
            onClick={() => setCurrentDate(new Date())}
            className="px-3 py-1.5 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
          >
            Today
          </button>
        </div>

        <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-xl p-4">
          <div className="grid grid-cols-7 gap-1 mb-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="text-center font-medium text-xs text-zinc-500 py-2">{day}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {Array(firstDay).fill(null).map((_, i) => (
              <div key={`empty-${i}`} className="aspect-square" />
            ))}
            {days.map(day => {
              const dayEvents = getEventsForDate(day);
              return (
                <button 
                  key={day}
                  onClick={() => handleDayClick(day)}
                  className={`
                    aspect-square rounded-lg flex flex-col items-center justify-start p-1 text-sm font-medium transition-all relative
                    ${isToday(day) ? 'bg-blue-600 text-white' : ''}
                    ${isSelected(day) && !isToday(day) ? 'bg-blue-100 dark:bg-blue-900/50 ring-2 ring-blue-500' : ''}
                    ${!isToday(day) && !isSelected(day) ? 'hover:bg-zinc-100 dark:hover:bg-zinc-700' : ''}
                  `}
                >
                  <span className="mb-0.5">{day}</span>
                  {dayEvents.length > 0 && (
                    <div className="flex gap-0.5 flex-wrap justify-center">
                      {dayEvents.slice(0, 3).map(event => (
                        <div 
                          key={event.id}
                          className={`w-1.5 h-1.5 rounded-full ${getColorClass(event.color).bg}`}
                        />
                      ))}
                      {dayEvents.length > 3 && (
                        <span className="text-[8px] text-zinc-500">+{dayEvents.length - 3}</span>
                      )}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {!selectedDate && (
          <div className="mt-6 text-center text-zinc-500">
            <CalendarIcon className="w-12 h-12 mx-auto mb-2 opacity-30" />
            <p>Select a date to view or add events</p>
          </div>
        )}
      </div>

      {selectedDate && (
        <div className="w-80 border-l border-zinc-200 dark:border-zinc-800 p-4 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-lg">
                {selectedDate.toLocaleDateString('en-US', { weekday: 'long' })}
              </h3>
              <p className="text-sm text-zinc-500">
                {selectedDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </p>
            </div>
            <button 
              onClick={() => { 
                setShowEventForm(true); 
                setEditingEvent(null); 
                setNewEvent({ title: '', time: '09:00', color: 'blue', description: '' }); 
              }}
              className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>

          {showEventForm && (
            <div className="mb-4 p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium">{editingEvent ? 'Edit Event' : 'New Event'}</h4>
                <button 
                  onClick={() => { 
                    setShowEventForm(false); 
                    setEditingEvent(null); 
                    setNewEvent({ title: '', time: '09:00', color: 'blue', description: '' });
                  }}
                  className="p-1 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <input
                type="text"
                placeholder="Event title"
                value={newEvent.title}
                onChange={(e) => setNewEvent(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-3 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg mb-2 text-sm"
                autoFocus
              />
              <div className="flex gap-2 mb-2">
                <div className="flex-1">
                  <label className="text-xs text-zinc-500 mb-1 block">Time</label>
                  <input
                    type="time"
                    value={newEvent.time}
                    onChange={(e) => setNewEvent(prev => ({ ...prev, time: e.target.value }))}
                    className="w-full px-3 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm"
                  />
                </div>
              </div>
              <div className="mb-2">
                <label className="text-xs text-zinc-500 mb-1 block">Color</label>
                <div className="flex gap-1">
                  {colorOptions.map(color => (
                    <button
                      key={color.id}
                      onClick={() => setNewEvent(prev => ({ ...prev, color: color.id }))}
                      className={`w-6 h-6 rounded-full ${color.bg} ${newEvent.color === color.id ? 'ring-2 ring-offset-2 ring-zinc-400' : ''}`}
                    />
                  ))}
                </div>
              </div>
              <textarea
                placeholder="Description (optional)"
                value={newEvent.description}
                onChange={(e) => setNewEvent(prev => ({ ...prev, description: e.target.value }))}
                className="w-full px-3 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg mb-3 text-sm resize-none h-16"
              />
              <button
                onClick={handleAddEvent}
                disabled={!newEvent.title.trim()}
                className="w-full py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-zinc-400 text-white rounded-lg text-sm font-medium flex items-center justify-center gap-2"
              >
                <Check className="w-4 h-4" />
                {editingEvent ? 'Save Changes' : 'Add Event'}
              </button>
            </div>
          )}

          <div className="flex-1 overflow-auto">
            {selectedDateEvents.length === 0 ? (
              <div className="text-center text-zinc-400 py-8">
                <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No events for this day</p>
              </div>
            ) : (
              <div className="space-y-2">
                {selectedDateEvents.map(event => {
                  const color = getColorClass(event.color);
                  return (
                    <div 
                      key={event.id}
                      className={`p-3 rounded-lg ${color.light} border-l-4 ${color.bg.replace('bg-', 'border-')} group`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm truncate">{event.title}</h4>
                          <p className="text-xs text-zinc-500 flex items-center gap-1 mt-0.5">
                            <Clock className="w-3 h-3" />
                            {event.time}
                          </p>
                          {event.description && (
                            <p className="text-xs text-zinc-500 mt-1 line-clamp-2">{event.description}</p>
                          )}
                        </div>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => handleEditEvent(event)}
                            className="p-1 hover:bg-white/50 dark:hover:bg-black/20 rounded"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button 
                            onClick={() => handleDeleteEvent(event.id)}
                            className="p-1 hover:bg-red-100 dark:hover:bg-red-900/30 rounded text-red-500"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
