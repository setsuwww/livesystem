"use client";

import { useState, useEffect } from "react";

export default function CreateShiftPage() {
  const [type, setType] = useState("MORNING");
  const [customType, setCustomType] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [users, setUsers] = useState<{ id: number; name: string; email: string }[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [search, setSearch] = useState("");

  // fetch users
  useEffect(() => {
    fetch("/api/users")
      .then((res) => res.json())
      .then(setUsers);
  }, []);

  const toggleUser = (id: number) => {
    setSelectedUsers((prev) =>
      prev.includes(id) ? prev.filter((u) => u !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch("/api/shifts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type,
        startTime,
        endTime,
        customType: type === "CUSTOM" ? customType : null,
        userIds: selectedUsers,
      }),
    });

    if (res.ok) alert("Shift created!");
    else alert("Error creating shift");
  };

  const filteredUsers = users.filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold">Create Shift</h1>

      {/* Shift Type */}
      <div>
        <label className="block mb-1">Shift Type</label>
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="border rounded p-2 w-full"
        >
          <option value="MORNING">Morning</option>
          <option value="AFTERNOON">Afternoon</option>
          <option value="NIGHT">Night</option>
          <option value="CUSTOM">Custom</option>
        </select>
      </div>

      {type === "CUSTOM" && (
        <div>
          <label className="block mb-1">Custom Shift Name</label>
          <input
            type="text"
            value={customType}
            onChange={(e) => setCustomType(e.target.value)}
            className="border rounded p-2 w-full"
            placeholder="e.g. Shift Weekend"
            required
          />
        </div>
      )}

      {/* Time */}
      <div>
        <label className="block mb-1">Start Time</label>
        <input
          type="time"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
          className="border rounded p-2 w-full"
          required
        />
      </div>

      <div>
        <label className="block mb-1">End Time</label>
        <input
          type="time"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
          className="border rounded p-2 w-full"
          required
        />
      </div>

      {/* User Multi Select */}
      <div>
        <label className="block mb-1">Assign Users</label>
        <input
          type="text"
          placeholder="Search user..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded p-2 w-full mb-2"
        />
        <div className="max-h-40 overflow-y-auto border rounded p-2">
          {filteredUsers.map((u) => (
            <label key={u.id} className="flex items-center gap-2 py-1">
              <input
                type="checkbox"
                checked={selectedUsers.includes(u.id)}
                onChange={() => toggleUser(u.id)}
              />
              <span>{u.name} ({u.email})</span>
            </label>
          ))}
          {filteredUsers.length === 0 && (
            <div className="text-gray-500 text-sm">No users found</div>
          )}
        </div>
      </div>

      <button
        type="submit"
        className="bg-blue-600 text-white rounded p-2 w-full hover:bg-blue-700"
      >
        Save
      </button>
    </form>
  );
}
