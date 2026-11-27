import { createClient } from "./client";

/** Access token of the signed-in web user (browser side), or null. */
export async function browserAccessToken() {
  const { data } = await createClient().auth.getSession();
  return data.session?.access_token ?? null;
}
