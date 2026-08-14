import { motion } from 'framer-motion';
import { TrendingUp } from 'lucide-react';
import { getProgressColor } from '../../utils/helpers';

export default function ProgressCard() {
  const progress = 46;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="glass-card p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold">التقدم العام</h3>
        <TrendingUp className="w-5 h-5 text-green-500" />
      </div>
      <div className="relative h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1, delay: 0.5 }}
          className={`absolute h-full rounded-full ${getProgressColor(progress)}`}
        />
      </div>
      <p className="text-center mt-2 text-2xl font-bold">{progress}%</p>
      <p className="text-center text-sm text-gray-500">أكملتي 67 من 145 درسًا</p>
    </motion.div>
  );
}