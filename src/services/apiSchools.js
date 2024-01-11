import supabase from './supabase';

const table = 'schools';
export async function getSchools() {
  const { data: schools, error } = await supabase
    .from(table)
    .select('*')
    .order('school', { ascending: true });
  if (error) {
    console.log(error);
    throw new Error('Schools Could Not Be Loaded');
  }
  return schools;
}

export async function createEditSchool(newSchool, id) {
  let query = supabase.from(table);
  //create school
  if (!id) query = query.insert([{ ...newSchool }]);
  //edit school
  if (id)
    query = query
      .update({ ...newSchool })
      .eq('id', id)
      .select();
  const { data, error } = await query.select().single();
  if (error) {
    console.log(error);
    throw new Error('School Could Not Be Created or Updated');
  }
  return data;
}

export async function deleteSchool(id) {
  const { error } = await supabase.from(table).delete().eq('id', id);
  if (error) {
    console.log(error);
    throw new Error('School Could Not Be Deleted');
  }
  return null;
}
