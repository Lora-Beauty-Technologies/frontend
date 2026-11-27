import { createClient } from "@supabase/supabase-js";
import { supabasePublishableKey, supabaseUrl } from "./env";

/** Cookie-free client for the public catalog (RLS: public read). */
export const catalogClient = () => createClient(supabaseUrl, supabasePublishableKey, { auth: { persistSession: false } });
