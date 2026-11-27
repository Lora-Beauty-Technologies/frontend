import { connection } from "next/server";
import { createClient as createServerSupabase } from "./server";

/** Access token of the signed-in web user (server side), or null. */
export async function serverAccessToken() {
  // Session checks read the clock; mark the render as request-time first.
  await connection();
  const supabase = await createServerSupabase();
  const { data } = await supabase.auth.getSession();
  return data.session?.access_token ?? null;
}
