export const statusPriority = ["ABSENT", "LATE", "PERMISSION"];

export const attedancesStyles = {
  Present: "text-teal-600 bg-teal-100 border-teal-300",
  Late: "text-yellow-600 bg-yellow-100 border-yellow-300",
  Permission: "text-blue-600 bg-blue-100 border-blue-300",
  Absent: "text-rose-600 bg-rose-100 border-rose-300",
  Rejected: "text-white bg-rose-500 border-rose-500",
  Accepted: "text-white bg-teal-500 border-teal-500",
  Pending: "text-white bg-yellow-500 border-yellow-500",
};

export const statusColorsClass = {
  PRESENT: { 
    bgPing: "bg-teal-400", 
    bgDot: "bg-radial from-teal-400 to-teal-500", 

    head: "text-teal-800",
    text: "text-teal-600", 
    subtext: "text-teal-400", 
    border: "bg-teal-100 border-teal-600" 
  },
  ABSENT: { 
    bgPing: "bg-rose-400", 
    bgDot: "bg-radial from-rose-400 to-rose-500", 
    
    head: "text-rose-800",
    text: "text-rose-600", 
    subtext: "text-rose-400", 
    border: "bg-rose-50 border-rose-600" 
  },
  LATE: { 
    bgPing: "bg-yellow-400", 
    bgDot: "bg-radial from-yellow-400 to-yellow-500", 
    
    head: "text-yellow-800",
    text: "text-yellow-600", 
    subtext: "text-yellow-400", 
    border: "bg-yellow-50 border-yellow-600" 
  },
  PERMISSION: { 
    bgPing: "bg-blue-400", 
    bgDot: "bg-radial from-blue-400 to-blue-500", 
    
    head: "text-blue-800",
    text: "text-blue-600", 
    subtext: "text-blue-400", 
    border: "bg-blue-50 border-blue-600"  
  },
};