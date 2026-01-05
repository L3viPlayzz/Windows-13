import { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Plus, Trash2, Save, Sun, Cloud, CloudRain, CloudSnow, Wind,
  Brush, Eraser, Square, Circle, Minus, Download,
  Image as ImageIcon, Upload, ZoomIn, ZoomOut, RotateCw,
  MapPin, Navigation, Layers,
  BookOpen, FileText, ChevronLeft, ChevronRight,
  Gamepad2, Trophy, Star, Play, Pause, RefreshCw,
  Newspaper, ExternalLink, Clock, ArrowUp, ArrowDown, ArrowLeft, ArrowRight,
  Flag, Bomb, Grid3X3, Loader2, Search,
} from 'lucide-react';

export function NotesApp() {
  const [notes, setNotes] = useState<Array<{ id: number; title: string; content: string; date: string }>>(() => {
    const saved = localStorage.getItem('windows13-notes');
    return saved ? JSON.parse(saved) : [
      { id: 1, title: 'Welcome!', content: 'Welcome to Notes! Start writing your thoughts here.', date: new Date().toLocaleDateString() }
    ];
  });
  const [activeNote, setActiveNote] = useState(notes[0]?.id || 0);
  const [editContent, setEditContent] = useState(notes[0]?.content || '');

  useEffect(() => {
    localStorage.setItem('windows13-notes', JSON.stringify(notes));
  }, [notes]);

  const addNote = () => {
    const newNote = {
      id: Date.now(),
      title: 'New Note',
      content: '',
      date: new Date().toLocaleDateString(),
    };
    setNotes([newNote, ...notes]);
    setActiveNote(newNote.id);
    setEditContent('');
  };

  const deleteNote = (id: number) => {
    const filtered = notes.filter(n => n.id !== id);
    setNotes(filtered);
    if (activeNote === id && filtered.length > 0) {
      setActiveNote(filtered[0].id);
      setEditContent(filtered[0].content);
    }
  };

  const updateNote = (content: string) => {
    setEditContent(content);
    setNotes(notes.map(n => 
      n.id === activeNote 
        ? { ...n, content, title: content.split('\n')[0].slice(0, 30) || 'Untitled' }
        : n
    ));
  };

  const currentNote = notes.find(n => n.id === activeNote);

  return (
    <div className="h-full flex bg-background">
      <div className="w-64 border-r border-zinc-200 dark:border-white/10 flex flex-col">
        <div className="p-3 border-b border-zinc-200 dark:border-white/10">
          <button 
            onClick={addNote}
            className="w-full py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg flex items-center justify-center gap-2 font-medium"
          >
            <Plus className="w-4 h-4" />
            New Note
          </button>
        </div>
        <div className="flex-1 overflow-auto">
          {notes.map(note => (
            <div
              key={note.id}
              onClick={() => { setActiveNote(note.id); setEditContent(note.content); }}
              className={`p-3 border-b border-zinc-100 dark:border-white/5 cursor-pointer ${
                activeNote === note.id ? 'bg-yellow-50 dark:bg-yellow-900/20' : 'hover:bg-zinc-50 dark:hover:bg-white/5'
              }`}
            >
              <div className="flex justify-between items-start">
                <div className="font-medium text-sm truncate flex-1">{note.title}</div>
                <button 
                  onClick={(e) => { e.stopPropagation(); deleteNote(note.id); }}
                  className="p-1 hover:bg-red-100 dark:hover:bg-red-900/30 rounded text-red-500"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
              <div className="text-xs text-muted-foreground mt-1">{note.date}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex-1 flex flex-col">
        {currentNote ? (
          <textarea
            value={editContent}
            onChange={(e) => updateNote(e.target.value)}
            placeholder="Start typing..."
            className="flex-1 p-4 resize-none bg-transparent focus:outline-none text-foreground"
          />
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            No note selected
          </div>
        )}
      </div>
    </div>
  );
}

export function WeatherApp() {
  const [city, setCity] = useState('Amsterdam');
  const [loading, setLoading] = useState(false);
  const [weather, setWeather] = useState({
    temp: 15,
    condition: 'Partly Cloudy',
    humidity: 65,
    wind: 18,
    icon: 'cloud',
    forecast: [
      { day: 'Mon', temp: 15, icon: 'cloud' },
      { day: 'Tue', temp: 17, icon: 'sun' },
      { day: 'Wed', temp: 14, icon: 'rain' },
      { day: 'Thu', temp: 16, icon: 'cloud' },
      { day: 'Fri', temp: 18, icon: 'sun' },
    ]
  });

  const fetchWeather = async (searchCity: string) => {
    setLoading(true);
    try {
      const response = await fetch(`https://wttr.in/${encodeURIComponent(searchCity)}?format=j1`);
      if (response.ok) {
        const data = await response.json();
        const current = data.current_condition[0];
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        
        const getIconType = (code: string) => {
          const c = parseInt(code);
          if (c === 113) return 'sun';
          if (c >= 116 && c <= 122) return 'cloud';
          if (c >= 176 && c <= 359) return 'rain';
          if (c >= 368 && c <= 395) return 'snow';
          return 'cloud';
        };

        setWeather({
          temp: parseInt(current.temp_C),
          condition: current.weatherDesc[0].value,
          humidity: parseInt(current.humidity),
          wind: parseInt(current.windspeedKmph),
          icon: getIconType(current.weatherCode),
          forecast: data.weather.slice(0, 5).map((day: any, i: number) => {
            const date = new Date(day.date);
            return {
              day: days[date.getDay()],
              temp: parseInt(day.avgtempC),
              icon: getIconType(day.hourly[4].weatherCode),
            };
          }),
        });
      }
    } catch (error) {
      console.error('Weather fetch error:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchWeather(city);
  }, []);

  const handleSearch = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      fetchWeather(city);
    }
  };

  const getWeatherIcon = (icon: string, size = 8) => {
    const className = `w-${size} h-${size}`;
    switch (icon) {
      case 'sun': return <Sun className={`${className} text-yellow-500`} />;
      case 'cloud': return <Cloud className={`${className} text-gray-300`} />;
      case 'rain': return <CloudRain className={`${className} text-blue-400`} />;
      case 'snow': return <CloudSnow className={`${className} text-blue-200`} />;
      default: return <Sun className={`${className} text-yellow-500`} />;
    }
  };

  return (
    <div className="h-full bg-gradient-to-br from-blue-400 to-blue-600 text-white p-6 overflow-auto">
      <div className="max-w-md mx-auto">
        <div className="relative mb-6">
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            onKeyDown={handleSearch}
            className="w-full p-3 pr-12 rounded-xl bg-white/20 backdrop-blur-sm border-0 text-white placeholder-white/60"
            placeholder="Search city... (press Enter)"
          />
          <button 
            onClick={() => fetchWeather(city)}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 hover:bg-white/20 rounded-lg"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
          </button>
        </div>
        
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            {getWeatherIcon(weather.icon, 16)}
          </div>
          <div className="text-6xl mb-2 font-light">{weather.temp}°C</div>
          <div className="text-xl opacity-80">{weather.condition}</div>
          <div className="text-lg opacity-60">{city}</div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center">
            <Cloud className="w-6 h-6 mx-auto mb-2 opacity-80" />
            <div className="text-2xl font-bold">{weather.humidity}%</div>
            <div className="text-sm opacity-80">Humidity</div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center">
            <Wind className="w-6 h-6 mx-auto mb-2 opacity-80" />
            <div className="text-2xl font-bold">{weather.wind} km/h</div>
            <div className="text-sm opacity-80">Wind</div>
          </div>
        </div>

        <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
          <h3 className="font-medium mb-4 opacity-80">5-Day Forecast</h3>
          <div className="flex justify-between">
            {weather.forecast.map((day, i) => (
              <div key={i} className="text-center">
                <div className="text-sm opacity-80 mb-2">{day.day}</div>
                {getWeatherIcon(day.icon, 8)}
                <div className="text-lg font-bold mt-2">{day.temp}°</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function NewsApp() {
  const [articles, setArticles] = useState<Array<{
    title: string;
    description: string;
    source: string;
    time: string;
    category: string;
  }>>([
    { title: 'AI Revolution: New Models Outperform Human Experts', description: 'Latest AI developments show unprecedented capabilities in multiple domains.', source: 'Tech News', time: '2 hours ago', category: 'Technology' },
    { title: 'Global Markets Rally on Economic Data', description: 'Stock markets worldwide see gains following positive economic indicators.', source: 'Finance Daily', time: '3 hours ago', category: 'Business' },
    { title: 'Climate Summit Reaches Historic Agreement', description: 'World leaders commit to ambitious new targets for emissions reduction.', source: 'World News', time: '5 hours ago', category: 'World' },
    { title: 'Major Sports League Announces Expansion', description: 'New teams to be added in upcoming seasons as league grows.', source: 'Sports Central', time: '6 hours ago', category: 'Sports' },
    { title: 'Breakthrough in Renewable Energy Storage', description: 'Scientists develop new battery technology that could transform clean energy.', source: 'Science Today', time: '8 hours ago', category: 'Science' },
    { title: 'Entertainment Industry Adapts to Streaming Era', description: 'Major studios announce new strategies for content distribution.', source: 'Entertainment Weekly', time: '10 hours ago', category: 'Entertainment' },
  ]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const categories = ['All', 'Technology', 'Business', 'World', 'Sports', 'Science', 'Entertainment'];

  const filteredArticles = selectedCategory === 'All' 
    ? articles 
    : articles.filter(a => a.category === selectedCategory);

  return (
    <div className="h-full flex flex-col bg-background">
      <div className="p-4 border-b border-zinc-200 dark:border-white/10">
        <h1 className="text-xl font-bold flex items-center gap-2 mb-4">
          <Newspaper className="w-6 h-6 text-blue-500" />
          News
        </h1>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                selectedCategory === cat 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>
      <div className="flex-1 overflow-auto">
        {filteredArticles.map((article, i) => (
          <div key={i} className="p-4 border-b border-zinc-100 dark:border-white/5 hover:bg-zinc-50 dark:hover:bg-white/5 cursor-pointer">
            <div className="flex items-start gap-3">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg flex-shrink-0 flex items-center justify-center">
                <Newspaper className="w-8 h-8 text-white/80" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-sm line-clamp-2 mb-1">{article.title}</h3>
                <p className="text-xs text-muted-foreground line-clamp-2 mb-2">{article.description}</p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="font-medium text-blue-500">{article.source}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {article.time}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function PaintApp() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState(5);
  const [tool, setTool] = useState<'brush' | 'eraser'>('brush');

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
    }
  }, []);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    draw(e);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.strokeStyle = tool === 'eraser' ? '#ffffff' : color;
    
    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) ctx.beginPath();
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
    }
  };

  const saveCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const link = document.createElement('a');
      link.download = 'drawing.png';
      link.href = canvas.toDataURL();
      link.click();
    }
  };

  const colors = ['#000000', '#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff', '#ff8800'];

  return (
    <div className="h-full flex flex-col bg-zinc-100 dark:bg-zinc-900">
      <div className="p-3 border-b border-zinc-200 dark:border-white/10 flex items-center gap-4 bg-white dark:bg-zinc-800">
        <div className="flex gap-1">
          <button
            onClick={() => setTool('brush')}
            className={`p-2 rounded ${tool === 'brush' ? 'bg-blue-100 dark:bg-blue-900 text-blue-600' : 'hover:bg-zinc-100 dark:hover:bg-zinc-700'}`}
          >
            <Brush className="w-5 h-5" />
          </button>
          <button
            onClick={() => setTool('eraser')}
            className={`p-2 rounded ${tool === 'eraser' ? 'bg-blue-100 dark:bg-blue-900 text-blue-600' : 'hover:bg-zinc-100 dark:hover:bg-zinc-700'}`}
          >
            <Eraser className="w-5 h-5" />
          </button>
        </div>
        
        <div className="flex gap-1">
          {colors.map(c => (
            <button
              key={c}
              onClick={() => setColor(c)}
              className={`w-6 h-6 rounded-full border-2 ${color === c ? 'border-blue-500' : 'border-transparent'}`}
              style={{ backgroundColor: c }}
            />
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Size:</span>
          <input
            type="range"
            min="1"
            max="50"
            value={brushSize}
            onChange={(e) => setBrushSize(Number(e.target.value))}
            className="w-24"
          />
          <span className="text-sm w-6">{brushSize}</span>
        </div>

        <div className="ml-auto flex gap-2">
          <button onClick={clearCanvas} className="px-3 py-1.5 bg-red-100 dark:bg-red-900/30 text-red-600 rounded text-sm">
            Clear
          </button>
          <button onClick={saveCanvas} className="px-3 py-1.5 bg-blue-600 text-white rounded text-sm flex items-center gap-1">
            <Download className="w-4 h-4" />
            Save
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-auto p-4">
        <canvas
          ref={canvasRef}
          width={800}
          height={600}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          className="bg-white rounded-lg shadow-lg cursor-crosshair mx-auto"
        />
      </div>
    </div>
  );
}

export function PhotosApp() {
  const [photos, setPhotos] = useState<Array<{ id: number; url: string; name: string }>>([]);
  const [selectedPhoto, setSelectedPhoto] = useState<{ id: number; url: string; name: string } | null>(null);
  const [zoom, setZoom] = useState(1);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onload = (event) => {
          setPhotos(prev => [...prev, {
            id: Date.now() + Math.random(),
            url: event.target?.result as string,
            name: file.name,
          }]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  return (
    <div className="h-full flex flex-col bg-background">
      {selectedPhoto ? (
        <div className="flex-1 flex flex-col">
          <div className="p-3 border-b border-zinc-200 dark:border-white/10 flex items-center gap-4">
            <button onClick={() => setSelectedPhoto(null)} className="text-blue-500 hover:underline">
              ← Back
            </button>
            <span className="flex-1 truncate">{selectedPhoto.name}</span>
            <div className="flex gap-2">
              <button onClick={() => setZoom(z => Math.max(0.5, z - 0.25))} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded">
                <ZoomOut className="w-5 h-5" />
              </button>
              <button onClick={() => setZoom(z => Math.min(3, z + 0.25))} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded">
                <ZoomIn className="w-5 h-5" />
              </button>
            </div>
          </div>
          <div className="flex-1 overflow-auto flex items-center justify-center bg-black/90 p-4">
            <img 
              src={selectedPhoto.url} 
              alt={selectedPhoto.name}
              style={{ transform: `scale(${zoom})` }}
              className="max-w-full max-h-full object-contain transition-transform"
            />
          </div>
        </div>
      ) : (
        <>
          <div className="p-3 border-b border-zinc-200 dark:border-white/10 flex items-center gap-4">
            <h2 className="text-lg font-bold">Photos</h2>
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="ml-auto px-3 py-1.5 bg-blue-600 text-white rounded-lg flex items-center gap-2"
            >
              <Upload className="w-4 h-4" />
              Add Photos
            </button>
            <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={handleUpload} className="hidden" />
          </div>
          <div className="flex-1 overflow-auto p-4">
            {photos.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-muted-foreground">
                <ImageIcon className="w-16 h-16 mb-4 opacity-30" />
                <p>No photos yet</p>
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg"
                >
                  Add Photos
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-4 gap-4">
                {photos.map(photo => (
                  <div
                    key={photo.id}
                    onClick={() => { setSelectedPhoto(photo); setZoom(1); }}
                    className="aspect-square rounded-lg overflow-hidden cursor-pointer hover:ring-2 ring-blue-500 transition-all"
                  >
                    <img src={photo.url} alt={photo.name} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export function MapsApp() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('New York City');

  const locations = [
    { name: 'New York City', lat: 40.7128, lng: -74.0060 },
    { name: 'Los Angeles', lat: 34.0522, lng: -118.2437 },
    { name: 'Chicago', lat: 41.8781, lng: -87.6298 },
    { name: 'Houston', lat: 29.7604, lng: -95.3698 },
    { name: 'Phoenix', lat: 33.4484, lng: -112.0740 },
  ];

  return (
    <div className="h-full flex flex-col bg-background">
      <div className="p-3 border-b border-zinc-200 dark:border-white/10 flex items-center gap-4">
        <div className="relative flex-1">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for a place..."
            className="w-full pl-10 pr-4 py-2 bg-zinc-100 dark:bg-zinc-800 rounded-lg border-0"
          />
        </div>
        <button className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg">
          <Navigation className="w-5 h-5" />
        </button>
        <button className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg">
          <Layers className="w-5 h-5" />
        </button>
      </div>
      <div className="flex-1 relative bg-gradient-to-br from-blue-100 to-green-100 dark:from-blue-900/30 dark:to-green-900/30">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <MapPin className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold">{selectedLocation}</h2>
            <p className="text-muted-foreground">Interactive map coming soon</p>
          </div>
        </div>
        <div className="absolute bottom-4 left-4 bg-white dark:bg-zinc-800 rounded-lg shadow-lg p-3 max-w-xs">
          <h3 className="font-medium text-sm mb-2">Quick Locations</h3>
          <div className="space-y-1">
            {locations.map(loc => (
              <button
                key={loc.name}
                onClick={() => setSelectedLocation(loc.name)}
                className={`w-full text-left px-2 py-1.5 rounded text-sm ${
                  selectedLocation === loc.name ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600' : 'hover:bg-zinc-100 dark:hover:bg-zinc-700'
                }`}
              >
                {loc.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function ReaderApp() {
  const [books] = useState([
    { id: 1, title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', pages: 180 },
    { id: 2, title: '1984', author: 'George Orwell', pages: 328 },
    { id: 3, title: 'Pride and Prejudice', author: 'Jane Austen', pages: 279 },
  ]);
  const [selectedBook, setSelectedBook] = useState<typeof books[0] | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  return (
    <div className="h-full flex flex-col bg-amber-50 dark:bg-zinc-900">
      {selectedBook ? (
        <>
          <div className="p-3 border-b border-amber-200 dark:border-white/10 flex items-center gap-4">
            <button onClick={() => setSelectedBook(null)} className="text-amber-700 dark:text-amber-400 hover:underline">
              ← Library
            </button>
            <span className="flex-1 font-medium">{selectedBook.title}</span>
            <span className="text-sm text-muted-foreground">Page {currentPage} of {selectedBook.pages}</span>
          </div>
          <div className="flex-1 overflow-auto p-8 max-w-2xl mx-auto">
            <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-lg p-8 min-h-full">
              <h2 className="text-2xl font-serif font-bold mb-4">{selectedBook.title}</h2>
              <p className="text-muted-foreground mb-6">by {selectedBook.author}</p>
              <div className="prose dark:prose-invert">
                <p className="text-lg leading-relaxed">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                </p>
              </div>
            </div>
          </div>
          <div className="p-3 border-t border-amber-200 dark:border-white/10 flex justify-center gap-4">
            <button 
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              className="p-2 hover:bg-amber-200 dark:hover:bg-zinc-800 rounded"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button 
              onClick={() => setCurrentPage(p => Math.min(selectedBook.pages, p + 1))}
              className="p-2 hover:bg-amber-200 dark:hover:bg-zinc-800 rounded"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </>
      ) : (
        <>
          <div className="p-4 border-b border-amber-200 dark:border-white/10">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-amber-600" />
              Library
            </h2>
          </div>
          <div className="flex-1 overflow-auto p-4">
            <div className="grid grid-cols-3 gap-4">
              {books.map(book => (
                <div
                  key={book.id}
                  onClick={() => { setSelectedBook(book); setCurrentPage(1); }}
                  className="bg-white dark:bg-zinc-800 rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
                >
                  <div className="h-40 bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                    <BookOpen className="w-12 h-12 text-white/80" />
                  </div>
                  <div className="p-3">
                    <h3 className="font-medium truncate">{book.title}</h3>
                    <p className="text-sm text-muted-foreground">{book.author}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// Snake Game Component
function SnakeGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const gameState = useRef({
    snake: [{ x: 10, y: 10 }],
    food: { x: 15, y: 15 },
    direction: { x: 1, y: 0 },
    nextDirection: { x: 1, y: 0 },
  });

  const GRID_SIZE = 20;
  const CELL_SIZE = 15;

  const resetGame = () => {
    gameState.current = {
      snake: [{ x: 10, y: 10 }],
      food: { x: Math.floor(Math.random() * GRID_SIZE), y: Math.floor(Math.random() * GRID_SIZE) },
      direction: { x: 1, y: 0 },
      nextDirection: { x: 1, y: 0 },
    };
    setScore(0);
    setGameOver(false);
    setIsPlaying(true);
  };

  useEffect(() => {
    if (!isPlaying || gameOver) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const { direction } = gameState.current;
      switch (e.key) {
        case 'ArrowUp': if (direction.y !== 1) gameState.current.nextDirection = { x: 0, y: -1 }; break;
        case 'ArrowDown': if (direction.y !== -1) gameState.current.nextDirection = { x: 0, y: 1 }; break;
        case 'ArrowLeft': if (direction.x !== 1) gameState.current.nextDirection = { x: -1, y: 0 }; break;
        case 'ArrowRight': if (direction.x !== -1) gameState.current.nextDirection = { x: 1, y: 0 }; break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    const gameLoop = setInterval(() => {
      const { snake, food, nextDirection } = gameState.current;
      gameState.current.direction = nextDirection;
      
      const head = { x: snake[0].x + nextDirection.x, y: snake[0].y + nextDirection.y };
      
      if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE ||
          snake.some(s => s.x === head.x && s.y === head.y)) {
        setGameOver(true);
        setIsPlaying(false);
        return;
      }

      const newSnake = [head, ...snake];
      
      if (head.x === food.x && head.y === food.y) {
        setScore(s => s + 10);
        gameState.current.food = {
          x: Math.floor(Math.random() * GRID_SIZE),
          y: Math.floor(Math.random() * GRID_SIZE),
        };
      } else {
        newSnake.pop();
      }
      
      gameState.current.snake = newSnake;

      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.fillStyle = '#1a1a2e';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          
          ctx.fillStyle = '#4ade80';
          newSnake.forEach((segment, i) => {
            ctx.fillStyle = i === 0 ? '#22c55e' : '#4ade80';
            ctx.fillRect(segment.x * CELL_SIZE, segment.y * CELL_SIZE, CELL_SIZE - 1, CELL_SIZE - 1);
          });
          
          ctx.fillStyle = '#ef4444';
          ctx.fillRect(gameState.current.food.x * CELL_SIZE, gameState.current.food.y * CELL_SIZE, CELL_SIZE - 1, CELL_SIZE - 1);
        }
      }
    }, 100);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      clearInterval(gameLoop);
    };
  }, [isPlaying, gameOver]);

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex items-center gap-4 text-white">
        <span>Score: {score}</span>
      </div>
      <canvas 
        ref={canvasRef} 
        width={GRID_SIZE * CELL_SIZE} 
        height={GRID_SIZE * CELL_SIZE}
        className="border-2 border-green-500 rounded"
      />
      {!isPlaying && (
        <button onClick={resetGame} className="px-6 py-2 bg-green-500 hover:bg-green-600 rounded-lg font-medium">
          {gameOver ? 'Play Again' : 'Start Snake'}
        </button>
      )}
      {isPlaying && <p className="text-xs text-white/60">Use arrow keys to move</p>}
    </div>
  );
}

// Minesweeper Game Component
function MinesweeperGame() {
  const GRID_SIZE = 10;
  const MINE_COUNT = 15;
  
  const [grid, setGrid] = useState<Array<Array<{
    isMine: boolean;
    isRevealed: boolean;
    isFlagged: boolean;
    neighborMines: number;
  }>>>([]);
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);

  const initGame = useCallback(() => {
    const newGrid: typeof grid = [];
    for (let y = 0; y < GRID_SIZE; y++) {
      newGrid[y] = [];
      for (let x = 0; x < GRID_SIZE; x++) {
        newGrid[y][x] = { isMine: false, isRevealed: false, isFlagged: false, neighborMines: 0 };
      }
    }
    
    let minesPlaced = 0;
    while (minesPlaced < MINE_COUNT) {
      const x = Math.floor(Math.random() * GRID_SIZE);
      const y = Math.floor(Math.random() * GRID_SIZE);
      if (!newGrid[y][x].isMine) {
        newGrid[y][x].isMine = true;
        minesPlaced++;
      }
    }
    
    for (let y = 0; y < GRID_SIZE; y++) {
      for (let x = 0; x < GRID_SIZE; x++) {
        if (!newGrid[y][x].isMine) {
          let count = 0;
          for (let dy = -1; dy <= 1; dy++) {
            for (let dx = -1; dx <= 1; dx++) {
              const ny = y + dy, nx = x + dx;
              if (ny >= 0 && ny < GRID_SIZE && nx >= 0 && nx < GRID_SIZE && newGrid[ny][nx].isMine) {
                count++;
              }
            }
          }
          newGrid[y][x].neighborMines = count;
        }
      }
    }
    
    setGrid(newGrid);
    setGameOver(false);
    setWon(false);
  }, []);

  useEffect(() => { initGame(); }, [initGame]);

  const revealCell = (x: number, y: number) => {
    if (gameOver || won || grid[y][x].isRevealed || grid[y][x].isFlagged) return;
    
    const newGrid = grid.map(row => row.map(cell => ({ ...cell })));
    
    if (newGrid[y][x].isMine) {
      newGrid.forEach(row => row.forEach(cell => { if (cell.isMine) cell.isRevealed = true; }));
      setGrid(newGrid);
      setGameOver(true);
      return;
    }
    
    const reveal = (cx: number, cy: number) => {
      if (cx < 0 || cx >= GRID_SIZE || cy < 0 || cy >= GRID_SIZE) return;
      if (newGrid[cy][cx].isRevealed || newGrid[cy][cx].isFlagged || newGrid[cy][cx].isMine) return;
      newGrid[cy][cx].isRevealed = true;
      if (newGrid[cy][cx].neighborMines === 0) {
        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            reveal(cx + dx, cy + dy);
          }
        }
      }
    };
    
    reveal(x, y);
    setGrid(newGrid);
    
    const unrevealedSafe = newGrid.flat().filter(c => !c.isRevealed && !c.isMine).length;
    if (unrevealedSafe === 0) setWon(true);
  };

  const toggleFlag = (e: React.MouseEvent, x: number, y: number) => {
    e.preventDefault();
    if (gameOver || won || grid[y][x].isRevealed) return;
    const newGrid = grid.map(row => row.map(cell => ({ ...cell })));
    newGrid[y][x].isFlagged = !newGrid[y][x].isFlagged;
    setGrid(newGrid);
  };

  const getCellColor = (cell: typeof grid[0][0]) => {
    if (!cell.isRevealed) return 'bg-zinc-600 hover:bg-zinc-500';
    if (cell.isMine) return 'bg-red-500';
    return 'bg-zinc-800';
  };

  const getNumberColor = (n: number) => {
    const colors = ['', 'text-blue-400', 'text-green-400', 'text-red-400', 'text-purple-400', 'text-yellow-400', 'text-cyan-400', 'text-pink-400', 'text-white'];
    return colors[n] || '';
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex items-center gap-4 text-white">
        <span className="flex items-center gap-1"><Bomb className="w-4 h-4" /> {MINE_COUNT}</span>
        {gameOver && <span className="text-red-400">Game Over!</span>}
        {won && <span className="text-green-400">You Won!</span>}
      </div>
      <div className="grid gap-0.5" style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, 24px)` }}>
        {grid.map((row, y) => row.map((cell, x) => (
          <button
            key={`${x}-${y}`}
            onClick={() => revealCell(x, y)}
            onContextMenu={(e) => toggleFlag(e, x, y)}
            className={`w-6 h-6 flex items-center justify-center text-xs font-bold rounded-sm ${getCellColor(cell)}`}
          >
            {cell.isFlagged && !cell.isRevealed && <Flag className="w-3 h-3 text-red-400" />}
            {cell.isRevealed && cell.isMine && <Bomb className="w-3 h-3" />}
            {cell.isRevealed && !cell.isMine && cell.neighborMines > 0 && (
              <span className={getNumberColor(cell.neighborMines)}>{cell.neighborMines}</span>
            )}
          </button>
        )))}
      </div>
      <button onClick={initGame} className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg font-medium text-sm">
        New Game
      </button>
      <p className="text-xs text-white/60">Left click: reveal, Right click: flag</p>
    </div>
  );
}

// Tetris Game Component
function TetrisGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const COLS = 10;
  const ROWS = 20;
  const CELL_SIZE = 20;
  
  const SHAPES = [
    [[1,1,1,1]], // I
    [[1,1],[1,1]], // O
    [[0,1,0],[1,1,1]], // T
    [[1,0,0],[1,1,1]], // L
    [[0,0,1],[1,1,1]], // J
    [[0,1,1],[1,1,0]], // S
    [[1,1,0],[0,1,1]], // Z
  ];
  const COLORS = ['#00f5ff', '#ffff00', '#a855f7', '#ff8800', '#3b82f6', '#22c55e', '#ef4444'];
  
  const gameState = useRef({
    board: Array(ROWS).fill(null).map(() => Array(COLS).fill(0)),
    piece: { shape: SHAPES[0], x: 3, y: 0, color: 0 },
    gameLoop: null as any,
  });

  const spawnPiece = () => {
    const idx = Math.floor(Math.random() * SHAPES.length);
    gameState.current.piece = { shape: SHAPES[idx], x: 3, y: 0, color: idx };
  };

  const canMove = (shape: number[][], x: number, y: number) => {
    for (let row = 0; row < shape.length; row++) {
      for (let col = 0; col < shape[row].length; col++) {
        if (shape[row][col]) {
          const newX = x + col;
          const newY = y + row;
          if (newX < 0 || newX >= COLS || newY >= ROWS) return false;
          if (newY >= 0 && gameState.current.board[newY][newX]) return false;
        }
      }
    }
    return true;
  };

  const placePiece = () => {
    const { piece, board } = gameState.current;
    for (let row = 0; row < piece.shape.length; row++) {
      for (let col = 0; col < piece.shape[row].length; col++) {
        if (piece.shape[row][col]) {
          const y = piece.y + row;
          const x = piece.x + col;
          if (y >= 0) board[y][x] = piece.color + 1;
        }
      }
    }
    
    let linesCleared = 0;
    for (let row = ROWS - 1; row >= 0; row--) {
      if (board[row].every(cell => cell !== 0)) {
        board.splice(row, 1);
        board.unshift(Array(COLS).fill(0));
        linesCleared++;
        row++;
      }
    }
    if (linesCleared > 0) setScore(s => s + linesCleared * 100);
    
    spawnPiece();
    if (!canMove(gameState.current.piece.shape, gameState.current.piece.x, gameState.current.piece.y)) {
      setGameOver(true);
      setIsPlaying(false);
    }
  };

  const rotate = () => {
    const { piece } = gameState.current;
    const rotated = piece.shape[0].map((_, i) => piece.shape.map(row => row[i]).reverse());
    if (canMove(rotated, piece.x, piece.y)) {
      piece.shape = rotated;
    }
  };

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const { board, piece } = gameState.current;
    
    for (let row = 0; row < ROWS; row++) {
      for (let col = 0; col < COLS; col++) {
        if (board[row][col]) {
          ctx.fillStyle = COLORS[board[row][col] - 1];
          ctx.fillRect(col * CELL_SIZE, row * CELL_SIZE, CELL_SIZE - 1, CELL_SIZE - 1);
        }
      }
    }

    ctx.fillStyle = COLORS[piece.color];
    for (let row = 0; row < piece.shape.length; row++) {
      for (let col = 0; col < piece.shape[row].length; col++) {
        if (piece.shape[row][col]) {
          ctx.fillRect((piece.x + col) * CELL_SIZE, (piece.y + row) * CELL_SIZE, CELL_SIZE - 1, CELL_SIZE - 1);
        }
      }
    }
  };

  const resetGame = () => {
    gameState.current.board = Array(ROWS).fill(null).map(() => Array(COLS).fill(0));
    spawnPiece();
    setScore(0);
    setGameOver(false);
    setIsPlaying(true);
  };

  useEffect(() => {
    if (!isPlaying) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const { piece } = gameState.current;
      switch (e.key) {
        case 'ArrowLeft':
          if (canMove(piece.shape, piece.x - 1, piece.y)) piece.x--;
          break;
        case 'ArrowRight':
          if (canMove(piece.shape, piece.x + 1, piece.y)) piece.x++;
          break;
        case 'ArrowDown':
          if (canMove(piece.shape, piece.x, piece.y + 1)) piece.y++;
          else placePiece();
          break;
        case 'ArrowUp':
          rotate();
          break;
      }
      draw();
    };

    window.addEventListener('keydown', handleKeyDown);

    const gameLoop = setInterval(() => {
      const { piece } = gameState.current;
      if (canMove(piece.shape, piece.x, piece.y + 1)) {
        piece.y++;
      } else {
        placePiece();
      }
      draw();
    }, 500);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      clearInterval(gameLoop);
    };
  }, [isPlaying]);

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="text-white">Score: {score}</div>
      <canvas 
        ref={canvasRef} 
        width={COLS * CELL_SIZE} 
        height={ROWS * CELL_SIZE}
        className="border-2 border-purple-500 rounded"
      />
      {!isPlaying && (
        <button onClick={resetGame} className="px-6 py-2 bg-purple-500 hover:bg-purple-600 rounded-lg font-medium">
          {gameOver ? 'Play Again' : 'Start Tetris'}
        </button>
      )}
      {isPlaying && <p className="text-xs text-white/60">Arrows: move/rotate, Down: drop</p>}
    </div>
  );
}

export function GamesHubApp() {
  const [selectedGame, setSelectedGame] = useState<'menu' | 'click' | 'snake' | 'minesweeper' | 'tetris'>('menu');
  const [clickScore, setClickScore] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameTime, setGameTime] = useState(30);
  const [clickPosition, setClickPosition] = useState({ x: 50, y: 50 });

  useEffect(() => {
    if (isPlaying && gameTime > 0) {
      const timer = setInterval(() => setGameTime(t => t - 1), 1000);
      return () => clearInterval(timer);
    } else if (gameTime === 0) {
      setIsPlaying(false);
    }
  }, [isPlaying, gameTime]);

  const moveTarget = () => setClickPosition({ x: Math.random() * 80 + 10, y: Math.random() * 70 + 10 });
  const handleClick = () => { setClickScore(s => s + 1); moveTarget(); };
  const startClickGame = () => { setClickScore(0); setGameTime(30); setIsPlaying(true); moveTarget(); };

  const games = [
    { id: 'click', name: 'Click Challenge', icon: Star, color: 'from-red-500 to-orange-500', desc: 'Click targets fast!' },
    { id: 'snake', name: 'Snake', icon: Gamepad2, color: 'from-green-500 to-emerald-500', desc: 'Classic snake game' },
    { id: 'minesweeper', name: 'Minesweeper', icon: Bomb, color: 'from-blue-500 to-cyan-500', desc: 'Find all mines' },
    { id: 'tetris', name: 'Tetris', icon: Grid3X3, color: 'from-purple-500 to-pink-500', desc: 'Stack the blocks' },
  ];

  if (selectedGame === 'menu') {
    return (
      <div className="h-full bg-gradient-to-br from-purple-900 to-indigo-900 text-white p-6 overflow-auto">
        <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <Gamepad2 className="w-8 h-8" /> Games Hub
        </h1>
        <div className="grid grid-cols-2 gap-4">
          {games.map(game => (
            <button
              key={game.id}
              onClick={() => setSelectedGame(game.id as any)}
              className={`p-6 rounded-xl bg-gradient-to-br ${game.color} hover:scale-105 transition-transform text-left`}
            >
              <game.icon className="w-10 h-10 mb-3" />
              <h3 className="font-bold text-lg">{game.name}</h3>
              <p className="text-sm opacity-80">{game.desc}</p>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-purple-900 to-indigo-900 text-white">
      <div className="p-4 border-b border-white/10 flex items-center gap-4">
        <button onClick={() => setSelectedGame('menu')} className="text-white/70 hover:text-white">
          ← Back
        </button>
        <h2 className="font-bold">{games.find(g => g.id === selectedGame)?.name}</h2>
      </div>
      <div className="flex-1 flex items-center justify-center p-4">
        {selectedGame === 'click' && (
          <div className="w-full h-full relative">
            {!isPlaying ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                {gameTime === 0 && <><Trophy className="w-16 h-16 text-yellow-400 mb-4" /><p className="text-xl mb-4">Score: {clickScore}</p></>}
                <button onClick={startClickGame} className="px-8 py-3 bg-green-500 hover:bg-green-600 rounded-full font-bold flex items-center gap-2">
                  <Play className="w-5 h-5" /> {gameTime === 0 ? 'Play Again' : 'Start'}
                </button>
              </div>
            ) : (
              <>
                <div className="absolute top-4 right-4 flex gap-4">
                  <span><Trophy className="w-5 h-5 inline mr-1 text-yellow-400" />{clickScore}</span>
                  <span className="font-mono">{gameTime}s</span>
                </div>
                <button
                  onClick={handleClick}
                  className="absolute w-14 h-14 bg-red-500 hover:bg-red-400 rounded-full flex items-center justify-center transform -translate-x-1/2 -translate-y-1/2 hover:scale-110 shadow-lg"
                  style={{ left: `${clickPosition.x}%`, top: `${clickPosition.y}%` }}
                >
                  <Star className="w-7 h-7" />
                </button>
              </>
            )}
          </div>
        )}
        {selectedGame === 'snake' && <SnakeGame />}
        {selectedGame === 'minesweeper' && <MinesweeperGame />}
        {selectedGame === 'tetris' && <TetrisGame />}
      </div>
    </div>
  );
}
