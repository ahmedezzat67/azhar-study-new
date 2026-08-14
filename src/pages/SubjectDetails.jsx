import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { useSubjectsStore } from '../store/subjectsStore';
import { motion } from 'framer-motion';
import Loading from '../components/common/Loading';
import EmptyState from '../components/common/EmptyState';

export default function SubjectDetails() {
  const { id } = useParams();
  const { currentSubject, fetchSubject, isLoading } = useSubjectsStore();

  useEffect(() => { fetchSubject(id); }, [id]);

  if (isLoading) return <Loading />;
  if (!currentSubject) return <EmptyState message="المادة غير موجودة" />;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="glass-card p-6">
        <h1 className="text-2xl font-bold">{currentSubject.name}</h1>
        <p className="text-gray-500 mt-2">{currentSubject.description}</p>
      </div>
      <div className="glass-card p-6">
        <h2 className="text-lg font-bold mb-4">الدروس ({currentSubject.lessons?.length || 0})</h2>
        {currentSubject.lessons?.length === 0 ? (
          <EmptyState message="لا توجد دروس في هذه المادة" />
        ) : (
          <div className="space-y-3">
            {currentSubject.lessons?.map((lesson) => (
              <div key={lesson.id} className="p-4 rounded-xl bg-white/50 dark:bg-gray-800/50 hover:bg-white/80 dark:hover:bg-gray-700/50 transition-colors cursor-pointer">
                <h3 className="font-medium">{lesson.title}</h3>
                <p className="text-sm text-gray-500">{lesson.description}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}