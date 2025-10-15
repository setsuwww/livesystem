export const statusStyle = (status) => {
  const pendingStyle = "text-yellow-700 bg-yellow-100";
  const approvedStyle = "text-teal-700 bg-teal-100";
  const rejectedStyle = "text-rose-700 bg-rose-100";
  const defaultStyle = "text-slate-600 bg-slate-100";

  switch (status) {
    case "PENDING":
    case "PENDING_TARGET":
    case "PENDING_ADMIN":
      return pendingStyle;
    case "APPROVED":
      return approvedStyle;
    case "REJECTED":
      return rejectedStyle;
    default:
      return defaultStyle;
  }
};

export const typeStyles = {
  "Shift Change": "text-sky-600",
  Permission: "text-purple-600",
  DEFAULT: "text-slate-600 bg-slate-100 border-slate-200",
};
