import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://mrstwkqgregzshsbjbre.supabase.co";
const supabaseKey = "sb_publishable_ZPln2KJKNpws4cHOPA26_A_-OoQccHb";

export const supabase = createClient(supabaseUrl, supabaseKey);