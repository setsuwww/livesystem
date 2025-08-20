"use client";

import { CircleQuestionMark } from "lucide-react";
import { useState, useMemo, useCallback } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select";
import { Checkbox } from "@/components/ui/Checkbox";
import { ScrollArea } from "@/components/ui/Scroll-area";

interface User {
  id: string;
  name: string;
  email: string;
}

interface CreateShiftFormProps {
  users: User[];
}

export default function CreateShiftForm({ users }: CreateShiftFormProps) {
  const [type, setType] = useState("MORNING");
  const [customType, setCustomType] = useState(""); // ✅ untuk shift custom
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [search, setSearch] = useState("");

  const filteredUsers = useMemo(() => {
    return users.filter((u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
    );
  }, [users, search]);

  const toggleUser = useCallback((id: string) => {
    setSelectedUsers((prev) =>
      prev.includes(id) ? prev.filter((u) => u !== id) : [...prev, id]
    );
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      type,
      customType: type === "CUSTOM" ? customType : null,
      startTime,
      endTime,
      userIds: selectedUsers,
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
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Shift Type</label>
          <Select value={type} onValueChange={(v) => setType(v)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a shift type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="MORNING">Morning</SelectItem>
              <SelectItem value="AFTERNOON">Afternoon</SelectItem>
              <SelectItem value="NIGHT">Night</SelectItem>
              <SelectItem value="CUSTOM">Custom</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Start time */}
        <div>
          <label className="block text-sm font-medium mb-1">Start Time</label>
          <Input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
          />
        </div>

        {/* End time */}
        <div>
          <label className="block text-sm font-medium mb-1">End Time</label>
          <Input
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
          />
        </div>
      </div>

      {/* Kalau pilih CUSTOM muncul input tambahan */}
{type === "CUSTOM" && (
  <div className="bg-gray-100 border border-gray-300 rounded-lg p-3 space-y-2">
    <label className="flex items-center space-x-1 font-medium text-gray-500">
      <CircleQuestionMark strokeWidth={1.75} size={20} />
      <span className="text-sm">Custom Shift Type</span>
    </label>
    <Input
      type="text"
      placeholder="Custom shift name"
      value={customType}
      onChange={(e) => setCustomType(e.target.value)}
    />
    <p className="text-xs text-gray-400 mt-2 max-w-xs">
      This will be used to identify the custom shift.
      Input on to is used for your custom shift
    </p>
  </div>
)}


      {/* Search user */}
      <div>
        <label className="block text-sm font-medium mb-1">Search User</label>
        <Input
          type="text"
          placeholder="Search by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Users list */}
      <div>
        <label className="block text-sm font-medium mb-2">Assign Users</label>
        <ScrollArea className="h-40 rounded-md border border-gray-300 p-2">
          <div className="space-y-1">
            {filteredUsers.length === 0 && (
              <p className="text-sm text-center text-red-500">No users found</p>
            )}
            {filteredUsers.map((user) => (
              <label key={user.id} className="flex items-center space-x-2 rounded hover:bg-muted px-2 py-1 cursor-pointer"> 
                <Checkbox label={`${user.name} (${user.email})`} checked={selectedUsers.includes(user.id)}
                  onChange={() => toggleUser(user.id)}
                />
              </label>
            ))}
          </div>
        </ScrollArea>
      </div>

      <Button type="submit" className="w-full">
        Create Shift
      </Button>
    </form>
  );
}
