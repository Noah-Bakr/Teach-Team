export const Roles = ['admin', 'lecturer', 'candidate'] as const;
export type RoleUI = typeof Roles[number];