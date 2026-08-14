import { supabase } from './apiClient';

export const authApi = {
  login: async (credentials) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password,
    });
    if (error) throw new Error(error.message);
    const user = {
      id: data.user.id,
      email: data.user.email,
      name: data.user.user_metadata?.name || data.user.email,
      role: data.user.user_metadata?.role || 'VIEWER',
      avatar: data.user.user_metadata?.avatar || null,
    };
    return { user, token: data.session.access_token };
  },

  register: async (userData) => {
    const { data, error } = await supabase.auth.signUp({
      email: userData.email,
      password: userData.password,
      options: {
        data: { name: userData.name, role: 'VIEWER', avatar: null },
      },
    });
    if (error) throw new Error(error.message);
    const user = {
      id: data.user.id,
      email: data.user.email,
      name: userData.name,
      role: 'VIEWER',
      avatar: null,
    };
    return { user, token: data.session.access_token };
  },

  logout: async () => {
    await supabase.auth.signOut();
    return { success: true };
  },

  getCurrentUser: async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;
    return {
      id: user.id,
      email: user.email,
      name: user.user_metadata?.name || user.email,
      role: user.user_metadata?.role || 'VIEWER',
      avatar: user.user_metadata?.avatar || null,
    };
  },

  forgotPassword: async (email) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) throw new Error(error.message);
    return { message: 'Password reset email sent' };
  },

  resetPassword: async (token, password) => {
    const { error } = await supabase.auth.updateUser({ password });
    if (error) throw new Error(error.message);
    return { message: 'Password reset successful' };
  },
};
