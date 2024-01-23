import supabase from './supabase';

export async function getGoals({ filter, sortBy }) {
  if (filter.value === 'createSeason') return {};
  let query = supabase
    .from('stoppages')
    .select('*,periodId!inner(id, game!inner(id, season))');
  //Filter
  if (filter !== null)
    query = query.eq(filter.field, filter.value).like('event', '%Goal%');
  const { data: goals, error } = await query;
  if (error) {
    console.log(error);
    throw new Error('Seasons Could Not Be Loaded');
  }
  return goals;
}
