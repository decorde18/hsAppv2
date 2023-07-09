import supabase from './supabase';

export async function getParents() {
  let { data: parents, error } = await supabase.from('parents').select('*');
  if (error) {
    console.log(error);
    throw new Error('Parents Could Not Be Loaded');
  }
  return { parents, error };
}
