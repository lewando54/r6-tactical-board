import { useEffect, useState } from 'react';
import { Circle, Image as KonvaImage } from 'react-konva';
import type { KonvaEventObject } from 'konva/lib/Node';
import { getLegendItem } from '../../config/legendConfig';
import { PLACEHOLDER_ERROR_FILL, PLACEHOLDER_LOADING_FILL } from '../../config/canvasConstants';
import type { LegendIconElement } from '../../types';
import { svgStringToImage } from '../../utils/svgToImage';
import { textToCanvas } from '../../utils/textToImage';

interface LegendIconProps {
  element: LegendIconElement;
  draggable?: boolean;
  listening?: boolean;
  onDragEnd?: (event: KonvaEventObject<DragEvent>) => void;
  onClick?: (event: KonvaEventObject<MouseEvent>) => void;
  onTap?: (event: KonvaEventObject<TouchEvent>) => void;
}

export function LegendIcon({
  element,
  draggable = false,
  listening = true,
  onDragEnd,
  onClick,
  onTap,
}: LegendIconProps) {
  const [imageSource, setImageSource] = useState<HTMLImageElement | HTMLCanvasElement | null>(null);
  const [hasError, setHasError] = useState(false);
  const legendItem = getLegendItem(element.legendId);

  useEffect(() => {
    let active = true;
    setImageSource(null);
    setHasError(false);

    if (!legendItem) {
      setHasError(true);
      return;
    }

    if (legendItem.svgSource) {
      svgStringToImage(legendItem.svgSource, element.width, element.height)
        .then((image) => {
          if (active) {
            setImageSource(image);
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
    }

    if (legendItem.symbol) {
      try {
        const canvas = textToCanvas(legendItem.symbol, {
          fontSize: element.height * 0.8,
          color: legendItem.color,
          width: element.width,
          height: element.height,
          align: 'center',
        });
        if (active) {
          setImageSource(canvas);
        }
      } catch {
        if (active) {
          setHasError(true);
        }
      }
    } else {
      setHasError(true);
    }

    return () => {
      active = false;
    };
  }, [legendItem, element.width, element.height]);

  const interactionProps = {
    id: element.id,
    x: element.x,
    y: element.y,
    draggable,
    listening,
    onDragEnd,
    onClick,
    onTap,
  };

  if (hasError) {
    return <Circle {...interactionProps} radius={element.width / 2} fill={PLACEHOLDER_ERROR_FILL} />;
  }

  if (!imageSource) {
    return <Circle {...interactionProps} radius={element.width / 2} fill={PLACEHOLDER_LOADING_FILL} />;
  }

  return (
    <KonvaImage
      {...interactionProps}
      image={imageSource}
      width={element.width}
      height={element.height}
      offsetX={element.width / 2}
      offsetY={element.height / 2}
      scaleX={1}
      scaleY={1}
    />
  );
}
