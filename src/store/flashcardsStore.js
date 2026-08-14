import { create } from "zustand";
import { supabase } from "../lib/supabase";

export const useFlashcardsStore = create((set, get) => ({
  flashcards: [],
  isLoading: false,
  error: null,

  fetchFlashcards: async (lessonId) => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from("flashcards")
        .select("*")
        .eq("lesson_id", lessonId);

      if (error) throw error;
      set({ flashcards: data || [], isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  createFlashcard: async (data) => {
    try {
      const { data: newCard, error } = await supabase
        .from("flashcards")
        .insert([data])
        .select()
        .single();

      if (error) throw error;
      set((state) => ({ flashcards: [...state.flashcards, newCard] }));
      return newCard;
    } catch (error) {
      set({ error: error.message });
      throw error;
    }
  },
}));
