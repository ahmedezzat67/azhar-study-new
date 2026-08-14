import { useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  BookOpen,
  Clock,
  Star,
  TrendingUp,
  Award,
  Calendar,
  Heart,
  Zap,
} from "lucide-react";
import { useAuthStore } from "../store/authStore";
import { useSubjectsStore } from "../store/subjectsStore";
import { useCalendarStore } from "../store/calendarStore";
import { getRandomQuote, getGreeting } from "../utils/helpers";

export default function Dashboard() {
  const { user } = useAuthStore();
  const { subjects, fetchSubjects } = useSubjectsStore();
  const { events, fetchEvents } = useCalendarStore();

  useEffect(() => {
    fetchSubjects();
    fetchEvents();
  }, []);

  const completedLessons = subjects.reduce(
    (acc, s) =>
      acc + (s.lessons?.filter((l) => l.status === "COMPLETED").length || 0),
    0,
  );
  const totalLessons = subjects.reduce(
    (acc, s) => acc + (s.lessons?.length || 0),
    0,
  );
  const progress =
    totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  const upcomingEvents = events.slice(0, 3);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Welcome */}
      <div className="glass-card p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-pink-200/30 to-purple-200/30 rounded-full -mr-10 -mt-10 blur-2xl" />
        <div className="relative z-10">
          <motion.h1
            className="text-3xl font-bold gradient-text mb-2"
            initial={{ x: -20 }}
            animate={{ x: 0 }}
          >
            {getGreeting()} يا {user?.name?.split(" ")[0] || "سارة"}! 🌸
          </motion.h1>
          <p className="text-gray-500">{getRandomQuote()}</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          {
            icon: BookOpen,
            label: "المواد",
            value: subjects.length,
            color: "from-pink-400 to-rose-400",
            bg: "bg-pink-50",
          },
          {
            icon: Star,
            label: "الدروس",
            value: totalLessons,
            color: "from-yellow-400 to-amber-400",
            bg: "bg-yellow-50",
          },
          {
            icon: TrendingUp,
            label: "التقدم",
            value: `${progress}%`,
            color: "from-purple-400 to-indigo-400",
            bg: "bg-purple-50",
          },
          {
            icon: Award,
            label: "مكتمل",
            value: completedLessons,
            color: "from-blue-400 to-cyan-400",
            bg: "bg-blue-50",
          },
        ].map((stat, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.05, y: -5 }}
            className="glass-card p-4 text-center cursor-pointer"
          >
            <div
              className={`w-12 h-12 mx-auto rounded-2xl ${stat.bg} flex items-center justify-center mb-2`}
            >
              <stat.icon
                className={`w-6 h-6 bg-gradient-to-r ${stat.color} bg-clip-text`}
                style={{ color: "inherit" }}
              />
            </div>
            <p className="text-2xl font-bold gradient-text">{stat.value}</p>
            <p className="text-sm text-gray-500">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Subjects Progress */}
          <div className="glass-card p-6">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5 text-pink-500" /> تقدم المواد
            </h3>
            <div className="space-y-4">
              {subjects.length === 0 ? (
                <p className="text-gray-500 text-center py-4">
                  لا توجد مواد بعد.{" "}
                  <Link to="/subjects" className="text-pink-500">
                    أضيفي مادة جديدة
                  </Link>
                </p>
              ) : (
                subjects.map((subject, i) => {
                  const subLessons = subject.lessons?.length || 0;
                  const subCompleted =
                    subject.lessons?.filter((l) => l.status === "COMPLETED")
                      .length || 0;
                  const subProgress =
                    subLessons > 0
                      ? Math.round((subCompleted / subLessons) * 100)
                      : 0;
                  return (
                    <motion.div
                      key={subject.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                    >
                      <div className="flex justify-between mb-1">
                        <span className="font-medium text-sm">
                          {subject.name}
                        </span>
                        <span className="text-sm text-gray-500">
                          {subProgress}%
                        </span>
                      </div>
                      <div className="h-2.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${subProgress}%` }}
                          transition={{ duration: 1, delay: 0.5 }}
                          className="h-full rounded-full bg-gradient-to-r from-pink-400 to-purple-400"
                        />
                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>
          </div>

          {/* Recent Lessons */}
          <div className="glass-card p-6">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-pink-500" /> آخر الدروس
            </h3>
            <div className="space-y-3">
              {subjects
                .flatMap(
                  (s) =>
                    s.lessons?.map((l) => ({ ...l, subjectName: s.name })) ||
                    [],
                )
                .slice(0, 5)
                .map((lesson, i) => (
                  <motion.div
                    key={lesson.id}
                    whileHover={{ scale: 1.02, x: 5 }}
                    className="flex items-center gap-4 p-3 rounded-xl bg-white/50 dark:bg-gray-800/50 cursor-pointer"
                  >
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center">
                      <BookOpen className="w-5 h-5 text-pink-500" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{lesson.title}</p>
                      <p className="text-xs text-gray-500">
                        {lesson.subjectName}
                      </p>
                    </div>
                    <Heart
                      className={`w-4 h-4 ${lesson.is_favorite ? "text-pink-500 fill-pink-500" : "text-gray-300"}`}
                    />
                  </motion.div>
                ))}
              {subjects.length === 0 && (
                <p className="text-gray-500 text-center">لا توجد دروس بعد</p>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Calendar Events */}
          <div className="glass-card p-6">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-pink-500" /> قادمًا
            </h3>
            <div className="space-y-3">
              {upcomingEvents.length === 0 ? (
                <p className="text-gray-500 text-sm text-center">
                  لا توجد أحداث
                </p>
              ) : (
                upcomingEvents.map((event, i) => (
                  <motion.div
                    key={event.id}
                    whileHover={{ scale: 1.03 }}
                    className="p-3 rounded-xl bg-gradient-to-r from-pink-50 to-purple-50 dark:from-purple-900/20 dark:to-pink-900/20 border border-pink-100"
                  >
                    <p className="font-bold text-pink-600 text-sm">
                      {event.title}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(event.date).toLocaleDateString("ar-SA")}
                    </p>
                  </motion.div>
                ))
              )}
            </div>
          </div>

          {/* Daily Goal */}
          <div className="glass-card p-6 bg-gradient-to-br from-pink-50/80 to-purple-50/80">
            <p className="text-sm text-gray-500 mb-2">🎯 هدف اليوم</p>
            <p className="font-bold text-gray-700">أكملي درس واحد على الأقل</p>
            <div className="mt-3 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full w-1/3 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full" />
            </div>
            <p className="text-xs text-gray-400 mt-1">1/3 دروس</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
