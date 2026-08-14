import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import EmptyState from '../components/common/EmptyState';

export default function Favorites() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <Heart className="w-6 h-6 text-pink-400" /> المفضلة
      </h1>
      <div className="glass-card p-6">
        <EmptyState message="لا توجد دروس مفضلة بعد" />
      </div>
    </motion.div>
  );
}