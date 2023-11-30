import { styled } from 'styled-components';
import Header from '../ui/Header';
import Footer from '../components/Footer';

import supabase from '../services/supabase';
import DateTimePicker from 'react-datetime-picker';
import { useState } from 'react';

import {
  useSession,
  useSupabaseClient,
  useSessionContext,
} from '@supabase/auth-helpers-react';

const StyledPublicPage = styled.div`
  display: grid;
  overflow: auto;
  height: 100vh;
  grid-template-rows: 15rem 1fr auto;
`;
//TODO create a PageNav page (if we want from the top)

function PublicPage() {
  const [start, setStart] = useState();
  const [end, setEnd] = useState();
  const [eventName, setEventName] = useState();
  const [eventDescription, setEventDescription] = useState();
  const calendarID = '6urfeejbvf98os9r16sf94eqdc@group.calendar.google.com';

  const { isLoading } = useSessionContext();
  const session = useSession(); //tokens, when session exists we have a user
  const supabaseClient = useSupabaseClient(); //talk to supabase

  async function googleSignIn() {
    const { error } = await supabaseClient.auth.signInWithOAuth({
      provider: 'google',
      options: {
        scopes: [
          'https://www.googleapis.com/auth/calendar',
          'https://www.googleapis.com/auth/spreadsheets',
        ],
      },
    });
    if (error) {
      alert('Error logging in to Google provider with Supabase');
      console.log(error);
    }
  }
  async function signOut() {
    await supabaseClient.auth.signOut();
  }
  async function createCalendarEvent() {
    console.log(session);
    const nw = new Date();
    const event = {
      summary: eventName,
      description: eventDescription,
      start: {
        dateTime: nw.toISOString(),
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      },
      end: {
        dateTime: nw.toISOString(),
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      },
    };
    await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/${calendarID}/events`,
      {
        method: 'POST',
        // headers: { Authorization: 'Bearer ' + session.provider_token },
        headers: { Authorization: 'Bearer decordecoach@gmail.com' },
        body: JSON.stringify(event),
      }
    )
      .then((data) => {
        return data.json();
      })
      .then((data) => {
        console.log(data);
        alert('Event Created, check your Google Calendar');
      });
  }

  if (isLoading) {
    return <></>;
  }
  console.log(session);
  console.log(start, end, eventName, eventDescription);
  return (
    <StyledPublicPage>
      <Header type="nonApp" />
      <main>
        This is the main section. It will include all things on the landing
        page. This page is before you are logged in
        {session ? (
          <div>
            <h2>Hey there {session.user.email}</h2>
            <p>Start of your event</p>
            <div>
              <DateTimePicker
                onChange={setStart}
                value={start}
                closeWidgets={true}
              />
            </div>
            <p>End of your event</p>
            <DateTimePicker onChange={setEnd} value={end} closeWidgets={true} />
            <button onClick={signOut}></button>
            <p>Event Name</p>
            <input type="text" onChange={(e) => setEventName(e.target.value)} />
            <p>Event Description</p>
            <input
              type="text"
              onChange={(e) => setEventDescription(e.target.value)}
            />
            <hr />
            <button onClick={() => createCalendarEvent()}>
              Create Calendar event
            </button>
            <p></p>
          </div>
        ) : (
          <button onClick={() => googleSignIn()}>Sign In with Google</button>
        )}
      </main>
      <Footer />
    </StyledPublicPage>
  );
}

export default PublicPage;
