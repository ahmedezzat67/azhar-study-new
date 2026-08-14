import { supabase, toCamelCase } from "./apiClient";

export const settingsApi = {
  getSettings: async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return {
        theme: "SYSTEM",
        accentColor: "#ec4899",
        fontSize: 16,
        notifications: true,
        autoSave: true,
        language: "ar",
      };
    }

    const { data, error } = await supabase
      .from("settings")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();
    if (error) throw new Error(error.message);

    if (!data) {
      const defaults = {
        user_id: user.id,
        theme: "SYSTEM",
        accent_color: "#ec4899",
        font_size: 16,
        notifications: true,
        auto_save: true,
        language: "ar",
      };
      const { data: created, error: ce } = await supabase
        .from("settings")
        .insert([defaults])
        .select()
        .single();
      if (ce) throw new Error(ce.message);
      return toCamelCase(created);
    }
    return toCamelCase(data);
  },

  updateSettings: async (settings) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    const update = {};
    if (settings.theme !== undefined) update.theme = settings.theme;
    if (settings.accentColor !== undefined)
      update.accent_color = settings.accentColor;
    if (settings.fontSize !== undefined) update.font_size = settings.fontSize;
    if (settings.notifications !== undefined)
      update.notifications = settings.notifications;
    if (settings.autoSave !== undefined) update.auto_save = settings.autoSave;
    if (settings.language !== undefined) update.language = settings.language;

    const { data, error } = await supabase
      .from("settings")
      .update(update)
      .eq("user_id", user.id)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return toCamelCase(data);
  },
};
