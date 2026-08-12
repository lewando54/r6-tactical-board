import { describe, expect, it } from 'vitest';
import { parseStrategyFile, STRATEGY_FILE_VERSION } from './strategyFile';

describe('parseStrategyFile', () => {
  it('parses a v2 strategy file', () => {
    const parsed = parseStrategyFile({
      version: STRATEGY_FILE_VERSION,
      mapId: 'oregon',
      elementsByFloor: {
        '0': [
          {
            type: 'operator',
            id: 'op-1',
            x: 10,
            y: 20,
            operatorId: 'ash',
            width: 30,
            height: 30,
          },
        ],
      },
      stageState: { x: 1, y: 2, scale: 1.5 },
    });

    expect(parsed.version).toBe(2);
    expect(parsed.mapId).toBe('oregon');
    expect(parsed.elementsByFloor[0]?.[0]).toEqual({
      type: 'operator',
      id: 'op-1',
      x: 10,
      y: 20,
      operatorId: 'ash',
      width: 30,
      height: 30,
    });
  });

  it('migrates a legacy file and drops embedded SVG fields', () => {
    const parsed = parseStrategyFile({
      mapId: 'oregon',
      elementsByFloor: {
        '0': [
          {
            type: 'operator',
            id: 123.45,
            x: 10,
            y: 20,
            operatorId: 'ash',
            icon: '<svg></svg>',
            iconSVG: '<svg></svg>',
            width: 30,
            height: 30,
            floorIndex: 0,
          },
          {
            type: 'legendIcon',
            id: 2,
            x: 5,
            y: 6,
            legendId: 'camera',
            color: '#fff',
            width: 30,
            height: 30,
            symbol: '📷',
          },
          {
            type: 'drawing',
            id: 3,
            points: [0, 0, 10, 10],
            stroke: '#ffffff',
            strokeWidth: 10,
            globalCompositeOperation: 'destination-out',
            lineCap: 'round',
            lineJoin: 'round',
          },
        ],
      },
      stageState: { x: 0, y: 0, scale: 1 },
    });

    expect(parsed.version).toBe(2);
    expect(parsed.elementsByFloor[0]).toEqual([
      {
        type: 'operator',
        id: '123.45',
        x: 10,
        y: 20,
        operatorId: 'ash',
        width: 30,
        height: 30,
      },
      {
        type: 'legendIcon',
        id: '2',
        x: 5,
        y: 6,
        legendId: 'camera',
        width: 30,
        height: 30,
      },
      {
        type: 'eraser',
        id: '3',
        points: [0, 0, 10, 10],
        strokeWidth: 10,
        lineCap: 'round',
        lineJoin: 'round',
      },
    ]);
  });

  it('rejects invalid files', () => {
    expect(() => parseStrategyFile({ version: 2, mapId: 'oregon' })).toThrow();
  });
});
