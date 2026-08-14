import { create } from "zustand";
import { supabase } from "../lib/supabase";

export const useQuizzesStore = create((set, get) => ({
  quizzes: [],
  currentQuiz: null,
  isLoading: false,
  error: null,

  fetchQuizzes: async (lessonId) => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from("quizzes")
        .select("*")
        .eq("lesson_id", lessonId);

      if (error) throw error;
      set({ quizzes: data || [], isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  submitQuiz: async (quizId, answers) => {
    try {
      // Calculate score
      const quiz = get().quizzes.find((q) => q.id === quizId);
      let correct = 0;
      quiz.questions.forEach((q, i) => {
        if (q.correctAnswer === answers[i]) correct++;
      });
      const score = Math.round((correct / quiz.questions.length) * 100);

      const { data: updated, error } = await supabase
        .from("quizzes")
        .update({ score })
        .eq("id", quizId)
        .select()
        .single();

      if (error) throw error;
      set((state) => ({
        quizzes: state.quizzes.map((q) => (q.id === quizId ? updated : q)),
      }));
      return score;
    } catch (error) {
      console.error(error);
    }
  },
}));
