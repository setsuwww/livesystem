"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { RadioButton } from "@/components/ui/RadioButton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select";
import ContentForm from "@/components/content/ContentForm";
import { ContentInformation } from "@/components/content/ContentInformation";
import { Label } from "@/components/ui/Label";
import { DashboardHeader } from "@/app/admin/dashboard/DashboardHeader";
import { apiFetchData } from "@/function/helpers/fetch";
import { capitalize } from "@/function/globalFunction";
import { roleOptions } from "@/constants/roleOptions";

export default function EditForm({ user, offices, shifts }) {
  const router = useRouter();

  const [form, setForm] = useState({
    id: user.id,
    name: user.name,
    email: user.email,
    password: "",
    role: user.role,
    officeId: user.officeId ? String(user.officeId) : "",
    shiftId: user.shiftId ? String(user.shiftId) : "",
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
    try {
      await apiFetchData({
        url: "/users",
        method: "put",
        data: form,
        successMessage: "User updated successfully ✅",
        errorMessage: "Failed to update user ❌",
        onSuccess: () => router.push("/admin/dashboard/users"),
      });
    } finally {
      setLoading(false);
    }
  };

  const selectedOffice = useMemo(
    () => offices.find((o) => String(o.id) === form.officeId),
    [form.officeId, offices]
  );

  const availableShifts = useMemo(() => selectedOffice?.shifts || [], [selectedOffice]);

  return (
    <section>
      <DashboardHeader
        title="Edit User"
        subtitle="Update user details including name, email, role, and assignment"
      />

      <ContentForm>
        <form onSubmit={handleSubmit} className="space-y-2">
          <ContentForm.Header>
            <ContentInformation heading="Public" subheading="Update user info" />
          </ContentForm.Header>

          <ContentForm.Body>
            <div className="space-y-6">
              <div className="space-y-2">
                <Label>Username</Label>
                <Input name="name" value={form.name} onChange={handleChange} required />
              </div>

              <div className="space-y-2">
                <Label>Email</Label>
                <Input type="email" name="email" value={form.email} onChange={handleChange} required />
              </div>

              <ContentInformation heading="Private" subheading="Password & Role" />

              <div className="space-y-2 mt-6">
                <Label>Password</Label>
                <Input
                  type="password"
                  name="password"
                  value={form.password}
                  placeholder="Leave blank to keep current"
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label>Role</Label>
                <RadioButton
                  name="role"
                  options={roleOptions}
                  value={form.role}
                  onChange={(v) => handleCustomChange("role", v)}
                />
              </div>

              <div className="space-y-2">
                <Label>Office Assignment</Label>
                <Select value={form.officeId} onValueChange={(v) => handleCustomChange("officeId", v)}>
                  <SelectTrigger className="w-1/2">
                    <SelectValue placeholder="Select an Office" />
                  </SelectTrigger>
                  <SelectContent>
                    {offices.map((o) => (
                      <SelectItem key={o.id} value={String(o.id)}>
                        {capitalize(o.name)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Shift Assignment</Label>
                <Select
                  value={form.shiftId}
                  onValueChange={(v) => handleCustomChange("shiftId", v)}
                  disabled={availableShifts.length === 0}
                >
                  <SelectTrigger className="w-1/2">
                    <SelectValue placeholder={availableShifts.length === 0 ? "No shifts found" : "Select a Shift"} />
                  </SelectTrigger>
                  <SelectContent>
                    {availableShifts.map((s) => (
                      <SelectItem key={s.id} value={String(s.id)}>
                        {capitalize(s.name)} ({s.startTime} - {s.endTime})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </ContentForm.Body>

          <ContentForm.Footer>
            <Button type="submit" disabled={loading}>
              {loading ? "Updating..." : "Update User"}
            </Button>
          </ContentForm.Footer>
        </form>
      </ContentForm>
    </section>
  );
}
