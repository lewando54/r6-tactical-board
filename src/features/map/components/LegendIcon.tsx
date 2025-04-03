import React, { useState, useEffect, useRef } from 'react';
import { Text as KonvaText, Image as KonvaImage, Circle } from 'react-konva';
import { LegendIconElement } from '../types';

interface LegendIconProps {
  element: LegendIconElement;
}

const svgStringToImage = (svgString: string | undefined | null, width: number, height: number): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
      // --- Early validation ---
      if (!svgString) {
          console.error("svgStringToImage called with invalid or empty svgString input.");
          reject(new Error('Invalid or empty SVG string provided'));
          return;
      }
      // --- End validation ---

      // 1. Create a data URL from the SVG string or use the URL directly
      let dataUrl: string;
      if (svgString.startsWith('data:image/svg+xml') || svgString.startsWith('http')) {
          // If it's already a data URL or http URL, use it directly
          dataUrl = svgString;
      } else {
          // Encode potentially problematic characters like #
          const encodedSVG = encodeURIComponent(svgString)
                              .replace(/'/g, '%27')
                              .replace(/"/g, '%22');
          dataUrl = `data:image/svg+xml;charset=utf-8,${encodedSVG}`;
      }

      // 2. Create an HTML Image element
      const img = new Image();
      img.crossOrigin = 'anonymous';

      img.onload = () => {
          // Check if dimensions are valid
           if (img.naturalWidth > 0 && img.naturalHeight > 0) {
               resolve(img);
           } else {
               // Sometimes onload fires too early for SVG data URLs? Add a small delay as fallback.
                setTimeout(() => {
                    if (img.naturalWidth > 0 && img.naturalHeight > 0) {
                        resolve(img);
                    } else {
                       console.error("SVG loaded but has zero dimensions:", svgString.substring(0, 100));
                       reject(new Error('SVG failed to load with valid dimensions'));
                    }
                }, 50);
           }
      };

      img.onerror = (event: string | Event) => {
          console.error("Error loading SVG:", event, svgString.substring(0, 100));
          reject(new Error('Failed to load SVG'));
      };

      // 3. Set the source to the data URL
      img.src = dataUrl;
      // Optional: Explicitly set dimensions
      img.width = width;
      img.height = height;
  });
};

const LegendIcon: React.FC<LegendIconProps> = ({ element }) => {
  const [imageElement, setImageElement] = useState<HTMLImageElement | null>(null);
  const [error, setError] = useState<boolean>(false);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    let active = true;

    setImageElement(null);
    setError(false);

    if ('svgSource' in element && element.svgSource) {
      svgStringToImage(element.svgSource, element.width, element.height)
        .then((img: HTMLImageElement) => {
          if (isMountedRef.current && active) {
            setImageElement(img);
          }
        })
        .catch((err: Error) => {
          if (isMountedRef.current && active) {
            console.error(`Failed to render SVG for legend icon ${element.legendId}:`, err);
            setError(true);
          }
        });
    }

    return () => {
      isMountedRef.current = false;
      active = false;
    };
  }, [element.svgSource, element.legendId, element.width, element.height]);

  const commonProps = {
    x: element.x,
    y: element.y,
    width: element.width,
    height: element.height,
    scaleX: 1,
    scaleY: 1,
    align: "center" as const,
    verticalAlign: "middle" as const,
  };

  if (error) {
    return <Circle 
      radius={element.width / 2} 
      fill="red" 
      x={element.x}
      y={element.y}
    />;
  }

  if ('svgSource' in element && element.svgSource) {
    if (!imageElement) {
      return <Circle 
        radius={element.width / 2} 
        fill="gray" 
        x={element.x}
        y={element.y}
      />;
    }

    return <KonvaImage
      {...commonProps}
      image={imageElement}
      offsetX={element.width/2}
      offsetY={element.height/2}
    />;
  }

  if ('symbol' in element && element.symbol) {
    return <KonvaText
      {...commonProps}
      text={element.symbol}
      fill={element.color}
      fontSize={element.height * 0.8}
      offsetX={element.width/2}
      offsetY={element.height/2}
    />;
  }

  // Fallback
  return <KonvaText
    {...commonProps}
    text="?"
    fill={element.color}
    fontSize={element.height * 0.8}
    offsetX={element.width/2}
    offsetY={element.height/2}
  />;
};

export default LegendIcon; 