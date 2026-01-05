import { Music, Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Upload, Trash2, Shuffle, Repeat, List, X } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useFileSystem } from '@/lib/FileSystemContext';
import { VirtualFile } from '@/lib/fileSystem';

export function MusicApp() {
  const { files, uploadFiles, deleteFile, getBlobUrl } = useFileSystem();
  const audioRef = useRef<HTMLAudioElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [songs, setSongs] = useState<Array<{ file: VirtualFile; url: string }>>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState<'none' | 'all' | 'one'>('none');
  const [showPlaylist, setShowPlaylist] = useState(true);

  useEffect(() => {
    loadSongs();
  }, [files]);

  const loadSongs = async () => {
    setIsLoading(true);
    const audioFiles: Array<{ file: VirtualFile; url: string }> = [];
    
    const musicFolder = files['music'];
    if (musicFolder?.children) {
      for (const childId of musicFolder.children) {
        const file = files[childId];
        if (file?.fileType === 'audio') {
          const url = await getBlobUrl(file.id);
          if (url) {
            audioFiles.push({ file, url });
          }
        }
      }
    }

    for (const file of Object.values(files)) {
      if (file.fileType === 'audio' && file.parentId !== 'music') {
        const existing = audioFiles.find(s => s.file.id === file.id);
        if (!existing) {
          const url = await getBlobUrl(file.id);
          if (url) {
            audioFiles.push({ file, url });
          }
        }
      }
    }
    
    setSongs(audioFiles);
    setIsLoading(false);
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleLoadedMetadata = () => setDuration(audio.duration);
    const handleEnded = () => {
      if (repeat === 'one') {
        audio.currentTime = 0;
        audio.play();
      } else if (repeat === 'all' || currentIndex < songs.length - 1) {
        playNext();
      } else {
        setIsPlaying(false);
      }
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [currentIndex, songs.length, repeat]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  useEffect(() => {
    if (songs[currentIndex] && audioRef.current) {
      audioRef.current.src = songs[currentIndex].url;
      if (isPlaying) {
        audioRef.current.play().catch(() => {});
      }
    }
  }, [currentIndex, songs]);

  const togglePlay = () => {
    if (!songs.length) return;
    
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(() => {});
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
    setIsMuted(false);
  };

  const playNext = () => {
    if (songs.length === 0) return;
    
    if (shuffle) {
      const nextIndex = Math.floor(Math.random() * songs.length);
      setCurrentIndex(nextIndex);
    } else {
      setCurrentIndex((prev) => (prev + 1) % songs.length);
    }
    setIsPlaying(true);
  };

  const playPrev = () => {
    if (songs.length === 0) return;
    
    if (currentTime > 3) {
      if (audioRef.current) audioRef.current.currentTime = 0;
    } else {
      setCurrentIndex((prev) => (prev - 1 + songs.length) % songs.length);
    }
  };

  const playSong = (index: number) => {
    setCurrentIndex(index);
    setIsPlaying(true);
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      await uploadFiles(e.target.files, 'music');
      await loadSongs();
    }
  };

  const handleDelete = async (id: string) => {
    await deleteFile(id);
    if (songs.findIndex(s => s.file.id === id) === currentIndex) {
      setCurrentIndex(Math.max(0, currentIndex - 1));
      setIsPlaying(false);
    }
    await loadSongs();
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return '0:00';
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getFileName = (name: string) => {
    return name.replace(/\.[^/.]+$/, '');
  };

  const currentSong = songs[currentIndex];

  return (
    <div className="h-full w-full bg-gradient-to-br from-purple-900 via-blue-900 to-black text-white overflow-hidden flex flex-col">
      <audio ref={audioRef} />
      <input
        ref={fileInputRef}
        type="file"
        accept="audio/*"
        multiple
        className="hidden"
        onChange={handleUpload}
      />

      {isLoading ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : songs.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center">
          <Music className="w-20 h-20 opacity-20 mb-4" />
          <p className="text-lg mb-2 opacity-80">No music yet</p>
          <p className="text-sm mb-4 opacity-60">Upload audio files to start listening</p>
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg"
          >
            <Upload className="w-4 h-4" /> Upload Music
          </button>
        </div>
      ) : (
        <>
          <div className="flex-1 flex flex-col items-center justify-center p-6">
            <div className={`w-40 h-40 bg-gradient-to-br from-blue-400 to-purple-600 rounded-xl shadow-2xl flex items-center justify-center mb-6 ${isPlaying ? 'animate-pulse' : ''}`}>
              <Music className="w-20 h-20 opacity-50" />
            </div>
            
            <h2 className="text-2xl font-bold mb-1 text-center max-w-xs truncate">
              {currentSong ? getFileName(currentSong.file.name) : 'No song selected'}
            </h2>
            <p className="text-purple-300 mb-6 text-sm">Audio File</p>

            <div className="w-full max-w-sm mb-4">
              <input
                type="range"
                min="0"
                max={duration || 100}
                value={currentTime}
                onChange={handleSeek}
                className="w-full h-1.5 bg-white/20 rounded-full appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, rgb(139, 92, 246) ${(currentTime / (duration || 1)) * 100}%, rgba(255,255,255,0.2) ${(currentTime / (duration || 1)) * 100}%)`
                }}
              />
              <div className="flex justify-between text-xs text-purple-300 mt-1">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            <div className="flex items-center gap-3 mb-6">
              <button 
                onClick={() => setShuffle(!shuffle)}
                className={`p-2 rounded-full transition-colors ${shuffle ? 'text-purple-400' : 'text-white/50 hover:text-white'}`}
              >
                <Shuffle className="w-5 h-5" />
              </button>
              <button onClick={playPrev} className="p-2 hover:bg-white/10 rounded-full">
                <SkipBack className="w-6 h-6" />
              </button>
              <button 
                onClick={togglePlay}
                className="p-4 bg-purple-600 hover:bg-purple-700 rounded-full shadow-lg"
              >
                {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-0.5" />}
              </button>
              <button onClick={playNext} className="p-2 hover:bg-white/10 rounded-full">
                <SkipForward className="w-6 h-6" />
              </button>
              <button 
                onClick={() => setRepeat(r => r === 'none' ? 'all' : r === 'all' ? 'one' : 'none')}
                className={`p-2 rounded-full transition-colors ${repeat !== 'none' ? 'text-purple-400' : 'text-white/50 hover:text-white'}`}
              >
                <Repeat className="w-5 h-5" />
                {repeat === 'one' && <span className="absolute text-[8px] font-bold">1</span>}
              </button>
            </div>

            <div className="w-full max-w-xs flex items-center gap-2">
              <button onClick={() => setIsMuted(!isMuted)} className="p-1">
                {isMuted || volume === 0 ? (
                  <VolumeX className="w-5 h-5 text-white/70" />
                ) : (
                  <Volume2 className="w-5 h-5 text-white/70" />
                )}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="flex-1 h-1 bg-white/20 rounded-full appearance-none cursor-pointer"
              />
              <span className="w-8 text-xs text-white/70">{Math.round((isMuted ? 0 : volume) * 100)}%</span>
            </div>
          </div>

          <div className="bg-black/40 backdrop-blur-sm border-t border-white/10">
            <div className="flex items-center justify-between px-4 py-2 border-b border-white/10">
              <div className="flex items-center gap-2">
                <List className="w-4 h-4" />
                <span className="text-sm font-medium">Playlist</span>
                <span className="text-xs text-white/50">({songs.length} songs)</span>
              </div>
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-1 px-2 py-1 bg-purple-600/50 hover:bg-purple-600 rounded text-xs"
              >
                <Upload className="w-3 h-3" /> Add
              </button>
            </div>
            
            <div className="max-h-32 overflow-y-auto">
              {songs.map((song, i) => (
                <div 
                  key={song.file.id}
                  className={`flex items-center gap-3 px-4 py-2 hover:bg-white/5 cursor-pointer group ${i === currentIndex ? 'bg-white/10' : ''}`}
                  onClick={() => playSong(i)}
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-400/50 to-purple-600/50 rounded flex items-center justify-center flex-shrink-0">
                    {i === currentIndex && isPlaying ? (
                      <div className="flex gap-0.5">
                        <div className="w-0.5 h-3 bg-white animate-pulse" />
                        <div className="w-0.5 h-4 bg-white animate-pulse delay-75" />
                        <div className="w-0.5 h-2 bg-white animate-pulse delay-150" />
                      </div>
                    ) : (
                      <Music className="w-4 h-4 opacity-50" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm truncate ${i === currentIndex ? 'text-purple-400 font-medium' : ''}`}>
                      {getFileName(song.file.name)}
                    </p>
                    <p className="text-xs text-white/40">
                      {song.file.size ? `${(song.file.size / (1024 * 1024)).toFixed(1)} MB` : 'Audio'}
                    </p>
                  </div>
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleDelete(song.file.id); }}
                    className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-500/30 rounded transition-opacity"
                  >
                    <Trash2 className="w-4 h-4 text-red-400" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
