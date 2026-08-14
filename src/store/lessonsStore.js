import { create } from "zustand";
import { supabase } from "../lib/supabase";

export const useLessonsStore = create((set, get) => ({
  lessons: [],
  currentLesson: null,
  isLoading: false,
  error: null,

  fetchLessons: async (subjectId) => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from("lessons")
        .select("*")
        .eq("subject_id", subjectId)
        .order("created_at", { ascending: true });

      if (error) throw error;
      set({ lessons: data || [], isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  fetchLesson: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from("lessons")
        .select("*, flashcards(*), quizzes(*)")
        .eq("id", id)
        .single();

      if (error) throw error;
      set({ currentLesson: data, isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  createLesson: async (data) => {
    try {
      const { data: newLesson, error } = await supabase
        .from("lessons")
        .insert([data])
        .select()
        .single();

      if (error) throw error;
      set((state) => ({ lessons: [...state.lessons, newLesson] }));
      return newLesson;
    } catch (error) {
      set({ error: error.message });
      throw error;
    }
  },

  updateLesson: async (id, data) => {
    try {
      const { data: updated, error } = await supabase
        .from("lessons")
        .update(data)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      set((state) => ({
        lessons: state.lessons.map((l) => (l.id === id ? updated : l)),
        currentLesson:
          state.currentLesson?.id === id ? updated : state.currentLesson,
      }));
    } catch (error) {
      set({ error: error.message });
      throw error;
    }
  },

  toggleFavorite: async (id, currentStatus) => {
    try {
      const { data: updated, error } = await supabase
        .from("lessons")
        .update({ is_favorite: !currentStatus })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      set((state) => ({
        lessons: state.lessons.map((l) => (l.id === id ? updated : l)),
        currentLesson:
          state.currentLesson?.id === id ? updated : state.currentLesson,
      }));
    } catch (error) {
      console.error(error);
    }
  },
}));
