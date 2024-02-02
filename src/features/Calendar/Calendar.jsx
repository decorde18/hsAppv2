import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useGamesSeason } from '../games/useGames';
import { useEvents } from '../events/useEvents';
import { useCurrentSeason } from '../../contexts/CurrentSeasonContext';
import Spinner from '../../ui/Spinner';

const CalendarDiv = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  overflow-y: auto;
  width: 55%;
  padding: 0.6rem;
`;
const Div = styled.div`
  display: block;
  width: 100px;
  height: 100px;
  padding: 5px;
  border: 1px solid blue;
`;
const DivDesc = styled.div`
  font-size: 1rem;
`;
function Calendar({ startDate, endDate }) {
  const { currentSeason } = useCurrentSeason();

  const { isLoadingGamesSeason, gamesSeason } = useGamesSeason(currentSeason);
  const { isLoadingEvents, events } = useEvents(currentSeason);
  const isLoading = isLoadingEvents || isLoadingGamesSeason;
  function calendar(start, end) {
    //calendar builder
    start = new Date(start);
    end = new Date(end);
    const numberOfDays = Math.round((end - start) / (1000 * 3600 * 24)) + 1; //count days needed
    const dateArray = Array(numberOfDays) //create array with the dates needed
      .fill()
      .map((_, i) => new Date(new Date(start).setDate(start.getDate() + i)));
    const allDates = dateArray.map((date) => {
      //make the date arry into object of months, days, day
      return {
        date: date.setHours(0, 0, 0, 0),
        weekDay: date.getDay(),
        shortDate: new Intl.DateTimeFormat(['en-US', 'id']).format(
          date.setDate(date.getDate())
        ),
        day: date.getDate(),
      };
    });
    const games = gamesSeason.map((calEvent) => {
      //get games
      const date = new Date(
        new Date(calEvent.date).getTime() +
          new Date(calEvent.date).getTimezoneOffset() * 60000
      );
      return {
        ...calEvent,
        date: date.setHours(0, 0, 0, 0),
      };
    });
    const calEvents = events.map((calEvent) => {
      //get events
      const startDate = new Date(calEvent.startDateTime);
      const endDate = new Date(calEvent.endDateTime);
      return {
        ...calEvent,
        startDate: startDate.setHours(0, 0, 0, 0),
        endDate: endDate.setHours(0, 0, 0, 0),
      };
    });

    const dates = allDates.map((day) => {
      //
      return {
        ...day,
        eventsStart: calEvents.filter((event) => day.date === event.startDate),
        eventsEnd: calEvents.filter((event) => day.date === event.endDate),
        games: games.filter((game) => day.date === game.date),
      };
    });

    if (isLoading) return <Spinner />;
    const empty = Array(dates[0].weekDay)
      .fill()
      .map((_, i) => {
        return <Div key={`empty${i}`}></Div>;
      });
    const cal = dates.map((date) => {
      return (
        <Div key={`date${date.date}`}>
          <div>{date.day}</div>
          {date.eventsStart.length > 0 &&
            date.eventsStart.map((event) => {
              return (
                <DivDesc key={`${event.id}event`}>{`${
                  event.startDate && event.summary
                } begins`}</DivDesc>
              );
            })}
          {date.eventsEnd.length > 0 &&
            date.eventsEnd.map((event) => {
              return (
                <DivDesc key={`${event.id}event`}>{`${
                  event.endDate && event.summary
                } ends`}</DivDesc>
              );
            })}
          {date.games.length > 0 &&
            date.games.map((type) => {
              return (
                <DivDesc key={`${type.id}game`}>
                  {type.teamType} - {type.schools.short_name}
                </DivDesc>
              );
            })}
        </Div>
      );
    });
    return (
      <>
        {empty}
        {cal}
      </>
    );
  }

  return (
    <CalendarDiv>
      <div>Sun</div>
      <div>Mon</div>
      <div>Tue</div>
      <div>Wed</div>
      <div>Thur</div>
      <div>Fri</div>
      <div>Sat</div>
      {calendar(startDate, endDate)}
    </CalendarDiv>
  );
}

export default Calendar;
