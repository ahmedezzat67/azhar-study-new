import { supabase, toCamelCase } from './apiClient';

export const achievementsApi = {
  getAchievements: async () => {
    const { data, error } = await supabase.from('achievements').select('*');
    if (error) throw new Error(error.message);
    return toCamelCase(data || []);
  },

  unlockAchievement: async (id) => {
    const { error } = await supabase.from('achievements').update({
      unlocked: true,
      unlocked_at: new Date().toISOString(),
    }).eq('id', id);
    if (error) throw new Error(error.message);
    return { success: true };
  },
};
