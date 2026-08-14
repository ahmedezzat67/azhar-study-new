import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  BookOpen,
  CheckCircle,
  Clock,
  RotateCcw,
  Award,
  Flame,
} from "lucide-react";
import { supabase } from "../../lib/supabase";

export default function StatsCard() {
  const [stats, setStats] = useState([
    {
      label: "المواد",
      value: 0,
      icon: BookOpen,
      color: "from-pink-400 to-rose-400",
    },
    {
      label: "الدروس المكتملة",
      value: 0,
      icon: CheckCircle,
      color: "from-green-400 to-emerald-400",
    },
    {
      label: "ساعات الدراسة",
      value: 0,
      icon: Clock,
      color: "from-blue-400 to-cyan-400",
    },
    {
      label: "المراجعات",
      value: 0,
      icon: RotateCcw,
      color: "from-purple-400 to-violet-400",
    },
    {
      label: "متوسط الاختبارات",
      value: "0%",
      icon: Award,
      color: "from-yellow-400 to-amber-400",
    },
    {
      label: "الاستمرارية",
      value: 0,
      icon: Flame,
      color: "from-orange-400 to-red-400",
    },
  ]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // 1. عدد المواد
      const { count: subjectsCount } = await supabase
        .from("subjects")
        .select("*", { count: "exact", head: true });

      // 2. الدروس المكتملة
      const { count: completedLessons } = await supabase
        .from("lessons")
        .select("*", { count: "exact", head: true })
        .eq("status", "COMPLETED");

      // 3. المراجعات
      const { count: reviewsCount } = await supabase
        .from("reviews")
        .select("*", { count: "exact", head: true });

      // 4. متوسط الاختبارات
      const { data: quizResults } = await supabase
        .from("quiz_results")
        .select("score, total");

      let quizAverage = 0;
      if (quizResults && quizResults.length > 0) {
        const totalPercentage = quizResults.reduce((acc, q) => {
          return acc + (q.total > 0 ? (q.score / q.total) * 100 : 0);
        }, 0);
        quizAverage = Math.round(totalPercentage / quizResults.length);
      }

      // 5. الإحصائيات (ساعات الدراسة + الاستمرارية)
      const { data: userStats } = await supabase
        .from("statistics")
        .select("total_study_hours, streak_days")
        .maybeSingle();

      setStats([
        {
          label: "المواد",
          value: subjectsCount || 0,
          icon: BookOpen,
          color: "from-pink-400 to-rose-400",
        },
        {
          label: "الدروس المكتملة",
          value: completedLessons || 0,
          icon: CheckCircle,
          color: "from-green-400 to-emerald-400",
        },
        {
          label: "ساعات الدراسة",
          value: Math.round(userStats?.total_study_hours || 0),
          icon: Clock,
          color: "from-blue-400 to-cyan-400",
        },
        {
          label: "المراجعات",
          value: reviewsCount || 0,
          icon: RotateCcw,
          color: "from-purple-400 to-violet-400",
        },
        {
          label: "متوسط الاختبارات",
          value: `${quizAverage}%`,
          icon: Award,
          color: "from-yellow-400 to-amber-400",
        },
        {
          label: "الاستمرارية",
          value: userStats?.streak_days || 0,
          icon: Flame,
          color: "from-orange-400 to-red-400",
        },
      ]);
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="glass-card p-4 animate-pulse">
            <div className="w-10 h-10 rounded-lg bg-gray-200 mb-3"></div>
            <div className="h-8 bg-gray-200 rounded w-16 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-24"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className="glass-card p-4 hover:shadow-lg transition-shadow"
          >
            <div
              className={`w-10 h-10 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center mb-3`}
            >
              <Icon className="w-5 h-5 text-white" />
            </div>
            <p className="text-2xl font-bold">{stat.value}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {stat.label}
            </p>
          </motion.div>
        );
      })}
    </div>
  );
}
