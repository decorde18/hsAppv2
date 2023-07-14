// import supabase, { supabaseUrl } from './supabase';
import supabase from './supabase';

export async function getPlayers() {
  const { data: players, error } = await supabase.from('players').select(`
    *,
    people (*)
  `);

  if (error) {
    console.log(error);
    throw new Error('Players Could Not Be Loaded');
  }
  return players;
}
export async function getPlayerSeasons() {
  const { data: playerSeasons, error } = await supabase.from('playerSeasons')
    .select(`
    *,
    players (
      *, people(*)
    ), seasons(*)
  `);

  if (error) {
    console.log(error);
    throw new Error('Player Seasons Could Not Be Loaded');
  }
  return playerSeasons;
}
export async function updatePlayerSeason({ id, ...updateField }) {
  const { data, error } = await supabase
    .from('playerSeasons')
    .update(updateField)
    .eq('id', id)
    .select();
  if (error) {
    console.log(error);
    throw new Error('Player Season Could Not Be updated');
  }
}
export async function createEditPlayer(newPlayer, id) {}

export async function deletePlayer(id) {
  //TODO ask for delete Person in People
  const { error } = await supabase.from('player').delete().eq('id', id);
  if (error) {
    console.log(error);
    throw new Error('Player Could Not Be Deleted');
  }
  return null;
}
// export async function createEditPlayer(newCabin, id) {
//   const hasImagePath = newCabin.image?.startsWith?.(supabaseUrl);
//   const imageName = `${Math.random()}-${newCabin.image.name}`.replaceAll(
//     '/',
//     ''
//   ); // if there are any slashes, supabase creates a new folder inside
//   const imagePath = hasImagePath
//     ? newCabin.image
//     : `${supabaseUrl}/storage/v1/object/public/cabin-images/${imageName}`;
//   let query = supabase.from('cabins');
//   //create cabin
//   if (!id) query = query.insert([{ ...newCabin, image: imagePath }]);
//   //edit cabin
//   if (id)
//     query = query
//       .update({ ...newCabin, image: imagePath })
//       .eq('id', id)
//       .select();
//   const { data, error } = await query.select().single();
//   // .insert([{ some_column: "someValue", other_column: "otherValue" }])
//   if (error) {
//     console.log(error);
//     throw new Error('Cabin Could Not Be Created');
//   }
//   //upload image
//   if (hasImagePath) return;
//   const { error: storageError } = await supabase.storage
//     .from('cabin-images')
//     .upload(imageName, newCabin.image);
//   //prevent new cabin from creating if error uploading image (delete)
//   if (storageError) {
//     await supabase.from('cabins').delete().eq('id', data.id);
//     console.log(error);
//     throw new Error('There was an error loading the image');
//   }
//   return data;
// }
