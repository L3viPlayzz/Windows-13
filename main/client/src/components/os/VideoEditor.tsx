import { Film, Play, Pause, RotateCcw, Volume2, VolumeX, Upload, Trash2, Scissors, SkipBack, SkipForward, Download, Maximize2 } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useFileSystem } from '@/lib/FileSystemContext';
import { VirtualFile } from '@/lib/fileSystem';

export function VideoEditorApp() {
  const { files, uploadFiles, deleteFile, getBlobUrl } = useFileSystem();
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [videos, setVideos] = useState<Array<{ file: VirtualFile; url: string }>>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [trimStart, setTrimStart] = useState(0);
  const [trimEnd, setTrimEnd] = useState(100);

  useEffect(() => {
    loadVideos();
  }, [files]);

  const loadVideos = async () => {
    setIsLoading(true);
    const videoFiles: Array<{ file: VirtualFile; url: string }> = [];
    
    const videosFolder = files['videos'];
    if (videosFolder?.children) {
      for (const childId of videosFolder.children) {
        const file = files[childId];
        if (file?.fileType === 'video') {
          const url = await getBlobUrl(file.id);
          if (url) {
            videoFiles.push({ file, url });
          }
        }
      }
    }

    for (const file of Object.values(files)) {
      if (file.fileType === 'video' && file.parentId !== 'videos') {
        const existing = videoFiles.find(v => v.file.id === file.id);
        if (!existing) {
          const url = await getBlobUrl(file.id);
          if (url) {
            videoFiles.push({ file, url });
          }
        }
      }
    }
    
    setVideos(videoFiles);
    setIsLoading(false);
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => setCurrentTime(video.currentTime);
    const handleLoadedMetadata = () => {
      setDuration(video.duration);
      setTrimEnd(100);
    };
    const handleEnded = () => setIsPlaying(false);

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('ended', handleEnded);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('ended', handleEnded);
    };
  }, [currentIndex]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  useEffect(() => {
    if (videos[currentIndex] && videoRef.current) {
      videoRef.current.src = videos[currentIndex].url;
    }
  }, [currentIndex, videos]);

  const togglePlay = () => {
    if (!videos.length) return;
    
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch(() => {});
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

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const vol = parseFloat(e.target.value);
    setVolume(vol);
    setIsMuted(false);
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      await uploadFiles(e.target.files, 'videos');
      await loadVideos();
    }
  };

  const handleDelete = async (id: string) => {
    await deleteFile(id);
    if (videos.findIndex(v => v.file.id === id) === currentIndex) {
      setCurrentIndex(Math.max(0, currentIndex - 1));
      setIsPlaying(false);
    }
    await loadVideos();
  };

  const skipForward = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.min(duration, currentTime + 10);
    }
  };

  const skipBackward = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.max(0, currentTime - 10);
    }
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return '0:00';
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleDownload = () => {
    if (videos[currentIndex]) {
      const a = document.createElement('a');
      a.href = videos[currentIndex].url;
      a.download = videos[currentIndex].file.name;
      a.click();
    }
  };

  const currentVideo = videos[currentIndex];

  return (
    <div className="h-full w-full bg-zinc-900 text-white flex flex-col">
      <input
        ref={fileInputRef}
        type="file"
        accept="video/*"
        multiple
        className="hidden"
        onChange={handleUpload}
      />

      <div className="border-b border-zinc-700 p-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Film className="w-5 h-5 text-blue-400" />
          <h2 className="text-lg font-bold">Video Editor</h2>
          {currentVideo && (
            <span className="text-xs text-zinc-400 ml-2 truncate max-w-[200px]">
              - {currentVideo.file.name}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 rounded text-sm"
          >
            <Upload className="w-4 h-4" /> Import
          </button>
          {currentVideo && (
            <button 
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-700 hover:bg-zinc-600 rounded text-sm"
            >
              <Download className="w-4 h-4" /> Export
            </button>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : videos.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center">
          <Film className="w-20 h-20 opacity-20 mb-4" />
          <p className="text-lg mb-2 opacity-80">No videos yet</p>
          <p className="text-sm mb-4 opacity-60">Import video files to start editing</p>
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg"
          >
            <Upload className="w-4 h-4" /> Import Video
          </button>
        </div>
      ) : (
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 bg-black m-2 rounded-lg flex items-center justify-center relative overflow-hidden">
            <video
              ref={videoRef}
              className="max-w-full max-h-full"
              onClick={togglePlay}
            />
            {!isPlaying && (
              <button 
                onClick={togglePlay}
                className="absolute inset-0 flex items-center justify-center bg-black/30"
              >
                <div className="p-4 bg-white/20 rounded-full">
                  <Play className="w-12 h-12" />
                </div>
              </button>
            )}
          </div>

          <div className="border-t border-zinc-700 p-3 space-y-3">
            <div className="bg-zinc-800 rounded p-3">
              <input
                type="range"
                min="0"
                max={duration || 100}
                value={currentTime}
                onChange={handleSeek}
                className="w-full h-1.5 bg-zinc-700 rounded-full appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, rgb(59, 130, 246) ${(currentTime / (duration || 1)) * 100}%, rgb(63, 63, 70) ${(currentTime / (duration || 1)) * 100}%)`
                }}
              />
              <div className="flex justify-between text-xs text-zinc-400 mt-1">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button onClick={skipBackward} className="p-2 hover:bg-zinc-700 rounded">
                <SkipBack className="w-5 h-5" />
              </button>
              <button 
                onClick={togglePlay}
                className="p-2.5 bg-blue-600 hover:bg-blue-700 rounded"
              >
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              </button>
              <button onClick={skipForward} className="p-2 hover:bg-zinc-700 rounded">
                <SkipForward className="w-5 h-5" />
              </button>
              
              <div className="w-px h-6 bg-zinc-700 mx-1" />
              
              <button 
                onClick={() => setIsMuted(!isMuted)}
                className="p-2 hover:bg-zinc-700 rounded"
              >
                {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              </button>
              <input 
                type="range" 
                min="0" 
                max="1" 
                step="0.01"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-20 h-1 bg-zinc-700 rounded-full appearance-none"
              />
              
              <div className="flex-1" />
              
              <button 
                onClick={() => videoRef.current?.requestFullscreen()}
                className="p-2 hover:bg-zinc-700 rounded"
              >
                <Maximize2 className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-zinc-800 rounded p-2">
              <p className="text-xs font-medium mb-2 text-zinc-400">Trim Range</p>
              <div className="flex items-center gap-2">
                <span className="text-xs w-10">{trimStart}%</span>
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  value={trimStart}
                  onChange={(e) => setTrimStart(Math.min(Number(e.target.value), trimEnd - 1))}
                  className="flex-1 h-1 bg-zinc-700 rounded-full appearance-none"
                />
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  value={trimEnd}
                  onChange={(e) => setTrimEnd(Math.max(Number(e.target.value), trimStart + 1))}
                  className="flex-1 h-1 bg-zinc-700 rounded-full appearance-none"
                />
                <span className="text-xs w-10 text-right">{trimEnd}%</span>
              </div>
            </div>
          </div>

          <div className="border-t border-zinc-700 p-2 max-h-24 overflow-y-auto">
            <div className="flex gap-2">
              {videos.map((video, i) => (
                <div 
                  key={video.file.id}
                  onClick={() => { setCurrentIndex(i); setIsPlaying(false); }}
                  className={`relative w-24 h-16 bg-zinc-800 rounded cursor-pointer flex-shrink-0 overflow-hidden group ${i === currentIndex ? 'ring-2 ring-blue-500' : ''}`}
                >
                  <video 
                    src={video.url}
                    className="w-full h-full object-cover"
                    muted
                  />
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Play className="w-6 h-6" />
                  </div>
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleDelete(video.file.id); }}
                    className="absolute top-1 right-1 p-1 bg-red-500/80 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="w-24 h-16 border-2 border-dashed border-zinc-600 rounded flex items-center justify-center text-zinc-500 hover:border-zinc-500 hover:text-zinc-400 flex-shrink-0"
              >
                <Upload className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
