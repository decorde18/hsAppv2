import supabase from './supabase';

export async function getGames() {
  const { data: games, error } = await supabase
    .from('games')
    .select('*, schools(*), locations(*)')
    .order('date', {
      ascending: true,
    })
    .order('time', { ascending: true });

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
