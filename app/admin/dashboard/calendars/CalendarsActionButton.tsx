import { Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface Props {
  onEdit: () => void;
  onDelete: () => void;
}

export function CalendarsActionButton({ onEdit, onDelete }: Props) {
  return (
    <div className="flex items-center gap-1">
      <Button variant="custom" className="bg-white text-blue-500 hover:bg-blue-100 h-6 w-6 p-0 flex items-center justify-center rounded"
        onClick={(e) => {e.stopPropagation();
          onEdit();
        }}>
        <Edit className="h-4 w-4" />
      </Button>

      <Button variant="custom" className="bg-white text-red-500 hover:bg-red-100 h-6 w-6 p-0 flex items-center justify-center rounded"
        onClick={(e) => {e.stopPropagation();
          onDelete();
        }}>
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}
