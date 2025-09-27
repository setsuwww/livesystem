"use client";

import { useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select";
import ContentForm from "@/components/content/ContentForm";
import { ContentInformation } from "@/components/content/ContentInformation";
import { ScrollArea } from "@/components/ui/Scroll-area";
import { Label } from "@/components/ui/Label";

import { fetch } from "@/function/helpers/fetch";
import { timeToInt } from "@/function/services/shiftAttendance";
import { DashboardHeader } from "../../DashboardHeader";

export default function CreateShiftForm() {
  const [type, setType] = useState("MORNING");
  const [shiftName, setShiftName] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      type,
      shiftName,
      startTime: timeToInt(startTime), endTime: timeToInt(endTime),
    };

    try {
      await fetch({
        url: "/shifts", method: "post",
        data: payload,
        successMessage: "Shift created successfully!",
        errorMessage: "Failed to create shift",
        onSuccess: () => {
          setType("MORNING");
          setShiftName("");
          setStartTime("");
          setEndTime("");
          router.push("/admin/dashboard/shifts");
        },
      });
    }
    catch (err) {
      console.error("Shift creation error:", err);
    }
  };


  return (
    <section>
      <DashboardHeader title="Create Shifts" subtitle="Manage shifts data" />

      <ContentForm>
        <form onSubmit={handleSubmit}>
          <ContentForm.Header>
            <ContentInformation heading="Shift Form" subheading="Create a new shift and assign users"
              show={true} buttonText="Back" variant="outline" href="/admin/dashboard/shifts"
            />
          </ContentForm.Header>

          <ContentForm.Body>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 space-y-2">
              <div>
                <Label htmlFor="shift-type">Shift Type</Label>
                <Select value={type} onValueChange={(v) => setType(v)}>
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
              <div>
                <Label htmlFor="shift-type">Shift Name<span className="text-red-500">*</span></Label>
                <Input id="shiftName" value={shiftName} onChange={(e) => setShiftName(e.target.value)}
                  type="text"
                  className="mt-1"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="start-time">Start Time<span className="text-red-500">*</span></Label>
                <Input id="start-time" value={startTime} onChange={(e) => setStartTime(e.target.value)}
                  type="time"
                  className="mt-1"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="end-time">End Time<span className="text-red-500">*</span></Label>
                <Input id="end-time" value={endTime} onChange={(e) => setEndTime(e.target.value)}
                  type="time"
                  className="mt-1"
                />
              </div>
            </div>
          </ContentForm.Body>

          <ContentForm.Footer>
            <Button type="submit">Create Shift</Button>
          </ContentForm.Footer>
        </form>
      </ContentForm>
    </section>
  );
}
