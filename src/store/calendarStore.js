import { create } from "zustand";
import { supabase } from "../lib/supabase";

export const useCalendarStore = create((set, get) => ({
  events: [],
  isLoading: false,
  error: null,

  fetchEvents: async () => {
    set({ isLoading: true, error: null });
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      const { data, error } = await supabase
        .from("calendar_events")
        .select("*")
        .eq("user_id", user.id)
        .order("date", { ascending: true });

      if (error) throw error;
      set({ events: data || [], isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  createEvent: async (data) => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      const { data: newEvent, error } = await supabase
        .from("calendar_events")
        .insert([{ ...data, user_id: user.id }])
        .select()
        .single();

      if (error) throw error;
      set((state) => ({ events: [...state.events, newEvent] }));
      return newEvent;
    } catch (error) {
      set({ error: error.message });
      throw error;
    }
  },

  deleteEvent: async (id) => {
    try {
      await supabase.from("calendar_events").delete().eq("id", id);
      set((state) => ({ events: state.events.filter((e) => e.id !== id) }));
    } catch (error) {
      console.error(error);
    }
  },
}));
