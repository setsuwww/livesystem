"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Label } from "@/components/ui/Label";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { toast } from "sonner";

export default function AttendanceForm({ userId, shift }) {
  const [arrivalTime, setArrivalTime] = useState("");
  const [departureTime, setDepartureTime] = useState("");
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const determineStatus = () => {
    if (!arrivalTime && !reason) return "ABSENT";
    if (reason) return "PERMISSION";

    const [hour, minute] = arrivalTime.split(":").map(Number);
    const arrivalDate = new Date();
    arrivalDate.setHours(hour, minute, 0);

    const shiftStart = new Date();
    shiftStart.setHours(shift.startTime.getHours(), shift.startTime.getMinutes(), 0);

    const shiftEnd = new Date();
    shiftEnd.setHours(shift.endTime.getHours(), shift.endTime.getMinutes(), 0);

    if (arrivalDate <= shiftStart) return "PRESENT";
    if (arrivalDate > shiftStart && arrivalDate <= shiftEnd) return "LATE";
    return "ABSENT";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const status = determineStatus();

    try {
      const res = await fetch("/api/attendance", {
        method: "POST",
        body: JSON.stringify({
          userId,
          shiftId: shift.id,
          status,
          reason: status === "PERMISSION" ? reason : "",
          arrivalTime,
          departureTime,
          date: new Date(),
        }),
      });

      if (!res.ok) throw new Error("Failed to submit attendance");

      toast.success(`Attendance recorded as ${status}`);
      setArrivalTime("");
      setDepartureTime("");
      setReason("");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
      <div>
        <Label>Arrival Time</Label>
        <Input
          type="time"
          value={arrivalTime}
          onChange={(e) => setArrivalTime(e.target.value)}
        />
      </div>

      <div>
        <Label>Departure Time (optional)</Label>
        <Input
          type="time"
          value={departureTime}
          onChange={(e) => setDepartureTime(e.target.value)}
        />
      </div>

      {(!arrivalTime || arrivalTime === "") && (
        <div>
          <Label>Reason (Permission)</Label>
          <Textarea
            placeholder="Enter reason if absent or requesting permission"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
        </div>
      )}

      <Button type="submit" disabled={submitting}>
        {submitting ? "Submitting..." : "Submit Attendance"}
      </Button>
    </form>
  );
}
