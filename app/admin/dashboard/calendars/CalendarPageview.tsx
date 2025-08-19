"use client";

import { useState } from "react";
import { toast, Toaster } from "sonner";

import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { DashboardHeader } from "../DashboardHeader";
import { Calendar } from "./Calendar";
import { CalendarsModal } from "./CalendarsModal";

import { api } from "@/lib/api";
import { Schedule } from "@/static/types/Schedule";
import { Clock } from 'lucide-react';

export default function CalendarPageview({ initialEvents }: { initialEvents: any[] }) {
  const [events, setEvents] = useState(initialEvents);
  const [selectedEvent, setSelectedEvent] = useState<Schedule | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({ title: "", description: "", date: "" });

  const fetchSchedules = async () => {
    try { setIsLoading(true);
      const { data } = await api.get<Schedule[]>("/schedules");
      setEvents(
        data.map((item) => {
          const dateStr = typeof item.date === "string"
            ? item.date
            : item.date.toISOString();

          return {
            id: item.id.toString(),
            title: item.title,
            description: item.description,
            date: dateStr.split("T")[0],
            backgroundColor: "#0070f3",
            borderColor: "#0070f3",
            textColor: "#ffffff",
          };
        })
      );

    }
    catch {
      toast.error("Failed to load schedules");
    }
    finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!formData.title.trim()) {
      toast.error("Please enter a title");
      return;
    }
    try { setIsLoading(true);
      if (selectedEvent) { await api.put(`/schedules/${selectedEvent.id}`, formData);
      } else {
        await api.post("/schedules", formData) 
      }
      await fetchSchedules();
      setIsModalOpen(false);
      setFormData({ title: "", description: "", date: "" });
      setSelectedEvent(null);
      toast.success(selectedEvent ? "Updated" : "Created");
    }
    catch {
      toast.error("Failed to save schedule");
    }
    finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <div className="container mx-auto space-y-6">
        <DashboardHeader title="Calendars" subtitle="List events or schedules in calendar grid" />
        <Card>
          <CardHeader className="flex items-center justify-between">
            <div>
              <CardTitle>Calendar grid</CardTitle>
              <CardDescription>Click date to add new event or schedules</CardDescription>

              <div className="flex items-center space-x-2 mt-4">
                <div className="flex items-center space-x-2 bg-purple-50 border border-purple-100 px-2 py-0.5 rounded-full">
                  <Clock className="bg-purple-500/50 text-transparent p-[2px] rounded-md" size={13}/>
                  <span className="text-purple-700 text-sm font-base">Night</span>
                </div>
                <div className="flex items-center space-x-2 bg-orange-50 border border-orange-100 px-2 py-0.5 rounded-full">
                  <Clock className="bg-orange-500/50 text-transparent p-[2px] rounded-md" size={13}/>
                  <span className="text-orange-700 text-sm font-base">Afternoon</span>
                </div>
                <div className="flex items-center space-x-2 bg-yellow-50 border border-yellow-100 px-2 py-0.5 rounded-full">
                  <Clock className="bg-yellow-500/50 text-transparent p-[2px] rounded-md" size={13}/>
                  <span className="text-yellow-700 text-sm font-base">Morning</span>
                </div>
                <div className="flex items-center space-x-2 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-full">
                  <Clock className="bg-blue-500/50 text-transparent p-[2px] rounded-md" size={13}/>
                  <span className="text-blue-700 text-sm font-base">Another</span>
                </div>
              </div>

            </div>
            <Button size="sm" onClick={() => { setFormData({
                title: "",
                description: "",
                date: new Date().toISOString().split("T")[0]
              });
              setSelectedEvent(null);
              setIsModalOpen(true);
            }}>
              Add Event
            </Button>
          </CardHeader>
          <CardContent>
            <Calendar events={events} 
              onDateClick={(info) => {
                setFormData({ title: "", description: "", date: info.dateStr });
                setSelectedEvent(null);
                setIsModalOpen(true);
              }}
              onEditEvent={(info) => {
                setFormData({ title: info.event.title, description: info.event.extendedProps.description ?? "", date: info.event.startStr });
                setSelectedEvent({
                  id: parseInt(info.event.id), title: info.event.title, description: info.event.extendedProps.description ?? "",
                  date: info.event.startStr,
                  userId: 0, shiftId: 0,
                  createdAt: new Date().toISOString(), updatedAt: new Date().toISOString()
                });
                setIsModalOpen(true);
              }}
              onDeleteEvent={async (id) => {
                setIsLoading(true);
                try { await api.delete(`/schedules/${id}`); await fetchSchedules();
                  toast.success("Deleted");
                }
                catch { toast.error("Failed to delete");
                }
                finally { setIsLoading(false);
                }
              }}
            />
          </CardContent>
        </Card>
        <CalendarsModal open={isModalOpen} loading={isLoading} formData={formData} selectedEvent={selectedEvent}
          onClose={() => setIsModalOpen(false)}
          onChange={(field, value) => setFormData({ ...formData, [field]: value })}
          onSave={handleSave}
        />
      </div>
      <Toaster position="top-right" richColors closeButton />
    </div>
  );
}
