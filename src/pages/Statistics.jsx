import { motion } from "framer-motion";
import {
  BarChart3,
  TrendingUp,
  BookOpen,
  Clock,
  Award,
  Target,
} from "lucide-react";

const stats = [
  {
    label: "الدروس المكتملة",
    value: 12,
    total: 20,
    icon: BookOpen,
    color: "from-pink-400 to-rose-400",
  },
  {
    label: "ساعات المذاكرة",
    value: 45,
    total: 100,
    icon: Clock,
    color: "from-purple-400 to-indigo-400",
  },
  {
    label: "الاختبارات",
    value: 8,
    total: 15,
    icon: Award,
    color: "from-blue-400 to-cyan-400",
  },
  {
    label: "الأهداف",
    value: 5,
    total: 10,
    icon: Target,
    color: "from-green-400 to-emerald-400",
  },
];

export default function Statistics() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <h1 className="text-2xl font-bold gradient-text">إحصائياتك 📊</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {stats.map((stat, i) => {
          const percentage = Math.round((stat.value / stat.total) * 100);
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ scale: 1.02 }}
              className="glass-card p-6"
            >
              <div className="flex items-center gap-4 mb-4">
                <div
                  className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}
                >
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                  <p className="text-2xl font-bold">
                    {stat.value}{" "}
                    <span className="text-sm text-gray-400">
                      / {stat.total}
                    </span>
                  </p>
                </div>
              </div>

              <div className="progress-bar-glow">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ duration: 1, delay: 0.5 + i * 0.2 }}
                />
              </div>
              <p className="text-sm text-gray-400 mt-2 text-left">
                {percentage}%
              </p>
            </motion.div>
          );
        })}
      </div>

      <div className="glass-card p-6">
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-pink-500" /> تقدمك الأسبوعي
        </h2>
        <div className="flex items-end justify-between h-40 gap-2">
          {[
            "السبت",
            "الأحد",
            "الإثنين",
            "الثلاثاء",
            "الأربعاء",
            "الخميس",
            "الجمعة",
          ].map((day, i) => {
            const height = [60, 80, 45, 90, 70, 55, 85][i];
            return (
              <div
                key={day}
                className="flex-1 flex flex-col items-center gap-2"
              >
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${height}%` }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="w-full max-w-[40px] rounded-t-xl bg-gradient-to-t from-pink-400 to-purple-400 opacity-80 hover:opacity-100 transition-opacity"
                />
                <span className="text-xs text-gray-500">{day}</span>
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
