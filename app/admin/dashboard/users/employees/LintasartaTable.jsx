import React, { useMemo } from "react";
import { Badge } from "@/components/ui/Badge";

const demoRows = [
  {
    no: 1,
    name: "AHMAD RIZKI HAFIFFUDIN",
    fungsi: "HD INDOSAT",
    shifts: { 1: "S", 2: "M", 3: "M", 4: "0", 5: "0", 6: "P", 7: "P", 8: "S", 9: "S", 10: "CM", 11: "M", 12: "L", 13: "L", 14: "P", 15: "P", 16: "S", 17: "S", 18: "M", 19: "M", 20: "L", 21: "L", 22: "P", 23: "P", 24: "S", 25: "S", 26: "M", 27: "M", 28: "L", 29: "L", 30: "P", 31: "P" }
  },
  {
    no: 2,
    name: "RIZKI NUR SEPRIANA",
    fungsi: "HD INDOSAT",
    shifts: { 1: "M", 2: "L", 3: "L", 4: "P", 5: "P", 6: "S", 7: "S", 8: "M", 9: "M", 10: "M", 11: "L", 12: "P", 13: "P", 14: "S", 15: "SM", 16: "M", 17: "M", 18: "L", 19: "L", 20: "P", 21: "P", 22: "S", 23: "S", 24: "M", 25: "M", 26: "L", 27: "L", 28: "P", 29: "P", 30: "S", 31: "S" }
  },
  {
    no: 3,
    name: "HILMI MAHDI",
    fungsi: "HD INDOSAT",
    shifts: { 1: "P", 2: "0", 3: "0", 4: "S", 5: "S", 6: "M", 7: "M", 8: "L", 9: "L", 10: "P", 11: "P", 12: "S", 13: "S", 14: "M", 15: "M", 16: "L", 17: "L", 18: "P", 19: "CP", 20: "S", 21: "S", 22: "M", 23: "M", 24: "L", 25: "L", 26: "P", 27: "P", 28: "S", 29: "S", 30: "M", 31: "M" }
  },
  {
    no: 4,
    name: "SAIFUL",
    fungsi: "HD INDOSAT",
    shifts: { 1: "P", 2: "S", 3: "S", 4: "M", 5: "M", 6: "L", 7: "S", 8: "P", 9: "P", 10: "S", 11: "S", 12: "M", 13: "M", 14: "L", 15: "L", 16: "P", 17: "P", 18: "S", 19: "PS", 20: "M", 21: "M", 22: "L", 23: "L", 24: "P", 25: "P", 26: "S", 27: "S", 28: "M", 29: "M", 30: "L", 31: "L" }
  },
  {
    no: 5,
    name: "SYAHID DEWANTARA",
    fungsi: "HD GLOBAL PARTNER",
    shifts: { 1: "S", 2: "M", 3: "M", 4: "L", 5: "L", 6: "P", 7: "P", 8: "S", 9: "S", 10: "M", 11: "M", 12: "L", 13: "L", 14: "P", 15: "P", 16: "S", 17: "PS", 18: "M", 19: "M", 20: "L", 21: "L", 22: "P", 23: "S", 24: "S", 25: "M", 26: "M", 27: "L", 28: "L", 29: "P", 30: "P", 31: "S" }
  },
  {
    no: 6,
    name: "ATMAJI YUDHANTO",
    fungsi: "HD GLOBAL PARTNER",
    shifts: { 1: "M", 2: "L", 3: "L", 4: "P", 5: "P", 6: "S", 7: "S", 8: "M", 9: "M", 10: "L", 11: "L", 12: "P", 13: "P", 14: "S", 15: "S", 16: "M", 17: "M", 18: "L", 19: "L", 20: "P", 21: "P", 22: "S", 23: "S", 24: "M", 25: "M", 26: "L", 27: "L", 28: "P", 29: "P", 30: "S", 31: "S" }
  },
  {
    no: 7,
    name: "FACHRUL HIDAYAT",
    fungsi: "HD GLOBAL PARTNER",
    shifts: { 1: "L", 2: "P", 3: "P", 4: "S", 5: "S", 6: "M", 7: "M", 8: "L", 9: "L", 10: "P", 11: "P", 12: "S", 13: "S", 14: "M", 15: "M", 16: "L", 17: "L", 18: "P", 19: "P", 20: "S", 21: "S", 22: "M", 23: "M", 24: "L", 25: "L", 26: "P", 27: "P", 28: "S", 29: "S", 30: "M", 31: "M" }
  },
  {
    no: 8,
    name: "HARTANTO PANJI PRASETYO SUJARWO",
    fungsi: "HD GLOBAL PARTNER",
    shifts: { 1: "L", 2: "P", 3: "P", 4: "S", 5: "S", 6: "M", 7: "L", 8: "N", 9: "L", 10: "P", 11: "N", 12: "N", 13: "S", 14: "M", 15: "M", 16: "L", 17: "L", 18: "P", 19: "P", 20: "S", 21: "S", 22: "N", 23: "M", 24: "L", 25: "L", 26: "P", 27: "P", 28: "S", 29: "S", 30: "M", 31: "M" }
  },
  {
    no: 9,
    name: "ERA ANGGARA",
    fungsi: "HD GLOBAL PARTNER",
    shifts: { 1: "P", 2: "S", 3: "S", 4: "M", 5: "M", 6: "L", 7: "L", 8: "P", 9: "P", 10: "S", 11: "S", 12: "M", 13: "M", 14: "L", 15: "L", 16: "P", 17: "L", 18: "S", 19: "S", 20: "M", 21: "M", 22: "L", 23: "L", 24: "P", 25: "PS", 26: "S", 27: "S", 28: "M", 29: "M", 30: "L", 31: "L" }
  }
];

function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function ShiftScheduleTable({ month = 8, year = 2025, rows = demoRows }) {
  const { daysInMonth, headerCells } = useMemo(() => buildCalendar(month, year), [month, year]);

  return (
    <div className="w-full bg-white">
      {/* Legend */}
      <div className="mb-4 flex flex-wrap items-center gap-4 text-sm p-4 bg-gray-50 rounded-lg">
        <Legend code="S" label="Shift Siang" color="bg-blue-500" />
        <Legend code="M" label="Shift Pagi" color="bg-green-500" />
        <Legend code="P" label="Shift Malam" color="bg-purple-500" />
        <Legend code="L" label="Libur" color="bg-gray-500" />
        <Legend code="N" label="Cuti/Need" color="bg-yellow-500" />
        <span className="ml-2 text-gray-600 font-medium">⚠️ Sabtu & Minggu highlight merah</span>
      </div>

      <div className="overflow-x-auto border border-gray-300 rounded-lg shadow-lg">
        <table className="max-w-xs border-collapse bg-white">
          <thead>
            <tr>
              <th colSpan={3} className="bg-blue-600 text-white px-4 py-3 text-left font-bold border border-gray-300 text">
                HELPDESK INDOSAT & GLOBAL PARTNER
              </th>
              <th colSpan={daysInMonth}  className="bg-blue-600 text-white px-4 py-3 text-center font-bold border border-gray-300 text-lg">
                {monthName(month)}-{String(year).slice(-2)}
              </th>
            </tr>
            
            {/* Column Headers */}
            <tr>
              <th className="bg-gray-200 px-3 py-3 text-center font-bold border border-gray-300 w-16">NO</th>
              <th className="bg-gray-200 px-4 py-3 text-center font-bold border border-gray-300 w-64">NAMA</th>
              <th className="bg-gray-200 px-4 py-3 text-center font-bold border border-gray-300 w-48">FUNGSI</th>
              {headerCells.map((cell, index) => (
                <th
                  key={index}
                  className={cn(
                    "bg-gray-200 px-2 py-3 text-center font-bold border border-gray-300 w-12 text-xs",
                    isWeekend(cell.weekdayIndex) && "bg-red-100 text-red-800"
                  )}
                  title={cell.weekdayLabel}
                >
                  <div className="leading-tight">
                    <div className="font-bold">{cell.weekdayShort}</div>
                    <div className="text-xs font-normal">{cell.day}</div>
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          {/* Body */}
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr key={row.no ?? rowIndex} className="hover:bg-gray-50">
                <td className="px-3 py-2 text-center font-medium border border-gray-300 bg-gray-50">
                  {row.no ?? rowIndex + 1}
                </td>
                <td className="px-4 py-2 font-semibold border border-gray-300 text-sm">
                  {row.name}
                </td>
                <td className="px-4 py-2 border border-gray-300 text-sm">
                  {row.fungsi}
                </td>
                {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
                  const isWeekendDay = isWeekend(headerCells[day - 1]?.weekdayIndex);
                  const shiftValue = row.shifts?.[day];
                  
                  return (
                    <td
                      key={day}
                      className={cn(
                        "px-1 py-2 text-center border border-gray-300 text-sm",
                        isWeekendDay && "bg-red-50"
                      )}
                    >
                      <ShiftBadge value={shiftValue} />
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* Helper Components */
function Legend({ code, label, color }) {
  return (
    <div className="flex items-center gap-2">
      <span className={cn("px-2 py-1 rounded text-white text-xs font-bold", color)}>
        {code}
      </span>
      <span className="text-gray-700 font-medium">{label}</span>
    </div>
  );
}

function ShiftBadge({ value }) {
  if (!value || value === "0") return <span className="text-gray-400 text-xs">-</span>;
  
  const v = String(value).toUpperCase();
  
  // Color mapping for different shift types
  const getShiftStyle = (shift) => {
    switch (shift) {
      case "S":
        return "bg-blue-500 text-white";
      case "M":
        return "bg-green-500 text-white";
      case "P":
        return "bg-purple-500 text-white";
      case "L":
        return "bg-gray-500 text-white";
      case "N":
        return "bg-yellow-500 text-black";
      case "CM":
        return "bg-cyan-500 text-white";
      case "SM":
        return "bg-indigo-500 text-white";
      case "PS":
        return "bg-pink-500 text-white";
      case "CP":
        return "bg-orange-500 text-white";
      default:
        return "bg-gray-400 text-white";
    }
  };

  return (
    <span className={cn(
      "px-1.5 py-0.5 rounded text-xs font-bold",
      getShiftStyle(v)
    )}>
      {v}
    </span>
  );
}

/* Helper Functions */
function buildCalendar(month, year) {
  const daysInMonth = new Date(year, month, 0).getDate();
  const headerCells = Array.from({ length: daysInMonth }, (_, i) => {
    const day = i + 1;
    const date = new Date(year, month - 1, day);
    const weekdayIndex = date.getDay();
    return {
      day,
      weekdayIndex,
      weekdayShort: WEEKDAY_SHORT_ID[weekdayIndex],
      weekdayLabel: WEEKDAY_LONG_ID[weekdayIndex],
    };
  });
  return { daysInMonth, headerCells };
}

function isWeekend(weekdayIndex) {
  return weekdayIndex === 0 || weekdayIndex === 6; // Sunday = 0, Saturday = 6
}

function monthName(m) {
  return MONTHS_ID[m - 1];
}

const WEEKDAY_SHORT_ID = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
const WEEKDAY_LONG_ID = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
const MONTHS_ID = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];