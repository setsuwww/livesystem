import { CircleCheckBig, CircleX, Info } from "lucide-react";

const typeStyles = {
  p: { 
    text: "text-green-600", 
    bg: "bg-green-100", 
    border: "border-green-200", 
    icon: CircleCheckBig 
  },
  n: { 
    text: "text-red-600", 
    bg: "bg-red-100", 
    border: "border-red-200", 
    icon: CircleX 
  },
  i: { 
    text: "text-blue-600", 
    bg: "bg-blue-50", 
    border: "border-blue-200", 
    icon: Info 
  },
};

export function IconListItem({ children, type = "i" }) {
  const { text, icon: Icon } = typeStyles[type];
  return (
    <div className={`flex items-center gap-x-2 ${text}`}>
      <Icon strokeWidth={1.75} size={16} />
      <p className="text-sm">{children}</p>
    </div>
  );
}

export function ContentList({ items, type = "i" }) {
  const { bg, border } = typeStyles[type];
  return (
    <div className={`flex flex-col ${bg} border   ${border} p-2 rounded-xl`}>
      {items.map((item, idx) => (
        <IconListItem key={idx} type={type}>
          {item}
        </IconListItem>
      ))}
    </div>
  );
}
