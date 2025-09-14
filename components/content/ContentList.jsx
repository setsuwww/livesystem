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
  w: {
    text: "text-yellow-600",
    bg: "bg-yellow-50",
    border: "border-yellow-200",
    icon: Info
  }
};

export function IconListItem({ children, type = "i" }) {
  const { text } = typeStyles[type];
  return (
    <div className={`flex items-center gap-x-2 ${text}`}>
      <p className="text-xs">{children}</p>
    </div>
  );
}

export function ContentList({ items, type = "i" }) {
  const { bg, border, icon: Icon, text } = typeStyles[type];
  return (
    <div className={`w-1/3 flex items-start space-x-2 ${bg} border ${border} p-2 rounded-xl`}>
      <div className="font-semibold">
        <Icon className={text} strokeWidth={1.5} size={16} />
      </div>
      <div className="flex flex-col">
        {items.map((item, idx) => (
          <IconListItem key={idx} type={type}>
            {item}
          </IconListItem>
        ))}
      </div>
    </div>
  );
}

