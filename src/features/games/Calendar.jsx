import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useGamesSeason } from './useGames';
import { useCurrentSeason } from '../../contexts/CurrentSeasonContext';

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

  function calendar(start, end) {
    const startD = new Date(start);
    end = new Date(end);
    const numberOfDays = Math.round((end - startD) / (1000 * 3600 * 24)) + 1;
    const dateArray = Array(numberOfDays)
      .fill()
      .map((_, i) => new Date(new Date(startD).setDate(startD.getDate() + i)));
    const allDates = dateArray.map((date) => {
      return {
        date: date.setHours(0, 0, 0, 0),
        weekDay: date.getDay(),
        shortDate: new Intl.DateTimeFormat(['en-US', 'id']).format(
          date.setDate(date.getDate())
        ),
        day: date.getDate(),
      };
    });
    const games = gamesSeason.map((game) => {
      const date = new Date(
        new Date(game.date).getTime() +
          new Date(game.date).getTimezoneOffset() * 60000
      );
      return {
        ...game,
        date: date.setHours(0, 0, 0, 0),
      };
    });
    const dates = allDates.map((day) => {
      return { ...day, games: games.filter((game) => day.date === game.date) };
    });
    const empty = Array(dates[0].weekDay)
      .fill()
      .map((_, i) => {
        return <Div key={`empty${i}`}></Div>;
      });
    const cal = dates.map((date) => {
      return (
        <Div key={`date${date.date}`}>
          <div>{date.day}</div>
          {date.games.length > 0 &&
            date.games.map((type) => {
              return (
                <DivDesc key={type.id}>
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
  if (isLoadingGamesSeason) return <></>;

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
