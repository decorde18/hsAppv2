import supabase from './supabase';

const table = 'coaches';
export async function getCoaches() {
  let query = supabase.from(table).select(`*, people (*)`);

  const { data: coaches, error } = await query;

  if (error) {
    console.log(error);
    throw new Error('Coaches Could Not Be Loaded');
  }
  return coaches;
}

export async function createEditCoach(newCoach, id) {
  let query = supabase.from(table);
  //create coach
  if (!id) query = query.insert([{ ...newCoach }]);
  //edit coach
  if (id)
    query = query
      .update({ ...newCoach })
      .eq('id', id)
      .select();

  const { data, error } = await query.select().single();

  if (error) {
    console.log(error);
    throw new Error('Coach Could Not Be Created or Edited');
  }
  return data;
}

export async function deleteCoachApi(id) {
  const { error } = await supabase.from(table).delete().eq('id', id);
  if (error) {
    console.log(error);
    throw new Error('Coach Could Not Be Deleted');
  }
  return null;
}
