import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useSubjectsStore } from '../store/subjectsStore';
import { useLessonsStore } from '../store/lessonsStore';
import { motion } from 'framer-motion';
import { BookOpen, Plus, Clock, CheckCircle, Heart, ArrowRight } from 'lucide-react';
import Loading from '../components/common/Loading';
import EmptyState from '../components/common/EmptyState';

export default function SubjectDetails() {
  const { id } = useParams();
  const { currentSubject, fetchSubject } = useSubjectsStore();
  const { lessons, fetchLessons, createLesson } = useLessonsStore();
  const [showAddLesson, setShowAddLesson] = useState(false);
  const [newLesson, setNewLesson] = useState({ title: '', description: '', difficulty: 'MEDIUM' });

  useEffect(() => {
    fetchSubject(id);
    fetchLessons(id);
  }, [id]);

  const handleAddLesson = async (e) => {
    e.preventDefault();
    await createLesson({ ...newLesson, subject_id: id, content: '', status: 'NOT_STARTED' });
    setShowAddLesson(false);
    setNewLesson({ title: '', description: '', difficulty: 'MEDIUM' });
    fetchLessons(id);
  };

  if (!currentSubject) return <Loading />;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="glass-card p-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2" style={{ background: currentSubject.color || '#ec4899' }} />
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl text-white flex items-center justify-center text-3xl" style={{ background: currentSubject.color || '#ec4899' }}>
            <BookOpen className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">{currentSubject.name}</h1>
            <p className="text-gray-500">{currentSubject.description}</p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">الدروس ({lessons.length})</h2>
        <button onClick={() => setShowAddLesson(true)} className="btn-primary flex items-center gap-2 text-sm">
          <Plus className="w-4 h-4" /> إضافة درس
        </button>
      </div>

      {lessons.length === 0 ? (
        <EmptyState message="لا توجد دروس في هذه المادة بعد" />
      ) : (
        <div className="grid gap-4">
          {lessons.map((lesson, i) => (
            <motion.div
              key={lesson.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ scale: 1.01, x: 5 }}
            >
              <Link to={`/lessons/${lesson.id}`}>
                <div className="glass-card p-5 flex items-center gap-4 group cursor-pointer">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    lesson.status === 'COMPLETED' ? 'bg-green-100 text-green-500' : 'bg-pink-100 text-pink-500'
                  }`}>
                    {lesson.status === 'COMPLETED' ? <CheckCircle className="w-6 h-6" /> : <BookOpen className="w-6 h-6" />}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold group-hover:text-pink-500 transition-colors">{lesson.title}</h3>
                    <p className="text-sm text-gray-500">{lesson.description}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {lesson.difficulty === 'EASY' ? 'سهل' : lesson.difficulty === 'MEDIUM' ? 'متوسط' : 'صعب'}</span>
                      <Heart className={`w-3 h-3 ${lesson.is_favorite ? 'text-pink-500 fill-pink-500' : ''}`} />
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-pink-500 transition-colors" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}

      {showAddLesson && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="glass-card p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">إضافة درس جديد</h2>
            <form onSubmit={handleAddLesson} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">عنوان الدرس</label>
                <input type="text" value={newLesson.title} onChange={e => setNewLesson({...newLesson, title: e.target.value})} className="input-field" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">الوصف</label>
                <textarea value={newLesson.description} onChange={e => setNewLesson({...newLesson, description: e.target.value})} className="input-field" rows={3} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">الصعوبة</label>
                <select value={newLesson.difficulty} onChange={e => setNewLesson({...newLesson, difficulty: e.target.value})} className="input-field">
                  <option value="EASY">سهل</option>
                  <option value="MEDIUM">متوسط</option>
                  <option value="HARD">صعب</option>
                </select>
              </div>
              <div className="flex gap-2">
                <button type="button" onClick={() => setShowAddLesson(false)} className="btn-secondary flex-1">إلغاء</button>
                <button type="submit" className="btn-primary flex-1">إضافة</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}