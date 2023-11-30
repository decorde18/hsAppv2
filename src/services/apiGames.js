import supabase from './supabase';

export async function getGames({ filter, sortBy }) {
  let query = supabase
    .from('games')
    .select('*, schools(*), locations(*)')
    .order('date', {
      ascending: true,
    })
    .order('time', { ascending: true });
  //FILTER
  if (filter !== null) query = query.eq(filter.field, filter.value);
  const { data: games, error } = await query;

  if (error) {
    console.log(error);
    throw new Error('Games Could Not Be Loaded');
  }
  return games;
}
export async function getGamesSeason(seasonId) {
  const { data: games, error } = await supabase
    .from('games')
    .select('*, schools(*), locations(*)')
    .eq('season', seasonId)
    .order('date', { ascending: true })
    .order('time', { ascending: true });

  if (error) {
    console.log(error);
    throw new Error('Games Could Not Be Loaded');
  }
  return games;
}

export async function createEditGame(newGame, id) {
  let query = supabase.from('games');
  //create game
  if (!id) query = query.insert([{ ...newGame }]);
  //edit game
  if (id)
    query = query
      .update({ ...newGame })
      .eq('id', id)
      .select();
  const { data, error } = await query.select().single();

  if (error) {
    console.log(error);
    throw new Error('Game Could Not Be Created');
  }
  return data;
}

export async function deleteGame(id) {
  const { error } = await supabase.from('games').delete().eq('id', id);
  if (error) {
    console.log(error);
    throw new Error('Game Could Not Be Deleted');
  }
  return null;
}

export async function cancelGame(id) {
  //to be played, canceled, forfeit, called early
  //TODO Future this should be updateGameStatus and takes which status
  const { error } = await supabase
    .from('games')
    .update({ status: 'canceled' })
    .eq('id', id)
    .select();

  if (error) {
    console.log(error);
    throw new Error('Game Could Not Be Canceled');
  }
  return null;
}
export async function getPeriods(gameId) {
  console.log(gameId);
  const { data: periods, error } = await supabase
    .from('periods')
    .select('*')
    .eq('gameId', gameId);

  if (error) {
    console.log(error);
    throw new Error('Periods Could Not Be Loaded');
  }
  return periods;
}
