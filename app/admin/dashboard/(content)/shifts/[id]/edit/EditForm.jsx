"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/_components/ui/Button";
import { Input } from "@/_components/ui/Input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/_components/ui/Select";
import ContentForm from "@/_components/content/ContentForm";
import { ContentInformation } from "@/_components/content/ContentInformation";
import { Label } from "@/_components/ui/Label";
import { DashboardHeader } from "@/app/admin/dashboard/DashboardHeader";

import { apiFetchData } from "@/_function/helpers/fetch";
import { timeToInt, intToTime } from "@/_function/services/shiftAttendanceHelpers";
import { capitalize } from "@/_function/globalFunction";

export default function EditShiftForm({ divisions, shift }) {
  const router = useRouter();

  const [type, setType] = useState(shift.type);
  const [name, setName] = useState(shift.name);
  const [startTime, setStartTime] = useState(intToTime(shift.startTime));
  const [endTime, setEndTime] = useState(intToTime(shift.endTime));
  const [divisionId, setDivisionId] = useState(String(shift.divisionId));
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (divisionId === "NONE") {
      alert("Please select an division for this shift!");
      return;
    }

    const payload = {
      type, name,
      startTime: timeToInt(startTime),
      endTime: timeToInt(endTime),
      divisionId: parseInt(divisionId),
    };

    try {
      setLoading(true);
      await apiFetchData({ url: `/shifts/${shift.id}`, method: "put", data: payload,
        successMessage: "Shift updated successfully!",
        errorMessage: "Failed to update shift",
        onSuccess: () => {router.push("/admin/dashboard/shifts")},
      });
    } 
    finally {setLoading(false)}
  };

  return (
    <section>
      <DashboardHeader title="Edit Shift" subtitle={`Modify ${capitalize(shift.name)} shift details`} />

      <ContentForm>
        <form onSubmit={handleSubmit} className="space-y-4">
          <ContentForm.Header>
            <ContentInformation
              heading="Shift Form"
              subheading="Edit the selected shift"
              show={true}
              buttonText="Back"
              variant="outline"
              href="/admin/dashboard/shifts"
            />
          </ContentForm.Header>

          <ContentForm.Body>
            <div className="flex flex-col space-y-4">
              <div className="space-y-2">
                <Label htmlFor="division-select">
                  Division <span className="text-rose-500">*</span>
                </Label>
                <Select value={divisionId} onValueChange={setDivisionId}>
                  <SelectTrigger id="division-select" className="w-full mt-1">
                    <SelectValue placeholder="Select an division" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="NONE">-</SelectItem>
                    {divisions.map((division) => (
                      <SelectItem key={division.id} value={String(division.id)}>
                        {capitalize(division.name)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

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
                  <Input id="shift-name" value={name}
                    onChange={(e) => setName(e.target.value)} type="text"
                    placeholder="Example: Morning Shift"
                    className="mt-1"
                    required
                  />
                </div>
              </div>

              <div className="flex space-x-4">
                <div className="flex-1 space-y-2">
                  <Label htmlFor="start-time">
                    Start Time <span className="text-rose-500">*</span>
                  </Label>
                  <Input id="start-time" value={startTime}
                    onChange={(e) => setStartTime(e.target.value)} type="time"
                    className="mt-1"
                    required
                  />
                </div>

                <div className="flex-1 space-y-2">
                  <Label htmlFor="end-time">
                    End Time <span className="text-rose-500">*</span>
                  </Label>
                  <Input id="end-time" value={endTime} 
                    onChange={(e) => setEndTime(e.target.value)} type="time"
                    className="mt-1"
                    required
                  />
                </div>
              </div>
            </div>
          </ContentForm.Body>

          <ContentForm.Footer>
            <Button type="submit" disabled={loading}>
              {loading ? "Updating..." : "Update Shift"}
            </Button>
          </ContentForm.Footer>
        </form>
      </ContentForm>
    </section>
  );
}
