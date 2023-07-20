import supabase from './supabase';

export async function getLocations() {
  const { data: locations, error } = await supabase
    .from('locations')
    .select('*')
    .order('name', { ascending: true });
  if (error) {
    console.log(error);
    throw new Error('Locations Could Not Be Loaded');
  }
  return locations;
}
