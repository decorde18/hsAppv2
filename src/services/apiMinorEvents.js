import supabase from './supabase';

const table = 'minorEvents';

export async function getMinorEvent(gameId) {
  const { data: minorEvent, error } = await supabase
    .from(table)
    .select('*, periods!inner(*)')
    .eq('periods.game', gameId)
    .order('gameMinute', { ascending: true });
  // .select();

  if (error) {
    console.log(error);
    throw new Error('Minor Event Could Not Be Loaded');
  }
  return minorEvent;
}
export async function getMinorEvents() {
  const { data: minorEvents, error } = await supabase.from(table).select(
    `
    *,periods!inner(*)
  `
  );

  if (error) {
    console.log(error);
    throw new Error('MinorEvent Could Not Be Loaded');
  }
  return minorEvents;
}
export async function createEditMinorEvent({ newData, id }) {
  let query = supabase.from(table);
  //create
  if (!id) query = query.insert([{ ...newData }]);
  //edit
  if (id)
    query = query
      .update({ ...newData })
      .eq('id', id)
      .select();
  const { data, error } = await query.select().single();
  if (error) {
    console.log(error);
    throw new Error('Minor Event Could Not Be Created');
  }
  return data;
}
export async function deleteMinorEventApi(id) {
  const { error } = await supabase.from(table).delete().eq('id', id);
  if (error) {
    console.log(error);
    throw new Error('Minor Event Could Not Be Deleted');
  }
  return null;
}
