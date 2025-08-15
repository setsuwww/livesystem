import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { EventInput } from "@fullcalendar/core";
import { CalendarsActionButton } from "./CalendarsActionButton";
import dayjs from "dayjs";
import "@/styles/calendars.css";

interface Props {
  events: EventInput[];
  onDateClick: (info: any) => void;
  onEditEvent: (info: any) => void;
  onDeleteEvent: (id: string) => void;
}

export function Calendar({ events, onDateClick, onEditEvent, onDeleteEvent }: Props) {
  return (
    <FullCalendar plugins={[dayGridPlugin, interactionPlugin]} initialView="dayGridMonth" height="auto" selectable
      dateClick={onDateClick} events={events}
      dayMaxEvents={3}
      moreLinkClick="popover"
      headerToolbar={{
        left: "prev,next today",
        center: "title",
        right: "dayGridYear,dayGridMonth,dayGridWeek",
      }} eventContent={(eventInfo) => (
        <div className="flex items-center justify-between border border-gray-200 shadow-sm w-full rounded-lg bg-white px-2 py-2 hover:border-gray-300 transition">
          <p className="flex flex-col truncate font-medium">
            <span className="text-sm text-gray-800">{eventInfo.event.title}</span>
            <span className="text-xs text-gray-400">{eventInfo.event.extendedProps.description}</span>
          </p>
          <CalendarsActionButton
            onEdit={() => onEditEvent(eventInfo)}
            onDelete={() => onDeleteEvent(eventInfo.event.id)}
          />
        </div>
      )} eventClassNames="!bg-transparent !border-0 !p-0"
      dayHeaderClassNames="text-sm text-gray-600 p-2"
      dayHeaderFormat={{ weekday: 'long' }}
      dayCellClassNames={(arg) => {
        if (dayjs(arg.date).isSame(dayjs(), "day")) {
          return "!bg-sky-200 !border-sky-300 today-highlight";
        }
        return "border border-gray-200";
      }}
      eventDisplay="block"
    />
  );
}