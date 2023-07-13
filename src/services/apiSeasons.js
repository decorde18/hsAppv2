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

// export async function getRecentSeason() {
//   const { data: recentSeason, error } = await supabase
//     .from('seasons')
//     .select('*')
//     .order('season', { ascending: false })
//     .limit(1);
//   if (error) {
//     console.log(error);
//     throw new Error('Recent Season Could Not Be Loaded');
//   }
//   return recentSeason;
// }
