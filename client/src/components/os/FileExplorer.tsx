import { useState, useEffect, useRef, useCallback } from 'react';
import { 
  ArrowLeft, 
  ArrowRight, 
  ArrowUp, 
  Search, 
  Home, 
  Monitor, 
  Download, 
  FileText, 
  Music, 
  Image as ImageIcon, 
  Video, 
  HardDrive,
  Folder,
  File,
  ChevronRight,
  Menu,
  UploadCloud,
  Plus,
  FolderPlus,
  Trash2,
  Edit3,
  Copy,
  Scissors,
  Clipboard,
  Grid,
  List,
  MoreVertical,
  RefreshCw,
  X,
  Check,
  FileCode,
  FileSpreadsheet,
  FileImage,
  FileAudio,
  FileVideo,
  Archive
} from 'lucide-react';
import { useFileSystem } from '@/lib/FileSystemContext';
import { VirtualFile } from '@/lib/fileSystem';
import { getFileViewer } from './FileViewers';

const getFileIcon = (file: VirtualFile) => {
  if (file.type === 'folder') return <Folder className="w-10 h-10 text-yellow-400 fill-yellow-400" />;
  if (file.type === 'drive') return <HardDrive className="w-10 h-10 text-zinc-400" />;
  if (file.type === 'root') return <Monitor className="w-10 h-10 text-blue-400" />;
  
  switch (file.fileType) {
    case 'image':
      return <FileImage className="w-8 h-8 text-purple-400" />;
    case 'audio':
      return <FileAudio className="w-8 h-8 text-pink-400" />;
    case 'video':
      return <FileVideo className="w-8 h-8 text-red-400" />;
    case 'pdf':
      return <FileText className="w-8 h-8 text-red-500" />;
    case 'word':
      return <FileText className="w-8 h-8 text-blue-500" />;
    case 'excel':
      return <FileSpreadsheet className="w-8 h-8 text-green-500" />;
    case 'code':
    case 'text':
      return <FileCode className="w-8 h-8 text-cyan-400" />;
    case 'archive':
      return <Archive className="w-8 h-8 text-amber-500" />;
    default:
      return <File className="w-8 h-8 text-zinc-400" />;
  }
};

const getSidebarIcon = (iconName: string | undefined) => {
  switch (iconName) {
    case 'Monitor': return Monitor;
    case 'FileText': return FileText;
    case 'Download': return Download;
    case 'Image': return ImageIcon;
    case 'Music': return Music;
    case 'Video': return Video;
    case 'HardDrive': return HardDrive;
    default: return Folder;
  }
};

export function FileExplorer() {
  const { 
    files, 
    isLoading, 
    uploadFiles, 
    createFolder, 
    deleteFile, 
    renameFile,
    getBlobUrl,
    refreshFiles,
    requestOpenFile,
    searchFiles
  } = useFileSystem();
  
  const [currentPath, setCurrentPath] = useState<string[]>(['root']);
  const [history, setHistory] = useState<string[][]>([['root']]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [notification, setNotification] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; itemId?: string } | null>(null);
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState('New Folder');
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState('');
  const [clipboard, setClipboard] = useState<{ ids: string[]; action: 'copy' | 'cut' } | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<VirtualFile[] | null>(null);
  const [openFile, setOpenFile] = useState<{ file: VirtualFile; blobUrl?: string } | null>(null);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);

  const currentFolderId = currentPath[currentPath.length - 1];
  const currentFolder = files[currentFolderId];

  const currentChildren = currentFolder?.children
    ?.map(id => files[id])
    .filter(Boolean)
    .sort((a, b) => {
      if (a.type === 'folder' && b.type !== 'folder') return -1;
      if (a.type !== 'folder' && b.type === 'folder') return 1;
      return a.name.localeCompare(b.name);
    }) || [];

  const handleNavigate = useCallback((folderId: string) => {
    const item = files[folderId];
    if (!item || item.type === 'file') return;

    const newPath = [...currentPath, folderId];
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newPath);
    
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
    setCurrentPath(newPath);
    setSelectedItems(new Set());
    setSearchResults(null);
    setSearchQuery('');
  }, [files, currentPath, history, historyIndex]);

  const goBack = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setCurrentPath(history[newIndex]);
      setSelectedItems(new Set());
    }
  };

  const goForward = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setCurrentPath(history[newIndex]);
      setSelectedItems(new Set());
    }
  };

  const goUp = () => {
    if (currentPath.length > 1) {
      const newPath = currentPath.slice(0, -1);
      const newHistory = history.slice(0, historyIndex + 1);
      newHistory.push(newPath);
      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
      setCurrentPath(newPath);
      setSelectedItems(new Set());
    }
  };

  const goToPath = (index: number) => {
    const newPath = currentPath.slice(0, index + 1);
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newPath);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
    setCurrentPath(newPath);
    setSelectedItems(new Set());
  };

  const handleFileUpload = async (fileList: FileList) => {
    try {
      const uploaded = await uploadFiles(fileList, currentFolderId);
      showNotification(`Uploaded ${uploaded.length} file(s)`);
    } catch (error) {
      showNotification('Upload failed');
    }
  };

  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) return;
    
    try {
      await createFolder(newFolderName.trim(), currentFolderId);
      showNotification(`Created folder "${newFolderName}"`);
      setIsCreatingFolder(false);
      setNewFolderName('New Folder');
    } catch (error) {
      showNotification('Failed to create folder');
    }
  };

  const handleDelete = async (ids: string[]) => {
    try {
      for (const id of ids) {
        await deleteFile(id);
      }
      showNotification(`Deleted ${ids.length} item(s)`);
      setSelectedItems(new Set());
    } catch (error) {
      showNotification('Delete failed');
    }
  };

  const handleRename = async () => {
    if (!renamingId || !renameValue.trim()) return;
    
    try {
      await renameFile(renamingId, renameValue.trim());
      showNotification('Renamed successfully');
      setRenamingId(null);
      setRenameValue('');
    } catch (error) {
      showNotification('Rename failed');
    }
  };

  const handleOpenFile = async (file: VirtualFile) => {
    if (file.type !== 'file') {
      handleNavigate(file.id);
      return;
    }
    
    const blobUrl = await getBlobUrl(file.id);
    setOpenFile({ file, blobUrl: blobUrl || undefined });
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      const results = await searchFiles(query);
      setSearchResults(results);
    } else {
      setSearchResults(null);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(false);
    
    const items = e.dataTransfer.files;
    if (items.length > 0) {
      await handleFileUpload(items);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(true);
  };

  const handleDragLeave = () => {
    setIsDraggingOver(false);
  };

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(''), 3000);
  };

  const handleItemClick = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    
    if (e.ctrlKey || e.metaKey) {
      const newSelected = new Set(selectedItems);
      if (newSelected.has(id)) {
        newSelected.delete(id);
      } else {
        newSelected.add(id);
      }
      setSelectedItems(newSelected);
    } else if (e.shiftKey && selectedItems.size > 0) {
      const children = currentChildren.map(c => c.id);
      const selectedArr = Array.from(selectedItems);
      const lastSelected = selectedArr[selectedArr.length - 1];
      const startIdx = children.indexOf(lastSelected);
      const endIdx = children.indexOf(id);
      const range = children.slice(Math.min(startIdx, endIdx), Math.max(startIdx, endIdx) + 1);
      setSelectedItems(new Set([...Array.from(selectedItems), ...range]));
    } else {
      setSelectedItems(new Set([id]));
    }
  };

  const handleContextMenu = (e: React.MouseEvent, itemId?: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (itemId && !selectedItems.has(itemId)) {
      setSelectedItems(new Set([itemId]));
    }
    
    setContextMenu({ x: e.clientX, y: e.clientY, itemId });
  };

  const connectLocalDrive = async () => {
    try {
      // @ts-ignore - File System Access API
      if (!window.showDirectoryPicker) {
        showNotification("File System Access not supported. Use Chrome/Edge.");
        return;
      }

      // @ts-ignore - File System Access API
      const dirHandle = await window.showDirectoryPicker({ mode: 'read' });
      showNotification(`Connected to "${dirHandle.name}". Uploading files...`);
      
      const filesToUpload: File[] = [];
      
      const processDirectory = async (handle: any) => {
        // @ts-ignore - File System Access API
        for await (const entry of handle.values()) {
          if (entry.kind === 'file') {
            const file = await entry.getFile();
            filesToUpload.push(file);
          }
        }
      };
      
      await processDirectory(dirHandle);
      
      if (filesToUpload.length > 0) {
        const dataTransfer = new DataTransfer();
        filesToUpload.forEach(f => dataTransfer.items.add(f));
        await handleFileUpload(dataTransfer.files);
      }
      
      showNotification(`Connected! Added ${filesToUpload.length} files.`);
    } catch (error: any) {
      if (error.name !== 'AbortError') {
        showNotification('Connection failed');
      }
    }
  };

  const displayItems = searchResults || currentChildren;

  if (openFile) {
    return getFileViewer(openFile.file, openFile.blobUrl, () => setOpenFile(null));
  }

  return (
    <div 
      className="flex flex-col h-full w-full bg-[#F0F0F0] dark:bg-[#191919] text-foreground font-sans"
      onClick={() => { setSelectedItems(new Set()); setContextMenu(null); }}
    >
      <input
        ref={fileInputRef}
        type="file"
        multiple
        className="hidden"
        onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
      />
      
      <div className="h-12 bg-[#F9F9F9] dark:bg-[#202020] border-b border-zinc-200 dark:border-zinc-700 flex items-center px-2 gap-2 shadow-sm z-10">
        <div className="flex items-center gap-1 mr-2">
          <button 
            onClick={goBack} 
            disabled={historyIndex === 0} 
            className="p-1.5 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-md disabled:opacity-30 transition-colors"
            title="Back"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <button 
            onClick={goForward} 
            disabled={historyIndex === history.length - 1} 
            className="p-1.5 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-md disabled:opacity-30 transition-colors"
            title="Forward"
          >
            <ArrowRight className="w-4 h-4" />
          </button>
          <button 
            onClick={goUp} 
            disabled={currentPath.length <= 1} 
            className="p-1.5 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-md disabled:opacity-30 transition-colors"
            title="Up"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
          <button 
            onClick={refreshFiles} 
            className="p-1.5 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-md transition-colors"
            title="Refresh"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 flex items-center bg-white dark:bg-[#2B2B2B] border border-zinc-200 dark:border-zinc-600 rounded-md px-3 h-8 text-sm shadow-sm overflow-hidden">
          <Monitor className="w-3.5 h-3.5 mr-2 text-zinc-500 flex-shrink-0" />
          <div className="flex items-center overflow-x-auto scrollbar-hide whitespace-nowrap">
            {currentPath.map((id, index) => (
              <div key={id} className="flex items-center">
                {index > 0 && <ChevronRight className="w-3 h-3 text-zinc-400 mx-1" />}
                <button 
                  className="hover:bg-zinc-100 dark:hover:bg-zinc-700 px-1 rounded cursor-pointer"
                  onClick={(e) => { e.stopPropagation(); goToPath(index); }}
                >
                  {files[id]?.name || id}
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="w-48 hidden sm:flex items-center bg-white dark:bg-[#2B2B2B] border border-zinc-200 dark:border-zinc-600 rounded-md px-3 h-8 text-sm shadow-sm">
          <Search className="w-3.5 h-3.5 mr-2 text-zinc-500" />
          <input 
            type="text" 
            placeholder="Search files..." 
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="bg-transparent border-none outline-none w-full placeholder:text-zinc-400 text-xs"
            onClick={(e) => e.stopPropagation()}
          />
          {searchQuery && (
            <button onClick={() => { setSearchQuery(''); setSearchResults(null); }}>
              <X className="w-3 h-3 text-zinc-400 hover:text-zinc-600" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-1">
          <button 
            onClick={() => setViewMode('grid')}
            className={`p-1.5 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600' : 'hover:bg-zinc-200 dark:hover:bg-zinc-700'}`}
          >
            <Grid className="w-4 h-4" />
          </button>
          <button 
            onClick={() => setViewMode('list')}
            className={`p-1.5 rounded-md transition-colors ${viewMode === 'list' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600' : 'hover:bg-zinc-200 dark:hover:bg-zinc-700'}`}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div className="w-48 bg-[#F3F3F3] dark:bg-[#191919] border-r border-zinc-200 dark:border-zinc-800 p-2 flex flex-col gap-1 overflow-y-auto text-sm">
          <div className="px-2 py-1.5 text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1">Quick Access</div>
          {['root', 'desktop', 'documents', 'downloads', 'pictures', 'music', 'videos'].map(id => {
            const item = files[id];
            if (!item) return null;
            const Icon = getSidebarIcon(item.icon);
            return (
              <button 
                key={id}
                onClick={(e) => { e.stopPropagation(); handleNavigate(id); }}
                className={`flex items-center gap-2 px-2 py-1.5 rounded-md w-full text-left transition-colors ${currentFolderId === id ? 'bg-blue-100 dark:bg-white/10 text-blue-600 dark:text-blue-400' : 'hover:bg-zinc-200 dark:hover:bg-white/5'}`}
              >
                <Icon className={`w-4 h-4 ${item.color || 'text-yellow-500'}`} />
                <span className="truncate">{item.name}</span>
              </button>
            );
          })}
           
          <div className="px-2 py-1.5 text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1 mt-4">Drives</div>
          {files['c_drive'] && (
            <button 
              onClick={(e) => { e.stopPropagation(); handleNavigate('c_drive'); }}
              className={`flex items-center gap-2 px-2 py-1.5 rounded-md w-full text-left transition-colors ${currentFolderId === 'c_drive' ? 'bg-blue-100 dark:bg-white/10 text-blue-600 dark:text-blue-400' : 'hover:bg-zinc-200 dark:hover:bg-white/5'}`}
            >
              <HardDrive className="w-4 h-4 text-zinc-500" />
              <span className="truncate">Local Disk (C:)</span>
            </button>
          )}
           
          <div className="mt-4 px-2 space-y-2">
            <button 
              onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
              className="w-full flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-xs font-medium transition-colors shadow-sm"
            >
              <UploadCloud className="w-3 h-3" /> Upload Files
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); connectLocalDrive(); }}
              className="w-full flex items-center gap-2 px-3 py-2 bg-zinc-600 hover:bg-zinc-700 text-white rounded-md text-xs font-medium transition-colors shadow-sm"
            >
              <Plus className="w-3 h-3" /> Connect Folder
            </button>
          </div>
        </div>

        <div 
          className={`flex-1 bg-white dark:bg-[#1C1C1C] p-4 overflow-y-auto relative ${isDraggingOver ? 'ring-2 ring-blue-500 ring-inset' : ''}`}
          onContextMenu={(e) => handleContextMenu(e)}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          {isDraggingOver && (
            <div className="absolute inset-0 bg-blue-500/10 flex items-center justify-center z-10 pointer-events-none">
              <div className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2">
                <UploadCloud className="w-5 h-5" />
                Drop files here to upload
              </div>
            </div>
          )}

          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
              <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4" />
              <p>Loading files...</p>
            </div>
          ) : (
            <>
              {searchResults && (
                <div className="mb-4 px-2 py-1 bg-blue-50 dark:bg-blue-900/20 rounded text-sm">
                  Found {searchResults.length} results for "{searchQuery}"
                </div>
              )}
              
              {viewMode === 'grid' ? (
                <div className="grid grid-cols-[repeat(auto-fill,minmax(90px,1fr))] gap-2">
                  {isCreatingFolder && (
                    <div className="flex flex-col items-center gap-1 p-2 rounded-md bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                      <Folder className="w-10 h-10 text-yellow-400 fill-yellow-400" />
                      <input
                        type="text"
                        value={newFolderName}
                        onChange={(e) => setNewFolderName(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleCreateFolder();
                          if (e.key === 'Escape') setIsCreatingFolder(false);
                        }}
                        onBlur={handleCreateFolder}
                        autoFocus
                        className="text-xs text-center w-full bg-white dark:bg-zinc-800 border rounded px-1 py-0.5"
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                  )}
                  
                  {displayItems.map((item) => (
                    <div 
                      key={item.id}
                      onClick={(e) => handleItemClick(e, item.id)}
                      onDoubleClick={() => handleOpenFile(item)}
                      onContextMenu={(e) => handleContextMenu(e, item.id)}
                      className={`
                        group flex flex-col items-center gap-1 p-2 rounded-md cursor-default border border-transparent
                        ${selectedItems.has(item.id) ? 'bg-blue-50 dark:bg-white/10 border-blue-200 dark:border-white/20' : 'hover:bg-zinc-50 dark:hover:bg-white/5'}
                      `}
                    >
                      {renamingId === item.id ? (
                        <>
                          <div className="w-12 h-12 flex items-center justify-center">
                            {getFileIcon(item)}
                          </div>
                          <input
                            type="text"
                            value={renameValue}
                            onChange={(e) => setRenameValue(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleRename();
                              if (e.key === 'Escape') { setRenamingId(null); setRenameValue(''); }
                            }}
                            onBlur={handleRename}
                            autoFocus
                            className="text-xs text-center w-full bg-white dark:bg-zinc-800 border rounded px-1 py-0.5"
                            onClick={(e) => e.stopPropagation()}
                          />
                        </>
                      ) : (
                        <>
                          <div className="w-12 h-12 flex items-center justify-center">
                            {getFileIcon(item)}
                          </div>
                          <span className={`text-xs text-center w-full truncate px-1 ${selectedItems.has(item.id) ? 'text-blue-600 dark:text-blue-400 font-medium' : 'text-zinc-700 dark:text-zinc-300'}`}>
                            {item.name}
                          </span>
                        </>
                      )}
                    </div>
                  ))}
                  
                  {displayItems.length === 0 && !isCreatingFolder && (
                    <div className="col-span-full flex flex-col items-center justify-center text-zinc-400 py-20">
                      <Folder className="w-16 h-16 mb-2 opacity-20" />
                      <p className="text-sm">{searchResults ? 'No results found' : 'This folder is empty'}</p>
                      <p className="text-xs mt-2">Drop files here or click "Upload Files"</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-1">
                  <div className="grid grid-cols-[1fr_100px_150px] gap-4 px-2 py-1 text-xs font-medium text-zinc-500 border-b border-zinc-200 dark:border-zinc-700">
                    <span>Name</span>
                    <span>Size</span>
                    <span>Modified</span>
                  </div>
                  
                  {displayItems.map((item) => (
                    <div 
                      key={item.id}
                      onClick={(e) => handleItemClick(e, item.id)}
                      onDoubleClick={() => handleOpenFile(item)}
                      onContextMenu={(e) => handleContextMenu(e, item.id)}
                      className={`
                        grid grid-cols-[1fr_100px_150px] gap-4 px-2 py-1.5 rounded cursor-default
                        ${selectedItems.has(item.id) ? 'bg-blue-50 dark:bg-white/10' : 'hover:bg-zinc-50 dark:hover:bg-white/5'}
                      `}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="w-5 h-5 flex items-center justify-center flex-shrink-0">
                          {item.type === 'folder' ? (
                            <Folder className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                          ) : (
                            <File className="w-4 h-4 text-zinc-400" />
                          )}
                        </div>
                        {renamingId === item.id ? (
                          <input
                            type="text"
                            value={renameValue}
                            onChange={(e) => setRenameValue(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleRename();
                              if (e.key === 'Escape') { setRenamingId(null); setRenameValue(''); }
                            }}
                            onBlur={handleRename}
                            autoFocus
                            className="text-sm bg-white dark:bg-zinc-800 border rounded px-1 flex-1"
                            onClick={(e) => e.stopPropagation()}
                          />
                        ) : (
                          <span className="text-sm truncate">{item.name}</span>
                        )}
                      </div>
                      <span className="text-xs text-zinc-500">
                        {item.type === 'file' && item.size ? `${(item.size / 1024).toFixed(1)} KB` : '-'}
                      </span>
                      <span className="text-xs text-zinc-500">
                        {new Date(item.modifiedAt).toLocaleDateString()}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
      
      <div className="h-6 bg-[#F9F9F9] dark:bg-[#202020] border-t border-zinc-200 dark:border-zinc-700 flex items-center px-3 text-xs text-zinc-500 justify-between">
        <span>
          {selectedItems.size > 0 
            ? `${selectedItems.size} item(s) selected`
            : `${displayItems.length} items`
          }
        </span>
        <div className="flex gap-4">
          <button className="hover:text-foreground"><Menu className="w-3 h-3" /></button>
        </div>
      </div>

      {contextMenu && (
        <div 
          className="fixed z-[9999] bg-white/95 dark:bg-zinc-800/95 backdrop-blur-md border border-zinc-200 dark:border-zinc-700 rounded-lg shadow-xl py-1 min-w-[180px]"
          style={{ top: contextMenu.y, left: contextMenu.x }}
          onClick={(e) => e.stopPropagation()}
        >
          {contextMenu.itemId ? (
            <>
              <button
                onClick={() => {
                  const item = files[contextMenu.itemId!];
                  if (item) handleOpenFile(item);
                  setContextMenu(null);
                }}
                className="w-full px-4 py-2 text-left text-sm hover:bg-blue-500/20 flex items-center gap-2"
              >
                <File className="w-4 h-4" /> Open
              </button>
              <button
                onClick={() => {
                  const item = files[contextMenu.itemId!];
                  if (item) {
                    setRenamingId(item.id);
                    setRenameValue(item.name);
                  }
                  setContextMenu(null);
                }}
                className="w-full px-4 py-2 text-left text-sm hover:bg-blue-500/20 flex items-center gap-2"
              >
                <Edit3 className="w-4 h-4" /> Rename
              </button>
              <button
                onClick={() => {
                  setClipboard({ ids: Array.from(selectedItems.size > 0 ? selectedItems : [contextMenu.itemId!]), action: 'copy' });
                  showNotification('Copied to clipboard');
                  setContextMenu(null);
                }}
                className="w-full px-4 py-2 text-left text-sm hover:bg-blue-500/20 flex items-center gap-2"
              >
                <Copy className="w-4 h-4" /> Copy
              </button>
              <button
                onClick={() => {
                  setClipboard({ ids: Array.from(selectedItems.size > 0 ? selectedItems : [contextMenu.itemId!]), action: 'cut' });
                  showNotification('Cut to clipboard');
                  setContextMenu(null);
                }}
                className="w-full px-4 py-2 text-left text-sm hover:bg-blue-500/20 flex items-center gap-2"
              >
                <Scissors className="w-4 h-4" /> Cut
              </button>
              <div className="border-t border-zinc-200 dark:border-zinc-700 my-1" />
              <button
                onClick={() => {
                  handleDelete(selectedItems.size > 0 ? Array.from(selectedItems) : [contextMenu.itemId!]);
                  setContextMenu(null);
                }}
                className="w-full px-4 py-2 text-left text-sm hover:bg-red-500/20 text-red-600 flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" /> Delete
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => {
                  setIsCreatingFolder(true);
                  setContextMenu(null);
                }}
                className="w-full px-4 py-2 text-left text-sm hover:bg-blue-500/20 flex items-center gap-2"
              >
                <FolderPlus className="w-4 h-4" /> New Folder
              </button>
              <button
                onClick={() => {
                  fileInputRef.current?.click();
                  setContextMenu(null);
                }}
                className="w-full px-4 py-2 text-left text-sm hover:bg-blue-500/20 flex items-center gap-2"
              >
                <UploadCloud className="w-4 h-4" /> Upload Files
              </button>
              {clipboard && (
                <>
                  <div className="border-t border-zinc-200 dark:border-zinc-700 my-1" />
                  <button
                    onClick={async () => {
                      showNotification('Paste not yet implemented');
                      setContextMenu(null);
                    }}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-blue-500/20 flex items-center gap-2"
                  >
                    <Clipboard className="w-4 h-4" /> Paste
                  </button>
                </>
              )}
              <div className="border-t border-zinc-200 dark:border-zinc-700 my-1" />
              <button
                onClick={() => {
                  refreshFiles();
                  setContextMenu(null);
                }}
                className="w-full px-4 py-2 text-left text-sm hover:bg-blue-500/20 flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" /> Refresh
              </button>
            </>
          )}
        </div>
      )}

      {notification && (
        <div className="fixed bottom-6 left-6 bg-zinc-800 text-white px-4 py-2 rounded-lg shadow-lg text-sm flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 z-50">
          <Check className="w-4 h-4 text-green-400" />
          {notification}
        </div>
      )}
    </div>
  );
}
