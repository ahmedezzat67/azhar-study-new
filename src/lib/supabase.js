import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

console.log("URL:", supabaseUrl);
console.log("Key loaded:", supabaseKey ? "YES ✅" : "NO ❌");
console.log("Key starts with:", supabaseKey.substring(0, 20));
export const supabase = createClient(supabaseUrl, supabaseKey);
