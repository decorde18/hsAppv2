## GOOGLE PROVIDER TOKEN - Authentication with Google

import {
useSession,
useSupabaseClient,
useSessionContext,
} from '@supabase/auth-helpers-react';

Here is the code to log in with Google credentials.
// async function googleSignIn() {
// const { error } = await supabaseClient.auth.signInWithOAuth({
// provider: 'google',
// options: {
// scopes: [
// 'https://www.googleapis.com/auth/calendar',
// 'https://www.googleapis.com/auth/spreadsheets',
// ],
// },
// });
// if (error) {
// alert('Error logging in to Google provider with Supabase');
// console.log(error);
// }
// }

// const [start, setStart] = useState();
// const [end, setEnd] = useState();
// const [eventName, setEventName] = useState();
// const [eventDescription, setEventDescription] = useState();
// const calendarID = '6urfeejbvf98os9r16sf94eqdc@group.calendar.google.com';

// const { isLoading } = useSessionContext();
// const session = useSession(); //tokens, when session exists we have a user
// const supabaseClient = useSupabaseClient(); //talk to supabase

// async function googleSignIn() {
// const { error } = await supabaseClient.auth.signInWithOAuth({
// provider: 'google',
// options: {
// scopes: [
// 'https://www.googleapis.com/auth/calendar',
// 'https://www.googleapis.com/auth/spreadsheets',
// ],
// },
// });
// if (error) {
// alert('Error logging in to Google provider with Supabase');
// console.log(error);
// }
// }
// async function signOut() {
// await supabaseClient.auth.signOut();
// }
// async function createCalendarEvent() {
// console.log(session);
// const nw = new Date();
// const event = {
// summary: eventName,
// description: eventDescription,
// start: {
// dateTime: nw.toISOString(),
// timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
// },
// end: {
// dateTime: nw.toISOString(),
// timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
// },
// };
// await fetch(
// `https://www.googleapis.com/calendar/v3/calendars/${calendarID}/events`,
// {
// method: 'POST',
// // headers: { Authorization: 'Bearer ' + session.provider_token },
// headers: { Authorization: 'Bearer ' + session.provider_token },
// body: JSON.stringify(event),
// }
// )
// .then((data) => {
// return data.json();
// })
// .then((data) => {
// console.log(data);
// alert('Event Created, check your Google Calendar');
// });
// }

// if (isLoading) {
// return <></>;
// }
// console.log(session.provider_token);
// console.log(start, end, eventName, eventDescription);

// const [start, setStart] = useState();
// const [end, setEnd] = useState();
// const [eventName, setEventName] = useState();
// const [eventDescription, setEventDescription] = useState();
// const calendarID = '6urfeejbvf98os9r16sf94eqdc@group.calendar.google.com';

// const { isLoading } = useSessionContext();
// const session = useSession(); //tokens, when session exists we have a user
// const supabaseClient = useSupabaseClient(); //talk to supabase

// async function googleSignIn() {
// const { error } = await supabaseClient.auth.signInWithOAuth({
// provider: 'google',
// options: {
// scopes: [
// 'https://www.googleapis.com/auth/calendar',
// 'https://www.googleapis.com/auth/spreadsheets',
// ],
// },
// });
// if (error) {
// alert('Error logging in to Google provider with Supabase');
// console.log(error);
// }
// }
// async function signOut() {
// await supabaseClient.auth.signOut();
// }
// async function createCalendarEvent() {
// console.log(session);
// const nw = new Date();
// const event = {
// summary: eventName,
// description: eventDescription,
// start: {
// dateTime: nw.toISOString(),
// timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
// },
// end: {
// dateTime: nw.toISOString(),
// timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
// },
// };
// await fetch(
// `https://www.googleapis.com/calendar/v3/calendars/${calendarID}/events`,
// {
// method: 'POST',
// // headers: { Authorization: 'Bearer ' + session.provider_token },
// headers: { Authorization: 'Bearer ' + session.provider_token },
// body: JSON.stringify(event),
// }
// )
// .then((data) => {
// return data.json();
// })
// .then((data) => {
// console.log(data);
// alert('Event Created, check your Google Calendar');
// });
// }

// if (isLoading) {
// return <></>;
// }
// console.log(session.provider_token);
// console.log(start, end, eventName, eventDescription);
