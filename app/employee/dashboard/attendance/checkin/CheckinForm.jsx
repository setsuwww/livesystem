"use client";
import { useState } from "react";

export default function AttendanceForm() {
  const [reason, setReason] = useState("");
  const [showPermission, setShowPermission] = useState(false);

  const handleCheckIn = async () => {
    await fetch("/api/attendance/checkin", { method: "POST" });
  };

  const handleCheckOut = async () => {
    await fetch("/api/attendance/checkout", { method: "POST" });
  };

  const handlePermission = async () => {
    await fetch("/api/attendance/permission", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reason }),
    });
    setReason("");
    setShowPermission(false);
  };

  return (
    <div className="p-4 space-y-4">
      <button
        onClick={handleCheckIn}
        className="px-4 py-2 bg-green-600 text-white rounded-lg"
      >
        Check In
      </button>

      <button
        onClick={handleCheckOut}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg"
      >
        Check Out
      </button>

      {!showPermission ? (
        <button
          onClick={() => setShowPermission(true)}
          className="px-4 py-2 bg-yellow-600 text-white rounded-lg"
        >
          Permission
        </button>
      ) : (
        <div className="space-y-2">
          <input
            type="text"
            placeholder="Enter reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="border p-2 rounded w-full"
          />
          <button
            onClick={handlePermission}
            className="px-4 py-2 bg-yellow-700 text-white rounded-lg"
          >
            Submit Permission
          </button>
        </div>
      )}
    </div>
  );
}
