import supabase from './supabase';

const table = 'scheduleHelper';

export async function getScheduleHelpers({ filter, sortBy }) {
  let query = supabase.from(table).select('*');
  //FILTER
  if (filter !== null) query = query.eq(filter.field, filter.value);
  const { data: scheduleHelpers, error } = await query;
  if (error) {
    console.log(error);
    throw new Error('Schedule Helpers Could Not Be Loaded');
  }
  return scheduleHelpers;
}

export async function createEditScheduleHelper({ id, ...newScheduleHelper }) {
  let query = supabase.from(table);
  //create scheduleHelper
  if (!id) query = query.insert([{ ...newScheduleHelper }]);
  //edit scheduleHelper
  if (id)
    query = query
      .update({ ...newScheduleHelper })
      .eq('id', id)
      .select();

  const { data, error } = await query.select().single();

  if (error) {
    console.log(error);
    throw new Error('Schedule Helper Could Not Be Created or Edited');
  }
  return data;
}

export async function deleteScheduleHelper(id) {
  const { error } = await supabase.from(table).delete().eq('id', id);
  if (error) {
    console.log(error);
    throw new Error('Schedule Helper Could Not Be Deleted');
  }
  return null;
}
