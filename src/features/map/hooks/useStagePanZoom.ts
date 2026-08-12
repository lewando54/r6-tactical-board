import { useCallback, type RefObject } from 'react';
import type Konva from 'konva';
import type { KonvaEventObject } from 'konva/lib/Node';
import type { Dispatch } from 'react';
import {
  MAX_STAGE_SCALE,
  MIN_STAGE_SCALE,
  STAGE_SCALE_BY,
} from '../config/canvasConstants';
import type { MapAction } from '../types';

export function useStagePanZoom(
  stageRef: RefObject<Konva.Stage | null>,
  dispatch: Dispatch<MapAction>,
) {
  const handleWheel = useCallback(
    (event: KonvaEventObject<WheelEvent>) => {
      event.evt.preventDefault();
      const stage = stageRef.current;
      if (!stage) {
        return;
      }

      const oldScale = stage.scaleX();
      const pointer = stage.getPointerPosition();
      if (!pointer) {
        return;
      }

      const mousePointTo = {
        x: (pointer.x - stage.x()) / oldScale,
        y: (pointer.y - stage.y()) / oldScale,
      };

      const zoomIn = event.evt.deltaY < 0;
      const nextScale = zoomIn ? oldScale * STAGE_SCALE_BY : oldScale / STAGE_SCALE_BY;
      const newScale = Math.max(MIN_STAGE_SCALE, Math.min(MAX_STAGE_SCALE, nextScale));

      dispatch({
        type: 'SET_STAGE_STATE',
        payload: {
          scale: newScale,
          x: pointer.x - mousePointTo.x * newScale,
          y: pointer.y - mousePointTo.y * newScale,
        },
      });
    },
    [dispatch, stageRef],
  );

  const handleStageDragEnd = useCallback(
    (event: KonvaEventObject<DragEvent>) => {
      if (event.target === stageRef.current) {
        dispatch({
          type: 'SET_STAGE_STATE',
          payload: { x: event.target.x(), y: event.target.y() },
        });
      }
    },
    [dispatch, stageRef],
  );

  return { handleWheel, handleStageDragEnd };
}
