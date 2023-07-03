import supabase from './supabase';

export async function getSeasons() {
  const { data, error } = await supabase.from('seasons').select('*');
  if (error) {
    console.log(error);
    throw new Error('Seasons Could Not Be Loaded');
  }
  return data;
}
