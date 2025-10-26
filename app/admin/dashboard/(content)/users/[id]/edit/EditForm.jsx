"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/_components/ui/Button";
import { Input } from "@/_components/ui/Input";
import { RadioButton } from "@/_components/ui/RadioButton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/_components/ui/Select";
import ContentForm from "@/_components/content/ContentForm";
import { ContentInformation } from "@/_components/content/ContentInformation";
import { Label } from "@/_components/ui/Label";
import { DashboardHeader } from "@/app/admin/dashboard/DashboardHeader";
import { capitalize } from "@/_function/globalFunction";
import { roleOptions } from "@/_constants/roleOptions";
import { updateUser } from "@/_components/server/userAction.js";

export default function EditForm({ user, divisions, shifts }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [form, setForm] = useState({
    id: user.id, name: user.name, email: user.email, 
    password: "", role: user.role,
    divisionId: user.divisionId ? String(user.divisionId) : "",
    shiftId: user.shiftId ? String(user.shiftId) : "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCustomChange = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  async function handleSubmit(e) {
    e.preventDefault();

    startTransition(async () => {
      const result = await updateUser(form);
        if (result?.success) { router.push("/admin/dashboard/users")} 
          else { alert(result?.error || "Failed to update user ❌")}
    });
  }

  const selectedDivision = divisions.find((o) => String(o.id) === form.divisionId);
  const availableShifts = selectedDivision?.shifts || [];

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
                <Input type="password" name="password" value={form.password}
                  placeholder="Leave blank to keep current"
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label>Role</Label>
                <RadioButton name="role" options={roleOptions}
                  value={form.role} onChange={(v) => handleCustomChange("role", v)}
                />
              </div>

              <div className="space-y-2">
                <Label>Division Assignment</Label>
                <Select value={form.divisionId} onValueChange={(v) => handleCustomChange("divisionId", v)}>
                  <SelectTrigger className="w-1/2">
                    <SelectValue placeholder="Select an division" />
                  </SelectTrigger>
                  <SelectContent>
                    {divisions.map((o) => (
                      <SelectItem key={o.id} value={String(o.id)}>
                        {capitalize(o.name)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Shift Assignment</Label>
                <Select value={form.shiftId} onValueChange={(v) => handleCustomChange("shiftId", v)}
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
            <Button type="submit" disabled={isPending}>
              {isPending ? "Updating..." : "Update User"}
            </Button>
          </ContentForm.Footer>
        </form>
      </ContentForm>
    </section>
  );
}
