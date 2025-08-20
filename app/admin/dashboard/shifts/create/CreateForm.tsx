"use client";

import { useState, useMemo, useCallback } from "react";
import { Checkbox } from "@/components/ui/Checkbox";
import { Button } from "@/components/ui/Button";

interface User {
  id: string;
  name: string;
  email: string;
}

interface CreateShiftFormProps {
  users: User[];
}

export default function CreateShiftForm({ users }: CreateShiftFormProps) {
  // State shift
  const [type, setType] = useState("MORNING");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  // State user selection
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  // Memoize daftar user (biar gak recompute tiap render)
  const memoizedUsers = useMemo(() => users, [users]);

  // Toggle pilih user
  const toggleUser = useCallback((id: string) => {
    setSelectedUsers((prev) =>
      prev.includes(id) ? prev.filter((u) => u !== id) : [...prev, id]
    );
  }, []);

  // Submit handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      type,
      startTime,
      endTime,
      users: selectedUsers, // ✅ cuma yang dicentang
    };

    try {
      const res = await fetch("/api/shifts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to create shift");

      alert("Shift created!");
    } catch (err) {
      console.error(err);
      alert("Error creating shift");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Shift type */}
      <div>
        <label className="block text-sm font-medium">Shift Type</label>
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="mt-1 block w-full rounded border border-gray-300 p-2"
        >
          <option value="MORNING">Morning</option>
          <option value="EVENING">Evening</option>
          <option value="NIGHT">Night</option>
        </select>
      </div>

      {/* Start time */}
      <div>
        <label className="block text-sm font-medium">Start Time</label>
        <input
          type="time"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
          className="mt-1 block w-full rounded border border-gray-300 p-2"
        />
      </div>

      {/* End time */}
      <div>
        <label className="block text-sm font-medium">End Time</label>
        <input
          type="time"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
          className="mt-1 block w-full rounded border border-gray-300 p-2"
        />
      </div>

      {/* Users list */}
      <div>
        <label className="block text-sm font-medium">Assign Users</label>
        <div className="mt-2 space-y-2 max-h-40 overflow-y-auto border border-gray-300 rounded p-2">
          {memoizedUsers.map((user) => (
            <Checkbox
              key={user.id}
              label={`${user.name} (${user.email})`}
              checked={selectedUsers.includes(user.id)}
              onChange={() => toggleUser(user.id)}
            />
            
          ))}
        </div>
      </div>

      <Button type="submit">Create Shift</Button>
    </form>
  );
}
