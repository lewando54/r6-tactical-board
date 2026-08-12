import { describe, expect, it } from 'vitest';
import { adminMapConfigSchema, mapsIndexSchema } from './mapConfig';

describe('mapsIndexSchema', () => {
  it('parses a valid maps index', () => {
    const parsed = mapsIndexSchema.parse({
      maps: [
        {
          id: 'oregon',
          nameKey: 'maps.oregon',
          menuImage: 'r6-maps-oregon.jpg',
          floors: [
            { nameKey: 'map.basement', floorNumber: -1, image: 'r6-maps-oregon-blueprint-1.jpg' },
            { nameKey: 'map.ground', floorNumber: 0, image: 'r6-maps-oregon-blueprint-2.jpg' },
          ],
        },
      ],
    });

    expect(parsed.maps).toHaveLength(1);
    expect(parsed.maps[0]?.id).toBe('oregon');
    expect(parsed.maps[0]?.floors[0]?.image).toBe('r6-maps-oregon-blueprint-1.jpg');
  });

  it('rejects maps without floors', () => {
    expect(() =>
      mapsIndexSchema.parse({
        maps: [{ id: 'oregon', nameKey: 'maps.oregon', menuImage: 'x.jpg', floors: [] }],
      }),
    ).toThrow();
  });
});

describe('adminMapConfigSchema', () => {
  it('parses floors keyed by floorNumber', () => {
    const parsed = adminMapConfigSchema.parse({
      floors: [
        {
          floorNumber: -1,
          callouts: [{ nameKey: 'stairs', x: 10, y: 20 }],
          icons: [{ legendId: 'camera', x: 1, y: 2 }],
        },
      ],
    });

    expect(parsed.floors[0]?.floorNumber).toBe(-1);
    expect(parsed.floors[0]?.callouts?.[0]?.nameKey).toBe('stairs');
  });

  it('rejects floors missing floorNumber', () => {
    expect(() =>
      adminMapConfigSchema.parse({
        floors: [{ callouts: [] }],
      }),
    ).toThrow();
  });
});
