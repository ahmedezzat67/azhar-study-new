import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search } from 'lucide-react';
import { useSubjectsStore } from '../store/subjectsStore';
import { useAuthStore } from '../store/authStore';
import SubjectCard from '../components/subjects/SubjectCard';
import SubjectModal from '../components/subjects/SubjectModal';
import Loading from '../components/common/Loading';
import EmptyState from '../components/common/EmptyState';

export default function Subjects() {
  const { subjects, fetchSubjects, isLoading } = useSubjectsStore();
  const { hasPermission } = useAuthStore();
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);

  useEffect(() => { fetchSubjects(); }, []);

  const filtered = subjects.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.description?.toLowerCase().includes(search.toLowerCase())
  );

  if (isLoading) return <Loading />;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">المواد الدراسية</h1>
        {hasPermission('canCreateSubject') && (
          <button onClick={() => setShowModal(true)} className="btn-primary flex items-center gap-2">
            <Plus className="w-5 h-5" /> إضافة مادة
          </button>
        )}
      </div>

      <div className="relative">
        <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input type="text" placeholder="البحث في المواد..." value={search} onChange={(e) => setSearch(e.target.value)} className="input-field pr-12" />
      </div>

      {filtered.length === 0 ? (
        <EmptyState message="لا توجد مواد مطابقة للبحث" />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((subject) => (
            <SubjectCard key={subject.id} subject={subject} onUpdate={fetchSubjects} />
          ))}
        </div>
      )}

      {showModal && <SubjectModal onClose={() => setShowModal(false)} onSuccess={fetchSubjects} />}
    </motion.div>
  );
}