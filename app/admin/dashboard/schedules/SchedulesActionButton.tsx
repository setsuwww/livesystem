import { Button } from "@/components/ui/Button";
import { SchedulesActionButton } from "@/static/interfaces/SchedulesActionButton";

export default function ScheduleActionsButtons({ id, onEdit, onDelete }: SchedulesActionButton) {
  return (
    <div className="space-x-2">
      <Button variant="secondary" size="sm" onClick={() => onEdit?.(id)}>
        Edit
      </Button>
      <Button variant="destructive" size="sm" onClick={() => onDelete?.(id)}>
        Delete
      </Button>
    </div>
  );
}
