import { create } from 'zustand';
import { lessonsApi } from '../api';

export const useLessonsStore = create((set, get) => ({
  lessons: [],
  currentLesson: null,
  favorites: [],
  searchResults: [],
  isLoading: false,

  fetchLessons: async (subjectId) => {
    set({ isLoading: true });
    const lessons = await lessonsApi.getLessons(subjectId);
    set({ lessons, isLoading: false });
  },

  fetchLesson: async (id) => {
    set({ isLoading: true });
    const lesson = await lessonsApi.getLesson(id);
    set({ currentLesson: lesson, isLoading: false });
  },

  updateLesson: async (id, data) => {
    const updated = await lessonsApi.updateLesson(id, data);
    set((state) => ({
      lessons: state.lessons.map((l) => (l.id === id ? updated : l)),
      currentLesson: state.currentLesson?.id === id ? updated : state.currentLesson,
    }));
  },

  deleteLesson: async (id) => {
    await lessonsApi.deleteLesson(id);
    set((state) => ({
      lessons: state.lessons.filter((l) => l.id !== id),
      currentLesson: state.currentLesson?.id === id ? null : state.currentLesson,
    }));
  },

  searchLessons: async (query) => {
    if (!query) { set({ searchResults: [] }); return; }
    const results = await lessonsApi.searchLessons(query);
    set({ searchResults: results });
  },

  toggleFavorite: async (id) => {
    const lesson = get().lessons.find((l) => l.id === id);
    if (lesson?.isFavorite) await lessonsApi.removeFavorite(id);
    else await lessonsApi.addFavorite(id);
    get().fetchLessons();
  },
}));