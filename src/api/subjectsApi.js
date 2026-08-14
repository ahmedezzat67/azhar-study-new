import { supabase, toCamelCase } from './apiClient';

export const subjectsApi = {
  getSubjects: async () => {
    const { data: subjects, error } = await supabase.from('subjects').select('*');
    if (error) throw new Error(error.message);
    const { data: lessons, error: le } = await supabase.from('lessons').select('subject_id, status');
    if (le) throw new Error(le.message);
    return subjects.map(s => {
      const sl = lessons?.filter(l => l.subject_id === s.id) || [];
      return { ...toCamelCase(s), lessonsCount: sl.length, completedLessons: sl.filter(l => l.status === 'COMPLETED').length };
    });
  },

  getSubject: async (id) => {
    const { data, error } = await supabase.from('subjects').select('*, lessons(*)').eq('id', id).single();
    if (error) throw new Error(error.message);
    return toCamelCase(data);
  },

  createSubject: async (data) => {
    const { data: subject, error } = await supabase.from('subjects').insert([{
      name: data.name, description: data.description, icon: data.icon,
      color: data.color, image: data.image, order: data.order, tags: data.tags,
    }]).select().single();
    if (error) throw new Error(error.message);
    return toCamelCase(subject);
  },

  updateSubject: async (id, data) => {
    const updateData = {};
    const map = { name:'name', description:'description', icon:'icon', color:'color', image:'image', order:'order', tags:'tags' };
    for (const [k,v] of Object.entries(map)) if (data[k] !== undefined) updateData[v] = data[k];
    updateData.updated_at = new Date().toISOString();
    const { data: subject, error } = await supabase.from('subjects').update(updateData).eq('id', id).select().single();
    if (error) throw new Error(error.message);
    return toCamelCase(subject);
  },

  deleteSubject: async (id) => {
    const { error } = await supabase.from('subjects').delete().eq('id', id);
    if (error) throw new Error(error.message);
    return { success: true };
  },

  reorderLessons: async (subjectId, lessonIds) => ({ success: true, subjectId, lessonIds }),

  duplicateSubject: async (id) => {
    const { data: s, error } = await supabase.from('subjects').select('*').eq('id', id).single();
    if (error) throw new Error(error.message);
    const { data: ns, error: ne } = await supabase.from('subjects').insert([{
      name: `${s.name} (نسخة)`, description: s.description, icon: s.icon,
      color: s.color, image: s.image, order: s.order, tags: s.tags,
    }]).select().single();
    if (ne) throw new Error(ne.message);
    return toCamelCase(ns);
  },
};
