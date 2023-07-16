// import supabase, { supabaseUrl } from './supabase';
import supabase from './supabase';

export async function getGames() {
  const { data: games, error } = await supabase
    .from('games')
    .select('*, schools(*), locations(*)');

  if (error) {
    console.log(error);
    throw new Error('Games Could Not Be Loaded')
      .order('date', {
        ascending: true,
      })
      .order('time', { ascending: true });
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
