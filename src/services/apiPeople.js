import supabase from './supabase';

/* IF THE ID SEQUENCE GETS OUT OF WHACK:
how to know:
SELECT MAX(id) FROM the_table;   
SELECT nextval('people_id_seq');
SELECT setval('people_id_seq', (SELECT MAX(id) FROM people)+1);

in sql editor

*/
export async function getPeople() {
  let { data: people, error } = await supabase.from('people').select('*');
  if (error) {
    console.log(error);
    throw new Error('People Could Not Be Loaded');
  }
  return { people, error };
}
export async function createEditPeople(newPerson, id) {
  let query = supabase.from('people');
  //create person
  if (!id) query = query.insert({ ...newPerson }).select();
  //edit person
  if (id) query = query.update({ newPerson }).eq('id', id).select();

  const { data, error } = await query.select().single();

  if (error) {
    console.log(error);
    throw new Error('Person Could Not Be Created');
  }
  return data;
}

export async function deletePeople(id) {
  const { error } = await supabase.from('people').delete().eq('id', id);
  // .eq("some_column", "someValue");
  if (error) {
    console.log(error);
    throw new Error('People Could Not Be Deleted');
  }
  return null;
}
