import { supabase, toCamelCase } from './apiClient';

export const reviewsApi = {
  getReviews: async (lessonId) => {
    let q = supabase.from('reviews').select('*');
    if (lessonId) q = q.eq('lesson_id', lessonId);
    const { data, error } = await q;
    if (error) throw new Error(error.message);
    return toCamelCase(data || []);
  },

  createReview: async (data) => {
    const { data: review, error } = await supabase.from('reviews').insert([{
      lesson_id: data.lessonId, score: data.score, difficulty: data.difficulty,
    }]).select().single();
    if (error) throw new Error(error.message);
    return toCamelCase(review);
  },

  getTodayReview: async () => {
    const today = new Date().toISOString().split('T')[0];
    const { data, error } = await supabase.from('reviews').select('*').gte('reviewed_at', today);
    if (error) throw new Error(error.message);
    return toCamelCase(data || []);
  },

  getSmartReview: async () => {
    const { data, error } = await supabase.from('reviews').select('*').limit(5);
    if (error) throw new Error(error.message);
    return toCamelCase(data || []);
  },
};
