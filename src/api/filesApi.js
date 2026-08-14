import { supabase } from './apiClient';

export const filesApi = {
  uploadFile: async (file, type = 'image') => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `${type}s/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('uploads')
      .upload(filePath, file);

    if (uploadError) throw new Error(uploadError.message);

    const { data: { publicUrl } } = supabase.storage
      .from('uploads')
      .getPublicUrl(filePath);

    return { url: publicUrl, name: file.name, size: file.size, type: file.type };
  },

  deleteFile: async (url) => {
    const path = url.split('/uploads/')[1];
    if (!path) return { success: true };
    const { error } = await supabase.storage.from('uploads').remove([path]);
    if (error) throw new Error(error.message);
    return { success: true };
  },
};
