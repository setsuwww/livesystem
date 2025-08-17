"use client";

import { useState, ChangeEvent } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { RadioButton } from "@/components/ui/RadioButton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select";
import ContentForm from "@/components/content/ContentForm";
import { ContentInformation } from "@/components/content/ContentInformation";
import { DashboardHeader } from "../../../DashboardHeader";

import { api } from "@/lib/api";
import { Shift } from "@/static/types/Shift";

interface Props {
  userId: number; 
  shifts: Shift[];
  initialForm: {
    name: string;
    email: string;
    password: string;
    role: string;
    shiftId: string;
  };
}

export default function UsersEditForm({ userId, shifts, initialForm }: Props) {
  const [form, setForm] = useState({ ...initialForm });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCustomChange = (name: string, value: string) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try { const payload: any = {
        name: form.name,
        email: form.email,
        role: form.role,
        shiftId: form.shiftId === "NONE" ? null : parseInt(form.shiftId)
      };

      if (form.password.trim() !== "") {
        payload.password = form.password;
      }

      const res = await api.patch(`/users/${userId}`, payload);

      if (res.status === 200) { router.push("/admin/dashboard/users");
      } else { alert("Failed to update user") }
    } 
    catch (error) {
      alert("Error: " + error);
    } 
    finally {
      setLoading(false);
    }
  };

  const formatTime = (time: string | Date) => {
    const dateObj = typeof time === "string" ? new Date(time) : time;
    return dateObj.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const roleOptions = [
    { label: "Admin", description: "Maintain and manage all contents", value: "ADMIN" },
    { label: "Manager", description: "Manage shifts and schedules for users", value: "MANAGER" },
    { label: "User", description: "Just for submitting helpdesk", value: "USER" }
  ];

  return (
    <section>
      <DashboardHeader
        title="Edit User"
        subtitle="Update name, email, password, role, and shift for this user"
      />

      <ContentForm>
        <form onSubmit={handleSubmit} className="space-y-4">
          <ContentInformation heading="Public" subheading="Users public username & email" />
          <Input
            label="Name"
            placeholder="Username"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          />
          <Input
            label="Email"
            placeholder="Users Email"
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
          />

          <ContentInformation heading="Private" subheading="Users role, password and shift assignment" />
          <Input
            label="Password"
            placeholder="Leave blank to keep current password"
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
          />

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-600">Role</label>
            <RadioButton
              name="role"
              options={roleOptions}
              value={form.role}
              onChange={(value) => handleCustomChange("role", value)}
            />
          </div>

          <div>
            <label className="block mb-1.5 text-sm font-medium text-gray-600">
              Shift Assignment
            </label>
            <Select
              value={form.shiftId}
              onValueChange={(value) => handleCustomChange("shiftId", value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="No Shift Assigned" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="NONE">No Shift Assigned</SelectItem>
                {shifts.map((shift) => (
                  <SelectItem key={shift.id} value={String(shift.id)}>
                    {shift.type} ({formatTime(shift.startTime)} - {formatTime(shift.endTime)})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button disabled={loading}>{loading ? "Updating..." : "Update User"}</Button>
        </form>
      </ContentForm>
    </section>
  );
}
