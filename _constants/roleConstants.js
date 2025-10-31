export const roleOptions = [
  { label: "Admin", description: "Maintain and manage all contents", value: "ADMIN" },
  { label: "Employee", description: "Communicate with another person in division", value: "EMPLOYEE" },
  { label: "User", description: "Register, login and manage task", value: "USER" },
];

export const roleStyles = {
  Admin: "text-purple-600 bg-purple-100 border-purple-200",
  Coordinator: "text-sky-600 bg-sky-100 border-sky-200",
  Employee: "text-teal-600 bg-teal-100 border-teal-200",
  User: "text-slate-600 bg-slate-100 border-slate-200",
};