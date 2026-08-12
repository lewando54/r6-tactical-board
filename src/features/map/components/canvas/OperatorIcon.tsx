import { useEffect, useState } from 'react';
import { Circle, Image as KonvaImage } from 'react-konva';
import type { KonvaEventObject } from 'konva/lib/Node';
import { PLACEHOLDER_ERROR_FILL, PLACEHOLDER_LOADING_FILL } from '../../config/canvasConstants';
import type { OperatorElement } from '../../types';
import { getOperatorById } from '../../../../lib/operators';
import { svgStringToImage } from '../../utils/svgToImage';

interface OperatorIconProps {
  element: OperatorElement;
  draggable: boolean;
  onDragEnd: (event: KonvaEventObject<DragEvent>) => void;
  onClick: (event: KonvaEventObject<MouseEvent>) => void;
  onTap: (event: KonvaEventObject<TouchEvent>) => void;
}

export function OperatorIcon({ element, draggable, onDragEnd, onClick, onTap }: OperatorIconProps) {
  const [imageElement, setImageElement] = useState<HTMLImageElement | null>(null);
  const [hasError, setHasError] = useState(false);
  const operator = getOperatorById(element.operatorId);

  useEffect(() => {
    let active = true;
    setImageElement(null);
    setHasError(false);

    if (!operator) {
      setHasError(true);
      return;
    }

    svgStringToImage(operator.icon, element.width, element.height)
      .then((image) => {
        if (active) {
          setImageElement(image);
        }
      })
      .catch(() => {
        if (active) {
          setHasError(true);
        }
      });

    return () => {
      active = false;
    };
  }, [operator, element.width, element.height]);

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
    return <Circle {...interactionProps} radius={element.width / 2} fill={PLACEHOLDER_ERROR_FILL} />;
  }

  if (!imageElement) {
    return <Circle {...interactionProps} radius={element.width / 2} fill={PLACEHOLDER_LOADING_FILL} />;
  }

  return (
    <KonvaImage
      {...interactionProps}
      image={imageElement}
      width={element.width}
      height={element.height}
      offsetX={element.width / 2}
      offsetY={element.height / 2}
      scaleX={1}
      scaleY={1}
    />
  );
}
