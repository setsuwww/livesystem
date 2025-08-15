"use client";

import { useState } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { Schedule, Shift } from "@prisma/client";

interface ScheduleWithShift extends Schedule {
  shift: Pick<Shift, "type" | "startTime" | "endTime"> | null;
}

export default function CreateForm({ schedules }: { schedules: ScheduleWithShift[] }) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    date: "",
  });

  const handleChange = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.title.trim() || !form.description.trim() || !form.date.trim()) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      setLoading(true);
      await api.post("/schedules", form);
      toast.success("Schedule created successfully");
      setForm({ title: "", description: "", date: "" });
    } catch {
      toast.error("Failed to create schedule");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
        <Input label="Title" value={form.title} onChange={(e) => handleChange("title", e.target.value)} required />
        <Input label="Description" value={form.description} onChange={(e) => handleChange("description", e.target.value)} required />
        <Input label="Date" type="date" value={form.date} onChange={(e) => handleChange("date", e.target.value)} required />
        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Saving..." : "Save Schedule"}
        </Button>
      </form>

      <div className="space-y-2">
        {schedules.map((s) => (
          <div key={s.id} className="p-3 border rounded">
            <p className="font-medium">{s.title}</p>
            <p className="text-sm text-gray-500">{s.description}</p>
            <p className="text-sm">{new Date(s.date).toLocaleDateString()}</p>
            {s.shift && (
              <p className="text-xs text-gray-400">
                Shift: {s.shift.type} ({s.shift.startTime.toLocaleTimeString()} - {s.shift.endTime.toLocaleTimeString()})
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
