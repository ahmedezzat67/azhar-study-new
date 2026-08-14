import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { subjectsApi } from '../../api';
import toast from 'react-hot-toast';

const colors = [
  '#ec4899', '#8b5cf6', '#3b82f6', '#10b981', '#f59e0b',
  '#ef4444', '#14b8a6', '#f97316', '#6366f1', '#06b6d4',
];

export default function SubjectModal({ onClose, onSuccess }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = colors[0];
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await subjectsApi.createSubject({ name, description, color, icon: 'BookOpen' });
      toast.success('تم إضافة المادة بنجاح');
      onSuccess();
      onClose();
    } catch (error) {
      toast.error('حدث خطأ');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="glass-card w-full max-w-md p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">إضافة مادة جديدة</h2>
            <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">اسم المادة</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="input-field" required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">الوصف</label>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="input-field h-24" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">اللون</label>
              <div className="flex gap-2 flex-wrap">
                {colors.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setColor(c)}
                    className={`w-8 h-8 rounded-full transition-transform ${color === c ? 'scale-125 ring-2 ring-offset-2 ring-gray-400' : ''}`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>
            <button type="submit" disabled={isLoading} className="btn-primary w-full">
              {isLoading ? 'جاري الحفظ...' : 'حفظ'}
            </button>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}