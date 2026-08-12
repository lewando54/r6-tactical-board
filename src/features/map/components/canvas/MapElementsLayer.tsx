import { Arrow as KonvaArrow, Circle, Line as KonvaLine } from 'react-konva';
import type { KonvaEventObject } from 'konva/lib/Node';
import {
  ARROW_POINTER_LENGTH,
  ARROW_POINTER_WIDTH,
  DRAWING_TENSION,
  ERASER_STROKE_WIDTH,
  PERM_MARKER_RADIUS,
  SHADOW_BLUR_DRAGGABLE,
  SHADOW_BLUR_STATIC,
  SHADOW_OPACITY,
} from '../../config/canvasConstants';
import type { MapElement, Tool } from '../../types';
import { LegendIcon } from './LegendIcon';
import { OperatorIcon } from './OperatorIcon';
import { TextWithEmoji } from '../TextWithEmoji';

interface MapElementsLayerProps {
  elements: MapElement[];
  currentTool: Tool;
  stageScale: number;
  onDragEnd: (event: KonvaEventObject<DragEvent>) => void;
  onElementClick: (event: KonvaEventObject<MouseEvent | TouchEvent>, element: MapElement) => void;
}

export function MapElementsLayer({
  elements,
  currentTool,
  stageScale,
  onDragEnd,
  onElementClick,
}: MapElementsLayerProps) {
  const isDraggable = currentTool === 'select';
  const inverseScale = 1 / stageScale;

  return (
    <>
      {elements.map((element) => {
        const handleClick = (event: KonvaEventObject<MouseEvent>) => onElementClick(event, element);
        const handleTap = (event: KonvaEventObject<TouchEvent>) => onElementClick(event, element);
        const shadowBlur = isDraggable ? SHADOW_BLUR_DRAGGABLE : SHADOW_BLUR_STATIC;
        const sharedShadow = {
          shadowColor: 'black',
          shadowBlur,
          shadowOpacity: SHADOW_OPACITY,
          shadowOffsetX: inverseScale,
          shadowOffsetY: inverseScale,
        };

        switch (element.type) {
          case 'permMarker':
            return (
              <Circle
                key={element.id}
                id={element.id}
                x={element.x}
                y={element.y}
                radius={(element.radius || PERM_MARKER_RADIUS) * inverseScale}
                fill={element.fill}
                draggable={isDraggable}
                onDragEnd={onDragEnd}
                onClick={handleClick}
                onTap={handleTap}
                scaleX={1}
                scaleY={1}
                {...sharedShadow}
              />
            );
          case 'operator':
            return (
              <OperatorIcon
                key={element.id}
                element={element}
                draggable={isDraggable}
                onDragEnd={onDragEnd}
                onClick={handleClick}
                onTap={handleTap}
              />
            );
          case 'arrow':
            return (
              <KonvaArrow
                key={element.id}
                id={element.id}
                points={element.points}
                stroke={element.stroke}
                fill={element.fill}
                strokeWidth={element.strokeWidth * inverseScale}
                pointerLength={(element.pointerLength || ARROW_POINTER_LENGTH) * inverseScale}
                pointerWidth={(element.pointerWidth || ARROW_POINTER_WIDTH) * inverseScale}
                draggable={isDraggable}
                onDragEnd={onDragEnd}
                onClick={handleClick}
                onTap={handleTap}
                scaleX={1}
                scaleY={1}
                {...sharedShadow}
              />
            );
          case 'text':
            return (
              <TextWithEmoji
                key={element.id}
                element={element}
                draggable={isDraggable}
                onDragEnd={onDragEnd}
                onClick={handleClick}
                onTap={handleTap}
              />
            );
          case 'drawing':
            return (
              <KonvaLine
                key={element.id}
                id={element.id}
                points={element.points}
                stroke={element.stroke}
                strokeWidth={element.strokeWidth * inverseScale}
                tension={element.tension ?? DRAWING_TENSION}
                lineCap={element.lineCap ?? 'round'}
                lineJoin={element.lineJoin ?? 'round'}
                draggable={isDraggable}
                onDragEnd={onDragEnd}
                onClick={handleClick}
                onTap={handleTap}
                scaleX={1}
                scaleY={1}
                {...sharedShadow}
              />
            );
          case 'eraser':
            return (
              <KonvaLine
                key={element.id}
                id={element.id}
                points={element.points}
                stroke="#ffffff"
                strokeWidth={(element.strokeWidth || ERASER_STROKE_WIDTH) * inverseScale}
                tension={DRAWING_TENSION}
                lineCap={element.lineCap ?? 'round'}
                lineJoin={element.lineJoin ?? 'round'}
                globalCompositeOperation="destination-out"
                draggable={isDraggable}
                onDragEnd={onDragEnd}
                onClick={handleClick}
                onTap={handleTap}
                scaleX={1}
                scaleY={1}
              />
            );
          case 'legendIcon':
            return (
              <LegendIcon
                key={element.id}
                element={element}
                draggable={isDraggable}
                onDragEnd={onDragEnd}
                onClick={handleClick}
                onTap={handleTap}
              />
            );
          default: {
            const exhaustive: never = element;
            void exhaustive;
            return null;
          }
        }
      })}
    </>
  );
}
