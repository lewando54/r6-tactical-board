import React, { useState, useEffect, useRef, ComponentProps } from 'react';
import { Image as KonvaImage, Circle } from 'react-konva';
import { TextElement } from '../types';

interface TextWithEmojiProps {
  element: TextElement;
  commonProps: ComponentProps<typeof KonvaImage>;
}

const TextWithEmoji: React.FC<TextWithEmojiProps> = ({ element, commonProps }) => {
  const [canvasElement, setCanvasElement] = useState<HTMLCanvasElement | null>(null);
  const [error, setError] = useState<boolean>(false);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    let active = true;

    // Reset state when element changes
    setCanvasElement(null);
    setError(false);

    // Dynamically import the textToCanvas function
    import('../utils/textToImage').then(({ textToCanvas }) => {
      textToCanvas(element.text, {
        fontSize: element.fontSize,
        color: element.fill,
        width: element.fontSize * element.text.length * 1.2, // Approximate width based on text length
        height: element.fontSize * 1.5, // Provide enough height for the text
        align: 'center'
      }).then(canvas => {
        if (isMountedRef.current && active) {
          setCanvasElement(canvas);
        }
      }).catch(err => {
        console.error('Error rendering text to canvas:', err);
        if (isMountedRef.current && active) {
          setError(true);
        }
      });
    });

    return () => {
      isMountedRef.current = false;
      active = false;
    };
  }, [element.text, element.fill, element.fontSize]);

  // Show error state
  if (error) {
    return <Circle 
      radius={element.fontSize} 
      fill="red" 
      x={element.x}
      y={element.y}
      draggable={commonProps.draggable}
      onDragEnd={commonProps.onDragEnd}
      id={commonProps.id}
    />;
  }

  // Show loading state
  if (!canvasElement) {
    return <Circle 
      radius={element.fontSize / 2} 
      fill="gray" 
      x={element.x}
      y={element.y}
      draggable={commonProps.draggable}
      onDragEnd={commonProps.onDragEnd}
      id={commonProps.id}
    />;
  }

  // Show the rendered text as an image
  return <KonvaImage
    {...commonProps}
    image={canvasElement}
    x={element.x}
    y={element.y}
    offsetX={canvasElement.width / 2}
    offsetY={canvasElement.height / 2}
    scaleX={1}
    scaleY={1}
  />;
};

export default TextWithEmoji;