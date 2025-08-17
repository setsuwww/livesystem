export interface Schedule {
  id: number;
  title: string;
  description: string;
  date: string | Date;
  userId: number;
  shiftId: number | null;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface ScheduleModalProps {
  open: boolean;
  loading: boolean;
  formData: { title: string; description: string; date: string | Date };
  selectedEvent: Schedule | null;
  
  onClose: () => void;
  onChange: (field: string, value: string) => void;
  onSave: () => void;
}

export interface ScheduleWithShift {
  id: number
  title: string
  description: string
  date: string | Date
  userId: number
  shiftId: number | null
  createdAt: string | Date
  updatedAt: string | Date
  shift?: {
    id: number
    type: string
  } | null
}

