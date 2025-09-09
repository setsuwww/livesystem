"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { RadioButton } from "@/components/ui/RadioButton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select";
import ContentForm from "@/components/content/ContentForm";
import { ContentList } from "@/components/content/ContentList";
import { ContentInformation } from "@/components/content/ContentInformation";
import { Label } from "@/components/ui/Label";

import { DashboardHeader } from "../../DashboardHeader";

import { fetch } from "@/function/helpers/fetch";
import { capitalize } from "@/function/globalFunction";
import { roleOptions } from "@/constants/roleOptions";

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

  const handleChange = (e) => { const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCustomChange = (name, value) => { setForm((prev) => ({ ...prev, [name]: value })); };

  const handleSubmit = async (e) => { e.preventDefault();
    setLoading(true);

    const payload = { ...form,
      shiftId: form.shiftId && form.shiftId !== "NONE" ? parseInt(form.shiftId) : null,
    };

    try { await fetch({ url: "/users", method: "post", data: payload,
        successMessage: "User created successfully ✅",
        errorMessage: "Failed to create user ❌",
        onSuccess: () => router.push("/admin/dashboard/users"),
      });
    }
    finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <DashboardHeader title="Create Users" subtitle="Insert name, email, password, select role and shift for users data" />

      <ContentForm>
        <form onSubmit={handleSubmit} className="space-y-2">
          <ContentForm.Header>
            <ContentInformation
              heading="Public"
              subheading="Users public username & email"
            />
          </ContentForm.Header>

          {/* BODY */}
          <ContentForm.Body>
            <div className="space-y-6">
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
                <Input placeholder="Users email" type="email" name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-head">Password <span className="text-red-500">*</span></Label>
                <Input placeholder="Users password" type="password" name="password"
                  value={form.password}
                  onChange={handleChange}
                  required
                />
                <ContentList items={[
                  "Minimum 8 characters",
                  "At least one uppercase letter",
                ]} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="role" className="text-head">Role <span className="text-red-500">*</span></Label>
                <RadioButton name="role"
                  options={roleOptions}
                  value={form.role}
                  onChange={(value) => handleCustomChange("role", value)}
                />
                
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
                    <SelectItem value="NONE">-</SelectItem>
                    {shifts.map((shift) => (
                      <SelectItem key={shift.id} value={String(shift.id)}>
                        {capitalize(shift.type)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-subhead">Optional</p>
              </div>
            </div>
          </ContentForm.Body>

          <ContentForm.Footer>
            <footer className="flex items-center space-x-2">
              <Button type="submit" variant="outline">Cancel</Button>
              <Button type="submit" disabled={loading}>{loading ? "Creating..." : "Create User"}</Button>
            </footer>
          </ContentForm.Footer>
        </form>
      </ContentForm>
    </section>
  );
}
