import supabase from './supabase';
import { deleteGoogleCalendarEvent } from './apiGoogle';

const table = 'calendarEvents';
export async function getEvents({ filter, sortBy }) {
  let query = supabase.from(table).select('*').order('startDateTime', {
    ascending: true,
  });
  //FILTER
  if (filter !== null) query = query.eq(filter.field, filter.value);
  const { data: events, error } = await query;

  if (error) {
    console.log(error);
    throw new Error('Events Could Not Be Loaded');
  }
  return events;
}

export async function createEditEvent(newEvent, id) {
  if (newEvent.calendar === 'all') newEvent.calendar = 'ihsSoccer';
  let query = supabase.from(table);
  //create event
  if (!id) query = query.insert([{ ...newEvent }]);
  //edit event
  if (id)
    query = query
      .update({ ...newEvent })
      .eq('id', id)
      .select();

  const { data, error } = await query.select().single();

  if (error) {
    console.log(error);
    throw new Error('Event Could Not Be Created or Edited');
  }
  return data;
}

export async function deleteEvent({ id, calendar, calId }) {
  if (calendar === 'all') calendar = 'ihsSoccer';
  const { error } = await supabase.from(table).delete().eq('id', id);
  if (error) {
    console.log(error);
    throw new Error('Event Could Not Be Deleted');
  }
  deleteGoogleCalendarEvent(calendar, calId);
  return null;
}
