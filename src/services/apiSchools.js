import supabase from './supabase';

export async function getSchools() {
  const { data: schools, error } = await supabase
    .from('schools')
    .select('*')
    .order('school', { ascending: true });
  if (error) {
    console.log(error);
    throw new Error('Schools Could Not Be Loaded');
  }
  return schools;
}
