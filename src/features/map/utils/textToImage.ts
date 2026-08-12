export interface TextToCanvasOptions {
  fontSize?: number;
  fontFamily?: string;
  color?: string;
  width?: number;
  height?: number;
  align?: CanvasTextAlign;
}

const DEFAULT_FONT_SIZE = 24;
const DEFAULT_FONT_FAMILY = 'Arial, sans-serif';
const DEFAULT_COLOR = '#000000';
const HEIGHT_FACTOR = 1.2;

export function textToCanvas(text: string, options: TextToCanvasOptions = {}): HTMLCanvasElement {
  const fontSize = options.fontSize ?? DEFAULT_FONT_SIZE;
  const fontFamily = options.fontFamily ?? DEFAULT_FONT_FAMILY;
  const color = options.color ?? DEFAULT_COLOR;
  const width = options.width ?? fontSize * text.length;
  const height = options.height ?? fontSize * HEIGHT_FACTOR;
  const align = options.align ?? 'center';

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext('2d');
  if (!context) {
    return canvas;
  }

  context.clearRect(0, 0, width, height);
  context.font = `${fontSize}px ${fontFamily}`;
  context.fillStyle = color;
  context.textAlign = align;
  context.textBaseline = 'middle';

  let x = width / 2;
  if (align === 'left') {
    x = 0;
  }
  if (align === 'right') {
    x = width;
  }

  context.fillText(text, x, height / 2);
  return canvas;
}
