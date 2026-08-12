import { describe, expect, it } from 'vitest';
import { initialMapState, mapReducer } from './mapReducer';
import type { MapElement } from '../types';

const marker: MapElement = {
  type: 'permMarker',
  id: 'marker-1',
  x: 10,
  y: 20,
  radius: 5,
  fill: '#ff0000',
};

describe('mapReducer', () => {
  it('adds an element to a floor', () => {
    const next = mapReducer(initialMapState, {
      type: 'ADD_ELEMENT',
      payload: { floor: 0, element: marker },
    });

    expect(next.elementsByFloor[0]).toEqual([marker]);
    expect(next.history.elementsByFloor).toHaveLength(1);
  });

  it('moves a positioned element', () => {
    const withMarker = mapReducer(initialMapState, {
      type: 'ADD_ELEMENT',
      payload: { floor: 0, element: marker },
    });
    const moved = mapReducer(withMarker, {
      type: 'MOVE_ELEMENT',
      payload: { floor: 0, id: 'marker-1', x: 40, y: 50 },
    });

    expect(moved.elementsByFloor[0]?.[0]).toMatchObject({ x: 40, y: 50, type: 'permMarker' });
  });

  it('undoes the last change', () => {
    const withMarker = mapReducer(initialMapState, {
      type: 'ADD_ELEMENT',
      payload: { floor: 0, element: marker },
    });
    const undone = mapReducer(withMarker, { type: 'UNDO' });

    expect(undone.elementsByFloor[0]).toBeUndefined();
  });

  it('clears a single floor or the whole canvas', () => {
    const withMarker = mapReducer(initialMapState, {
      type: 'ADD_ELEMENT',
      payload: { floor: 1, element: marker },
    });
    const clearedFloor = mapReducer(withMarker, {
      type: 'CLEAR_CANVAS',
      payload: { floor: 1 },
    });
    expect(clearedFloor.elementsByFloor[1]).toEqual([]);

    const clearedAll = mapReducer(withMarker, { type: 'CLEAR_CANVAS' });
    expect(clearedAll.elementsByFloor).toEqual({});
    expect(clearedAll.stageState).toEqual({ x: 0, y: 0, scale: 1 });
  });
});
