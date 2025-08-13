"use client";

import { Edit, Trash2, Plus } from 'lucide-react';
import { useState, useEffect } from "react";

import '@/styles/calendars.css'
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { EventInput } from "@fullcalendar/core";

import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/badge";
import { toast, Toaster } from "sonner";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/api";

import { DashboardHeader } from '../DashboardHeader';

interface Schedule {
  id: number;
  title: string;
  date: string;
  userId: number;
  createdAt: string;
  updatedAt: string;
}

export default function SchedulePage() {
  const [events, setEvents] = useState<EventInput[]>([]);
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
    } catch (error) {
      console.error("Failed to fetch schedules", error);
      toast.error("Failed to load schedules. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSchedules();
  }, []);

  const handleDateClick = (info: any) => {
    setFormData({ title: "", date: info.dateStr });
    setSelectedEvent(null);
    setIsModalOpen(true);
  };

  const handleEventClick = (clickInfo: any) => {
    const event = events.find(e => e.id === clickInfo.event.id);
    if (event) {
      setFormData({
        title: clickInfo.event.title,
        date: clickInfo.event.startStr,
      });
      setSelectedEvent({
        id: parseInt(clickInfo.event.id),
        title: clickInfo.event.title,
        date: clickInfo.event.startStr,
        userId: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      setIsModalOpen(true);
    }
  };

  const handleSave = async () => {
    if (!formData.title.trim()) {
      toast.error("Please enter a title for the event.");
      return;
    }

    try {
      setIsLoading(true);
      if (selectedEvent) {
        await api.put(`/schedules/${selectedEvent.id}`, formData);
      } else {
        await api.post("/schedules", { ...formData, userId: 1 });
      }
      await fetchSchedules();
      setIsModalOpen(false);
      setFormData({ title: "", date: "" });
      setSelectedEvent(null);
      toast.success(selectedEvent ? "Schedule updated successfully!" : "Schedule created successfully!");
    } catch (error) {
      console.error("Failed to save schedule", error);
      toast.error("Failed to save schedule. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setIsLoading(true);
      await api.delete(`/schedules/${id}`);
      await fetchSchedules();
      toast.success("Schedule deleted successfully!");
    } catch (error) {
      console.error("Failed to delete schedule", error);
      toast.error("Failed to delete schedule. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const renderEventContent = (eventInfo: any) => (
    <div className="flex items-center justify-between w-full">
      <span className="truncate text-sm font-medium text-white mr-24">
        {eventInfo.event.title}
      </span>

      <div className="flex items-center gap-1">
        <Button
          variant="custom"
          className="bg-white text-blue-500 hover:bg-blue-100 h-6 w-6 p-0 flex items-center justify-center rounded"
          onClick={(e) => {
            e.stopPropagation();
            handleEventClick(eventInfo);
          }}
        >
          <Edit className="h-4 w-4" />
        </Button>

        <Button
          variant="custom"
          className="bg-white text-red-500 hover:bg-red-100 h-6 w-6 p-0 flex items-center justify-center rounded"
          onClick={(e) => {
            e.stopPropagation();
            handleDelete(eventInfo.event.id);
          }}
        >
          <Trash2 className="h-4 w-4" />
        </Button>

      </div>
    </div>
  );

  return (
    <div className="min-h-screen">
      <div className="container mx-auto space-y-6">
        {/* Header */}
        <DashboardHeader title='Calendar' subtitle='Manage and view all schedules, evetns date here' />

        {/* Calendar */}
        <Card>
          <CardHeader className='flex items-center justify-between'>
            <div>
              <CardTitle>Calendar View</CardTitle>
              <CardDescription>
                Click on any date to add an event, or click on existing events to edit them
              </CardDescription>
            </div>
            <Button variant='primary' onClick={() => {
              setFormData({ title: "", date: new Date().toISOString().split('T')[0] });
              setSelectedEvent(null);
              setIsModalOpen(true);
            }}>
              <Plus className="h-4 w-4 mr-2" />
              Add Event
            </Button>
          </CardHeader>
          <CardContent>
            <FullCalendar
              plugins={[dayGridPlugin, interactionPlugin]}
              initialView="dayGridMonth"
              selectable={true}
              dateClick={handleDateClick}
              eventClick={handleEventClick}
              events={events}
              height="auto"
              eventContent={renderEventContent}
              dayMaxEvents={3}
              moreLinkClick="popover"
              headerToolbar={{
                left: "prev,next today",
                center: "title",
                right: "dayGridWeek,dayGridMonth",
              }}
              eventClassNames="group cursor-pointer hover:shadow-lg transition-shadow"
              dayCellClassNames="hover:bg-sky-50 transition-colors"
              eventDisplay="block"
            />
          </CardContent>
        </Card>

        {/* Modal */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="bg-white sm:max-w-[425px] border border-gray-300">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                {selectedEvent ? "Edit Event" : "Add New Event"}
              </DialogTitle>
              <DialogDescription>
                {selectedEvent
                  ? "Update the details of your event below."
                  : "Create a new event by filling out the form below."
                }
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Event Title</Label>
                <Input
                  id="title"
                  placeholder="Enter event title..."
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) =>
                    setFormData({ ...formData, date: e.target.value })
                  }
                />
              </div>
              {selectedEvent && (
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">
                    ID: {selectedEvent.id}
                  </Badge>
                  <Badge variant="outline">
                    Created: {new Date(selectedEvent.createdAt).toLocaleDateString()}
                  </Badge>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button variant='secondary'
                onClick={() => setIsModalOpen(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={isLoading}>
                {isLoading ? "Saving..." : selectedEvent ? "Update Event" : "Create Event"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <Toaster position="top-right" richColors closeButton />
    </div>
  );
}
