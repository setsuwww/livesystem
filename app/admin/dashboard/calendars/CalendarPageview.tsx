"use client";

import { useState } from "react";
import { toast, Toaster } from "sonner";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { DashboardHeader } from "../DashboardHeader";
import { api } from "@/lib/api";
import { Calendar } from "./Calendar";
import { CalendarsModal } from "./CalendarsModal";
import { Schedule } from "@/static/interfaces/Schedule";

export default function CalendarPagview({ initialEvents }: { initialEvents: any[] }) {
  const [events, setEvents] = useState(initialEvents);
  const [selectedEvent, setSelectedEvent] = useState<Schedule | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({ title: "", date: "" });

  const fetchSchedules = async () => {
    try {
      setIsLoading(true);
      const { data } = await api.get<Schedule[]>("/schedules");
      setEvents(
        data.map((item) => ({
          id: item.id.toString(),
          title: item.title,
          date: item.date.split("T")[0],
          backgroundColor: "#0070f3",
          borderColor: "#0070f3",
          textColor: "#ffffff"
        }))
      );
    } catch {
      toast.error("Failed to load schedules");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!formData.title.trim()) {
      toast.error("Please enter a title");
      return;
    }
    try {
      setIsLoading(true);
      if (selectedEvent) {
        await api.put(`/schedules/${selectedEvent.id}`, formData);
      } else {
        await api.post("/schedules", formData);
      }
      await fetchSchedules();
      setIsModalOpen(false);
      setFormData({ title: "", date: "" });
      setSelectedEvent(null);
      toast.success(selectedEvent ? "Updated" : "Created");
    } catch {
      toast.error("Failed to save schedule");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <div className="container mx-auto space-y-6">
        <DashboardHeader title="Calendar" subtitle="Manage schedules" />
        <Card>
          <CardHeader className="flex items-center justify-between">
            <div>
              <CardTitle>Calendar View</CardTitle>
              <CardDescription>Click date to add, click event to edit</CardDescription>
            </div>
            <Button
              onClick={() => {
                setFormData({ title: "", date: new Date().toISOString().split("T")[0] });
                setSelectedEvent(null);
                setIsModalOpen(true);
              }}
            >
              <Plus className="h-4 w-4 mr-2" /> Add Event
            </Button>
          </CardHeader>
          <CardContent>
            <Calendar
              events={events}
              onDateClick={(info) => {
                setFormData({ title: "", date: info.dateStr });
                setSelectedEvent(null);
                setIsModalOpen(true);
              }}
              onEditEvent={(info) => {
                setFormData({ title: info.event.title, date: info.event.startStr });
                setSelectedEvent({
                  id: parseInt(info.event.id),
                  title: info.event.title,
                  date: info.event.startStr,
                  userId: 0,
                  createdAt: new Date().toISOString(),
                  updatedAt: new Date().toISOString()
                });
                setIsModalOpen(true);
              }}
              onDeleteEvent={async (id) => {
                setIsLoading(true);
                try {
                  await api.delete(`/schedules/${id}`);
                  await fetchSchedules();
                  toast.success("Deleted");
                } catch {
                  toast.error("Failed to delete");
                } finally {
                  setIsLoading(false);
                }
              }}
            />
          </CardContent>
        </Card>
        <CalendarsModal
          open={isModalOpen}
          loading={isLoading}
          formData={formData}
          selectedEvent={selectedEvent}
          onClose={() => setIsModalOpen(false)}
          onChange={(field, value) => setFormData({ ...formData, [field]: value })}
          onSave={handleSave}
        />
      </div>
      <Toaster position="top-right" richColors closeButton />
    </div>
  );
}
