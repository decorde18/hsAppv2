import supabase from './supabase';

export async function getSeasons({ filter, sortBy } /*filter pagination*/) {
  /*filter pagination*/
  let query = supabase
    .from('seasons')
    .select('*')
    .order('season', { ascending: false });
  // const { data: seasons, error } = await supabase
  //   .from('seasons')
  //   .select('*')
  //   .order('season', { ascending: false });
  //FILTER
  if (filter !== null)
    query = query[filter.method || 'eq'](filter.field, filter.value);
  const { data: seasons, error } = await query;

  if (error) {
    console.log(error);
    throw new Error('Seasons Could Not Be Loaded');
  }
  return seasons;
}

export async function getRecentSeason() {
  const { data: recentSeason, error } = await supabase
    .from('seasons')
    .select('*')
    .order('season', { ascending: false })
    .limit(1);
  if (error) {
    console.log(error);
    throw new Error('Recent Season Could Not Be Loaded');
  }
  return recentSeason;
}

export async function getSeason(season) {
  const { data: recentSeason, error } = await supabase
    .from('seasons')
    .select('*, people(*)')
    .eq('id', season)
    .single();
  if (error) {
    console.log(error);
    throw new Error('Recent Season Could Not Be Loaded');
  }
  return recentSeason;
}

export async function updateSeasonApi({ id, ...updateField }) {
  const { data, error } = await supabase
    .from('seasons')
    .update(updateField)
    .eq('id', id)
    .select();
  if (error) {
    console.log(error);
    throw new Error('Season Could Not Be Updated');
  }
  return data;
}

export async function createEditSeason(newSeason, id) {
  let query = supabase.from('seasons');

  if (!id) query = query.insert({ ...newSeason }).select();

  if (id) query = query.update({ newSeason }).eq('id', id).select();

  const { data, error } = await query.select().single();

  if (error) {
    console.log(error);
    throw new Error('Season Could Not Be Created');
  }
  return data;
}
