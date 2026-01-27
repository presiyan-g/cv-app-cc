import { useCallback, useEffect, useState } from 'react';

interface ResizeHandleProps {
  onResize: (delta: number) => void;
  onResizeEnd?: () => void;
}

export function ResizeHandle({ onResize, onResizeEnd }: ResizeHandleProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    setStartX(e.clientX);
  }, []);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging) return;
      const delta = e.clientX - startX;
      setStartX(e.clientX);
      onResize(delta);
    },
    [isDragging, startX, onResize]
  );

  const handleMouseUp = useCallback(() => {
    if (isDragging) {
      setIsDragging(false);
      onResizeEnd?.();
    }
  }, [isDragging, onResizeEnd]);

  // Touch support
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    setIsDragging(true);
    setStartX(e.touches[0].clientX);
  }, []);

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      if (!isDragging) return;
      const delta = e.touches[0].clientX - startX;
      setStartX(e.touches[0].clientX);
      onResize(delta);
    },
    [isDragging, startX, onResize]
  );

  const handleTouchEnd = useCallback(() => {
    if (isDragging) {
      setIsDragging(false);
      onResizeEnd?.();
    }
  }, [isDragging, onResizeEnd]);

  // Add global mouse/touch event listeners when dragging
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('touchmove', handleTouchMove);
      document.addEventListener('touchend', handleTouchEnd);
      // Prevent text selection while dragging
      document.body.style.userSelect = 'none';
      document.body.style.cursor = 'col-resize';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
      document.body.style.userSelect = '';
      document.body.style.cursor = '';
    };
  }, [isDragging, handleMouseMove, handleMouseUp, handleTouchMove, handleTouchEnd]);

  return (
    <div
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      className={`
        hidden lg:block absolute right-0 top-0 bottom-0 w-1 z-10
        cursor-col-resize transition-colors
        hover:bg-primary-400 active:bg-primary-500
        ${isDragging ? 'bg-primary-500' : 'bg-transparent hover:bg-primary-300'}
      `}
      title="Drag to resize"
    >
      {/* Wider invisible hit area for easier grabbing */}
      <div className="absolute inset-y-0 -left-1 -right-1" />
    </div>
  );
}
