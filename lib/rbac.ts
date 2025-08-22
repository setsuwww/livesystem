type Role = "ADMIN" | "COORDINATOR" | "EMPLOYEE" | "OPERATOR" | "USER";

const can = {
  ADMIN: ["manage_users", "manage_shifts", "manage_schedules", "export", "view_all"],
  COORDINATOR: ["manage_schedules", "view_all"],
  OPERATOR: ["manage_schedules"],
  EMPLOYEE: ["view_self"],
  USER: ["todo_only"],
} as const;

export function canUser(role: Role, perm: (typeof can)[keyof typeof can][number]) {
  return can[role]?.includes(perm) ?? false;
}
