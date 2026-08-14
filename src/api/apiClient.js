import { supabase } from "../lib/supabase";

export const toCamelCase = (obj) => {
  if (obj === null || obj === undefined) return obj;
  if (Array.isArray(obj)) return obj.map(toCamelCase);
  if (typeof obj !== "object") return obj;
  return Object.keys(obj).reduce((acc, key) => {
    const camelKey = key.replace(/_([a-z])/g, (_, letter) =>
      letter.toUpperCase(),
    );
    acc[camelKey] = toCamelCase(obj[key]);
    return acc;
  }, {});
};

export { supabase };
