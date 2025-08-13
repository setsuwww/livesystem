"use client";

import { useState, useEffect, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { RadioButton } from "@/components/ui/RadioButton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ContentForm from "@/components/content/ContentForm";
import ContentInformation from "@/components/content/ContentInformation";
import { DashboardHeader } from "../../DashboardHeader";

import { Shift } from "@/static/interfaces/Shift";

export default function CreateUserPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "USER",
    shiftId: ""
  });

  const [loading, setLoading] = useState(false);
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [loadingShifts, setLoadingShifts] = useState(true);

  // Ambil data shifts saat mount
  useEffect(() => {
    const fetchShifts = async () => {
      try {
        const res = await api.get("/shifts");
        if (res.status === 200) {
          setShifts(res.data);
        }
      } catch (error) {
        console.error("Error fetching shifts:", error);
        alert("Failed to load shifts");
      } finally {
        setLoadingShifts(false);
      }
    };

    fetchShifts();
  }, []);

  // Untuk input HTML biasa
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  // Untuk komponen custom seperti Radix Select
  const handleCustomChange = (name: string, value: string) => {
    setForm((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRoleChange = (value: string) => {
    setForm({ ...form, role: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        ...form,
        shiftId: form.shiftId ? parseInt(form.shiftId) : null
      };

      const res = await api.post("/users", payload);

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
    {
      label: "Admin",
      description: "Maintain and manage all contents",
      value: "ADMIN"
    },
    {
      label: "Manager",
      description: "Manage shifts and schedules for users",
      value: "MANAGER"
    },
    {
      label: "User",
      description: "Just for submitting helpdesk",
      value: "USER"
    }
  ];

  const formatTime = (timeString: string) => {
    return new Date(timeString).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  return (
    <section>
      <DashboardHeader
        title="Create Users"
        subtitle="Insert name, email, password, select role and shift for users data"
      />

      <ContentForm>
        <form onSubmit={handleSubmit} className="space-y-4">
          <ContentInformation
            heading="Public"
            subheading="Users public username & email"
          />

          <Input
            label="Name"
            placeholder="Username"
            id="name"
            name="name"
            labelColor="text-gray-600"
            value={form.name}
            onChange={handleChange}
            required
          />

          <Input
            label="Email"
            placeholder="Users Email"
            type="email"
            id="email"
            name="email"
            labelColor="text-gray-600"
            value={form.email}
            onChange={handleChange}
            required
          />

          <ContentInformation
            heading="Private"
            subheading="Users role, password and shift assignment"
          />

          <Input
            label="Password"
            placeholder="Users Password"
            type="password"
            id="password"
            name="password"
            labelColor="text-gray-600"
            value={form.password}
            onChange={handleChange}
            required
          />

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-600">
              Role
            </label>
            <RadioButton
              name="role"
              options={roleOptions}
              value={form.role}
              onChange={handleRoleChange}
            />
          </div>

          {/* Shift Selection */}
          <div>
            <label htmlFor="shiftId" className="block mb-1.5 text-sm font-medium text-gray-600">
              Shift Assignment
            </label>

            {loadingShifts ? (
              <div className="text-sm text-gray-500">Loading shifts...</div>
            ) : (
              <Select
                value={form.shiftId}
                onValueChange={(value) =>
                  handleCustomChange("shiftId", value)
                }
              >
                <SelectTrigger className="w-full">
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
            )}
          </div>

          <Button disabled={loading || loadingShifts}>
            {loading ? "Creating..." : "Create User"}
          </Button>
        </form>
      </ContentForm>
    </section>
  );
}
