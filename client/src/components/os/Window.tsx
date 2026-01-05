import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Minus, Maximize2, Minimize2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSoundEffects } from '@/lib/useSoundEffects';

interface WindowProps {
  id: string;
  title: string;
  children: React.ReactNode;
  isOpen: boolean;
  isMinimised: boolean;
  onClose: () => void;
  onMinimize: () => void;
  onFocus: () => void;
  zIndex: number;
  initialWidth?: number;
  initialHeight?: number;
  minWidth?: number;
  minHeight?: number;
}

interface Position {
  x: number;
  y: number;
}

interface Size {
  width: number;
  height: number;
}

export function Window({ 
  id, 
  title, 
  children, 
  isOpen, 
  isMinimised, 
  onClose, 
  onMinimize, 
  onFocus, 
  zIndex,
  initialWidth = 900,
  initialHeight = 650,
  minWidth = 400,
  minHeight = 300,
}: WindowProps) {
  const windowRef = useRef<HTMLDivElement>(null);
  const { playClick, playClose, playMinimize } = useSoundEffects();
  const [isMaximized, setIsMaximized] = useState(false);
  const [position, setPosition] = useState<Position>({ x: 80 + Math.random() * 100, y: 60 + Math.random() * 80 });
  const [size, setSize] = useState<Size>({ width: initialWidth, height: initialHeight });
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeDirection, setResizeDirection] = useState<string>('');
  const dragStart = useRef<Position>({ x: 0, y: 0 });
  const initialPos = useRef<Position>({ x: 0, y: 0 });
  const initialSize = useRef<Size>({ width: 0, height: 0 });
  const preMaximizeState = useRef<{ position: Position; size: Size } | null>(null);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (isMaximized) return;
    e.preventDefault();
    setIsDragging(true);
    dragStart.current = { x: e.clientX, y: e.clientY };
    initialPos.current = { ...position };
    onFocus();
  }, [isMaximized, position, onFocus]);

  const handleResizeMouseDown = useCallback((e: React.MouseEvent, direction: string) => {
    if (isMaximized) return;
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);
    setResizeDirection(direction);
    dragStart.current = { x: e.clientX, y: e.clientY };
    initialPos.current = { ...position };
    initialSize.current = { ...size };
    onFocus();
  }, [isMaximized, position, size, onFocus]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const dx = e.clientX - dragStart.current.x;
        const dy = e.clientY - dragStart.current.y;
        setPosition({
          x: Math.max(0, Math.min(window.innerWidth - 100, initialPos.current.x + dx)),
          y: Math.max(0, Math.min(window.innerHeight - 100, initialPos.current.y + dy)),
        });
      } else if (isResizing) {
        const dx = e.clientX - dragStart.current.x;
        const dy = e.clientY - dragStart.current.y;
        let newWidth = initialSize.current.width;
        let newHeight = initialSize.current.height;
        let newX = initialPos.current.x;
        let newY = initialPos.current.y;

        if (resizeDirection.includes('e')) {
          newWidth = Math.max(minWidth, initialSize.current.width + dx);
        }
        if (resizeDirection.includes('w')) {
          newWidth = Math.max(minWidth, initialSize.current.width - dx);
          if (newWidth > minWidth) {
            newX = initialPos.current.x + dx;
          }
        }
        if (resizeDirection.includes('s')) {
          newHeight = Math.max(minHeight, initialSize.current.height + dy);
        }
        if (resizeDirection.includes('n')) {
          newHeight = Math.max(minHeight, initialSize.current.height - dy);
          if (newHeight > minHeight) {
            newY = initialPos.current.y + dy;
          }
        }

        setSize({ width: newWidth, height: newHeight });
        setPosition({ x: newX, y: newY });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setIsResizing(false);
      setResizeDirection('');
    };

    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, isResizing, resizeDirection, minWidth, minHeight]);

  const toggleMaximize = useCallback(() => {
    if (isMaximized) {
      if (preMaximizeState.current) {
        setPosition(preMaximizeState.current.position);
        setSize(preMaximizeState.current.size);
      }
      setIsMaximized(false);
    } else {
      preMaximizeState.current = { position, size };
      setIsMaximized(true);
    }
  }, [isMaximized, position, size]);

  const resizeHandleClass = "absolute hover:bg-blue-500/30 transition-colors";

  return (
    <AnimatePresence>
      {isOpen && !isMinimised && (
        <motion.div
          ref={windowRef}
          initial={{ scale: 0.92, opacity: 0, y: 20 }}
          animate={{ 
            scale: 1, 
            opacity: 1,
            y: 0,
          }}
          exit={{ scale: 0.92, opacity: 0, y: 30 }}
          transition={{ type: "spring", damping: 28, stiffness: 400, mass: 0.8 }}
          className={cn(
            "flex flex-col overflow-hidden shadow-2xl ring-1 ring-white/10 font-sans select-none",
            isMaximized ? "fixed inset-0 rounded-none" : "absolute rounded-xl",
            (isDragging || isResizing) && "pointer-events-none"
          )}
          style={{ 
            zIndex,
            ...(isMaximized ? {} : {
              left: position.x,
              top: position.y,
              width: size.width,
              height: size.height,
            })
          }}
          onMouseDown={(e) => {
            e.stopPropagation();
            onFocus();
          }}
        >
          <div className="absolute inset-0 bg-white/90 dark:bg-[#0f0f0f]/90 backdrop-blur-2xl -z-10" />

          <div 
            className="h-10 flex items-center justify-between px-4 cursor-move bg-white/50 dark:bg-white/5 border-b border-white/10 flex-shrink-0"
            onMouseDown={handleMouseDown}
            onDoubleClick={toggleMaximize}
          >
            <div className="text-xs font-medium text-foreground/80 font-display pointer-events-none">{title}</div>
            <div className="flex items-center gap-1" onMouseDown={(e) => e.stopPropagation()}>
              <button 
                onClick={() => { playMinimize(); onMinimize(); }}
                className="p-1.5 hover:bg-white/20 rounded-md transition-colors cursor-pointer"
              >
                <Minus className="w-3 h-3" />
              </button>
              <button 
                onClick={() => { playClick(); toggleMaximize(); }}
                className="p-1.5 hover:bg-white/20 rounded-md transition-colors cursor-pointer"
              >
                {isMaximized ? <Minimize2 className="w-3 h-3" /> : <Maximize2 className="w-3 h-3" />}
              </button>
              <button 
                onClick={() => { playClose(); onClose(); }}
                className="p-1.5 hover:bg-red-500 hover:text-white rounded-md transition-colors cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-auto">
            {children}
          </div>

          {!isMaximized && (
            <>
              <div 
                className={cn(resizeHandleClass, "top-0 left-0 right-0 h-1 cursor-n-resize")}
                onMouseDown={(e) => handleResizeMouseDown(e, 'n')}
              />
              <div 
                className={cn(resizeHandleClass, "bottom-0 left-0 right-0 h-1 cursor-s-resize")}
                onMouseDown={(e) => handleResizeMouseDown(e, 's')}
              />
              <div 
                className={cn(resizeHandleClass, "left-0 top-0 bottom-0 w-1 cursor-w-resize")}
                onMouseDown={(e) => handleResizeMouseDown(e, 'w')}
              />
              <div 
                className={cn(resizeHandleClass, "right-0 top-0 bottom-0 w-1 cursor-e-resize")}
                onMouseDown={(e) => handleResizeMouseDown(e, 'e')}
              />
              <div 
                className={cn(resizeHandleClass, "top-0 left-0 w-3 h-3 cursor-nw-resize")}
                onMouseDown={(e) => handleResizeMouseDown(e, 'nw')}
              />
              <div 
                className={cn(resizeHandleClass, "top-0 right-0 w-3 h-3 cursor-ne-resize")}
                onMouseDown={(e) => handleResizeMouseDown(e, 'ne')}
              />
              <div 
                className={cn(resizeHandleClass, "bottom-0 left-0 w-3 h-3 cursor-sw-resize")}
                onMouseDown={(e) => handleResizeMouseDown(e, 'sw')}
              />
              <div 
                className={cn(resizeHandleClass, "bottom-0 right-0 w-3 h-3 cursor-se-resize")}
                onMouseDown={(e) => handleResizeMouseDown(e, 'se')}
              />
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
