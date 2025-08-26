"use client";
import { useState } from "react";
import { Globe } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { RadioButton } from "@/components/ui/RadioButton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select";
import ContentForm from "@/components/content/ContentForm";
import { ContentInformation } from "@/components/content/ContentInformation";
import { Label } from "@/components/ui/Label";

import { DashboardHeader } from "../../DashboardHeader";

import { fetch } from "@/function/helpers/fetch";

export default function UsersForm({ shifts }) {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "USER",
    shiftId: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCustomChange = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      ...form,
      shiftId: form.shiftId && form.shiftId !== "NONE" ? parseInt(form.shiftId) : null,
    };

    try {
      await fetch({ url: "/users", method: "post", data: payload,
        successMessage: "User created successfully ✅",
        errorMessage: "Failed to create user ❌",
        onSuccess: () => router.push("/admin/dashboard/users"),
      });
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (time) => {
    const dateObj = typeof time === "string" ? new Date(time) : time;
    return dateObj.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
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
        title="Create Users"
        subtitle="Insert name, email, password, select role and shift for users data"
      />

      <ContentForm>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* HEADER */}
          <ContentForm.Header>
            <ContentInformation icon={<Globe className="w-8 h-8" strokeWidth={1.5} />}
              heading="Public"
              subheading="Users public username & email"
            />
          </ContentForm.Header>

          {/* BODY */}
          <ContentForm.Body>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-head">Username <span className="text-red-500">*</span></Label>
                <Input placeholder="Username" name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-head">Email <span className="text-red-500">*</span></Label>
                <Input placeholder="Users Email" type="email" name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <ContentInformation heading="Private" subheading="Users role, password and shift assignment"/>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-head">Password <span className="text-red-500">*</span></Label>
                <Input placeholder="Users Password" type="password" name="password"
                  value={form.password}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="role" className="text-head">Role <span className="text-red-500">*</span></Label>
                <RadioButton name="role"
                  options={roleOptions}
                  value={form.role}
                  onChange={(value) => handleCustomChange("role", value)}
                />
                <p className="text-xs text-subhead">(Optional)</p>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-head">
                  Shift Assignment
                </label>
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
            </div>
          </ContentForm.Body>

          {/* FOOTER */}
          <ContentForm.Footer>
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create User"}
            </Button>
          </ContentForm.Footer>
        </form>
      </ContentForm>
    </section>
  );
}
