import supabase from './supabase';

export async function getSeasons() {
  const { data: seasons, error } = await supabase
    .from('seasons')
    .select('*')
    .order('season', { ascending: false });
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

export async function getSeason(seasonId) {
  const { data: recentSeason, error } = await supabase
    .from('seasons')
    .select('*, people(*)')
    .eq('id', seasonId)
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
