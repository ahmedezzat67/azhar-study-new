import { motion } from 'framer-motion';
import { RotateCcw } from 'lucide-react';
import EmptyState from '../components/common/EmptyState';

export default function Review() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <RotateCcw className="w-6 h-6 text-blue-400" /> المراجعة الذكية
      </h1>
      <div className="glass-card p-6">
        <EmptyState message="سيتم إضافة المراجعة الذكية قريبًا" />
      </div>
    </motion.div>
  );
}