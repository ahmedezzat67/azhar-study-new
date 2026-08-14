import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, ChevronLeft, MoreVertical, Trash2, Copy } from 'lucide-react';
import { useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import { subjectsApi } from '../../api';
import { getProgressColor, calculatePercentage } from '../../utils/helpers';
import toast from 'react-hot-toast';

const iconMap = {
  BookOpen, Scroll: BookOpen, Scale: BookOpen, Star: BookOpen,
  PenTool: BookOpen, Type: BookOpen, MessageCircle: BookOpen,
  Feather: BookOpen, Globe: BookOpen, Calculator: BookOpen,
  Sigma: BookOpen, Triangle: BookOpen, Zap: BookOpen,
  FlaskConical: BookOpen, Leaf: BookOpen, Clock: BookOpen,
  Map: BookOpen, Monitor: BookOpen, Glasses: BookOpen,
};

export default function SubjectCard({ subject, onUpdate }) {
  const [showMenu, setShowMenu] = useState(false);
  const { hasPermission } = useAuthStore();
  const Icon = iconMap[subject.icon] || BookOpen;
  const progress = calculatePercentage(subject.completedLessons, subject.lessonsCount);

  const handleDelete = async () => {
    if (confirm('هل أنتِ متأكدة من حذف هذه المادة؟')) {
      await subjectsApi.deleteSubject(subject.id);
      onUpdate();
      toast.success('تم حذف المادة');
    }
  };

  const handleDuplicate = async () => {
    await subjectsApi.duplicateSubject(subject.id);
    onUpdate();
    toast.success('تم نسخ المادة');
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -5 }}
      className="glass-card p-5 card-hover relative group"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: subject.color + '20' }}>
          <Icon className="w-6 h-6" style={{ color: subject.color }} />
        </div>
        {hasPermission('canDeleteSubject') && (
          <div className="relative">
            <button onClick={() => setShowMenu(!showMenu)} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 opacity-0 group-hover:opacity-100 transition-opacity">
              <MoreVertical className="w-4 h-4" />
            </button>
            {showMenu && (
              <div className="absolute left-0 top-8 z-10 w-40 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 py-2">
                <button onClick={handleDuplicate} className="w-full px-4 py-2 text-right hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2">
                  <Copy className="w-4 h-4" /> نسخ
                </button>
                <button onClick={handleDelete} className="w-full px-4 py-2 text-right hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 flex items-center gap-2">
                  <Trash2 className="w-4 h-4" /> حذف
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <h3 className="font-bold text-lg mb-1">{subject.name}</h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 line-clamp-2">{subject.description}</p>

      <div className="mb-4">
        <div className="flex justify-between text-sm mb-1">
          <span>{subject.completedLessons} / {subject.lessonsCount} درس</span>
          <span>{progress}%</span>
        </div>
        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div className={`h-full rounded-full transition-all duration-500 ${getProgressColor(progress)}`} style={{ width: `${progress}%` }} />
        </div>
      </div>

      <Link to={`/subjects/${subject.id}`} className="flex items-center gap-2 text-sm font-medium hover:text-pink-500 transition-colors">
        عرض الدروس <ChevronLeft className="w-4 h-4" />
      </Link>
    </motion.div>
  );
}