"use client";

import { useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { CircleUserRound } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select";
import ContentForm from "@/components/content/ContentForm";
import { ContentInformation } from "@/components/content/ContentInformation";
import { Checkbox } from "@/components/ui/Checkbox";
import { ScrollArea } from "@/components/ui/Scroll-area";
import { Label } from "@/components/ui/Label";

import { fetch } from "@/function/helpers/fetch";
import { timeToInt } from "@/function/services/shiftAttendance";
import { ContentList } from "@/components/content/ContentList";

export default function CreateShiftForm({ users }) {
  const [type, setType] = useState("MORNING");
  const [shiftName, setShiftName] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const [sortOrder, setSortOrder] = useState("newest");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState("");

  const router = useRouter();

  const processedUsers = useMemo(() => {
    let result = [...users];

    if (search) { result = result.filter(
      (u) =>
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase())
      );
    }

    result.sort((a, b) => {
      const aDate = new Date(a.createdAt);
      const bDate = new Date(b.createdAt);

      return sortOrder === "newest"
        ? bDate - aDate
        : aDate - bDate;
    });

    return result;
  }, [users, search, sortOrder]);

  const toggleUser = useCallback(
    (id) => { setSelectedUsers((prev) =>
        prev.includes(id) ? prev.filter((u) => u !== id) : [...prev, id]
      );
    },
    []
  );

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      type, 
      shiftName,
      startTime: timeToInt(startTime), endTime: timeToInt(endTime),
      userIds: selectedUsers,
    };

    try { await fetch({ url: "/shifts", method: "post",
      data: payload,
      successMessage: "Shift created successfully!",
      errorMessage: "Failed to create shift",
      onSuccess: () => {
        setType("MORNING");
        setShiftName("");
        setStartTime("");
        setEndTime("");
        setSelectedUsers([]);
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
      <ContentForm>
        <form onSubmit={handleSubmit}>
          <ContentForm.Header>
            <ContentInformation
              heading="Create Shift"
              subheading="Create a new shift and assign users without changing their default shift"
            />
          </ContentForm.Header>

          <ContentForm.Body>
            {/* Shift form inputs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 space-y-4">
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

              <div>
                <Label htmlFor="start-time">Start Time<span className="text-red-500">*</span></Label>
                <Input id="start-time" value={startTime} onChange={(e) => setStartTime(e.target.value)}
                  type="time"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="end-time">End Time<span className="text-red-500">*</span></Label>
                <Input id="end-time" value={endTime} onChange={(e) => setEndTime(e.target.value)}
                  type="time"
                  className="mt-1"
                />
              </div>
            </div>

            <div className="mt-4">
              <Label>Assign Users</Label>
              <ScrollArea className="h-68 mt-2 rounded-md border border-zinc-100 p-4 overflow-auto" type="always">
                <div className="mb-6 flex items-center justify-between">
                  <Input id="search-user" placeholder="Search by name or email..." value={search} onChange={(e) => setSearch(e.target.value)}
                    type="text"
                    className="max-w-sm border-zinc-200"
                  />

                  <div className="flex items-center space-x-2">
                    <div className="flex bg-zinc-100 rounded-lg p-1 ">
                      <Button type="button" size="sm" variant={sortOrder === "newest" ? "secondary" : "ghost"}
                        onClick={() => setSortOrder("newest")}
                        className="rounded-l-lg text-sm px-3 py-1 font-medium focus:ring-0 focus:outline-none"
                      >
                        Newest
                      </Button>
                      <Button type="button" size="sm" variant={sortOrder === "oldest" ? "secondary" : "ghost"}
                        onClick={() => setSortOrder("oldest")}
                        className="rounded-r-lg text-sm px-3 py-1 font-medium focus:ring-0 focus:outline-none"
                      >
                        Oldest
                      </Button>
                    </div>

                    <Select>
                      <SelectTrigger>
                        <span className="font-semibold text-zinc-600 mr-1">Status:</span>
                        <SelectValue placeholder="All" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {processedUsers.length === 0 && (
                    <p className="text-sm text-center text-zinc-600">
                      No users found
                    </p>
                  )}

                  {processedUsers.map((user) => (
                    <Label key={user.id} htmlFor={`user-${user.id}`} className="group flex items-center space-x-2 border border-zinc-200 shadow-xs rounded-lg p-2 cursor-pointer hover:bg-zinc-50 transition-colors ease-in-out">
                      <Checkbox id={`user-${user.id}`} checked={selectedUsers.includes(user.id)} onCheckedChange={() => toggleUser(user.id)}
                        className="size-4 rounded-md border-zinc-300"
                      />
                      <div className="bg-zinc-100 group-hover:bg-sky-100 text-zinc-400 group-hover:text-sky-600 p-2 rounded-full shrink-0">
                        <CircleUserRound strokeWidth={1} />
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
              <Button size="lg" type="button" variant="outline">
                Cancel
              </Button>
              <Button size="lg" type="submit">Create Shift</Button>
            </div>
          </ContentForm.Footer>
        </form>
      </ContentForm>
    </section>
  );
}
