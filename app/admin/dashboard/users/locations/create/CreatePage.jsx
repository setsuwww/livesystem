"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select";
import { Label } from "@/components/ui/Label";

import { DashboardHeader } from "../../../DashboardHeader";
import ContentForm from "@/components/content/ContentForm";
import { ContentInformation } from "@/components/content/ContentInformation";

import { fetch } from "@/function/helpers/fetch";
import { capitalize, timeToMinutes } from "@/function/globalFunction";

const typeOptions = [
  { label: "WFO (Work From Office)", value: "WFO" },
  { label: "WFA (Work From Anywhere)", value: "WFA" },
];

const statusOptions = [
  { label: "ACTIVE", value: "ACTIVE" },
  { label: "INACTIVE", value: "INACTIVE" },
];

export default function CreateOfficeForm() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    location: "",
    longitude: "",
    latitude: "",
    radius: "",
    type: "WFO",
    status: "INACTIVE",
    startTime: "", // HH:mm format
    endTime: "",
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
      longitude: form.longitude ? parseFloat(form.longitude) : null,
      latitude: form.latitude ? parseFloat(form.latitude) : null,
      radius: form.radius ? parseInt(form.radius) : null,
      startTime: form.startTime ? timeToMinutes(form.startTime) : null,
      endTime: form.endTime ? timeToMinutes(form.endTime) : null,
    };

    try {
      await fetch({
        url: "/office",
        method: "post",
        data: payload,
        successMessage: "Office created successfully ✅",
        errorMessage: "Failed to create office ❌",
        onSuccess: () => router.push("/admin/dashboard/users/locations"),
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <DashboardHeader
        title="Create Office"
        subtitle="Fill in office details to register a new office location"
      />

      <ContentForm>
        <form onSubmit={handleSubmit} className="space-y-2">
          <ContentForm.Header>
            <ContentInformation
              heading="Office Info"
              subheading="Office details & location"
              show={true}
              variant="outline"
              buttonText="Back"
              href="/admin/dashboard/offices"
            />
          </ContentForm.Header>

          <ContentForm.Body>
            <div className="space-y-6">
              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="name">
                  Name <span className="text-rose-500">*</span>
                </Label>
                <Input
                  name="name"
                  placeholder="Head Office"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Location */}
              <div className="space-y-2">
                <Label htmlFor="location">
                  Location <span className="text-rose-500">*</span>
                </Label>
                <Input
                  name="location"
                  placeholder="Jakarta"
                  value={form.location}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Coordinates */}
              <ContentInformation
                heading="Offices Coordinate"
                subheading="Insert latitude and longitude for activate office location"
              />

              <div className="grid grid-cols-2 gap-4 mt-8">
                <div className="space-y-2">
                  <Label htmlFor="longitude">
                    Longitude<span className="text-rose-500">*</span>
                  </Label>
                  <Input
                    name="longitude"
                    placeholder="106.8456"
                    value={form.longitude}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="latitude">
                    Latitude<span className="text-rose-500">*</span>
                  </Label>
                  <Input
                    name="latitude"
                    placeholder="-6.2088"
                    value={form.latitude}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Radius */}
              <div className="space-y-2">
                <Label htmlFor="radius">
                  Radius (meter)<span className="text-rose-500">*</span>
                </Label>
                <Input
                  name="radius"
                  placeholder="100"
                  value={form.radius}
                  onChange={handleChange}
                />
              </div>

              {/* Time picker UX fix */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startTime">
                    Start Time <span className="text-rose-500">*</span>
                  </Label>
                  <Input
                    type="time"
                    name="startTime"
                    value={form.startTime}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endTime">
                    End Time <span className="text-rose-500">*</span>
                  </Label>
                  <Input
                    type="time"
                    name="endTime"
                    value={form.endTime}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {/* Type + Status */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Type<span className="text-rose-500">*</span></Label>
                  <Select
                    value={form.type}
                    onValueChange={(value) =>
                      handleCustomChange("type", value)
                    }
                  >
                    <SelectTrigger>
                      <span className="font-semibold text-slate-600 mr-1">
                        Type:
                      </span>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {typeOptions.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Status<span className="text-rose-500">*</span></Label>
                  <Select
                    value={form.status}
                    onValueChange={(value) =>
                      handleCustomChange("status", value)
                    }
                  >
                    <SelectTrigger>
                      <span className="font-semibold text-slate-600 mr-1">
                        Status:
                      </span>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {statusOptions.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {capitalize(opt.label)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </ContentForm.Body>

          <ContentForm.Footer>
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create Office"}
            </Button>
          </ContentForm.Footer>
        </form>
      </ContentForm>
    </section>
  );
}
