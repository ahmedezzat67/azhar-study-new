import { supabase, toCamelCase } from './apiClient';

export const quizzesApi = {
  getQuizzes: async (lessonId) => {
    let q = supabase.from('quizzes').select('*');
    if (lessonId) q = q.eq('lesson_id', lessonId);
    const { data, error } = await q;
    if (error) throw new Error(error.message);
    return toCamelCase(data || []);
  },

  getQuiz: async (id) => {
    const { data, error } = await supabase.from('quizzes').select('*').eq('id', id).single();
    if (error) throw new Error(error.message);
    return toCamelCase(data);
  },

  createQuiz: async (data) => {
    const { data: quiz, error } = await supabase.from('quizzes').insert([{
      lesson_id: data.lessonId, title: data.title, questions: data.questions, score: 0,
    }]).select().single();
    if (error) throw new Error(error.message);
    return toCamelCase(quiz);
  },

  updateQuiz: async (id, data) => {
    const update = {};
    if (data.title !== undefined) update.title = data.title;
    if (data.questions !== undefined) update.questions = data.questions;
    if (data.score !== undefined) update.score = data.score;
    const { data: quiz, error } = await supabase.from('quizzes').update(update).eq('id', id).select().single();
    if (error) throw new Error(error.message);
    return toCamelCase(quiz);
  },

  deleteQuiz: async (id) => {
    const { error } = await supabase.from('quizzes').delete().eq('id', id);
    if (error) throw new Error(error.message);
    return { success: true };
  },

  submitQuiz: async (id, answers) => {
    const { data: quiz, error } = await supabase.from('quizzes').select('questions').eq('id', id).single();
    if (error) throw new Error(error.message);
    let correct = 0;
    quiz.questions.forEach((q, i) => { if (q.correctAnswer === answers[i]) correct++; });
    const score = Math.round((correct / quiz.questions.length) * 100);
    await supabase.from('quizzes').update({ score }).eq('id', id);
    return { score, correct, wrong: quiz.questions.length - correct, total: quiz.questions.length, percentage: score };
  },

  getWrongAnswers: async () => [],

  duplicateQuiz: async (id) => {
    const { data: q, error } = await supabase.from('quizzes').select('*').eq('id', id).single();
    if (error) throw new Error(error.message);
    const { data: nq, error: ne } = await supabase.from('quizzes').insert([{
      lesson_id: q.lesson_id, title: `${q.title} (نسخة)`, questions: q.questions, score: 0,
    }]).select().single();
    if (ne) throw new Error(ne.message);
    return toCamelCase(nq);
  },
};
