import { useState, useRef } from 'react';
import { ArrowLeft, ArrowRight, RotateCw, Search, Lock, AlertCircle } from 'lucide-react';

export function Browser() {
  const [url, setUrl] = useState('https://www.google.com');
  const [inputValue, setInputValue] = useState('https://www.google.com');
  const [history, setHistory] = useState<string[]>(['https://www.google.com']);
  const [historyIndex, setHistoryIndex] = useState(0);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const handleNavigate = (e?: React.FormEvent) => {
    e?.preventDefault();
    let newUrl = inputValue;
    if (!newUrl.startsWith('http://') && !newUrl.startsWith('https://')) {
      newUrl = 'https://' + newUrl;
    }
    
    // Basic history management
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newUrl);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
    setUrl(newUrl);
    setInputValue(newUrl);
  };

  const goBack = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setUrl(history[newIndex]);
      setInputValue(history[newIndex]);
    }
  };

  const goForward = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setUrl(history[newIndex]);
      setInputValue(history[newIndex]);
    }
  };

  // List of sites that typically allow embedding or are useful for demo
  const allowedSites = [
    'wikipedia.org',
    'openstreetmap.org',
    'example.com',
  ];

  const isLikelyBlocked = !allowedSites.some(site => url.includes(site)) && !url.includes('localhost');

  return (
    <div className="flex flex-col h-full w-full bg-white dark:bg-[#1C1C1C]">
      {/* Browser Toolbar */}
      <div className="h-10 bg-[#F3F3F3] dark:bg-[#2B2B2B] flex items-center gap-2 px-2 border-b border-zinc-200 dark:border-zinc-700">
        <div className="flex items-center gap-1">
          <button 
            onClick={goBack}
            disabled={historyIndex === 0}
            className="p-1.5 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-full disabled:opacity-30 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 text-zinc-700 dark:text-zinc-200" />
          </button>
          <button 
            onClick={goForward}
            disabled={historyIndex === history.length - 1}
            className="p-1.5 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-full disabled:opacity-30 transition-colors"
          >
            <ArrowRight className="w-4 h-4 text-zinc-700 dark:text-zinc-200" />
          </button>
          <button 
            onClick={() => setUrl(url)} // Reload
            className="p-1.5 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-full transition-colors"
          >
            <RotateCw className="w-3.5 h-3.5 text-zinc-700 dark:text-zinc-200" />
          </button>
        </div>

        <form onSubmit={handleNavigate} className="flex-1">
          <div className="flex items-center bg-white dark:bg-[#1F1F1F] rounded-full px-3 py-1 border border-zinc-200 dark:border-zinc-700 focus-within:border-blue-500 shadow-sm h-8">
            <Lock className="w-3 h-3 text-green-600 mr-2" />
            <input 
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onFocus={(e) => e.target.select()}
              className="flex-1 bg-transparent text-xs outline-none text-zinc-800 dark:text-zinc-200 placeholder:text-zinc-400"
              placeholder="Search or enter web address"
            />
          </div>
        </form>

        <div className="flex items-center gap-2">
           {/* Add extensions or menu icons here if needed */}
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 relative bg-white dark:bg-[#1C1C1C]">
        {isLikelyBlocked ? (
           <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8">
             <div className="w-16 h-16 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mb-4">
               <AlertCircle className="w-8 h-8 text-zinc-400" />
             </div>
             <h3 className="text-lg font-semibold text-zinc-800 dark:text-zinc-100 mb-2">Connection Refused by Host</h3>
             <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-md mb-6">
               Most major websites (Google, YouTube, etc.) block being embedded inside other websites for security reasons (X-Frame-Options).
             </p>
             <div className="flex gap-2">
               <button 
                 onClick={() => {
                   setUrl('https://www.wikipedia.org');
                   setInputValue('https://www.wikipedia.org');
                 }}
                 className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded-md transition-colors"
               >
                 Try Wikipedia (Works)
               </button>
               <a 
                 href={url}
                 target="_blank"
                 rel="noreferrer"
                 className="px-4 py-2 bg-zinc-200 dark:bg-zinc-700 hover:bg-zinc-300 dark:hover:bg-zinc-600 text-zinc-800 dark:text-zinc-100 text-sm rounded-md transition-colors"
               >
                 Open in New Tab
               </a>
             </div>
           </div>
        ) : (
          <iframe 
            ref={iframeRef}
            src={url}
            className="w-full h-full border-none"
            title="Browser View"
            sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
          />
        )}
      </div>
    </div>
  );
}
