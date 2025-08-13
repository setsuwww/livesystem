"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { api } from "@/lib/api";
import { RadioButton } from "@/components/ui/RadioButton";
import { DashboardHeader } from "../../DashboardHeader";
import ContentForm from "@/components/content/ContentForm";
import ContentInformation from "@/components/content/ContentInformation";

export default function CreateUserPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "USER",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRoleChange = (value: string) => {
    setForm({ ...form, role: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.post("/users", form);

      if (res.status === 201 || res.status === 200) {
        router.push("/admin/dashboard/users");
      } else {
        alert("Failed to create user");
      }
    } catch (error) {
      alert("Error: " + error);
    } finally {
      setLoading(false);
    }
  };

  const roleOptions = [
    { label: "Admin", description: "Maintain and manage all contents", value: "ADMIN" },
    { label: "Manager", description: "Manage shifts and schedules for users", value: "MANAGER" },
    { label: "User", description: "Just for submitting helpdesk", value: "USER" },
  ];

  return (
    <section>
      <DashboardHeader title="Create Users" subtitle="Insert name, email, password, and select role for users data" />

      <ContentForm>

        <ContentInformation heading="Public" subheading="Users public username & email" />
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Name" placeholder="Username" id="name" name="name" labelColor="text-gray-600"
            value={form.name}
            onChange={handleChange}
            required
          />

          <Input label="Email" placeholder="Users Email" type="email" id="email" name="email" labelColor="text-gray-600" 
            value={form.email}
            onChange={handleChange}
            required
          />

          <ContentInformation heading="Private" subheading="Users role and password" />
          <Input label="Password" placeholder="Users Password" type="password" id="password" name="password" labelColor="text-gray-600"
            value={form.password}
            onChange={handleChange}
            required
          />

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-600">Role</label>
            <RadioButton name="role"
              options={roleOptions}
              value={form.role}
              onChange={handleRoleChange}
            />
          </div>

          <Button disabled={loading}>
            {loading ? "Creating..." : "Create User"}
          </Button>
        </form>
      </ContentForm>

    </section>
  );
}
