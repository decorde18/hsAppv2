import React, { useEffect, useState } from 'react';

import supabase from '../services/supabase';

import { gapi } from 'gapi-script';
// import Event from './components/Event.js';

const calendarId = {
  ihsSoccer: '6urfeejbvf98os9r16sf94eqdc@group.calendar.google.com',
  Varsity: 'unf92gqn4d6h2hpo4a7hgu26bo@group.calendar.google.com',
  JV: 'pm01daa6v3kosk9a43c88v2epo@group.calendar.google.com',
};
const googleProviderToken =
  'ya29.a0AfB_byAnKnIKuis5QAMS5xai8Z2wRJIa6wxH-SP638M549yR9oIi8MnnwqhlyA3OutkRM6u_vrHnHGqaHG-63XF-iEp3NAyEKcfQiceiWNz5dWWGsadGdNOMdo6LtCiA3RHfSwH8PHrcS-KZ1lrIydU0jS-1xmqs1RkaCgYKAYASARASFQHGX2Miu92oMg8fXKAechQZqbJUDA0170';
// THIS IS THE TOKEN I FIRST RECEIVED WHEN ADDING CALENDAR EVENTS.  IF IT STOPS WORKING, SEE Issues.md
export async function getCalendar() {
  return {};
}
export async function createCalendarEventApi(newEvent) {
  const event = {
    summary: `${newEvent.opponent} (${newEvent.gameType})`,
    description: newEvent.comment,
    start: {
      dateTime: newEvent.start,
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    },
    end: {
      dateTime: newEvent.end,
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    },
    location: newEvent.location,
  };
  const great = await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/${
      calendarId[newEvent.calendar]
    }/events`,
    {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + googleProviderToken,
      },
      body: JSON.stringify(event),
    }
  )
    .then((data) => {
      return data.json();
    })
    .then((data) => {
      return data;
    });
  return great;
}
// //** declare calendar instance */

// function gapiLoadCalendar() {
//   gapi.load('client', initiateCalendar);
// }
// initiateCalendar;
// function initiateCalendar() {
//   gapi.client.init({
//     apiKey: apiKey,
//   });
// }
// gapiLoadCalendar();
// export async function getCalendar({ filter, sortBy }) {
//   gapi.client.load('calendar', 'v3');

//   let response;

//   response = await gapi.client.request({
//     path: `https://www.googleapis.com/calendar/v3/calendars/${calendarID}/events`,
//     params: {
//       orderBr: 'startTime',
//       timeMax: '2023-12-31T08:00:00-05:00',
//       timeMin: '2023-01-01T08:00:00-05:00',
//     },
//   });

//   return response.result.items;
// }

// export async function getCalendar({ filter, sortBy }) {
//   const data = gapi.load('client', init);
//   async function init() {
//     await gapi.client.init({
//       apiKey: apiKey,
//     });
//     // .then(function () {
//     //   return gapi.client.request({
//     //     path: `https://www.googleapis.com/calendar/v3/calendars/${calendarID}/events`,
//     //   });
//     // });
//     await getEvents();
//   }
//   async function getEvents() {
//     try {
//       const events = await gapi.client.request({
//         path: `https://www.googleapis.com/calendar/v3/calendars/${calendarID}/events`,
//       });
//       return events.result.items;
//     } catch (e) {
//       console.log(e);
//     }
//     // .then(
//     //   (response) => {
//     //     const items = response.result.items;
//     //     return items;
//     //   },
//     //   function (err) {
//     //     return [false, err];
//     //   }
//     // );
//   }
//   console.log(data);
//   return data;
// }
// function Calendar() {
//   const [events, setEvents] = useState([]);
//   const getEvents = (calendarID, apiKey) => {
//     function initiate() {
//       gapi.client
//         .init({
//           apiKey: apiKey,
//         })
//         .then(function () {
//           return gapi.client.request({
//             path: `https://www.googleapis.com/calendar/v3/calendars/${calendarID}/events`,
//           });
//         })
//         .then(
//           (response) => {
//             let events = response.result.items;
//             setEvents(events);
//           },
//           function (err) {
//             return [false, err];
//           }
//         );
//     }
//     gapi.load('client', initiate);
//   };

//   useEffect(() => {
//     const events = getEvents(calendarID, apiKey);
//     setEvents(events);
//   }, []);
//   console.log(events);
// }
// const privateKey = CREDENTIALS.private_key.replace(/\\n/g, '\n');
// // const calendar = console.log(privateKey);
// const SCOPES = [
//   'https://www.googleapis.com/auth/calendar',
//   'https://www.googleapis.com/auth/calendar.events',
// ];
// const auth = new google.auth.JWT(
//   CREDENTIALS.client_email,
//   null,
//   privateKey,
//   SCOPES
// );

// export default Calendar;

// import React, { useEffect, useState } from 'react';
// import { google } from 'googleapis';

// const CalendarComponent = () => {
//   const [events, setEvents] = useState([]);

//   useEffect(() => {
//     const loadGoogleCalendarEvents = async () => {
//       // Load the service account key JSON file
//       const keyPath = 'path/to/your/service-account-key.json';
//       const auth = new google.auth.GoogleAuth({
//         keyFile: keyPath,
//         scopes: ['https://www.googleapis.com/auth/calendar.readonly'],
//       });

//       // Create a Google Calendar API client
//       const calendar = google.calendar({ version: 'v3', auth });

//       try {
//         // Fetch calendar events
//         const response = await calendar.events.list({
//           calendarId: 'primary', // Use 'primary' for the primary calendar
//           timeMin: new Date().toISOString(),
//           maxResults: 10, // You can adjust the number of events to retrieve
//           singleEvents: true,
//           orderBy: 'startTime',
//         });

//         // Extract and set events data in state
//         setEvents(response.data.items);
//       } catch (error) {
//         console.error('Error fetching Google Calendar events:', error);
//       }
//     };

//     loadGoogleCalendarEvents();
//   }, []);
//   return (
//     <div>
//       <h1>Google Calendar Events</h1>
//       <ul>
//         {events.map((event) => (
//           <li key={event.id}>{event.summary}</li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default CalendarComponent;
