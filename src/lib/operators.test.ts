import { describe, expect, it } from 'vitest';
import { availableOperators } from './operators';

describe('availableOperators', () => {
  it('builds a unique catalog with SVG icons and no recruits', () => {
    expect(availableOperators.length).toBeGreaterThan(0);

    const ids = availableOperators.map((operator) => operator.id);
    expect(new Set(ids).size).toBe(ids.length);

    for (const operator of availableOperators) {
      expect(operator.role === 'Attacker' || operator.role === 'Defender').toBe(true);
      expect(operator.icon.startsWith('<svg')).toBe(true);
      expect(operator.name.length).toBeGreaterThan(0);
    }

    expect(availableOperators.some((operator) => operator.role === 'Attacker')).toBe(true);
    expect(availableOperators.some((operator) => operator.role === 'Defender')).toBe(true);
  });
});
