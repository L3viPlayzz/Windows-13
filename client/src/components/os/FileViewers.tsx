import { useState, useEffect, useRef } from 'react';
import { VirtualFile } from '@/lib/fileSystem';
import { 
  X, 
  ZoomIn, 
  ZoomOut, 
  RotateCw, 
  Download, 
  Play, 
  Pause, 
  Volume2, 
  VolumeX,
  SkipBack,
  SkipForward,
  Maximize2,
  FileText,
  Image as ImageIcon,
  Music,
  Video,
  File
} from 'lucide-react';

interface FileViewerProps {
  file: VirtualFile;
  blobUrl?: string;
  onClose: () => void;
}

export function ImageViewer({ file, blobUrl, onClose }: FileViewerProps) {
  const [zoom, setZoom] = useState(100);
  const [rotation, setRotation] = useState(0);

  const handleDownload = () => {
    if (blobUrl) {
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = file.name;
      a.click();
    }
  };

  return (
    <div className="h-full w-full bg-black/95 flex flex-col">
      <div className="h-12 bg-zinc-900 flex items-center justify-between px-4 border-b border-zinc-800">
        <div className="flex items-center gap-2">
          <ImageIcon className="w-5 h-5 text-purple-400" />
          <span className="text-white font-medium truncate max-w-[200px]">{file.name}</span>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setZoom(z => Math.max(25, z - 25))}
            className="p-2 hover:bg-white/10 rounded transition-colors"
          >
            <ZoomOut className="w-4 h-4 text-white" />
          </button>
          <span className="text-white text-sm w-12 text-center">{zoom}%</span>
          <button 
            onClick={() => setZoom(z => Math.min(400, z + 25))}
            className="p-2 hover:bg-white/10 rounded transition-colors"
          >
            <ZoomIn className="w-4 h-4 text-white" />
          </button>
          <button 
            onClick={() => setRotation(r => (r + 90) % 360)}
            className="p-2 hover:bg-white/10 rounded transition-colors"
          >
            <RotateCw className="w-4 h-4 text-white" />
          </button>
          <button 
            onClick={handleDownload}
            className="p-2 hover:bg-white/10 rounded transition-colors"
          >
            <Download className="w-4 h-4 text-white" />
          </button>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-red-500/50 rounded transition-colors ml-2"
          >
            <X className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>
      
      <div className="flex-1 overflow-auto flex items-center justify-center p-4">
        {blobUrl ? (
          <img 
            src={blobUrl} 
            alt={file.name}
            className="max-w-full max-h-full object-contain transition-transform duration-200"
            style={{ 
              transform: `scale(${zoom / 100}) rotate(${rotation}deg)`,
            }}
          />
        ) : (
          <div className="text-white/50 flex flex-col items-center">
            <ImageIcon className="w-16 h-16 mb-2 opacity-50" />
            <p>Unable to load image</p>
          </div>
        )}
      </div>
      
      <div className="h-8 bg-zinc-900 flex items-center justify-center px-4 border-t border-zinc-800">
        <span className="text-zinc-400 text-xs">
          {file.size ? `${(file.size / 1024).toFixed(1)} KB` : 'Size unknown'} • {file.mimeType || 'Unknown type'}
        </span>
      </div>
    </div>
  );
}

export function AudioPlayer({ file, blobUrl, onClose }: FileViewerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleLoadedMetadata = () => setDuration(audio.duration);
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const vol = parseFloat(e.target.value);
    setVolume(vol);
    if (audioRef.current) {
      audioRef.current.volume = vol;
    }
  };

  const formatTime = (time: number) => {
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleDownload = () => {
    if (blobUrl) {
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = file.name;
      a.click();
    }
  };

  return (
    <div className="h-full w-full bg-gradient-to-br from-purple-900 via-blue-900 to-black flex flex-col">
      <audio ref={audioRef} src={blobUrl} />
      
      <div className="h-12 bg-black/30 flex items-center justify-between px-4 border-b border-white/10">
        <div className="flex items-center gap-2">
          <Music className="w-5 h-5 text-pink-400" />
          <span className="text-white font-medium truncate max-w-[200px]">{file.name}</span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={handleDownload} className="p-2 hover:bg-white/10 rounded">
            <Download className="w-4 h-4 text-white" />
          </button>
          <button onClick={onClose} className="p-2 hover:bg-red-500/50 rounded">
            <X className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-8">
        <div className="w-48 h-48 bg-gradient-to-br from-blue-400 to-purple-600 rounded-xl shadow-2xl flex items-center justify-center mb-8">
          <Music className={`w-24 h-24 text-white/50 ${isPlaying ? 'animate-pulse' : ''}`} />
        </div>
        
        <h2 className="text-2xl font-bold text-white mb-2 text-center">{file.name.replace(/\.[^/.]+$/, '')}</h2>
        <p className="text-purple-300 mb-8">Audio File</p>

        <div className="w-full max-w-md mb-6">
          <input
            type="range"
            min="0"
            max={duration || 100}
            value={currentTime}
            onChange={handleSeek}
            className="w-full h-2 bg-white/20 rounded-full appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-sm text-purple-300 mt-2">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        <div className="flex items-center gap-4 mb-8">
          <button 
            onClick={() => { if (audioRef.current) audioRef.current.currentTime -= 10; }}
            className="p-2 hover:bg-white/10 rounded-full"
          >
            <SkipBack className="w-6 h-6 text-white" />
          </button>
          <button 
            onClick={togglePlay}
            className="p-4 bg-blue-600 hover:bg-blue-700 rounded-full"
          >
            {isPlaying ? <Pause className="w-6 h-6 text-white" /> : <Play className="w-6 h-6 text-white" />}
          </button>
          <button 
            onClick={() => { if (audioRef.current) audioRef.current.currentTime += 10; }}
            className="p-2 hover:bg-white/10 rounded-full"
          >
            <SkipForward className="w-6 h-6 text-white" />
          </button>
        </div>

        <div className="w-full max-w-xs flex items-center gap-2">
          <button onClick={() => setIsMuted(!isMuted)} className="p-1">
            {isMuted ? <VolumeX className="w-5 h-5 text-white" /> : <Volume2 className="w-5 h-5 text-white" />}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={isMuted ? 0 : volume}
            onChange={handleVolumeChange}
            className="flex-1 h-2 bg-white/20 rounded-full appearance-none cursor-pointer"
          />
          <span className="w-10 text-sm text-white">{Math.round(volume * 100)}%</span>
        </div>
      </div>
    </div>
  );
}

export function VideoPlayer({ file, blobUrl, onClose }: FileViewerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => setCurrentTime(video.currentTime);
    const handleLoadedMetadata = () => setDuration(video.duration);
    const handleEnded = () => setIsPlaying(false);

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('ended', handleEnded);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('ended', handleEnded);
    };
  }, []);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const formatTime = (time: number) => {
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleDownload = () => {
    if (blobUrl) {
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = file.name;
      a.click();
    }
  };

  return (
    <div className="h-full w-full bg-black flex flex-col">
      <div className="h-10 bg-zinc-900 flex items-center justify-between px-4 border-b border-zinc-800">
        <div className="flex items-center gap-2">
          <Video className="w-4 h-4 text-red-400" />
          <span className="text-white font-medium truncate max-w-[200px] text-sm">{file.name}</span>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={handleDownload} className="p-1.5 hover:bg-white/10 rounded">
            <Download className="w-4 h-4 text-white" />
          </button>
          <button onClick={onClose} className="p-1.5 hover:bg-red-500/50 rounded">
            <X className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center bg-black relative">
        {blobUrl ? (
          <video
            ref={videoRef}
            src={blobUrl}
            className="max-w-full max-h-full"
            onClick={togglePlay}
          />
        ) : (
          <div className="text-white/50 flex flex-col items-center">
            <Video className="w-16 h-16 mb-2 opacity-50" />
            <p>Unable to load video</p>
          </div>
        )}
      </div>

      <div className="h-16 bg-zinc-900 px-4 py-2 border-t border-zinc-800">
        <input
          type="range"
          min="0"
          max={duration || 100}
          value={currentTime}
          onChange={handleSeek}
          className="w-full h-1 bg-white/20 rounded-full appearance-none cursor-pointer mb-2"
        />
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button onClick={togglePlay} className="p-1">
              {isPlaying ? <Pause className="w-5 h-5 text-white" /> : <Play className="w-5 h-5 text-white" />}
            </button>
            <span className="text-white text-xs">{formatTime(currentTime)} / {formatTime(duration)}</span>
          </div>
          <button 
            onClick={() => videoRef.current?.requestFullscreen()}
            className="p-1 hover:bg-white/10 rounded"
          >
            <Maximize2 className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}

export function TextViewer({ file, blobUrl, onClose }: FileViewerProps) {
  const [content, setContent] = useState<string>('');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (file.data) {
      setContent(file.data);
    } else if (blobUrl) {
      fetch(blobUrl)
        .then(res => res.text())
        .then(text => setContent(text))
        .catch(() => setContent('Unable to load file content'));
    }
  }, [file, blobUrl]);

  const handleDownload = () => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.name;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="h-full w-full bg-white dark:bg-zinc-900 flex flex-col">
      <div className="h-10 bg-zinc-100 dark:bg-zinc-800 flex items-center justify-between px-4 border-b border-zinc-200 dark:border-zinc-700">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-blue-500" />
          <span className="font-medium truncate max-w-[200px] text-sm">{file.name}</span>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={handleDownload} className="p-1.5 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded">
            <Download className="w-4 h-4" />
          </button>
          <button onClick={onClose} className="p-1.5 hover:bg-red-500/50 rounded">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-4">
        <pre className="font-mono text-sm whitespace-pre-wrap break-words">{content}</pre>
      </div>

      <div className="h-6 bg-zinc-100 dark:bg-zinc-800 flex items-center justify-between px-4 border-t border-zinc-200 dark:border-zinc-700">
        <span className="text-zinc-500 text-xs">
          {content.split('\n').length} lines • {content.length} characters
        </span>
        <span className="text-zinc-500 text-xs">{file.mimeType || 'text/plain'}</span>
      </div>
    </div>
  );
}

export function PDFViewer({ file, blobUrl, onClose }: FileViewerProps) {
  const handleDownload = () => {
    if (blobUrl) {
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = file.name;
      a.click();
    }
  };

  return (
    <div className="h-full w-full bg-zinc-800 flex flex-col">
      <div className="h-10 bg-zinc-900 flex items-center justify-between px-4 border-b border-zinc-700">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-red-500" />
          <span className="text-white font-medium truncate max-w-[200px] text-sm">{file.name}</span>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={handleDownload} className="p-1.5 hover:bg-white/10 rounded">
            <Download className="w-4 h-4 text-white" />
          </button>
          <button onClick={onClose} className="p-1.5 hover:bg-red-500/50 rounded">
            <X className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>

      <div className="flex-1">
        {blobUrl ? (
          <iframe
            src={blobUrl}
            className="w-full h-full border-0"
            title={file.name}
          />
        ) : (
          <div className="h-full flex items-center justify-center text-white/50">
            <div className="text-center">
              <FileText className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p>Unable to load PDF</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export function GenericFileViewer({ file, blobUrl, onClose }: FileViewerProps) {
  const handleDownload = () => {
    if (blobUrl) {
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = file.name;
      a.click();
    }
  };

  return (
    <div className="h-full w-full bg-white dark:bg-zinc-900 flex flex-col items-center justify-center">
      <div className="absolute top-0 right-0 p-2">
        <button onClick={onClose} className="p-2 hover:bg-red-500/50 rounded">
          <X className="w-5 h-5" />
        </button>
      </div>
      
      <File className="w-24 h-24 text-zinc-400 mb-4" />
      <h2 className="text-xl font-bold mb-2">{file.name}</h2>
      <p className="text-zinc-500 mb-2">{file.mimeType || 'Unknown file type'}</p>
      <p className="text-zinc-500 mb-6">{file.size ? `${(file.size / 1024).toFixed(1)} KB` : 'Size unknown'}</p>
      
      <button
        onClick={handleDownload}
        className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium"
      >
        <Download className="w-5 h-5" />
        Download File
      </button>
    </div>
  );
}

export function getFileViewer(file: VirtualFile, blobUrl: string | undefined, onClose: () => void) {
  const fileType = file.fileType || 'unknown';
  
  switch (fileType) {
    case 'image':
      return <ImageViewer file={file} blobUrl={blobUrl} onClose={onClose} />;
    case 'audio':
      return <AudioPlayer file={file} blobUrl={blobUrl} onClose={onClose} />;
    case 'video':
      return <VideoPlayer file={file} blobUrl={blobUrl} onClose={onClose} />;
    case 'text':
    case 'code':
      return <TextViewer file={file} blobUrl={blobUrl} onClose={onClose} />;
    case 'pdf':
      return <PDFViewer file={file} blobUrl={blobUrl} onClose={onClose} />;
    default:
      return <GenericFileViewer file={file} blobUrl={blobUrl} onClose={onClose} />;
  }
}
