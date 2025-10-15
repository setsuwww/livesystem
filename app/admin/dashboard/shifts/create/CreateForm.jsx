"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select";
import ContentForm from "@/components/content/ContentForm";
import { ContentInformation } from "@/components/content/ContentInformation";
import { Label } from "@/components/ui/Label";
import { DashboardHeader } from "../../DashboardHeader";

import { apiFetchData } from "@/function/helpers/fetch";
import { timeToInt } from "@/function/services/shiftAttendance";
import { capitalize } from "@/function/globalFunction";

export default function CreateShiftForm({ offices }) {
  const router = useRouter();

  const [type, setType] = useState("MORNING");
  const [name, setName] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [officeId, setOfficeId] = useState("NONE");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (officeId === "NONE") {
      alert("Please select an office for this shift!");
      return;
    }

    const payload = {
      type,
      name,
      startTime: timeToInt(startTime),
      endTime: timeToInt(endTime),
      officeId: parseInt(officeId),
    };

    try {
      setLoading(true);
      await apiFetchData({
        url: "/shifts",
        method: "post",
        data: payload,
        successMessage: "Shift created successfully!",
        errorMessage: "Failed to create shift",
        onSuccess: () => {
          setType("MORNING");
          setName("");
          setStartTime("");
          setEndTime("");
          setOfficeId("NONE");
          router.push("/admin/dashboard/shifts");
        },
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <DashboardHeader title="Create Shift" subtitle="Assign a shift to an office" />

      <ContentForm>
        <form onSubmit={handleSubmit} className="space-y-4">
          <ContentForm.Header>
            <ContentInformation
              heading="Shift Form"
              subheading="Create a new shift and assign it to an office"
              show={true}
              buttonText="Back"
              variant="outline"
              href="/admin/dashboard/shifts"
            />
          </ContentForm.Header>

          <ContentForm.Body>
            <div className="flex flex-col space-y-4">
              {/* Office */}
              <div className="space-y-2">
                <Label htmlFor="office-select">
                  Office <span className="text-rose-500">*</span>
                </Label>
                <Select value={officeId} onValueChange={setOfficeId}>
                  <SelectTrigger id="office-select" className="w-full mt-1">
                    <SelectValue placeholder="Select an office" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="NONE">-</SelectItem>
                    {offices.map((office) => (
                      <SelectItem key={office.id} value={String(office.id)}>
                        {capitalize(office.name)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Shift Type and Name */}
              <div className="flex space-x-4">
              <div className="flex-1 space-y-2">
                <Label htmlFor="shift-type">Shift Type</Label>
                <Select value={type} onValueChange={setType}>
                  <SelectTrigger id="shift-type" className="w-full mt-1">
                    <SelectValue placeholder="Select shift type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MORNING">Morning</SelectItem>
                    <SelectItem value="AFTERNOON">Afternoon</SelectItem>
                    <SelectItem value="EVENING">Evening</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex-1 space-y-2">
                <Label htmlFor="shift-name">
                  Shift Name <span className="text-rose-500">*</span>
                </Label>
                <Input
                  id="shift-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  type="text"
                  placeholder="Example: Morning Shift"
                  className="mt-1"
                  required
                />
              </div>
              </div>

              {/* Start & End Time */}
              <div className="flex space-x-4">
                <div className="flex-1 space-y-2">
                  <Label htmlFor="start-time">
                    Start Time <span className="text-rose-500">*</span>
                  </Label>
                  <Input
                    id="start-time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    type="time"
                    className="mt-1"
                    required
                  />
                </div>

                <div className="flex-1 space-y-2">
                  <Label htmlFor="end-time">
                    End Time <span className="text-rose-500">*</span>
                  </Label>
                  <Input
                    id="end-time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    type="time"
                    className="mt-1"
                    required
                  />
                </div>
              </div>
            </div>
          </ContentForm.Body>

          <ContentForm.Footer>
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create Shift"}
            </Button>
          </ContentForm.Footer>
        </form>
      </ContentForm>
    </section>
  );
}
