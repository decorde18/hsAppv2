import React, { useEffect, useState } from 'react';

import supabase from './supabase';

import { gapi } from 'gapi-script';
import { addDays } from '../utils/helpers';

const calendarId = {
  ihsSoccer: '6urfeejbvf98os9r16sf94eqdc@group.calendar.google.com',
  Varsity: 'unf92gqn4d6h2hpo4a7hgu26bo@group.calendar.google.com',
  JV: 'pm01daa6v3kosk9a43c88v2epo@group.calendar.google.com',
};

export async function getCalendar(newEvent) {
  try {
    const calendar = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/${
        calendarId[newEvent.calendar]
      }`,
      { method: 'GET' }
    ).then((data) => data.json().then((data) => data));
    return calendar;
  } catch (error) {
    console.log(error);
  }
  return {};
}
export async function createEditGoogleCalendarEvent(newEvent, edit) {
  const { startDateTime, endDateTime, allDay, calendar, calId } = newEvent;
  const { data: session, error } = await supabase.auth.getSession();
  const googleProviderToken = session.session.provider_token;

  const start = !allDay && startDateTime;
  const end = !allDay && endDateTime;
  const startDate = allDay && startDateTime.split('T')[0];
  const endDate = allDay && addDays(endDateTime.split('T')[0], 1);

  const event = {
    summary: newEvent.summary,
    description: newEvent.description,
    location: newEvent.location,
    ...(start && {
      start: {
        dateTime: start,
        timeZone: 'America/Chicago',
      },
      end: {
        dateTime: end,
        timeZone: 'America/Chicago',
      },
    }),
    ...(!start && {
      start: {
        date: startDate,
      },
      end: {
        date: endDate,
      },
    }),
  };

  try {
    return await fetch(
      edit
        ? `https://www.googleapis.com/calendar/v3/calendars/${calendarId[calendar]}/events/${calId}`
        : `https://www.googleapis.com/calendar/v3/calendars/${
            calendarId[newEvent.calendar]
          }/events`,
      {
        method: edit ? 'PUT' : 'POST',
        headers: {
          Authorization: 'Bearer ' + googleProviderToken,
        },
        body: JSON.stringify(event),
      }
    )
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else
          console.log(
            `Calendar entry Could Not Be ${edit ? 'Edited' : 'Created'}`
          );
      })
      .then((data) => {
        return data;
      });
  } catch (error) {
    console.error('Promise rejected');
  }
}
export async function createEditGoogleCalendarGame(newEvent, edit) {
  const { start, end, date, calendar, calId } = newEvent;

  const { data: session, error } = await supabase.auth.getSession();
  const googleProviderToken = session.session.provider_token;

  const event = {
    summary: `${newEvent.opponent} (${newEvent.gameType})`,
    description: newEvent.comment,

    location: newEvent.location,
    ...(start && {
      start: {
        dateTime: start,
        timeZone: 'America/Chicago',
      },
      end: {
        dateTime: end,
        timeZone: 'America/Chicago',
      },
    }),
    ...(!start && {
      start: {
        date,
      },
      end: {
        date,
      },
    }),
  };
  try {
    return await fetch(
      edit
        ? `https://www.googleapis.com/calendar/v3/calendars/${calendarId[calendar]}/events/${calId}`
        : `https://www.googleapis.com/calendar/v3/calendars/${
            calendarId[newEvent.calendar]
          }/events`,
      {
        method: edit ? 'PUT' : 'POST',
        headers: {
          Authorization: 'Bearer ' + googleProviderToken,
        },
        body: JSON.stringify(event),
      }
    )
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else
          console.log(
            `Calendar entry Could Not Be ${edit ? 'Edited' : 'Created'}`
          );
      })
      .then((data) => {
        return data;
      });
  } catch (error) {
    console.error('Promise rejected');
  }
}

export async function deleteGoogleCalendarEvent(calendar, calId) {
  const { data: session, error } = await supabase.auth.getSession();

  const googleProviderToken = session.session.provider_token;
  try {
    const { error } = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/${calendarId[calendar]}/events/${calId}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: 'Bearer ' + googleProviderToken,
        },
      }
    );
  } catch (error) {
    console.log(error);
  }
  return null;
}
