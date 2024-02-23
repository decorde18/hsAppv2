// import supabase, { supabaseUrl } from './supabase';
import supabase from './supabase';
const table = 'players';
const table2 = 'playerSeasons';
const table3 = 'player_seasons_with_numbers';
export async function getPlayers() {
  const { data: players, error } = await supabase
    .from(table)
    .select(
      `
    *,
    people!inner(*)
    `
    )
    .order('entryYear', { ascending: true });
  // .order('people.lastName', { ascending: true });
  // .order('people.lastName', { ascending: true })
  // .order('people.firstName', { ascending: true });

  if (error) {
    console.log(error);
    throw new Error('Players Could Not Be Loaded');
  }
  return players;
}
export async function createEditPlayer(newPlayer, id) {
  let query = supabase.from(table);
  //create player
  if (!id) query = query.insert([{ ...newPlayer }]);
  //edit player
  if (id)
    query = query
      .update({ ...newPlayer })
      .eq('id', id)
      .select();
  const { data, error } = await query.select().single();
  if (error) {
    console.log(error);
    throw new Error('Player Could Not Be Created');
  }
  return data;
}
export async function deletePlayer(id) {
  const { error } = await supabase.from(table).delete().eq('id', id);
  if (error) {
    console.log(error);
    throw new Error('Player Could Not Be Deleted');
  }
  return null;
}

export async function getPlayerSeasons({ filter, sortBy }) {
  if (filter.value === 'createSeason') return {};
  let query = supabase
    .from(table2)
    .select(
      `
    *,
    players (
      *, people(*)
    ), seasons(*)
  `
    )
    .order('grade', { ascending: false })
    .order('status', { ascending: true });
  //FILTER
  if (filter !== null) query = query.eq(filter.field, filter.value);
  const { data: playerSeasons, error } = await query;
  if (error) {
    console.log(error);
    throw new Error('Player Seasons Could Not Be Loaded');
  }
  return playerSeasons;
}
export async function getPlayerSeason(seasonId) {
  const { data: playerSeason, error } = await supabase
    .from(table2)
    .select(
      `
    *,
    players (
      *, people(*)
    ), seasons(*)
  `
    )
    .eq('seasonId', seasonId)
    .order('grade', { ascending: false })
    .order('status', { ascending: true });

  if (error) {
    console.log(error);
    throw new Error('Player Seasons Could Not Be Loaded');
  }
  return playerSeason;
}
export async function createPlayerSeasons(newPlayerSeason) {
  const { data, error } = await supabase
    .from(table2)
    .insert([{ ...newPlayerSeason }])
    .select();
  if (error) {
    console.log(error);
    throw new Error('Player Season Could Not Be created');
  }
  return data;
}
export async function updatePlayerSeason({ id, ...updateField }) {
  const { data, error } = await supabase
    .from(table2)
    .update(updateField)
    .eq('id', id)
    .select();
  if (error) {
    console.log(error);
    throw new Error('Player Season Could Not Be updated');
  }
  return data;
}
export async function deletePlayerSeasonApi(id) {
  const { error } = await supabase.from(table2).delete().eq('id', id);
  if (error) {
    console.log(error);
    throw new Error('Player Season Could Not Be Deleted');
  }
  return null;
}

export async function getPlayerSeasonWithNumbers(seasonId) {
  const { data: playerSeasonWithNumber, error } = await supabase
    .from(table3)
    .select(`*`)
    .eq('seasonId', seasonId)
    .order('grade', { ascending: false })
    .order('status', { ascending: true })
    .order('lastName')
    .order('firstName');

  if (error) {
    console.log(error);
    throw new Error('Player Seasons Could Not Be Loaded');
  }
  return playerSeasonWithNumber;
}
