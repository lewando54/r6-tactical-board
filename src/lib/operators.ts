import r6operators, { getSVGIcon } from 'r6operators';

export type OperatorRole = 'Attacker' | 'Defender';

export interface OperatorConfig {
  id: string;
  name: string;
  role: OperatorRole;
  icon: string;
}

const ROLE_ORDER: Record<OperatorRole, number> = {
  Attacker: 0,
  Defender: 1,
};

function isOperatorRole(role: string): role is OperatorRole {
  return role === 'Attacker' || role === 'Defender';
}

export function getAvailableOperators(): OperatorConfig[] {
  return Object.values(r6operators)
    .flatMap((operator) => {
      if (!isOperatorRole(operator.role)) {
        return [];
      }
      const icon = getSVGIcon(operator, { class: 'large' });
      if (typeof icon !== 'string') {
        return [];
      }
      return [
        {
          id: operator.id,
          name: operator.name,
          role: operator.role,
          icon,
        },
      ];
    })
    .sort((a, b) => {
      if (a.role !== b.role) {
        return ROLE_ORDER[a.role] - ROLE_ORDER[b.role];
      }
      return a.name.localeCompare(b.name);
    });
}

export const availableOperators = getAvailableOperators();

export function getOperatorById(id: string): OperatorConfig | undefined {
  return availableOperators.find((operator) => operator.id === id);
}
