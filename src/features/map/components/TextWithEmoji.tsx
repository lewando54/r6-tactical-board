import { useEffect, useState } from 'react';
import { Circle, Image as KonvaImage } from 'react-konva';
import type { KonvaEventObject } from 'konva/lib/Node';
import { PLACEHOLDER_ERROR_FILL, PLACEHOLDER_LOADING_FILL } from '../config/canvasConstants';
import type { TextElement } from '../types';
import { textToCanvas } from '../utils/textToImage';

interface TextWithEmojiProps {
  element: TextElement;
  draggable: boolean;
  onDragEnd: (event: KonvaEventObject<DragEvent>) => void;
  onClick: (event: KonvaEventObject<MouseEvent>) => void;
  onTap: (event: KonvaEventObject<TouchEvent>) => void;
}

const WIDTH_FACTOR = 1.2;
const HEIGHT_FACTOR = 1.5;

export function TextWithEmoji({ element, draggable, onDragEnd, onClick, onTap }: TextWithEmojiProps) {
  const [canvasElement, setCanvasElement] = useState<HTMLCanvasElement | null>(null);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    let active = true;
    setCanvasElement(null);
    setHasError(false);

    try {
      const canvas = textToCanvas(element.text, {
        fontSize: element.fontSize,
        color: element.fill,
        width: element.fontSize * element.text.length * WIDTH_FACTOR,
        height: element.fontSize * HEIGHT_FACTOR,
        align: 'center',
      });
      if (active) {
        setCanvasElement(canvas);
      }
    } catch {
      if (active) {
        setHasError(true);
      }
    }

    return () => {
      active = false;
    };
  }, [element.text, element.fill, element.fontSize]);

  const interactionProps = {
    id: element.id,
    x: element.x,
    y: element.y,
    draggable,
    onDragEnd,
    onClick,
    onTap,
  };

  if (hasError) {
    return <Circle {...interactionProps} radius={element.fontSize} fill={PLACEHOLDER_ERROR_FILL} />;
  }

  if (!canvasElement) {
    return <Circle {...interactionProps} radius={element.fontSize / 2} fill={PLACEHOLDER_LOADING_FILL} />;
  }

  return (
    <KonvaImage
      {...interactionProps}
      image={canvasElement}
      offsetX={canvasElement.width / 2}
      offsetY={canvasElement.height / 2}
      scaleX={1}
      scaleY={1}
    />
  );
}
