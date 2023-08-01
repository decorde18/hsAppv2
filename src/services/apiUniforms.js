import supabase from './supabase';

export async function getUniforms() {
  const { data: uniforms, error } = await supabase.from('uniforms').select('*');

  if (error) {
    console.log(error);
    throw new Error('Uniforms Could Not Be Loaded');
  }
  return uniforms;
}

export async function getUniform(uniformId) {
  const { data: singleUniform, error } = await supabase
    .from('uniforms')
    .select('*')
    .eq('id', uniformId)
    .single();
  if (error) {
    console.log(error);
    throw new Error('Recent Uniform Could Not Be Loaded');
  }
  return singleUniform;
}

export async function createEditUniform(newUniform, id) {
  let query = supabase.from('uniforms');

  if (!id) query = query.insert({ ...newUniform }).select();
  if (id)
    query = query
      .update({ ...newUniform })
      .eq('id', id)
      .select();

  const { data, error } = await query.select().single();

  if (error) {
    console.log(error);
    throw new Error('Uniform Could Not Be Created');
  }
  return data;
}
export async function deleteUniform(id) {
  console.log(id);
  const { error } = await supabase.from('uniforms').delete().eq('id', id);

  if (error) {
    console.log(error);
    throw new Error('Uniform Could Not Be Deleted');
  }
  return null;
}

export async function getUniformJerseys() {
  const { data: uniformJerseys, error } = await supabase
    .from('uniformJerseys')
    .select('*');

  if (error) {
    console.log(error);
    throw new Error('UniformJerseys Could Not Be Loaded');
  }
  return uniformJerseys;
}

export async function getUniformJersey(uniformJerseyId) {
  const { data: singleUniformJersey, error } = await supabase
    .from('uniformJerseys')
    .select('*')
    .eq('id', uniformJerseyId)
    .single();
  if (error) {
    console.log(error);
    throw new Error('Recent UniformJersey Could Not Be Loaded');
  }
  return singleUniformJersey;
}

export async function createEditUniformJersey(newUniformJersey, id) {
  let query = supabase.from('uniformJerseys');

  if (!id) query = query.insert({ ...newUniformJersey }).select();

  if (id)
    query = query
      .update({ ...newUniformJersey })
      .eq('id', id)
      .select();

  const { data, error } = await query.select().single();

  if (error) {
    console.log(error);
    throw new Error('UniformJersey Could Not Be Created');
  }
  return data;
}
export async function deleteUniformJersey(id) {
  const { error } = await supabase.from('uniformJerseys').delete().eq('id', id);

  if (error) {
    console.log(error);
    throw new Error('UniformJersey Could Not Be Deleted');
  }
  return null;
}

export async function getUniformSeasons() {
  const { data: uniformSeasons, error } = await supabase
    .from('uniformSeasons')
    .select('*, uniforms(*)');

  if (error) {
    console.log(error);
    throw new Error('UniformSeasons Could Not Be Loaded');
  }
  return uniformSeasons;
}

export async function getUniformSeason(uniformSeasonId) {
  const { data: singleUniformSeason, error } = await supabase
    .from('uniformSeasons')
    .select('*, uniforms(*)')
    .eq('season', uniformSeasonId);

  if (error) {
    console.log(error);
    throw new Error('Recent UniformSeason Could Not Be Loaded');
  }
  return singleUniformSeason;
}

export async function createEditUniformSeason(newUniformSeason, id) {
  let query = supabase.from('uniformSeasons');

  if (!id) query = query.insert({ ...newUniformSeason }).select();

  if (id)
    query = query
      .update({ ...newUniformSeason })
      .eq('id', id)
      .select();

  const { data, error } = await query.select().single();

  if (error) {
    console.log(error);
    throw new Error('UniformSeason Could Not Be Created');
  }
  return data;
}
export async function deleteUniformSeason(id) {
  console.log(id);
  const { error } = await supabase.from('uniformSeasons').delete().eq('id', id);

  if (error) {
    console.log(error);
    throw new Error('UniformSeason Could Not Be Deleted');
  }
  return null;
}

export async function getUniformSeasonPlayers() {
  const { data: uniformSeasonPlayers, error } = await supabase
    .from('uniformSeasonPlayers')
    .select('*, uniformJerseys(*)');

  if (error) {
    console.log(error);
    throw new Error('UniformSeasonPlayers Could Not Be Loaded');
  }
  return uniformSeasonPlayers;
}

export async function getUniformSeasonPlayer(uniformSeasonPlayerId) {
  const { data: singleUniformSeasonPlayer, error } = await supabase
    .from('uniformSeasonPlayer')
    .select('*')
    .eq('id', uniformSeasonPlayerId)
    .single();
  if (error) {
    console.log(error);
    throw new Error('Recent UniformSeasonPlayer Could Not Be Loaded');
  }
  return singleUniformSeasonPlayer;
}

export async function createEditUniformSeasonPlayers(
  newUniformSeasonPlayers,
  id
) {
  let query = supabase.from('uniformSeasonPlayers');

  if (!id) query = query.insert({ ...newUniformSeasonPlayers }).select();

  if (id)
    query = query
      .update({ ...newUniformSeasonPlayers })
      .eq('id', id)
      .select();

  const { data, error } = await query.select().single();

  if (error) {
    console.log(error);
    throw new Error('UniformSeasonPlayers Could Not Be Created');
  }
  return data;
}
export async function deleteUniformSeasonPlayers(id) {
  console.log(id);
  const { error } = await supabase
    .from('uniformSeasonPlayers')
    .delete()
    .eq('id', id);

  if (error) {
    console.log(error);
    throw new Error('UniformSeasonPlayers Could Not Be Deleted');
  }
  return null;
}
