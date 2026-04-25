const SUPABASE_URL = 'https://vmhfkqqsrokkehkejxdk.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_B5MlYv0lJk5soqD-kMQLsw_Lv8ZoXZt';

const { createClient } = supabase;
const sb = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function getSession() {
  const { data: { session } } = await sb.auth.getSession();
  return session;
}

async function getProfile(userId) {
  const { data, error } = await sb
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  if (error) return null;
  return data;
}

async function requireAuth(redirectTo = '/physics/login.html') {
  const session = await getSession();
  if (!session) {
    window.location.href = redirectTo;
    return null;
  }
  return session;
}

async function requireTeacher() {
  const session = await requireAuth();
  if (!session) return null;
  const profile = await getProfile(session.user.id);
  if (!profile || profile.role !== 'teacher') {
    window.location.href = '/physics/app.html';
    return null;
  }
  return { session, profile };
}

async function signOut() {
  await sb.auth.signOut();
  window.location.href = '/physics/login.html';
}
