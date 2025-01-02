import CalendarFull from '../ui/CalendarFull';

function Test() {
  return (
    <CalendarFull
      initialView="dayGridMonth"
      weekends={true}
      events={[
        {
          title: 'event 1',
          start: '2024-12-01T12:05:00',
          end: '2024-12-02T14:05:00',
        },
        { title: 'event 2', date: '2024-12-02', time: '3:45 pm' },
      ]}
      headerToolbar={{
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,listWeek',
      }}
    />
  );
}

export default Test;
