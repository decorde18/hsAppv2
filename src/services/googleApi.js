import React, { useEffect, useState } from 'react';
import { gapi } from 'gapi-script';
// import Event from './components/Event.js';

const REACT_APP_GOOGLE_API_KEY = 'AIzaSyAbbRFxdeJw2t-7U3cKe6eRdfS5a9JtnKI';

const REACT_APP_GOOGLE_ACCESS_TOKEN =
  '4/0Adeu5BVUPTo-DVJ-9qirfRIYj2_ILQqm02RWvLHIInHSy8dQXF8qs76ttihwdl_YH9x4ag';

const REACT_APP_CALENDAR_ID =
  '6urfeejbvf98os9r16sf94eqdc@group.calendar.google.com';
const calendarID = REACT_APP_CALENDAR_ID;
const apiKey = REACT_APP_GOOGLE_API_KEY;
const accessToken = REACT_APP_GOOGLE_ACCESS_TOKEN;
// // //** declare calendar instance */

function Calendar() {
  const [events, setEvents] = useState([]);

  const getEvents = (calendarID, apiKey) => {
    function initiate() {
      gapi.client
        .init({
          apiKey: apiKey,
        })
        .then(function () {
          return gapi.client.request({
            path: `https://www.googleapis.com/calendar/v3/calendars/${calendarID}/events`,
          });
        })
        .then(
          (response) => {
            let events = response.result.items;
            setEvents(events);
          },
          function (err) {
            return [false, err];
          }
        );
    }
    gapi.load('client', initiate);
  };

  useEffect(() => {
    const events = getEvents(calendarID, apiKey);
    setEvents(events);
  }, []);
  console.log(events);
}
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

export default Calendar;

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
