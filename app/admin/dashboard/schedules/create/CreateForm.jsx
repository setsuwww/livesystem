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
import { fetch } from "@/function/helpers/fetch";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/Select";
import { capitalize } from "@/function/globalFunction";

export default function CreateForm({ users, shifts, schedules }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    date: "",
    startDate: "",
    endDate: "",
    shiftId: "",
    userId: "", // baru
  });

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.description.trim() || !form.date.trim() || !form.userId) {
      toast.error("Please fill all required fields");
      return;
    }

    setLoading(true);
    try {
      await fetch({
        url: "/schedules",
        method: "post",
        data: form,
        successMessage: "Schedule created successfully",
        errorMessage: "Failed to create schedule",
        onSuccess: () => {
          setForm({ title: "", description: "", date: "", startDate: "", endDate: "", shiftId: "", userId: "" });
          router.push("/admin/dashboard/schedules");
        },
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="space-y-6">
      <DashboardHeader
        title="Create Schedule"
        subtitle="Insert title, description, date, select shift, and assign user"
      />

      <ContentForm>
        <form onSubmit={handleSubmit}>
          <ContentForm.Header>
            <ContentInformation
              heading="Schedule Details"
              subheading="Fill in all required fields below"
            />
          </ContentForm.Header>

          <ContentForm.Body>
            <section className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={form.title}
                  onChange={(e) => handleChange("title", e.target.value)}
                  placeholder="Enter schedule title"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={form.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  placeholder="Enter schedule description"
                  required
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="datetime-local"
                  value={form.date}
                  onChange={(e) => handleChange("date", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  type="datetime-local"
                  value={form.startDate}
                  onChange={(e) => handleChange("startDate", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  id="endDate"
                  type="datetime-local"
                  value={form.endDate}
                  onChange={(e) => handleChange("endDate", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="shift">Select Shift</Label>
                <Select
                  value={form.shiftId}
                  onValueChange={(val) => handleChange("shiftId", val)}
                >
                  <SelectTrigger id="shift" className="w-full mt-1">
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

              <div className="space-y-1">
                <Label htmlFor="user">Assign User</Label>
                <Select
                  value={form.userId}
                  onValueChange={(val) => handleChange("userId", val)}
                >
                  <SelectTrigger id="user" className="w-full mt-1">
                    <SelectValue placeholder="Choose a user" />
                  </SelectTrigger>
                  <SelectContent>
                    {users.map((user) => (
                      <SelectItem key={user.id} value={user.id.toString()}>
                        {user.name} ({user.email}) - {capitalize(user.role)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

            </section>
          </ContentForm.Body>

          <ContentForm.Footer>
            <div className="flex items-center space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Saving..." : "Save Schedule"}
              </Button>
            </div>
          </ContentForm.Footer>
        </form>
      </ContentForm>
    </section>
  );
}
