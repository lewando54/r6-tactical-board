import { useEffect, useState, type RefObject } from 'react';
import { DEFAULT_CANVAS_HEIGHT, DEFAULT_CANVAS_WIDTH } from '../config/canvasConstants';

export function useCanvasSize(containerRef: RefObject<HTMLElement | null>) {
  const [canvasSize, setCanvasSize] = useState({
    width: DEFAULT_CANVAS_WIDTH,
    height: DEFAULT_CANVAS_HEIGHT,
  });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return;
    }

    const handleResize = () => {
      setCanvasSize({ width: container.offsetWidth, height: container.offsetHeight });
    };

    const observer = new ResizeObserver(handleResize);
    observer.observe(container);
    handleResize();

    return () => {
      observer.disconnect();
    };
  }, [containerRef]);

  return canvasSize;
}
