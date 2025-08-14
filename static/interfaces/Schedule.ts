export interface Schedule {
  id: number;
  title: string;
  date: string;
  userId: number;
  createdAt: string;
  updatedAt: string;
}

export interface ScheduleFormProps {
  open: boolean;
  loading: boolean;
  formData: { title: string; date: string };
  selectedEvent: Schedule | null;
  onClose: () => void;
  onChange: (field: string, value: string) => void;
  onSave: () => void;
}

