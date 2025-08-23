"use client";;
import { Globe } from 'lucide-react';
import { useState } from "react";
import { useRouter } from "next/navigation";

import { RadioButton } from "@/components/ui/RadioButton";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select";

import ContentForm from "@/components/content/ContentForm";
import { ContentInformation } from "@/components/content/ContentInformation";
import { DashboardHeader } from "../../../DashboardHeader";

import { api } from "@/lib/api";

export default function UsersEditForm({
  userId,
  shifts,
  initialForm
}) {
  const [form, setForm] = useState({ ...initialForm });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCustomChange = (name, value) => setForm((prev) => ({ ...prev, [name]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        name: form.name, email: form.email, role: form.role,
        shiftId: form.shiftId === "NONE" ? null : parseInt(form.shiftId),
      };

      if (form.password.trim() !== "") payload.password = form.password;

      const res = await api.patch(`/users/${userId}`, payload);

      if (res.status === 200) router.push("/admin/dashboard/users");
      else alert("Failed to update user");

    }
    catch (error) {
      alert("Error: " + error);
    }
    finally {
      setLoading(false);
    }
  };

  const formatTime = (time) => {
    const dateObj = typeof time === "string" ? new Date(time) : time;
    return dateObj.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const roleOptions = [
    { label: "Admin", description: "Maintain and manage all contents", value: "ADMIN" },
    { label: "Coordinator", description: "Manage shifts and schedules for users", value: "COORDINATOR" },
    { label: "Employee", description: "Communicate with another person in office", value: "EMPLOYEE" },
    { label: "User", description: "Register, login and manage task", value: "USER" },
  ];

  return (
    <section>
      <DashboardHeader
        title={`Edit User : ${form.name}`}
        subtitle="Update name, email, password, role, and shift for this user"
      />

      <ContentForm>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Public Info */}
          <ContentInformation
            icon={<Globe className="w-8 h-8" strokeWidth={1.5} />}
            heading="Public"
            subheading="Users public username & email"
          />
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              placeholder="Username"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              placeholder="Users Email"
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          {/* Private Info */}
          <ContentInformation
            heading="Private"
            subheading="Users role, password and shift assignment"
          />

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" placeholder="Leave blank to keep current password" type="password" name="password"
              value={form.password}
              onChange={handleChange}
            />
          </div>

          {/* Role Radio */}
          <div className="space-y-2">
            <Label>Role</Label>
            <RadioButton
              name="role"
              options={roleOptions}
              value={form.role}
              onChange={(value) => handleCustomChange("role", value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Shift Assignment</Label>
            <Select value={form.shiftId} onValueChange={(value) => handleCustomChange("shiftId", value)}>
              <SelectTrigger className="w-1/2">
                <SelectValue placeholder="No Shift Assigned" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="NONE">No Shift Assigned</SelectItem>
                {shifts.map((shift) => (
                  <SelectItem key={shift.id} value={String(shift.id)}>
                    {shift.type} ({formatTime(shift.startTime)} -{" "}
                    {formatTime(shift.endTime)})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button disabled={loading} type="submit">
            {loading ? "Updating..." : "Update User"}
          </Button>
        </form>
      </ContentForm>
    </section>
  );
}
