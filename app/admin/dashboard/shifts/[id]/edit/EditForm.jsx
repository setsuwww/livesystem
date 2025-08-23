"use client";;
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { toast } from "sonner";
import { fetch } from "@/function/helpers/fetch";

export default function EditForm({
  shift
}) {
  const [form, setForm] = useState({
    type: shift.type,
    startTime: shift.startTime.slice(0, 5), // ambil HH:mm
    endTime: shift.endTime.slice(0, 5),
  });

  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await fetch({
        url: `/shifts/${shift.id}`,
        method: "put",
        data: {
          type: form.type,
          startTime: `1970-01-01T${form.startTime}:00Z`,
          endTime: `1970-01-01T${form.endTime}:00Z`,
        },
        successMessage: "Shift updated successfully",
        errorMessage: "Failed to update shift",
        onSuccess: () => {
          router.push("/admin/dashboard/shifts");
        },
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
      <Input
        label="Type"
        value={form.type}
        onChange={(e) => handleChange("type", e.target.value)}
        required
      />
      <Input
        label="Start Time"
        type="time"
        value={form.startTime}
        onChange={(e) => handleChange("startTime", e.target.value)}
        required
      />
      <Input
        label="End Time"
        type="time"
        value={form.endTime}
        onChange={(e) => handleChange("endTime", e.target.value)}
        required
      />
      <Button type="submit" disabled={loading}>
        {loading ? "Updating..." : "Update Shift"}
      </Button>
    </form>
  );
}
