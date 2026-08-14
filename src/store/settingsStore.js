import { create } from "zustand";
import { supabase } from "../lib/supabase";

export const useSettingsStore = create((set, get) => ({
  settings: {
    theme: "SYSTEM",
    accent_color: "#ec4899",
    font_size: 16,
    notifications: true,
    auto_save: true,
    language: "ar",
  },
  darkMode: false,

  loadSettings: async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("settings")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (error && error.code !== "PGRST116") throw error;

      const settings = data || get().settings;
      set({ settings });

      const isDark =
        settings.theme === "DARK" ||
        (settings.theme === "SYSTEM" &&
          window.matchMedia("(prefers-color-scheme: dark)").matches);

      set({ darkMode: isDark });
      document.documentElement.classList.toggle("dark", isDark);
    } catch (error) {
      console.error("Error loading settings:", error);
    }
  },

  updateSettings: async (newSettings) => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data: existing } = await supabase
        .from("settings")
        .select("id")
        .eq("user_id", user.id)
        .single();

      let result;
      if (existing) {
        result = await supabase
          .from("settings")
          .update(newSettings)
          .eq("user_id", user.id)
          .select()
          .single();
      } else {
        result = await supabase
          .from("settings")
          .insert([{ ...newSettings, user_id: user.id }])
          .select()
          .single();
      }

      if (result.error) throw result.error;

      set({ settings: result.data });

      if (result.data.theme === "DARK") {
        set({ darkMode: true });
        document.documentElement.classList.add("dark");
      } else if (result.data.theme === "LIGHT") {
        set({ darkMode: false });
        document.documentElement.classList.remove("dark");
      } else {
        const isDark = window.matchMedia(
          "(prefers-color-scheme: dark)",
        ).matches;
        set({ darkMode: isDark });
        document.documentElement.classList.toggle("dark", isDark);
      }
    } catch (error) {
      console.error("Error updating settings:", error);
    }
  },

  toggleDarkMode: () => {
    set((state) => {
      const newMode = !state.darkMode;
      document.documentElement.classList.toggle("dark", newMode);
      return { darkMode: newMode };
    });
  },
}));
