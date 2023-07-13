// import supabase, { supabaseUrl } from './supabase';
import supabase from './supabase';

export async function getGames() {
  const { data: games, error } = await supabase.from('games').select(`
    *,
    locations (
      *
    ), opponent(*)
  `);

  if (error) {
    console.log(error);
    throw new Error('Games Could Not Be Loaded');
  }
  return games;
}
