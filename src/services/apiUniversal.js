import supabase from './supabase';

export async function createDataApi({ newData, table, view }) {
  const { data, error } = await supabase
    .from(table)
    .insert([{ ...newData }])
    .select();
  if (error) {
    console.log(error);
    throw new Error('Player Season Could Not Be created');
  }
  return { data, table, view };
}
export async function getData({ table, filter, sort }) {
  let query = supabase.from(table).select(`*`);

  filter &&
    filter.map(
      (each) =>
        (query = !each.textSearch
          ? query.filter(each.field, 'in', `(${each.value})`)
          : query.textSearch(each.field, each.value.join(' or '), {
              type: 'websearch',
              config: 'english',
            }))
    );

  sort &&
    sort.map(
      (each) => (query = query.order(each.field, { ascending: each.direction }))
    );
  query;
  const { data, error } = await query;

  if (error) {
    console.log(error);
    throw new Error(`${table} Could Not Be Loaded`);
  }
  return data;
}

export async function updateDataApi({ table, newData, id, view }) {
  const { data, error } = await supabase
    .from(table)
    .update(newData)
    .eq('id', id)
    .select();
  if (error) {
    console.log(error);
    throw new Error(`${table} Could Not Be updated`);
  }
  return { data, table, view };
}
export async function deleteDataApi({ view, table, id }) {
  const { error } = await supabase.from(table).delete().eq('id', id);
  // .eq("some_column", "someValue");
  if (error) {
    console.log(error);
    throw new Error(`${table} Could Not Be Deleted`);
  }

  return { view, table };
}