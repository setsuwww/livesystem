"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { toast } from "sonner";

export default function AttendanceForm() {
  const [reason, setReason] = useState("");
  const [showPermission, setShowPermission] = useState(false);

  const handleCheckIn = async () => {
    try { const res = await fetch("/api/attendance/checkin", { method: "POST" });
      if (!res.ok) throw new Error("Failed");
      toast.success("Success");
    } 
    catch (err) { toast.error("Failed") }
  };

  const handleCheckOut = async () => {
    try { const res = await fetch("/api/attendance/checkout", { method: "POST" });
      if (!res.ok) throw new Error("Failed");
      toast.success("Success");
    } 
    catch (err) { toast.error("Failed") }
  };

  const handlePermission = async () => {
    try { const res = await fetch("/api/attendance/permission", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason }),
      });

      if (!res.ok) throw new Error("Failed");
      toast.success("Permission Sending");
      setReason("");
      setShowPermission(false);
    } 
    catch (err) {
      toast.error("Permission failed to send");
    }
  };

  return (
    <Card className="max-w-md mx-auto mt-8 shadow-lg">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Attendance</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Check in/out buttons */}
        <div className="flex gap-2">
          <Button onClick={handleCheckIn} className="flex-1 bg-teal-600 hover:bg-teal-700">
            Check In
          </Button>
          <Button onClick={handleCheckOut} className="flex-1 bg-blue-600 hover:bg-blue-700">
            Check Out
          </Button>
        </div>

        {/* Permission form */}
        {!showPermission ? (
          <Button
            onClick={() => setShowPermission(true)}
            className="w-full bg-yellow-600 hover:bg-yellow-700"
          >
            Request Permission
          </Button>
        ) : (
          <div className="space-y-2">
            <Input
              placeholder="Enter reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
            <div className="flex gap-2">
              <Button
                onClick={handlePermission}
                className="flex-1 bg-yellow-600 hover:bg-yellow-700"
              >
                Submit
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowPermission(false)}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
