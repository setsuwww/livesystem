"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/_components/ui/Button";
import { Input } from "@/_components/ui/Input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/_components/ui/Select";
import { Label } from "@/_components/ui/Label";
import { Loader } from "lucide-react";

import ContentForm from "@/_components/content/ContentForm";
import { ContentInformation } from "@/_components/content/ContentInformation";

import { apiFetchData } from "@/_function/helpers/fetch";
import { typeOptions, statusOptions } from "@/_constants/divisionConstants";
import { capitalize, minutesToTime, timeToMinutes } from "@/_function/globalFunction";

export default function EditDivisionForm({ division }) {
  const router = useRouter();

  const [form, setForm] = useState({
    name: division.name || "",
    location: division.location || "",
    longitude: division.longitude ?? "",
    latitude: division.latitude ?? "",
    radius: division.radius ?? "",
    type: division.type || "WFO",
    status: division.status || "INACTIVE",
    startTime: division.startTime ? minutesToTime(division.startTime) : "",
    endTime: division.endTime ? minutesToTime(division.endTime) : "",
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
      await apiFetchData({
        url: `/division/${division.id}`,
        method: "put",
        data: payload,
        successMessage: "Division updated successfully ✅",
        errorMessage: "Failed to update division ❌",
        onSuccess: () => router.push("/admin/dashboard/users/divisions"),
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ContentForm>
      <form onSubmit={handleSubmit} className="space-y-2">
        <ContentForm.Header>
          <ContentInformation
            heading="Edit Division"
            subheading={`Editing data for: ${division.name}`}
            show
            variant="outline"
            buttonText="Back"
            href="/admin/dashboard/divisions"
          />
        </ContentForm.Header>

        <ContentForm.Body>
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">
                Name <span className="text-rose-500">*</span>
              </Label>
              <Input
                name="name"
                placeholder="Head Division"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>

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

            <ContentInformation
              heading="Division Coordinates"
              subheading="Insert latitude and longitude for active division location"
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

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>
                  Type<span className="text-rose-500">*</span>
                </Label>
                <Select
                  value={form.type}
                  onValueChange={(value) => handleCustomChange("type", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
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
                <Label>
                  Status<span className="text-rose-500">*</span>
                </Label>
                <Select
                  value={form.status}
                  onValueChange={(value) => handleCustomChange("status", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
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
            {loading 
              ? (<><Loader className="w-4 h-4 animate-spin" /> Updating...</>) 
              : ("Update Division")
            }
          </Button>
        </ContentForm.Footer>
      </form>
    </ContentForm>
  );
}
