import { format, formatDistanceToNow, isToday, isYesterday } from 'date-fns';
import { ar } from 'date-fns/locale';

export const formatDate = (date) => {
  if (!date) return '-';
  const d = new Date(date);
  if (isToday(d)) return 'اليوم';
  if (isYesterday(d)) return 'أمس';
  return format(d, 'dd MMMM yyyy', { locale: ar });
};

export const formatDateTime = (date) => {
  if (!date) return '-';
  return format(new Date(date), 'dd MMMM yyyy - HH:mm', { locale: ar });
};

export const timeAgo = (date) => {
  if (!date) return '-';
  return formatDistanceToNow(new Date(date), { locale: ar, addSuffix: true });
};

export const generateId = () => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

export const cn = (...classes) => {
  return classes.filter(Boolean).join(' ');
};

export const getProgressColor = (percentage) => {
  if (percentage >= 80) return 'bg-green-400';
  if (percentage >= 60) return 'bg-blue-400';
  if (percentage >= 40) return 'bg-yellow-400';
  return 'bg-red-400';
};

export const getDifficultyColor = (difficulty) => {
  switch (difficulty) {
    case 'EASY': return 'text-green-500 bg-green-50 dark:bg-green-900/20';
    case 'MEDIUM': return 'text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20';
    case 'HARD': return 'text-red-500 bg-red-50 dark:bg-red-900/20';
    default: return 'text-gray-500 bg-gray-50 dark:bg-gray-900/20';
  }
};

export const getDifficultyLabel = (difficulty) => {
  switch (difficulty) {
    case 'EASY': return 'سهل';
    case 'MEDIUM': return 'متوسط';
    case 'HARD': return 'صعب';
    default: return 'غير محدد';
  }
};

export const getStatusLabel = (status) => {
  switch (status) {
    case 'NOT_STARTED': return 'لم يبدأ';
    case 'IN_PROGRESS': return 'قيد التقدم';
    case 'COMPLETED': return 'مكتمل';
    case 'REVIEW_LATER': return 'مراجعة لاحقًا';
    case 'NOT_UNDERSTOOD': return 'لم أفهم بعد';
    case 'MASTERED': return 'تم الحفظ';
    default: return 'غير محدد';
  }
};

export const getStatusColor = (status) => {
  switch (status) {
    case 'NOT_STARTED': return 'text-gray-500 bg-gray-50 dark:bg-gray-900/20';
    case 'IN_PROGRESS': return 'text-blue-500 bg-blue-50 dark:bg-blue-900/20';
    case 'COMPLETED': return 'text-green-500 bg-green-50 dark:bg-green-900/20';
    case 'REVIEW_LATER': return 'text-orange-500 bg-orange-50 dark:bg-orange-900/20';
    case 'NOT_UNDERSTOOD': return 'text-red-500 bg-red-50 dark:bg-red-900/20';
    case 'MASTERED': return 'text-purple-500 bg-purple-50 dark:bg-purple-900/20';
    default: return 'text-gray-500 bg-gray-50 dark:bg-gray-900/20';
  }
};

export const calculatePercentage = (value, total) => {
  if (!total) return 0;
  return Math.round((value / total) * 100);
};

export const truncateText = (text, maxLength = 100) => {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

export const dailyQuotes = [
  "كل درس بتخلصيه بيقربك من هدفك 💖",
  "أنتِ قدها ✨",
  "فاضل خطوة صغيرة وتخلصي المادة 🎉",
  "النجاح يبدأ بخطوة واحدة 🌟",
  "أنتِ أقوى مما تتخيلين 💪",
  "كل يوم فرصة جديدة للتعلم 📚",
  "استمري، أنتِ في الطريق الصحيح 🎯",
  "العلم نور، و أنتِ منارة 🌙",
  "لا تستسلمي، النجاح قريب 🏆",
  "أنتِ تستحقين الأفضل دائمًا 💕",
];

export const getRandomQuote = () => {
  const dayOfYear = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
  return dailyQuotes[dayOfYear % dailyQuotes.length];
};

export const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'صباح الخير';
  if (hour < 17) return 'مساء الخير';
  return 'مساء النور';
};