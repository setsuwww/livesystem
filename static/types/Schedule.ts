export interface Schedule {
  id: number;
  title: string;
  description: string;
  date: string;
  userId: number;
  shiftId: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface ScheduleModalProps {
  open: boolean;
  loading: boolean;
  formData: { title: string; description: string; date: string };
  selectedEvent: Schedule | null;
  
  onClose: () => void;
  onChange: (field: string, value: string) => void;
  onSave: () => void;
}

