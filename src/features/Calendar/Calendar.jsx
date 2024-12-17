import styled from 'styled-components';
import { useCurrentSeason } from '../../contexts/CurrentSeasonContext';
import Spinner from '../../ui/Spinner';
import { useData } from '../../services/useUniversal';

// Styled Components
const CalendarDiv = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  overflow-y: auto;
  width: 100%;
  max-width: 80rem;
  padding: 1rem;
  gap: 0.5rem;

  @media (max-width: 60rem) {
    grid-template-columns: repeat(3, 1fr);
    font-size: 0.8rem;
  }
`;

const DayCell = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  border: 1px solid var(--color-grey-50);
  padding: 0.5rem;
  background-color: ${(props) =>
    props.isCurrentDay ? 'var(--color-brand-50: ' : 'white'};
`;
const PlaceholderCell = styled.div`
  visibility: hidden;
`;
const Event = styled.div`
  font-size: 0.9rem;
  margin-top: 0.3rem;
  color: ${(props) =>
    props.type === 'game'
      ? 'var(--color-brand-500)'
      : 'var(--color-green-700)'};
`;

// Helper Functions
const buildDateArray = (start, end) => {
  const startDate = new Date(start);
  const endDate = new Date(end);
  const days = Math.round((endDate - startDate) / (1000 * 3600 * 24)) + 1;

  return Array.from({ length: days }, (_, i) => {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);
    return {
      date: date.setHours(0, 0, 0, 0),
      day: date.getDate(),
      weekDay: date.getDay(),
    };
  });
};

const processEvents = (data, type) =>
  data.map((item) => ({
    ...item,
    date: new Date(item.date).setHours(0, 0, 0, 0),
    type,
  }));

const groupEventsByDate = (dates, events, games) =>
  dates.map((day) => ({
    ...day,
    events: events.filter((event) => event.date === day.date),
    games: games.filter((game) => game.date === day.date),
  }));

// Calendar Component
function Calendar({ startDate, endDate }) {
  const { currentSeason } = useCurrentSeason();
  const { isLoading: isLoadingGames, data: gamesSeason } = useData({
    table: 'games',
    filter: [{ field: 'seasonId', value: currentSeason.id }],
  });
  const { isLoading: isLoadingEvents, data: events } = useData({
    table: 'calendarEvents',
    filter: [{ field: 'season', value: currentSeason.id }],
  });

  if (isLoadingGames || isLoadingEvents) return <Spinner />;

  const dates = buildDateArray(startDate, endDate);
  const games = processEvents(gamesSeason, 'game');
  const calendarEvents = processEvents(events, 'event');
  const groupedDates = groupEventsByDate(dates, calendarEvents, games);

  // Add placeholders for the first week to align days correctly
  const firstDayOfWeek = groupedDates[0]?.weekDay || 0;
  const placeholderDays = Array.from({ length: firstDayOfWeek }, (_, i) => (
    <PlaceholderCell key={`placeholder-${i}`} />
  ));

  return (
    <CalendarDiv>
      {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
        <div key={day} style={{ textAlign: 'center', fontWeight: 'bold' }}>
          {day}
        </div>
      ))}
      {placeholderDays}
      {groupedDates.map((date) => (
        <DayCell
          key={date.date}
          isCurrentDay={date.date === new Date().setHours(0, 0, 0, 0)}
        >
          <div>{date.day}</div>
          {date.events.map((event) => (
            <Event key={event.id} type="event">
              {event.summary} (Start)
            </Event>
          ))}
          {date.games.map((game) => (
            <Event key={game.id} type="game">
              {game.teamType} - {game.short_name}
            </Event>
          ))}
        </DayCell>
      ))}
    </CalendarDiv>
  );
}

export default Calendar;
