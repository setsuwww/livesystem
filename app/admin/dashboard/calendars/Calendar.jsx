import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { EventInput } from "@fullcalendar/core";
import { CalendarsActionButton } from "./CalendarsActionButton";
import dayjs from "dayjs";
import "@/styles/calendars.css";

export function Calendar({
  events,
  onDateClick,
  onEditEvent,
  onDeleteEvent
}) {
  return (
    <FullCalendar plugins={[dayGridPlugin, interactionPlugin]} initialView="dayGridMonth" height="auto" selectable
      dateClick={onDateClick} events={events}
      dayMaxEvents={3}
      moreLinkClick="popover"
      moreLinkContent={(args) => {
        return {
          html: `<div class="mt-0.5">
            <span class="px-2 py-1 bg-neutral-800 text-white rounded-md text-xs transition">
              +${args.num} more
            </span>
          </div>`
        };
      }}
      headerToolbar={{
        left: "prev,next today",
        center: "title",
        right: "dayGridYear,dayGridMonth,dayGridWeek,dayGridDay",
      }} eventContent={(eventInfo) => (
        <div className="flex items-center justify-between border border-neutral-200 shadow-sm w-full rounded-lg bg-white p-2 hover:border-neutral-300 transition">
          <p className="flex flex-col truncate font-medium">
            <span className="text-sm text-neutral-700">{eventInfo.event.title}</span>
            <span className="text-xs text-neutral-400">{eventInfo.event.extendedProps.description}</span>
          </p>
          <CalendarsActionButton
            onEdit={() => onEditEvent(eventInfo)}
            onDelete={() => onDeleteEvent(eventInfo.event.id)}
          />
        </div>
      )} eventClassNames="!bg-transparent !border-0 !p-0"
      dayHeaderClassNames="text-sm text-neutral-600 p-2"
      dayHeaderFormat={{ weekday: 'long' }}
      dayCellClassNames={(arg) => {
        if (dayjs(arg.date).isSame(dayjs(), "day")) {
          return "!bg-sky-200 today-highlight";
        }
        return "border border-neutral-200";
      }}
      eventDisplay="block"
    />
  );
}