import supabase from './supabase';

const table = 'subs';

export async function getSub(gameId) {
  const { data: sub, error } = await supabase
    .from(table)
    .select('*, periods!inner(*)')
    .eq('periods.game', gameId)
    .order('gameMinute', { ascending: true });
  // .select();

  if (error) {
    console.log(error);
    throw new Error('Minor Event Could Not Be Loaded');
  }
  return sub;
}
export async function getSubs() {
  const { data: subs, error } = await supabase.from(table).select(
    `
    * periods!inner(*),
  `
  );

  if (error) {
    console.log(error);
    throw new Error('Sub Could Not Be Loaded');
  }
  return subs;
}
export async function createEditSub({ newData, id }) {
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
    throw new Error('Sub Could Not Be Created');
  }
  return data;
}
export async function deleteSubApi(id) {
  const { error } = await supabase.from(table).delete().eq('id', id);
  if (error) {
    console.log(error);
    throw new Error('Sub Could Not Be Deleted');
  }
  return null;
}
