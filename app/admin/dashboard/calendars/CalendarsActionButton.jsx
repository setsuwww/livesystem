import { Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function CalendarsActionButton({
  onEdit,
  onDelete
}) {
  return (
    <div className="flex items-center gap-1">
      <Button size="icon" className="border-blue-200 bg-white text-blue-500 hover:bg-blue-100 rounded"
        onClick={(e) => {e.stopPropagation();
          onEdit();
        }}>
        <Edit />
      </Button>

      <Button size="icon" className="border-red-200 bg-white text-red-500 hover:bg-red-100 rounded"
        onClick={(e) => {e.stopPropagation();
          onDelete();
        }}>
        <Trash2 />
      </Button>
    </div>
  );
}
