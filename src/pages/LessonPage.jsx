import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import EmptyState from '../components/common/EmptyState';

export default function LessonPage() {
  const { id } = useParams();
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="glass-card p-6">
        <h1 className="text-2xl font-bold">صفحة الدرس</h1>
        <p className="text-gray-500 mt-2">معرف الدرس: {id}</p>
        <EmptyState message="سيتم إضافة محتوى الدرس قريبًا" />
      </div>
    </motion.div>
  );
}