import supabase from './supabase';

export async function getParents() {
  let { data: parents, error } = await supabase.from('parents').select('*');
  if (error) {
    console.log(error);
    throw new Error('Parents Could Not Be Loaded');
  }
  return parents;
}

export async function createEditParent(newParent, id) {
  let query = supabase.from('parents');
  //create parent
  if (!id) query = query.insert([{ ...newParent }]);
  //edit parent
  if (id)
    query = query
      .update({ ...newParent })
      .eq('id', id)
      .select();
  const { data, error } = await query.select().single();

  if (error) {
    console.log(error);
    throw new Error('Parent Could Not Be Created');
  }

  return data;
}

export async function deleteParent(id) {
  const { error } = await supabase.from('parents').delete().eq('id', id);
  if (error) {
    console.log(error);
    throw new Error('Parent Could Not Be Deleted');
  }
  return null;
}

export async function getPlayerParents() {
  let { data: playerParents, error } = await supabase
    .from('playerParents')
    .select('*,players(*, people(*)),parents(*,people(*))');
  if (error) {
    console.log(error);
    throw new Error('Player Parents Could Not Be Loaded');
  }
  return playerParents;
}

export async function createEditPlayerParent(newPlayerParent, id) {
  let query = supabase.from('playerParents');
  //create parent
  if (!id) query = query.insert([{ ...newPlayerParent }]);
  //edit parent
  if (id)
    query = query
      .update({ ...newPlayerParent })
      .eq('id', id)
      .select();
  const { data, error } = await query.select().single();

  if (error) {
    console.log(error);
    throw new Error('Player Parent Could Not Be Created');
  }

  return data;
}
