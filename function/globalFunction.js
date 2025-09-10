import { format } from "date-fns";
import { id } from "date-fns/locale";

export const capitalize = (str) =>
  typeof str === "string" && str.length
    ? str[0].toUpperCase() + str.slice(1).toLowerCase()
    : "";

export const safeToISOString = (v) => {
  const d = v ? new Date(v) : null;
  return d && !isNaN(d) ? d.toISOString() : null;
};

export const safeFormat = (v, fmt) => {
  const d = v ? new Date(v) : null;
  return d && !isNaN(d) ? format(d, fmt, { locale: id }) : "-";
};
