import { useCallback, useState, type Dispatch } from 'react';
import {
  ARROW_POINTER_LENGTH,
  ARROW_POINTER_WIDTH,
  ARROW_STROKE_WIDTH,
  DRAW_STROKE_WIDTH,
  ERASER_STROKE_WIDTH,
  MIN_ARROW_LENGTH,
  MIN_POLYLINE_COORDS,
} from '../config/canvasConstants';
import type { MapAction, Tool } from '../types';
import { createElementId } from '../utils/createElementId';
import { polylineLength } from '../utils/pointer';

interface UseDrawingSessionParams {
  currentTool: Tool;
  currentFloor: number;
  selectedColor: string;
  dispatch: Dispatch<MapAction>;
}

export function useDrawingSession({
  currentTool,
  currentFloor,
  selectedColor,
  dispatch,
}: UseDrawingSessionParams) {
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawingPoints, setDrawingPoints] = useState<number[]>([]);

  const startDrawing = useCallback((position: { x: number; y: number }) => {
    setIsDrawing(true);
    setDrawingPoints([position.x, position.y]);
  }, []);

  const continueDrawing = useCallback(
    (position: { x: number; y: number }) => {
      if (!isDrawing) {
        return;
      }
      if (currentTool === 'draw' || currentTool === 'erase') {
        setDrawingPoints((previous) => [...previous, position.x, position.y]);
        return;
      }
      if (currentTool === 'arrow') {
        setDrawingPoints((previous) => {
          if (previous.length < 2) {
            return previous;
          }
          const startX = previous[0];
          const startY = previous[1];
          if (startX === undefined || startY === undefined) {
            return previous;
          }
          return [startX, startY, position.x, position.y];
        });
      }
    },
    [currentTool, isDrawing],
  );

  const finishDrawing = useCallback(() => {
    if (!isDrawing) {
      return;
    }
    setIsDrawing(false);

    if (currentTool === 'draw' && drawingPoints.length >= MIN_POLYLINE_COORDS) {
      dispatch({
        type: 'ADD_ELEMENT',
        payload: {
          floor: currentFloor,
          element: {
            id: createElementId(),
            type: 'drawing',
            points: drawingPoints,
            stroke: selectedColor,
            strokeWidth: DRAW_STROKE_WIDTH,
          },
        },
      });
    }

    if (currentTool === 'arrow' && drawingPoints.length === MIN_POLYLINE_COORDS) {
      if (polylineLength(drawingPoints) > MIN_ARROW_LENGTH) {
        dispatch({
          type: 'ADD_ELEMENT',
          payload: {
            floor: currentFloor,
            element: {
              id: createElementId(),
              type: 'arrow',
              points: drawingPoints,
              stroke: selectedColor,
              fill: selectedColor,
              strokeWidth: ARROW_STROKE_WIDTH,
              pointerLength: ARROW_POINTER_LENGTH,
              pointerWidth: ARROW_POINTER_WIDTH,
            },
          },
        });
      }
    }

    if (currentTool === 'erase' && drawingPoints.length >= MIN_POLYLINE_COORDS) {
      dispatch({
        type: 'ADD_ELEMENT',
        payload: {
          floor: currentFloor,
          element: {
            id: createElementId(),
            type: 'eraser',
            points: drawingPoints,
            strokeWidth: ERASER_STROKE_WIDTH,
            lineCap: 'round',
            lineJoin: 'round',
          },
        },
      });
    }

    setDrawingPoints([]);
  }, [currentFloor, currentTool, dispatch, drawingPoints, isDrawing, selectedColor]);

  return { isDrawing, drawingPoints, startDrawing, continueDrawing, finishDrawing };
}
