import { useCallback, useRef, useState } from 'react';
import { Image as KonvaImage, Layer, Stage } from 'react-konva';
import type Konva from 'konva';
import type { KonvaEventObject } from 'konva/lib/Node';
import useImage from 'use-image';
import { useMapDispatch, useMapState } from '../../state/MapStateContext';
import type { AdminMapConfig, MapElement, Tool } from '../../types';
import {
  DEFAULT_ICON_SIZE,
  DEFAULT_TEXT_FONT_SIZE,
  PERM_MARKER_RADIUS,
} from '../../config/canvasConstants';
import { useCanvasSize } from '../../hooks/useCanvasSize';
import { useDrawingSession } from '../../hooks/useDrawingSession';
import { useStagePanZoom } from '../../hooks/useStagePanZoom';
import { createElementId } from '../../utils/createElementId';
import { getRelativePointerPosition } from '../../utils/pointer';
import { AdminOverlaysLayer } from './AdminOverlaysLayer';
import { DrawingPreviewLayer } from './DrawingPreviewLayer';
import { MapElementsLayer } from './MapElementsLayer';
import { TextPromptDialog } from '../TextPromptDialog';

interface MapCanvasProps {
  mapImageUrl: string;
  currentFloor: number;
  adminConfig: AdminMapConfig | null;
}

const DRAW_START_TOOLS: Tool[] = ['arrow', 'draw', 'erase'];
const MIDDLE_MOUSE_BUTTON = 1;

function getCursorStyle(tool: Tool): string {
  switch (tool) {
    case 'select':
      return 'grab';
    case 'erase':
      return 'cell';
    case 'text':
      return 'text';
    case 'draw':
    case 'arrow':
    case 'permMarker':
    case 'operator':
    case 'legendIcon':
      return 'crosshair';
    default:
      return 'default';
  }
}

export function MapCanvas({ mapImageUrl, currentFloor, adminConfig }: MapCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<Konva.Stage>(null);
  const canvasSize = useCanvasSize(containerRef);
  const [mapImage] = useImage(mapImageUrl);
  const mapState = useMapState();
  const dispatch = useMapDispatch();
  const currentFloorElements = mapState.elementsByFloor[currentFloor] ?? [];
  const { currentTool, selectedColor, selectedOperator, selectedLegendItem, stageState } = mapState;
  const [mousePosition, setMousePosition] = useState<{ x: number; y: number } | null>(null);
  const [pendingTextPosition, setPendingTextPosition] = useState<{ x: number; y: number } | null>(null);

  const { handleWheel, handleStageDragEnd } = useStagePanZoom(stageRef, dispatch);
  const { isDrawing, drawingPoints, startDrawing, continueDrawing, finishDrawing } = useDrawingSession({
    currentTool,
    currentFloor,
    selectedColor,
    dispatch,
  });

  const handleElementDragEnd = useCallback(
    (event: KonvaEventObject<DragEvent>) => {
      if (event.target === stageRef.current) {
        handleStageDragEnd(event);
        return;
      }
      const id = event.target.id();
      if (!id) {
        return;
      }
      dispatch({
        type: 'MOVE_ELEMENT',
        payload: { floor: currentFloor, id, x: event.target.x(), y: event.target.y() },
      });
    },
    [currentFloor, dispatch, handleStageDragEnd],
  );

  const handleElementClick = useCallback(
    (event: KonvaEventObject<MouseEvent | TouchEvent>, element: MapElement) => {
      event.evt.stopPropagation();
      if (currentTool === 'erase') {
        dispatch({ type: 'REMOVE_ELEMENT', payload: { floor: currentFloor, id: element.id } });
      }
    },
    [currentFloor, currentTool, dispatch],
  );

  const handleMouseDown = useCallback(
    (event: KonvaEventObject<MouseEvent>) => {
      const stage = stageRef.current;
      if (!stage || event.target !== stage) {
        return;
      }
      const position = getRelativePointerPosition(stage);
      if (!position) {
        return;
      }

      if (event.evt.button === MIDDLE_MOUSE_BUTTON) {
        stage.draggable(true);
        const handleMiddleMouseUp = () => {
          stage.draggable(currentTool === 'select');
          window.removeEventListener('mouseup', handleMiddleMouseUp);
        };
        window.addEventListener('mouseup', handleMiddleMouseUp);
        return;
      }

      if (DRAW_START_TOOLS.includes(currentTool)) {
        startDrawing(position);
        return;
      }

      switch (currentTool) {
        case 'permMarker':
          dispatch({
            type: 'ADD_ELEMENT',
            payload: {
              floor: currentFloor,
              element: {
                id: createElementId(),
                type: 'permMarker',
                x: position.x,
                y: position.y,
                radius: PERM_MARKER_RADIUS,
                fill: selectedColor,
              },
            },
          });
          break;
        case 'operator':
          if (selectedOperator) {
            dispatch({
              type: 'ADD_ELEMENT',
              payload: {
                floor: currentFloor,
                element: {
                  id: createElementId(),
                  type: 'operator',
                  x: position.x,
                  y: position.y,
                  operatorId: selectedOperator.id,
                  width: DEFAULT_ICON_SIZE,
                  height: DEFAULT_ICON_SIZE,
                },
              },
            });
          }
          break;
        case 'text':
          setPendingTextPosition(position);
          break;
        case 'legendIcon':
          if (selectedLegendItem) {
            dispatch({
              type: 'ADD_ELEMENT',
              payload: {
                floor: currentFloor,
                element: {
                  id: createElementId(),
                  type: 'legendIcon',
                  x: position.x,
                  y: position.y,
                  legendId: selectedLegendItem.id,
                  width: DEFAULT_ICON_SIZE,
                  height: DEFAULT_ICON_SIZE,
                },
              },
            });
          }
          break;
        default:
          break;
      }
    },
    [
      currentFloor,
      currentTool,
      dispatch,
      selectedColor,
      selectedLegendItem,
      selectedOperator,
      startDrawing,
    ],
  );

  const handleMouseMove = useCallback(() => {
    const position = getRelativePointerPosition(stageRef.current);
    if (!position) {
      return;
    }
    setMousePosition(position);
    continueDrawing(position);
  }, [continueDrawing]);

  const handleTextSubmit = useCallback(
    (text: string) => {
      if (!pendingTextPosition) {
        return;
      }
      dispatch({
        type: 'ADD_ELEMENT',
        payload: {
          floor: currentFloor,
          element: {
            id: createElementId(),
            type: 'text',
            x: pendingTextPosition.x,
            y: pendingTextPosition.y,
            text,
            fill: selectedColor,
            fontSize: DEFAULT_TEXT_FONT_SIZE,
          },
        },
      });
      setPendingTextPosition(null);
    },
    [currentFloor, dispatch, pendingTextPosition, selectedColor],
  );

  return (
    <div ref={containerRef} className="relative h-full w-full">
      <Stage
        ref={stageRef}
        width={canvasSize.width}
        height={canvasSize.height}
        draggable={currentTool === 'select'}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={finishDrawing}
        onMouseLeave={finishDrawing}
        onDragStart={(event) => {
          if (event.target === stageRef.current) {
            const container = stageRef.current.container();
            container.style.cursor = 'grabbing';
          }
        }}
        onDragEnd={(event) => {
          handleElementDragEnd(event);
          const container = stageRef.current?.container();
          if (container) {
            container.style.cursor = getCursorStyle(currentTool);
          }
        }}
        scaleX={stageState.scale}
        scaleY={stageState.scale}
        x={stageState.x}
        y={stageState.y}
        style={{ cursor: getCursorStyle(currentTool) }}
      >
        <Layer listening={false}>
          {mapImage ? <KonvaImage image={mapImage} width={mapImage.width} height={mapImage.height} /> : null}
        </Layer>
        <Layer listening={false}>
          <AdminOverlaysLayer
            adminConfig={adminConfig}
            currentFloor={currentFloor}
            mapId={mapState.mapId}
            stageScale={stageState.scale}
          />
        </Layer>
        <Layer>
          <MapElementsLayer
            elements={currentFloorElements}
            currentTool={currentTool}
            stageScale={stageState.scale}
            onDragEnd={handleElementDragEnd}
            onElementClick={handleElementClick}
          />
        </Layer>
        <Layer listening={false}>
          <DrawingPreviewLayer
            isDrawing={isDrawing}
            drawingPoints={drawingPoints}
            currentTool={currentTool}
            selectedColor={selectedColor}
            stageScale={stageState.scale}
          />
        </Layer>
      </Stage>
      {mousePosition ? (
        <div className="absolute bottom-4 left-4 z-10 rounded-lg bg-gray-800 bg-opacity-90 p-2 text-sm text-white shadow-lg">
          X: {Math.round(mousePosition.x)}, Y: {Math.round(mousePosition.y)}
        </div>
      ) : null}
      <TextPromptDialog
        isOpen={pendingTextPosition !== null}
        onClose={() => setPendingTextPosition(null)}
        onSubmit={handleTextSubmit}
      />
    </div>
  );
}

export default MapCanvas;
