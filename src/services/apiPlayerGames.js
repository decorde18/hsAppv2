import supabase from './supabase';

const table = 'playerGames';

export async function getPlayerGame(gameId) {
  const { data: playerGame, error } = await supabase
    .from(table)
    .select(
      `
    *,
  `
    )
    .eq('game', gameId)
    .select();

  if (error) {
    console.log(error);
    throw new Error('Player Game Could Not Be Loaded');
  }
  return playerGame;
}
export async function getPlayerGames() {
  const { data: playerGames, error } = await supabase.from(table).select(
    `
    *,
  `
  );

  if (error) {
    console.log(error);
    throw new Error('Player Games Could Not Be Loaded');
  }
  return playerGames;
}
export async function createEditPlayerGame({ playerGameData, id }) {
  let query = supabase.from(table);
  //create player
  if (!id) query = query.insert([{ ...playerGameData }]);
  //edit player
  if (id)
    query = query
      .update({ ...playerGameData })
      .eq('id', id)
      .select();
  const { data, error } = await query.select().single();
  if (error) {
    console.log(error);
    throw new Error('Player Game Could Not Be Created');
  }
  return data;
}
export async function deletePlayerGameApi(id) {
  const { error } = await supabase.from(table).delete().eq('id', id);
  if (error) {
    console.log(error);
    throw new Error('Player Game Could Not Be Deleted');
  }
  return null;
}
