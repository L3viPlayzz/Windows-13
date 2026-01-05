import { Image as ImageIcon, Download, Share2, Upload, Trash2, ZoomIn, ZoomOut, RotateCw, ChevronLeft, ChevronRight, X, Grid, Maximize2 } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useFileSystem } from '@/lib/FileSystemContext';
import { VirtualFile } from '@/lib/fileSystem';

export function GalleryApp() {
  const { files, uploadFiles, deleteFile, getBlobUrl } = useFileSystem();
  const [images, setImages] = useState<Array<{ file: VirtualFile; url: string }>>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoom, setZoom] = useState(100);
  const [rotation, setRotation] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadImages();
  }, [files]);

  const loadImages = async () => {
    setIsLoading(true);
    const imageFiles: Array<{ file: VirtualFile; url: string }> = [];
    
    const picturesFolder = files['pictures'];
    if (picturesFolder?.children) {
      for (const childId of picturesFolder.children) {
        const file = files[childId];
        if (file?.fileType === 'image') {
          const url = await getBlobUrl(file.id);
          if (url) {
            imageFiles.push({ file, url });
          }
        }
      }
    }

    for (const file of Object.values(files)) {
      if (file.fileType === 'image' && file.parentId !== 'pictures') {
        const existing = imageFiles.find(i => i.file.id === file.id);
        if (!existing) {
          const url = await getBlobUrl(file.id);
          if (url) {
            imageFiles.push({ file, url });
          }
        }
      }
    }
    
    setImages(imageFiles);
    setIsLoading(false);
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      await uploadFiles(e.target.files, 'pictures');
      await loadImages();
    }
  };

  const handleDelete = async () => {
    if (images[selectedIndex]) {
      await deleteFile(images[selectedIndex].file.id);
      setSelectedIndex(Math.max(0, selectedIndex - 1));
      await loadImages();
    }
  };

  const handleDownload = () => {
    if (images[selectedIndex]) {
      const a = document.createElement('a');
      a.href = images[selectedIndex].url;
      a.download = images[selectedIndex].file.name;
      a.click();
    }
  };

  const goNext = () => {
    setSelectedIndex((prev) => (prev + 1) % images.length);
    setZoom(100);
    setRotation(0);
  };

  const goPrev = () => {
    setSelectedIndex((prev) => (prev - 1 + images.length) % images.length);
    setZoom(100);
    setRotation(0);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') goNext();
      if (e.key === 'ArrowLeft') goPrev();
      if (e.key === 'Escape') setIsFullscreen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [images.length]);

  if (isFullscreen && images[selectedIndex]) {
    return (
      <div className="fixed inset-0 bg-black z-[99999] flex flex-col">
        <div className="h-12 bg-black/80 flex items-center justify-between px-4">
          <span className="text-white font-medium">{images[selectedIndex].file.name}</span>
          <div className="flex items-center gap-2">
            <button onClick={() => setZoom(z => Math.max(25, z - 25))} className="p-2 hover:bg-white/10 rounded">
              <ZoomOut className="w-5 h-5 text-white" />
            </button>
            <span className="text-white text-sm w-12 text-center">{zoom}%</span>
            <button onClick={() => setZoom(z => Math.min(400, z + 25))} className="p-2 hover:bg-white/10 rounded">
              <ZoomIn className="w-5 h-5 text-white" />
            </button>
            <button onClick={() => setRotation(r => (r + 90) % 360)} className="p-2 hover:bg-white/10 rounded">
              <RotateCw className="w-5 h-5 text-white" />
            </button>
            <button onClick={() => setIsFullscreen(false)} className="p-2 hover:bg-red-500/50 rounded ml-4">
              <X className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center relative">
          <button 
            onClick={goPrev}
            className="absolute left-4 p-3 bg-black/50 hover:bg-black/70 rounded-full z-10"
          >
            <ChevronLeft className="w-8 h-8 text-white" />
          </button>
          
          <img 
            src={images[selectedIndex].url}
            alt={images[selectedIndex].file.name}
            className="max-w-full max-h-full object-contain transition-transform duration-200"
            style={{ transform: `scale(${zoom / 100}) rotate(${rotation}deg)` }}
          />
          
          <button 
            onClick={goNext}
            className="absolute right-4 p-3 bg-black/50 hover:bg-black/70 rounded-full z-10"
          >
            <ChevronRight className="w-8 h-8 text-white" />
          </button>
        </div>
        <div className="h-8 bg-black/80 flex items-center justify-center">
          <span className="text-white/60 text-sm">{selectedIndex + 1} / {images.length}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full bg-white dark:bg-[#1a1a1a] flex flex-col">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={handleUpload}
      />
      
      <div className="border-b border-zinc-200 dark:border-zinc-800 p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ImageIcon className="w-6 h-6 text-purple-500" />
          <h2 className="text-xl font-bold">Gallery</h2>
          <span className="text-sm text-zinc-500 ml-2">{images.length} photos</span>
        </div>
        <button 
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium"
        >
          <Upload className="w-4 h-4" /> Add Photos
        </button>
      </div>

      {isLoading ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : images.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-zinc-500">
          <ImageIcon className="w-20 h-20 opacity-20 mb-4" />
          <p className="text-lg mb-2">No photos yet</p>
          <p className="text-sm mb-4">Upload images to see them here</p>
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg"
          >
            <Upload className="w-4 h-4" /> Upload Photos
          </button>
        </div>
      ) : (
        <div className="flex-1 flex overflow-hidden">
          <div className="flex-1 flex items-center justify-center bg-zinc-100 dark:bg-zinc-900 p-4 relative">
            <button 
              onClick={goPrev}
              className="absolute left-2 p-2 bg-black/30 hover:bg-black/50 rounded-full z-10"
            >
              <ChevronLeft className="w-6 h-6 text-white" />
            </button>
            
            <img 
              src={images[selectedIndex]?.url}
              alt={images[selectedIndex]?.file.name}
              className="max-w-full max-h-full object-contain rounded-lg shadow-lg cursor-pointer"
              onClick={() => setIsFullscreen(true)}
              style={{ transform: `scale(${zoom / 100}) rotate(${rotation}deg)` }}
            />
            
            <button 
              onClick={goNext}
              className="absolute right-2 p-2 bg-black/30 hover:bg-black/50 rounded-full z-10"
            >
              <ChevronRight className="w-6 h-6 text-white" />
            </button>

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 px-4 py-1 rounded-full">
              <span className="text-white text-sm">{selectedIndex + 1} / {images.length}</span>
            </div>
          </div>

          <div className="w-56 border-l border-zinc-200 dark:border-zinc-800 flex flex-col">
            <div className="p-3 border-b border-zinc-200 dark:border-zinc-800">
              <p className="font-medium truncate text-sm">{images[selectedIndex]?.file.name}</p>
              <p className="text-xs text-zinc-500 mt-1">
                {images[selectedIndex]?.file.size 
                  ? `${(images[selectedIndex].file.size / 1024).toFixed(1)} KB`
                  : 'Size unknown'
                }
              </p>
            </div>

            <div className="flex-1 overflow-y-auto p-2">
              <div className="grid grid-cols-2 gap-2">
                {images.map((img, i) => (
                  <button 
                    key={img.file.id}
                    onClick={() => { setSelectedIndex(i); setZoom(100); setRotation(0); }}
                    className={`aspect-square rounded overflow-hidden border-2 transition-colors ${selectedIndex === i ? 'border-purple-500' : 'border-transparent hover:border-zinc-300'}`}
                  >
                    <img 
                      src={img.url}
                      alt={img.file.name}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="border-t border-zinc-200 dark:border-zinc-800 p-2 space-y-1">
              <div className="flex items-center gap-1 justify-center mb-2">
                <button onClick={() => setZoom(z => Math.max(25, z - 25))} className="p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded">
                  <ZoomOut className="w-4 h-4" />
                </button>
                <span className="text-xs w-10 text-center">{zoom}%</span>
                <button onClick={() => setZoom(z => Math.min(200, z + 25))} className="p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded">
                  <ZoomIn className="w-4 h-4" />
                </button>
                <button onClick={() => setRotation(r => (r + 90) % 360)} className="p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded">
                  <RotateCw className="w-4 h-4" />
                </button>
              </div>
              <button 
                onClick={() => setIsFullscreen(true)}
                className="w-full flex items-center gap-2 p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded text-sm"
              >
                <Maximize2 className="w-4 h-4" /> Fullscreen
              </button>
              <button 
                onClick={handleDownload}
                className="w-full flex items-center gap-2 p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded text-sm"
              >
                <Download className="w-4 h-4" /> Download
              </button>
              <button 
                onClick={handleDelete}
                className="w-full flex items-center gap-2 p-2 hover:bg-red-100 dark:hover:bg-red-900/30 rounded text-sm text-red-600"
              >
                <Trash2 className="w-4 h-4" /> Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
