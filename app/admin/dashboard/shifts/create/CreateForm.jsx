"use client";

import { useState, useMemo, useCallback } from "react";
import { CircleUser } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import ContentForm from "@/components/content/ContentForm";
import { ContentInformation } from "@/components/content/ContentInformation";
import { Checkbox } from "@/components/ui/Checkbox";
import { ScrollArea } from "@/components/ui/Scroll-area";
import { Label } from "@/components/ui/Label";

import { fetch } from "@/function/helpers/fetch";

export default function CreateShiftForm({ users }) {
  const [type, setType] = useState("MORNING");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState("");

  // 🔍 Search + Sort
  const processedUsers = useMemo(() => {
    let result = [...users];

    // filter by search
    if (search) {
      result = result.filter(
        (u) =>
          u.name.toLowerCase().includes(search.toLowerCase()) ||
          u.email.toLowerCase().includes(search.toLowerCase())
      );
    }

    // sort newest / oldest
    result.sort((a, b) => {
      const aDate = new Date(a.createdAt);
      const bDate = new Date(b.createdAt);

      return sortOrder === "newest"
        ? bDate - aDate
        : aDate - bDate;
    });

    return result;
  }, [users, search, sortOrder]);

  // toggle user select
  const toggleUser = useCallback(
    (id) => {
      setSelectedUsers((prev) =>
        prev.includes(id) ? prev.filter((u) => u !== id) : [...prev, id]
      );
    },
    []
  );

  // submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { type, startTime, endTime, userIds: selectedUsers };

    try {
      await fetch({
        url: "/shifts",
        method: "post",
        data: payload,
        successMessage: "Shift created successfully!",
        errorMessage: "Failed to create shift",
        onSuccess: () => {
          setType("MORNING");
          setStartTime("");
          setEndTime("");
          setSelectedUsers([]);
          router.refresh();
        },
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <section>
      <ContentForm>
        <form onSubmit={handleSubmit}>
          <ContentForm.Header>
            <ContentInformation
              heading="Create Shift"
              subheading="Insert shift data and assigned users in the shift"
            />
          </ContentForm.Header>

          <ContentForm.Body>
            {/* Shift form inputs */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 space-y-4">
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
                <Label htmlFor="start-time">Start Time</Label>
                <Input
                  id="start-time"
                  type="time"
                  className="mt-1"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="end-time">End Time</Label>
                <Input
                  id="end-time"
                  type="time"
                  className="mt-1"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                />
              </div>
            </div>

            {/* Assign Users */}
            <div className="mt-4">
              <Label>Assign Users</Label>
              <ScrollArea className="h-68 mt-2 rounded-md border border-zinc-100 p-4 overflow-auto" type="always">
                {/* Header Search + Tabs + Filter */}
                <div className="mb-6 flex items-center justify-between">
                  <Input
                    id="search-user"
                    type="text"
                    className="max-w-sm border-zinc-200"
                    placeholder="Search by name or email..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />

                  <div className="flex items-center space-x-2">
                    {/* Tabs */}
                    <div className="flex bg-zinc-100 rounded-lg p-1 ">
                      <Button
                        type="button"
                        size="sm"
                        variant={sortOrder === "newest" ? "secondary" : "ghost"}
                        onClick={() => setSortOrder("newest")}
                        className="rounded-l-lg px-3 py-1 font-medium focus:ring-0 focus:outline-none"
                      >
                        Newest
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant={sortOrder === "oldest" ? "secondary" : "ghost"}
                        onClick={() => setSortOrder("oldest")}
                        className="rounded-r-lg px-3 py-1 font-medium focus:ring-0 focus:outline-none"
                      >
                        Oldest
                      </Button>
                    </div>

                    {/* Filter - nanti diisi */}
                    <Select>
                      <SelectTrigger className="w-[120px]">
                        <SelectValue placeholder="Filter" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Users list */}
                <div className="space-y-2">
                  {processedUsers.length === 0 && (
                    <p className="text-sm text-center text-zinc-600">
                      No users found
                    </p>
                  )}

                  {processedUsers.map((user) => (
                    <Label key={user.id} htmlFor={`user-${user.id}`}
                      className="group flex items-center space-x-2 border border-zinc-200 shadow-xs rounded-lg p-2 cursor-pointer hover:bg-zinc-50 transition"
                    >
                      <Checkbox id={`user-${user.id}`} checked={selectedUsers.includes(user.id)} onCheckedChange={() => toggleUser(user.id)}
                        className="size-4 rounded-md border-zinc-300"
                      />
                      <div className="bg-zinc-100 group-hover:bg-sky-100 text-zinc-400 group-hover:text-sky-400 p-2 rounded-full shrink-0">
                        <CircleUser strokeWidth={1} />
                      </div>

                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-zinc-700">
                          {user.name}
                        </span>
                        <span className="text-xs text-zinc-500">
                          {user.email}
                        </span>
                      </div>
                    </Label>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </ContentForm.Body>

          <ContentForm.Footer>
            <div className="space-x-2">
              <Button type="button" variant="outline">
                Cancel
              </Button>
              <Button type="submit">Create Shift</Button>
            </div>
          </ContentForm.Footer>
        </form>
      </ContentForm>
    </section>
  );
}
