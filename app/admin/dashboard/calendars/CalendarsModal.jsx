import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";

export function CalendarsModal({
  open,
  loading,
  formData,
  selectedEvent,
  onClose,
  onChange,
  onSave
}) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-white sm:max-w-[425px] border border-zinc-300">
        <DialogHeader>
          <DialogTitle>{selectedEvent ? "Edit Event" : "Add New Event"}</DialogTitle>
          <DialogDescription>{selectedEvent ? "Update the details of your event below." : "filling out the form below."}</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {/* tambahin label sebelum input */}
          <Input id="title" placeholder="Enter agenda title..." value={formData.title}
            onChange={(e) => onChange("title", e.target.value)}
          />
          <Input id="description" placeholder="Enter agenda description..." value={formData.description}
            onChange={(e) => onChange("description", e.target.value)}
          />
          <Input id="date" type="date" value={typeof formData.date === "string" ? formData.date : formData.date.toISOString().split("T")[0]}
            onChange={(e) => onChange("date", e.target.value)}
          />

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
          <Button size="sm" variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button size="sm" variant="primary" onClick={onSave} disabled={loading}>
            {loading ? "Saving..." : selectedEvent ? "Update Event" : "Create Event"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}