import { create } from "zustand";
import { supabase } from "../lib/supabase";

const ADMIN_EMAIL = "lys086703@gmail.com";

export const useAuthStore = create((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,

  initialize: () => {
    set({ isLoading: true, error: null });

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        const role = session.user.email === ADMIN_EMAIL ? "ADMIN" : "VIEWER";
        set({
          user: {
            id: session.user.id,
            email: session.user.email,
            name: session.user.user_metadata?.name || session.user.email,
            role: role,
          },
          isAuthenticated: true,
          isLoading: false,
        });
      } else {
        set({ user: null, isAuthenticated: false, isLoading: false });
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const role = session.user.email === ADMIN_EMAIL ? "ADMIN" : "VIEWER";
        set({
          user: {
            id: session.user.id,
            email: session.user.email,
            name: session.user.user_metadata?.name || session.user.email,
            role: role,
          },
          isAuthenticated: true,
          isLoading: false,
        });
      } else {
        set({ user: null, isAuthenticated: false, isLoading: false });
      }
    });

    return () => subscription.unsubscribe();
  },

  login: async (credentials) => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      });

      if (error) {
        set({ error: error.message, isLoading: false });
        return false;
      }

      if (!data.user || !data.session) {
        set({ error: "حدث خطأ غير متوقع، حاول مرة أخرى", isLoading: false });
        return false;
      }

      const role = data.user.email === ADMIN_EMAIL ? "ADMIN" : "VIEWER";

      set({
        user: {
          id: data.user.id,
          email: data.user.email,
          name: data.user.user_metadata?.name || data.user.email,
          role: role,
        },
        isAuthenticated: true,
        isLoading: false,
      });
      return true;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      return false;
    }
  },

  register: async (userData) => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          data: { name: userData.name, role: "VIEWER" },
        },
      });

      if (error) {
        set({ error: error.message, isLoading: false });
        return false;
      }

      // لو مفيش session يعني Confirm Email مفعل والإيميل لسه مش متأكد
      if (!data.session) {
        set({
          error: "تم إنشاء الحساب! يرجى تأكيد البريد الإلكتروني من الرابط اللي وصلك",
          isLoading: false,
        });
        return false;
      }

      // لو فيه session يبقى مسجل دخول فعلاً
      const role = data.user.email === ADMIN_EMAIL ? "ADMIN" : "VIEWER";

      set({
        user: {
          id: data.user.id,
          email: data.user.email,
          name: userData.name,
          role: role,
        },
        isAuthenticated: true,
        isLoading: false,
      });
      return true;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      return false;
    }
  },

  logout: async () => {
    set({ isLoading: true });
    await supabase.auth.signOut();
    set({ user: null, isAuthenticated: false, isLoading: false, error: null });
  },

  loadUser: async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const role = user.email === ADMIN_EMAIL ? "ADMIN" : "VIEWER";
        set({
          user: {
            id: user.id,
            email: user.email,
            name: user.user_metadata?.name || user.email,
            role: role,
          },
          isAuthenticated: true,
        });
      }
    } catch (error) {
      console.error("Error loading user:", error);
    }
  },

  clearError: () => set({ error: null }),

  hasPermission: (permission) => {
    const { user } = get();
    if (!user) return false;
    if (user.role === "ADMIN") return true;
    const viewerPerms = ["canViewSubject", "canViewLesson", "canTakeQuiz"];
    return viewerPerms.includes(permission);
  },

  isAdmin: () => {
    return get().user?.role === "ADMIN";
  },
}));