import { Arrow as KonvaArrow, Line as KonvaLine } from 'react-konva';
import {
  ARROW_POINTER_LENGTH,
  ARROW_POINTER_WIDTH,
  ARROW_STROKE_WIDTH,
  DRAW_STROKE_WIDTH,
  DRAWING_TENSION,
  ERASER_PREVIEW_STROKE,
  ERASER_STROKE_WIDTH,
  MIN_POLYLINE_COORDS,
  PREVIEW_DASH,
} from '../../config/canvasConstants';
import type { Tool } from '../../types';

interface DrawingPreviewLayerProps {
  isDrawing: boolean;
  drawingPoints: number[];
  currentTool: Tool;
  selectedColor: string;
  stageScale: number;
}

export function DrawingPreviewLayer({
  isDrawing,
  drawingPoints,
  currentTool,
  selectedColor,
  stageScale,
}: DrawingPreviewLayerProps) {
  if (!isDrawing || drawingPoints.length < 2) {
    return null;
  }

  const inverseScale = 1 / stageScale;
  const dash = [PREVIEW_DASH * inverseScale, PREVIEW_DASH * inverseScale];

  if (currentTool === 'arrow' && drawingPoints.length === MIN_POLYLINE_COORDS) {
    return (
      <KonvaArrow
        points={drawingPoints}
        stroke={selectedColor}
        fill={selectedColor}
        strokeWidth={ARROW_STROKE_WIDTH * inverseScale}
        pointerLength={ARROW_POINTER_LENGTH * inverseScale}
        pointerWidth={ARROW_POINTER_WIDTH * inverseScale}
        dash={dash}
        listening={false}
        scaleX={1}
        scaleY={1}
      />
    );
  }

  if (currentTool === 'draw' || currentTool === 'erase') {
    const stroke = currentTool === 'erase' ? ERASER_PREVIEW_STROKE : selectedColor;
    const strokeWidth = (currentTool === 'erase' ? ERASER_STROKE_WIDTH : DRAW_STROKE_WIDTH) * inverseScale;
    return (
      <KonvaLine
        points={drawingPoints}
        stroke={stroke}
        strokeWidth={strokeWidth}
        dash={dash}
        tension={DRAWING_TENSION}
        lineCap="round"
        lineJoin="round"
        listening={false}
        scaleX={1}
        scaleY={1}
      />
    );
  }

  return null;
}
