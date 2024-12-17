import supabase, { supabaseUrl } from './supabase';

export async function login({ email, password }) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (data?.session) {
    // Preserve search parameters
    const params = new URLSearchParams(window.location.search);
    const redirectUrl = `/app/seasonMain?${params.toString()}`;
    window.location.href = redirectUrl;
  } else {
    console.error('Login failed:', error.message);
  }
  if (error) throw new Error(error.message);
  else return data;
}

export async function getCurrentUser() {
  const { data: session } = await supabase.auth.getSession();
  if (!session.session) return null;
  const { data, error } = await supabase.auth.getUser();

  if (error) throw new Error(error.message);
  return data?.user;
}

export async function logout() {
  const { error } = await supabase.auth.signOut();
  if (error) throw new Error(error.message);
}

export async function updateCurrentUser({ password, fullName, avatar }) {
  //update password OR full name
  let updateData;
  if (password) updateData = { password };
  if (fullName) updateData = { data: { fullName } };
  const { data, error } = await supabase.auth.updateUser(updateData);
  if (error) throw new Error(error.message);
  if (!avatar) return data;

  //Upload avatar image
  const fileName = `avatar=${data.user.id}-${Math.random()}`;
  const { error: storageError } = await supabase.storage
    .from('avatars')
    .upload(fileName, avatar);
  if (storageError) throw new Error(storageError.message);

  //use avatar in user
  const { data: updatedUser, error: error2 } = await supabase.auth.updateUser({
    data: {
      avatar: `${supabaseUrl}/storage/v1/object/public/avatars/${fileName}`,
    },
  });
  if (error2) throw new Error(error2.message);
  return updatedUser;
}

export async function googleSignIn() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      scopes: [
        'https://www.googleapis.com/auth/calendar',
        'https://www.googleapis.com/auth/spreadsheets',
      ],
      redirectTo: 'http://ihssoccergirls.net/app/games',
    },
  });
  if (error) {
    alert('Error logging in to Google provider with Supabase');
    throw new Error(error.message);
  } else return data;
}
