import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { Label } from "@/components/ui/label";
import { ScheduleFormModal } from './CalendarsModal';

import { ScheduleFormProps } from '@/static/interfaces/Schedule';

export function CalendarsModal({ open, loading, formData, selectedEvent, onClose, onChange, onSave}:ScheduleFormProps ) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-white sm:max-w-[425px] border border-gray-300">
        <DialogHeader>
          <DialogTitle>
            {selectedEvent ? "Edit Event" : "Add New Event"}
          </DialogTitle>
          <DialogDescription>
            {selectedEvent ? "Update the details of your event below." : "Create a new event by filling out the form below."}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Input label="Event/Schedule Title" id="title" placeholder="Enter event title..."
              value={formData.title}
              onChange={(e) => onChange("title", e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Input id="date" type="date"
              value={formData.date}
              onChange={(e) => onChange("date", e.target.value)}
            />
          </div>

          {selectedEvent && (
            <div className="flex items-center gap-2">
              <Badge variant="secondary">ID: {selectedEvent.id}</Badge>
              <Badge variant="outline">
                Created: {new Date(selectedEvent.createdAt).toLocaleDateString()}
              </Badge>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="secondary" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={onSave} disabled={loading}>
            {loading ? "Saving..." : selectedEvent ? "Update Event" : "Create Event"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}