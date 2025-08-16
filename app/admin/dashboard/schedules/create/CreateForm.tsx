"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { DashboardHeader } from "../../DashboardHeader";
import ContentForm from "@/components/content/ContentForm";
import ContentInformation from "@/components/content/ContentInformation";
import { toast } from "sonner";

import { Schedule, Shift } from "@prisma/client";
import { fetch } from "@/function/helpers/fetch";

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
  const router = useRouter()

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
    try { await fetch({ url: "/schedules",
        method: "post",
        data: form,
        successMessage: "Schedule created successfully", errorMessage: "Failed to create schedule",
        onSuccess: () => {
          setForm({ title: "", description: "", date: "" });
          router.push("/admin/dashboard/schedules");
        },
      });
    } finally {
      setLoading(false);
    }
  };


  return (
    <section className="space-y-6">
      <DashboardHeader title="Create Users" subtitle="Insert name, email, password, select role and shift for users data" />

      <ContentForm>
        <ContentInformation heading="Public" subheading="Schedule public information" />
        <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
          <Input label="Title" value={form.title} onChange={(e) => handleChange("title", e.target.value)} required />
          <Input label="Description" value={form.description} onChange={(e) => handleChange("description", e.target.value)} required />
          <Input label="Date" type="date" value={form.date} onChange={(e) => handleChange("date", e.target.value)} required />

          <Button type="submit" disabled={loading}>
            {loading ? "Saving..." : "Save Schedule"}
          </Button>
        </form>

      </ContentForm>
    </section>
  );
}
