"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import ContentForm from "@/components/content/ContentForm";
import { ContentInformation } from "@/components/content/ContentInformation";
import { toast } from "sonner";

import { Schedule, Shift } from "@prisma/client";
import { fetch } from "@/function/helpers/fetch";

import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/Select";
import { capitalize } from "@/function/functionCapitalize";
import { DashboardHeader } from './../../../DashboardHeader';

interface ScheduleWithShift extends Schedule {
  shift: Pick<Shift, "id" | "type" | "startTime" | "endTime"> | null;
}

export default function EditForm({ schedule, shifts }: { schedule: ScheduleWithShift; shifts: Shift[] }) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: schedule.title || "",
    description: schedule.description || "",
    date: schedule.date ? schedule.date.toString().slice(0, 10) : "",
    shiftId: schedule.shiftId ? schedule.shiftId.toString() : "",
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
    try {
      await fetch({
        url: `/schedules/${schedule.id}`,
        method: "put",
        data: form,
        successMessage: "Schedule updated successfully",
        errorMessage: "Failed to update schedule",
        onSuccess: () => {
          router.push("/admin/dashboard/schedules");
        },
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="space-y-6">
      <DashboardHeader title="Edit Schedule" subtitle="Update title, description, date, and select shift"/>

      <ContentForm>
        <ContentInformation heading="Information" subheading="Schedule public information"/>
        <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
            
          <Input label="Title" value={form.title}
            onChange={(e) => handleChange("title", e.target.value)}
            required
          />
          <Input label="Description" value={form.description}
            onChange={(e) => handleChange("description", e.target.value)}
            required
          />

          <ContentInformation heading="Date & shift" subheading="Schedule's date & shift data"/>

          <Input label="Date" type="date" value={form.date}
            onChange={(e) => handleChange("date", e.target.value)}
            required
          />

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 mb-1">Select Shift</label>
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
            {loading ? "Updating..." : "Update Schedule"}
          </Button>
        </form>
      </ContentForm>
    </section>
  );
}
