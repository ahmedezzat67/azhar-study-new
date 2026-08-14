import { BookOpen } from 'lucide-react';

export default function EmptyState({ message = 'لا توجد بيانات' }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-20 h-20 rounded-full bg-pink-50 dark:bg-pink-900/20 flex items-center justify-center mb-4">
        <BookOpen className="w-10 h-10 text-pink-400" />
      </div>
      <p className="text-lg text-gray-500 dark:text-gray-400">{message}</p>
    </div>
  );
}