"use client";

import { useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Label } from "@/components/ui/Label";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/Select";
import { ScrollArea } from "@/components/ui/Scroll-area";

import { DashboardHeader } from "../../DashboardHeader";
import ContentForm from "@/components/content/ContentForm";
import { ContentInformation } from "@/components/content/ContentInformation";
import { ContentList } from "@/components/content/ContentList";

import { fetch } from "@/function/helpers/fetch";
import { capitalize } from "@/function/globalFunction";
import { defaultShifts } from "@/constants/shiftConstants";
import { roleStyles } from "@/constants/roleStyles";

export default function CreateForm({ users, shifts }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    title: "", description: "",
    frequency: "ONCE",
    startDate: "", endDate: "",
    shiftId: "", userIds: [],
  });

  const handleChange = useCallback((field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  }, []);

  const toggleUser = useCallback((id) => {
    setForm((prev) => {
      const exists = prev.userIds.includes(id);
      return {...prev,
        userIds: exists ? prev.userIds.filter((u) => u !== id)
          : [...prev.userIds, id],
      };
    });
  }, []);

  const setAllUsers = useCallback(() => {
    setForm((prev) => ({ ...prev, userIds: users.map((u) => u.id) }));
  }, [users]);

  const clearUsers = useCallback(() => {
    setForm((prev) => ({ ...prev, userIds: [] }));
  }, []);

  const handleSubmit = async (e) => {e.preventDefault();
    if (!form.title.trim() || !form.description.trim() || form.userIds.length === 0) {
      toast.error("Please fill all required fields");
      return;
    }

    setLoading(true);
    try {
      await fetch({
        url: "/schedules", method: "post", data: form,
        successMessage: "Schedule created successfully",
        errorMessage: "Failed to create schedule",
        onSuccess: () => {
          setForm({
            title: "", description: "",
            startDate: "", endDate: "",
            shiftId: "", userIds: [],
            frequency: "ONCE",
          });
          router.push("/admin/dashboard/schedules");
        },
      });
    } finally {
      setLoading(false);
    }
  };

  const uniqueShifts = useMemo(() => {
    const seenTypes = new Set();
    const result = [];

    shifts.forEach((shift) => {
      if (!seenTypes.has(shift.type) && ["MORNING", "AFTERNOON", "EVENING", "OFF"].includes(shift.type)) {
        seenTypes.add(shift.type);
        result.push(shift);
      } else {
        // sisanya dianggap custom → pakai shiftName
        result.push({ ...shift, isCustom: true });
      }
    });

    return result;
  }, [shifts]);



  const memoizedUsers = useMemo(() => users, [users]);

  return (
    <section className="space-y-6">
      <DashboardHeader
        title="Create Schedule"
        subtitle="Insert Schedule data on this field below"
      />

      <ContentForm>
        <form onSubmit={handleSubmit}>
          <ContentForm.Header>
            <ContentInformation
              heading="Schedule Form"
              subheading="Fill in all required fields below"
            />
          </ContentForm.Header>

          <ContentForm.Body>
            <section className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input id="title" value={form.title} onChange={(e) => handleChange("title", e.target.value)}
                    placeholder="Enter schedule title"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Input id="description" value={form.description} onChange={(e) => handleChange("description", e.target.value)}
                    placeholder="Enter schedule description"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="frequency">Select Frequency</Label>
                <Select value={form.frequency} onValueChange={(value) => handleChange("frequency", value)}>
                  <SelectTrigger id="frequency" className="w-full mt-1">
                    <SelectValue placeholder="Select Frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DAILY">Daily</SelectItem>
                    <SelectItem value="WEEKLY">Weekly</SelectItem>
                    <SelectItem value="MONTHLY">Monthly</SelectItem>
                    <SelectItem value="YEARLY">Yearly</SelectItem>
                    <SelectItem value="ONCE">Once</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input id="startDate" type="datetime-local"
                    value={form.startDate}
                    onChange={(e) => handleChange("startDate", e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="endDate">End Date</Label>
                  <Input id="endDate" type="datetime-local"
                    value={form.endDate}
                    onChange={(e) => handleChange("endDate", e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <Label htmlFor="shift">Select Shift</Label>
                <Select value={form.shiftId} onValueChange={(val) => handleChange("shiftId", val)}>
                  <SelectTrigger id="shift" className="w-full mt-1">
                    <SelectValue placeholder="Choose a shift" />
                  </SelectTrigger>
                  <SelectContent>
                    <div className="grid grid-cols-4 gap-2 p-2">
                      {uniqueShifts.map((shift) => (
                        <SelectItem key={shift.id} value={shift.id.toString()}
                          className="flex items-center justify-start 
                            border-1 border-dashed border-zinc-200 hover:border-sky-300 hover:border-solid rounded-lg
                            px-2 py-1.5 focus:text-sky-700 focus:bg-sky-100 "
                          >
                          {shift.isCustom ? shift.shiftName : capitalize(shift.type)}
                        </SelectItem>
                      ))}
                    </div>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Assign Users</Label>
                  <div className="flex gap-2">
                    <Button type="button" variant="outline" size="sm" onClick={setAllUsers}>
                      Assign all users
                    </Button>
                    <Button type="button" variant="outline" size="sm" className="text-red-500 hover:text-red-600" onClick={clearUsers}
                      disabled={form.userIds.length === 0}  
                    >
                      Clear all
                    </Button>
                  </div>
                </div>

                <ScrollArea className="h-64 w-full border border-zinc-100 rounded-lg p-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {memoizedUsers.map((user) => {
                      const isSelected = form.userIds.includes(user.id);
                      return (
                        <Card key={user.id}
                          className={`p-3 cursor-pointer transition border shadow-xs ${isSelected ? "border-zinc-300"
                            : "hover:border-zinc-200 border-zinc-100"
                            }`} onClick={() => toggleUser(user.id)}
                        >
                          <div>
                            <div className="flex items-center space-x-2">
                              <p className="text-sm font-medium text-zinc-600">{user.name}</p>
                              <Badge className={`text-xs text-zinc-400 bg-none border-none ${roleStyles[capitalize(user.role)]}`}>
                                {capitalize(user.role)}
                              </Badge>
                            </div>
                            <p className="text-xs text-zinc-500">{user.email}</p>
                          </div>
                        </Card>
                      );
                    })}
                  </div>
                </ScrollArea>
              </div>
            </section>
          </ContentForm.Body>

          <ContentForm.Footer>
            <div className="flex items-center space-x-2">
              <Button type="button" variant="outline"
                onClick={() => router.back()}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Saving..." : "Save Schedule"}
              </Button>
            </div>
          </ContentForm.Footer>
        </form>
      </ContentForm>
    </section>
  );
}
