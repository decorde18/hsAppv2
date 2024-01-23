import supabase from './supabase';

const table = 'stoppages';

export async function getStoppage(gameId) {
  const { data: stoppage, error } = await supabase
    .from(table)
    .select('*, periods!inner(*)')
    .eq('periods.game', gameId)
    .order('begin', { ascending: true });
  if (error) {
    console.log(error);
    throw new Error('Minor Event Could Not Be Loaded');
  }
  return stoppage;
}
export async function getStoppages() {
  const { data: stoppages, error } = await supabase.from(table).select(
    `
    * periods!inner(*),
  `
  );

  if (error) {
    console.log(error);
    throw new Error('Stoppage Could Not Be Loaded');
  }
  return stoppages;
}
export async function createEditStoppage({ newData, id }) {
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
    throw new Error('Stoppage Could Not Be Created');
  }
  return data;
}
export async function deleteStoppageApi(id) {
  const { error } = await supabase.from(table).delete().eq('id', id);
  if (error) {
    console.log(error);
    throw new Error('Stoppage Could Not Be Deleted');
  }
  return null;
}
