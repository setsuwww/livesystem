"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Label } from "@/components/ui/Label";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { DashboardHeader } from "../../DashboardHeader";
import ContentForm from "@/components/content/ContentForm";
import { ContentInformation } from "@/components/content/ContentInformation";
import { toast } from "sonner";

import { Schedule, Shift } from "@prisma/client";
import { fetch } from "@/function/helpers/fetch";

import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/Select"; // path sesuai file kamu tadi
import { capitalize } from '@/function/functionFormatters';

interface ScheduleWithShift extends Schedule {
  shift: Pick<Shift, "id" | "type" | "startTime" | "endTime"> | null;
}

export default function CreateForm({ schedules, shifts }: { schedules: ScheduleWithShift[]; shifts: Shift[] }) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    date: "",
    shiftId: "",
  });
  const router = useRouter();

  const handleChange = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.title.trim() || !form.description.trim() || !form.date.trim()) {
      toast.error("Please fill all required fields");
      return;
    }

    setLoading(true);
    try { await fetch({ url: "/schedules", method: "post", data: form,
        successMessage: "Schedule created successfully",
        errorMessage: "Failed to create schedule",
        onSuccess: () => {
          setForm({ title: "", description: "", date: "", shiftId: "" });
          router.push("/admin/dashboard/schedules");
        },
      });
    }
    finally {
      setLoading(false);
    }
  };

  return (
    <section className="space-y-6">
      <DashboardHeader title="Create Schedule" subtitle="Insert title, description, date, and select shift"/>

      <ContentForm>
        <ContentInformation heading="Information" subheading="Schedule public information"/>
        <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
          {/* Tambahin label sebelum input */}
          <Label className="text-sm font-medium text-zinc-600 mb-1">Title</Label>
          <Input value={form.title}
            onChange={(e) => handleChange("title", e.target.value)}
            required
          />

          <Label className="text-sm font-medium text-zinc-600 mb-1">Description</Label>
          <Input value={form.description}
            onChange={(e) => handleChange("description", e.target.value)}
            required
          />

          <ContentInformation heading="Date & shift" subheading="Schedule's date & shift data"/>

          <Label className="text-sm font-medium text-zinc-600 mb-1">Date</Label>
          <Input type="date"
            value={form.date}
            onChange={(e) => handleChange("date", e.target.value)}
            required
          />

          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-700 mb-1">Select Shift</label>
            <Select value={form.shiftId} onValueChange={(val) => handleChange("shiftId", val)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Choose a shift" />
              </SelectTrigger>
              <SelectContent>
                {shifts.map((shift) => (
                  <SelectItem key={shift.id} value={shift.id.toString()}>
                    {capitalize(shift.type)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button type="submit" disabled={loading}>
            {loading ? "Saving..." : "Save Schedule"}
          </Button>
        </form>
      </ContentForm>
    </section>
  );
}
