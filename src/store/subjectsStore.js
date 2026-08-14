import { create } from "zustand";
import { supabase } from "../lib/supabase";

export const useSubjectsStore = create((set, get) => ({
  subjects: [],
  currentSubject: null,
  isLoading: false,
  error: null,

  fetchSubjects: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from("subjects")
        .select("*")
        .order('"order"', { ascending: true });

      if (error) throw error;
      set({ subjects: data || [], isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  fetchSubject: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const { data: subject, error } = await supabase
        .from("subjects")
        .select("*, lessons(*)")
        .eq("id", id)
        .single();

      if (error) throw error;
      set({ currentSubject: subject, isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  createSubject: async (data) => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      const { data: newSubject, error } = await supabase
        .from("subjects")
        .insert([{ ...data, user_id: user.id }])
        .select()
        .single();

      if (error) throw error;
      set((state) => ({ subjects: [...state.subjects, newSubject] }));
      return newSubject;
    } catch (error) {
      set({ error: error.message });
      throw error;
    }
  },

  updateSubject: async (id, data) => {
    try {
      const { data: updated, error } = await supabase
        .from("subjects")
        .update(data)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      set((state) => ({
        subjects: state.subjects.map((s) => (s.id === id ? updated : s)),
        currentSubject:
          state.currentSubject?.id === id ? updated : state.currentSubject,
      }));
    } catch (error) {
      set({ error: error.message });
      throw error;
    }
  },

  deleteSubject: async (id) => {
    try {
      const { error } = await supabase.from("subjects").delete().eq("id", id);

      if (error) throw error;
      set((state) => ({
        subjects: state.subjects.filter((s) => s.id !== id),
        currentSubject:
          state.currentSubject?.id === id ? null : state.currentSubject,
      }));
    } catch (error) {
      set({ error: error.message });
      throw error;
    }
  },
}));
