// import supabase, { supabaseUrl } from './supabase';
import supabase from './supabase';

export async function getPlayers() {
  const { data: players, error } = await supabase
    .from('players')
    .select(
      `
    *,
    people (*)
  `
    )
    .order('entryYear', { ascending: true })
    .order('lastName', { foreignTable: 'people', ascending: true })
    .order('firstName', { foreignTable: 'people', ascending: true });
  //todo fixme these aren't ordering and I don't know why
  if (error) {
    console.log(error);
    throw new Error('Players Could Not Be Loaded');
  }
  return players;
}
export async function createEditPlayer(newPlayer, id) {
  let query = supabase.from('players');
  //create player
  if (!id) query = query.insert([{ ...newPlayer }]);
  //edit player
  if (id)
    query = query
      .update({ ...newPlayer })
      .eq('id', id)
      .select();
  const { data, error } = await query.select().single();
  // .insert([{ some_column: "someValue", other_column: "otherValue" }])
  if (error) {
    console.log(error);
    throw new Error('Player Could Not Be Created');
  }
  return data;
}

export async function deletePlayer(id) {
  //TODO ask for delete Person in People
  const { error } = await supabase.from('players').delete().eq('id', id);
  if (error) {
    console.log(error);
    throw new Error('Player Could Not Be Deleted');
  }
  return null;
}

export async function getPlayerSeasons() {
  const { data: playerSeasons, error } = await supabase
    .from('playerSeasons')
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

  if (error) {
    console.log(error);
    throw new Error('Player Seasons Could Not Be Loaded');
  }
  return playerSeasons;
}
export async function getPlayerSeason(seasonId) {
  const { data: playerSeason, error } = await supabase
    .from('playerSeasons')
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
    .from('playerSeasons')
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
    .from('playerSeasons')
    .update(updateField)
    .eq('id', id)
    .select();
  if (error) {
    console.log(error);
    throw new Error('Player Season Could Not Be updated');
  }
  return data;
}
