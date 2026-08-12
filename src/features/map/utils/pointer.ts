import type Konva from 'konva';

export function getRelativePointerPosition(stage: Konva.Stage | null): { x: number; y: number } | null {
  if (!stage) {
    return null;
  }
  const pointerPos = stage.getPointerPosition();
  if (!pointerPos) {
    return null;
  }
  const transform = stage.getAbsoluteTransform().copy();
  transform.invert();
  return transform.point(pointerPos);
}

export function polylineLength(points: number[]): number {
  if (points.length < 4) {
    return 0;
  }
  const [x1, y1, x2, y2] = points;
  return Math.hypot(x2 - x1, y2 - y1);
}
