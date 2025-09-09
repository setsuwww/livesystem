import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { Label } from "@/components/ui/Label";

export function CalendarsModal({ open, loading, formData, selectedEvent, onClose, onChange, onSave }) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-white sm:max-w-[800px] border border-zinc-300">
        <DialogHeader>
          <DialogTitle className="text-title">Employees</DialogTitle>
          <DialogDescription className="text-subtitle">Simple view dialog for see employees in this Date</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <Badge htmlFor="title" className="bg-yellow-100 border-yellow-200 text-yellow-700">Morning</Badge>
          <div className="flex flex-col border-l-2 pl-4 border-yellow-300">
            <span className="text-sm text-head font-semibold">Users</span>
            <span className="text-xs text-subhead">email@email.com</span>
          </div>
          <Badge htmlFor="description" className="bg-orange-100 border-orange-200 text-orange-700">Afternoon</Badge>
          <Badge htmlFor="duedate" className="bg-purple-100 border-purple-200 text-purple-700"> Evening</Badge>

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