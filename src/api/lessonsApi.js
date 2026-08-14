import { supabase, toCamelCase } from './apiClient';

const lessonMap = {
  subjectId: 'subject_id', title: 'title', description: 'description', content: 'content',
  summary: 'summary', understanding: 'understanding', keyIdeas: 'key_ideas',
  importantPoints: 'important_points', keywords: 'keywords', definitions: 'definitions',
  formulas: 'formulas', notes: 'notes', examNotes: 'exam_notes', commonMistakes: 'common_mistakes',
  difficulty: 'difficulty', status: 'status', isFavorite: 'is_favorite', reviewCount: 'review_count',
};

const buildLessonInsert = (data) => {
  const insert = {};
  for (const [camel, snake] of Object.entries(lessonMap)) {
    if (data[camel] !== undefined) insert[snake] = data[camel];
  }
  if (!insert.status) insert.status = 'NOT_STARTED';
  if (insert.is_favorite === undefined) insert.is_favorite = false;
  if (insert.review_count === undefined) insert.review_count = 0;
  return insert;
};

export const lessonsApi = {
  getLessons: async (subjectId) => {
    let q = supabase.from('lessons').select('*');
    if (subjectId) q = q.eq('subject_id', subjectId);
    const { data, error } = await q;
    if (error) throw new Error(error.message);
    return toCamelCase(data || []);
  },

  getLesson: async (id) => {
    const { data, error } = await supabase.from('lessons').select('*, flashcards(*)').eq('id', id).single();
    if (error) throw new Error(error.message);
    return toCamelCase(data);
  },

  createLesson: async (data) => {
    const { data: lesson, error } = await supabase.from('lessons').insert([buildLessonInsert(data)]).select().single();
    if (error) throw new Error(error.message);
    return toCamelCase(lesson);
  },

  updateLesson: async (id, data) => {
    const updateData = {};
    for (const [camel, snake] of Object.entries(lessonMap)) {
      if (data[camel] !== undefined) updateData[snake] = data[camel];
    }
    updateData.updated_at = new Date().toISOString();
    const { data: lesson, error } = await supabase.from('lessons').update(updateData).eq('id', id).select().single();
    if (error) throw new Error(error.message);
    return toCamelCase(lesson);
  },

  deleteLesson: async (id) => {
    const { error } = await supabase.from('lessons').delete().eq('id', id);
    if (error) throw new Error(error.message);
    return { success: true };
  },

  duplicateLesson: async (id) => {
    const { data: l, error } = await supabase.from('lessons').select('*').eq('id', id).single();
    if (error) throw new Error(error.message);
    const insert = { ...l };
    delete insert.id; delete insert.created_at; delete insert.updated_at; delete insert.last_reviewed_at;
    insert.title = `${l.title} (نسخة)`;
    insert.status = 'NOT_STARTED'; insert.is_favorite = false; insert.review_count = 0;
    const { data: nl, error: ne } = await supabase.from('lessons').insert([insert]).select().single();
    if (ne) throw new Error(ne.message);
    return toCamelCase(nl);
  },

  getLessonVersions: async () => [
    { id: '1', version: 1, createdAt: new Date().toISOString(), content: 'Version 1' },
    { id: '2', version: 2, createdAt: new Date().toISOString(), content: 'Version 2' },
  ],

  restoreLessonVersion: async () => ({ success: true }),

  addFavorite: async (id) => {
    const { error } = await supabase.from('lessons').update({ is_favorite: true }).eq('id', id);
    if (error) throw new Error(error.message);
    return { success: true };
  },

  removeFavorite: async (id) => {
    const { error } = await supabase.from('lessons').update({ is_favorite: false }).eq('id', id);
    if (error) throw new Error(error.message);
    return { success: true };
  },

  getFavorites: async () => {
    const { data, error } = await supabase.from('lessons').select('*').eq('is_favorite', true);
    if (error) throw new Error(error.message);
    return toCamelCase(data || []);
  },

  searchLessons: async (query) => {
    const { data, error } = await supabase.from('lessons').select('*');
    if (error) throw new Error(error.message);
    const q = query.toLowerCase();
    const filtered = (data || []).filter(l =>
      l.title?.toLowerCase().includes(q) || l.content?.toLowerCase().includes(q) ||
      l.keywords?.some(k => k.toLowerCase().includes(q)) || l.notes?.toLowerCase().includes(q)
    );
    return toCamelCase(filtered);
  },
};
