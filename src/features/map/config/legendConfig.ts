import { LegendItemConfig } from '../types';
import hatchCeiling from '../../../assets/icons/hatch-ceiling.svg';
import hatchFloor from '../../../assets/icons/hatch-floor.svg';

export const legendItems: LegendItemConfig[] = [
  {
    id: 'attackerSpawn',
    symbol: 'A',
    color: '#4299e1',
    nameKey: 'legendItems.attackerSpawn'
  },
  {
    id: 'defenderSpawn',
    symbol: 'D',
    color: '#f6ad55',
    nameKey: 'legendItems.defenderSpawn'
  },
  {
    id: 'objective',
    symbol: '🎯',
    color: '#f56565',
    nameKey: 'legendItems.objective'
  },
  {
    id: 'camera',
    symbol: '📷',
    color: '#a0aec0',
    nameKey: 'legendItems.camera'
  },
  {
    id: 'reinforcement',
    symbol: '🧱',
    color: '#718096',
    nameKey: 'legendItems.reinforcement'
  },
  {
    id: 'hatchCeiling',
    svgSource: hatchCeiling,
    color: '#a0aec0',
    nameKey: 'legendItems.hatchCeiling'
  },
  {
    id: 'hatchFloor',
    svgSource: hatchFloor,
    color: '#a0aec0',
    nameKey: 'legendItems.hatchFloor'
  },
  {
    id: 'softWall',
    symbol: 'SW',
    color: '#fed7d7',
    nameKey: 'legendItems.softWall'
  },
  {
    id: 'breach',
    symbol: '💥',
    color: '#ed8936',
    nameKey: 'legendItems.breach'
  },
  {
    id: 'droneHole',
    symbol: '>',
    color: '#cbd5e0',
    nameKey: 'legendItems.droneHole'
  },
  {
    id: 'lineOfSight',
    symbol: '👁️',
    color: '#63b3ed',
    nameKey: 'legendItems.lineOfSight'
  }
]; 