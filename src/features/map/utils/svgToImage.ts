import { SVG_LOAD_RETRY_MS } from '../config/canvasConstants';

export function svgStringToImage(
  svgString: string,
  width: number,
  height: number,
): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    let dataUrl: string;
    if (svgString.startsWith('data:image/svg+xml') || svgString.startsWith('http') || svgString.startsWith('/')) {
      dataUrl = svgString;
    } else {
      const encodedSVG = encodeURIComponent(svgString).replace(/'/g, '%27').replace(/"/g, '%22');
      dataUrl = `data:image/svg+xml;charset=utf-8,${encodedSVG}`;
    }

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.width = width;
    img.height = height;

    img.onload = () => {
      if (img.naturalWidth > 0 && img.naturalHeight > 0) {
        resolve(img);
        return;
      }
      window.setTimeout(() => {
        if (img.naturalWidth > 0 && img.naturalHeight > 0) {
          resolve(img);
        } else {
          reject(new Error('SVG failed to load with valid dimensions'));
        }
      }, SVG_LOAD_RETRY_MS);
    };

    img.onerror = () => {
      reject(new Error('Failed to load SVG'));
    };

    img.src = dataUrl;
  });
}
