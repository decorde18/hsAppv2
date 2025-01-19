import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid'; // a plugin!

export default function CalendarFull({
  initialView = 'dayGridMonth',
  weekends,
  events,
  headerToolbar,
}) {
  return (
    <FullCalendar
      plugins={[dayGridPlugin]}
      initialView={initialView}
      weekends={weekends}
      events={events}
      headerToolbar={headerToolbar}
    />
  );
}
