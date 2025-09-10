export const attedancesStyles = {
  Present: "text-green-600 bg-green-100 border-green-300",
  Late: "text-yellow-600 bg-yellow-100 border-yellow-300",
  Permission: "text-blue-600 bg-blue-100 border-blue-300",
  Absent: "text-red-600 bg-red-100 border-red-300",
  Alpha: "text-zinc-600 bg-zinc-100 border-zinc-300"
};

export const statusColorsClass = {
  PRESENT: { 
    bgPing: "bg-green-400", 
    bgDot: "bg-radial from-green-400 to-green-500", 

    head: "text-green-800",
    text: "text-green-600", 
    subtext: "text-green-400", 
    border: "bg-green-100 border-green-600" 
  },
  ABSENT: { 
    bgPing: "bg-red-400", 
    bgDot: "bg-radial from-red-400 to-red-500", 
    
    head: "text-red-800",
    text: "text-red-600", 
    subtext: "text-red-400", 
    border: "bg-red-50 border-red-600" 
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