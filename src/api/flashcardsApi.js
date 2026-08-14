import { supabase, toCamelCase } from './apiClient';

export const flashcardsApi = {
  getFlashcards: async (lessonId) => {
    let q = supabase.from('flashcards').select('*');
    if (lessonId) q = q.eq('lesson_id', lessonId);
    const { data, error } = await q;
    if (error) throw new Error(error.message);
    return toCamelCase(data || []);
  },

  getFlashcard: async (id) => {
    const { data, error } = await supabase.from('flashcards').select('*').eq('id', id).single();
    if (error) throw new Error(error.message);
    return toCamelCase(data);
  },

  createFlashcard: async (data) => {
    const { data: card, error } = await supabase.from('flashcards').insert([{
      lesson_id: data.lessonId, question: data.question, answer: data.answer,
      difficulty: data.difficulty || 'EASY', review_count: data.reviewCount || 0,
    }]).select().single();
    if (error) throw new Error(error.message);
    return toCamelCase(card);
  },

  updateFlashcard: async (id, data) => {
    const update = {};
    if (data.question !== undefined) update.question = data.question;
    if (data.answer !== undefined) update.answer = data.answer;
    if (data.difficulty !== undefined) update.difficulty = data.difficulty;
    if (data.reviewCount !== undefined) update.review_count = data.reviewCount;
    const { data: card, error } = await supabase.from('flashcards').update(update).eq('id', id).select().single();
    if (error) throw new Error(error.message);
    return toCamelCase(card);
  },

  deleteFlashcard: async (id) => {
    const { error } = await supabase.from('flashcards').delete().eq('id', id);
    if (error) throw new Error(error.message);
    return { success: true };
  },

  reviewFlashcard: async (id) => {
    const { data: card, error } = await supabase.from('flashcards').select('review_count').eq('id', id).single();
    if (error) throw new Error(error.message);
    const { error: ue } = await supabase.from('flashcards').update({
      review_count: (card.review_count || 0) + 1,
      last_reviewed_at: new Date().toISOString(),
    }).eq('id', id);
    if (ue) throw new Error(ue.message);
    return { success: true };
  },

  duplicateFlashcard: async (id) => {
    const { data: c, error } = await supabase.from('flashcards').select('*').eq('id', id).single();
    if (error) throw new Error(error.message);
    const { data: nc, error: ne } = await supabase.from('flashcards').insert([{
      lesson_id: c.lesson_id, question: c.question, answer: c.answer,
      difficulty: c.difficulty, review_count: 0,
    }]).select().single();
    if (ne) throw new Error(ne.message);
    return toCamelCase(nc);
  },
};
