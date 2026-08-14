import { motion } from 'framer-motion';
import { User } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

export default function Profile() {
  const { user } = useAuthStore();
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h1 className="text-2xl font-bold mb-6">الملف الشخصي</h1>
      <div className="glass-card p-6">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-pink-300 to-purple-300 flex items-center justify-center">
            <User className="w-10 h-10 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold">{user?.name || 'سارة أحمد'}</h2>
            <p className="text-gray-500">{user?.email || 'sara@example.com'}</p>
            <p className="text-sm text-pink-500">{user?.role === 'ADMIN' ? 'مدير' : 'طالبة'}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}