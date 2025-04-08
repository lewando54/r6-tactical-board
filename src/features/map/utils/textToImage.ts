/**
 * Utility for converting text (including emojis) to canvas/image elements
 * that can be used with Konva
 */

/**
 * Converts text (including emojis) to an HTMLCanvasElement
 * @param text The text to convert (can include emoji)
 * @param options Styling options
 * @returns Promise resolving to HTMLCanvasElement
 */
export const textToCanvas = (
  text: string,
  options: {
    fontSize?: number;
    fontFamily?: string;
    color?: string;
    width?: number;
    height?: number;
    align?: 'left' | 'center' | 'right';
  } = {}
): Promise<HTMLCanvasElement> => {
  return new Promise((resolve) => {
    // Default options
    const {
      fontSize = 24,
      fontFamily = 'Arial, sans-serif',
      color = '#000000',
      width = fontSize * text.length,
      height = fontSize * 1.2,
      align = 'center',
    } = options;

    // Create a canvas element
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    
    // Get the 2D context
    const context = canvas.getContext('2d');
    if (!context) {
      console.error('Failed to get canvas context');
      // Return an empty canvas as fallback
      resolve(canvas);
      return;
    }

    // Clear the canvas
    context.clearRect(0, 0, width, height);
    
    // Set text properties
    context.font = `${fontSize}px ${fontFamily}`;
    context.fillStyle = color;
    context.textAlign = align;
    context.textBaseline = 'middle';
    
    // Calculate position based on alignment
    let x = width / 2;
    if (align === 'left') x = 0;
    if (align === 'right') x = width;
    
    // Draw the text (including emoji)
    context.fillText(text, x, height / 2);
    
    // Resolve with the canvas
    resolve(canvas);
  });
};

/**
 * Converts text (including emojis) to an HTMLImageElement
 * @param text The text to convert (can include emoji)
 * @param options Styling options
 * @returns Promise resolving to HTMLImageElement
 */
export const textToImage = async (
  text: string,
  options: {
    fontSize?: number;
    fontFamily?: string;
    color?: string;
    width?: number;
    height?: number;
    align?: 'left' | 'center' | 'right';
  } = {}
): Promise<HTMLImageElement> => {
  // First convert to canvas
  const canvas = await textToCanvas(text, options);
  
  // Then convert canvas to image
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = (err) => {
      console.error('Error converting canvas to image:', err);
      reject(err);
    };
    img.src = canvas.toDataURL('image/png');
    img.width = canvas.width;
    img.height = canvas.height;
  });
};