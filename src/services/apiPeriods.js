import supabase from './supabase';

const table = 'periods';

export async function getPeriod(gameId) {
  const { data: period, error } = await supabase
    .from(table)
    .select(
      `
    *,
  `
    )
    .eq('game', gameId)
    .select()
    .order('period', { ascending: true });

  if (error) {
    console.log(error);
    throw new Error('Period Game Could Not Be Loaded');
  }
  return period;
}
export async function getPeriods() {
  const { data: periods, error } = await supabase.from(table).select(
    `
    *,
  `
  );

  if (error) {
    console.log(error);
    throw new Error('Period Could Not Be Loaded');
  }
  return periods;
}
export async function createEditPeriod({ newData, id }) {
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
    throw new Error('Period Could Not Be Created');
  }
  return data;
}
export async function deletePeriodApi(id) {
  const { error } = await supabase.from(table).delete().eq('id', id);
  if (error) {
    console.log(error);
    throw new Error('Period Could Not Be Deleted');
  }
  return null;
}
