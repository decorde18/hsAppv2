import supabase from './supabase';

export async function getGoals() {
  const { data: goals, error } = await supabase
    .from('stoppages')
    .select('*')
    .like('event', '%Goal%');
  if (error) {
    console.log(error);
    throw new Error('Seasons Could Not Be Loaded');
  }
  return goals;
}
