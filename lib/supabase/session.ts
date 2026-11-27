import { createClient as createServerSupabase } from "./server";

/** Access token of the signed-in web user (server side), or null. */
export async function serverAccessToken() {
  const supabase = await createServerSupabase();
  const { data } = await supabase.auth.getSession();
  return data.session?.access_token ?? null;
}
