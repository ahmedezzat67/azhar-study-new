import { motion } from "framer-motion";
import {
  Calendar,
  Clock,
  BookOpen,
  Star,
  TrendingUp,
  Award,
} from "lucide-react";
import { useAuthStore } from "../store/authStore";
import AnimatedPage from "../components/common/AnimatedPage";

export default function Dashboard() {
  const { user } = useAuthStore();

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <AnimatedPage>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="space-y-6"
      >
        {/* Welcome Card */}
        <motion.div
          variants={itemVariants}
          className="glass-card p-8 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-pink-200/30 to-purple-200/30 rounded-full -mr-10 -mt-10 blur-2xl" />
          <div className="relative z-10">
            <motion.h1
              className="text-3xl font-bold gradient-text mb-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              أهلاً بيكي يا {user?.name?.split(" ")[0] || "سارة"}! 🌸
            </motion.h1>
            <p className="text-gray-500">مستعدة للمذاكرة النهاردة؟</p>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Stats Grid */}
            <motion.div
              variants={itemVariants}
              className="grid grid-cols-2 md:grid-cols-4 gap-4"
            >
              {[
                {
                  icon: BookOpen,
                  label: "الدروس",
                  value: "12",
                  color: "text-pink-500",
                  bg: "bg-pink-50",
                },
                {
                  icon: Star,
                  label: "المفضلة",
                  value: "5",
                  color: "text-yellow-500",
                  bg: "bg-yellow-50",
                },
                {
                  icon: TrendingUp,
                  label: "التقدم",
                  value: "75%",
                  color: "text-purple-500",
                  bg: "bg-purple-50",
                },
                {
                  icon: Award,
                  label: "الإنجازات",
                  value: "3",
                  color: "text-blue-500",
                  bg: "bg-blue-50",
                },
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  whileHover={{ scale: 1.05, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                  className="glass-card p-4 text-center cursor-pointer"
                >
                  <div
                    className={`w-12 h-12 mx-auto rounded-2xl ${stat.bg} flex items-center justify-center mb-2`}
                  >
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                  <p className="text-2xl font-bold gradient-text">
                    {stat.value}
                  </p>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                </motion.div>
              ))}
            </motion.div>

            {/* Active Lessons */}
            <motion.div variants={itemVariants} className="glass-card p-6">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-pink-500" /> الدروس المستمرة
              </h3>
              <div className="space-y-3">
                {[
                  {
                    title: "أركان الصلاة",
                    progress: 75,
                    color: "from-pink-400 to-rose-400",
                  },
                  {
                    title: "الفاعل والمفعول به",
                    progress: 45,
                    color: "from-purple-400 to-indigo-400",
                  },
                  {
                    title: "سورة البقرة 21-39",
                    progress: 90,
                    color: "from-blue-400 to-cyan-400",
                  },
                ].map((lesson, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + i * 0.1 }}
                    whileHover={{ scale: 1.02, x: 5 }}
                    className="flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-white/60 to-transparent dark:from-gray-800/60 cursor-pointer border border-transparent hover:border-pink-200 transition-all"
                  >
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center">
                      <BookOpen className="w-6 h-6 text-pink-500" />
                    </div>
                    <div className="flex-1">
                      <p className="font-bold">{lesson.title}</p>
                      <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full mt-2 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${lesson.progress}%` }}
                          transition={{ duration: 1, delay: 0.5 + i * 0.2 }}
                          className={`h-full rounded-full bg-gradient-to-r ${lesson.color}`}
                        />
                      </div>
                    </div>
                    <span className="text-sm font-bold text-gray-500">
                      {lesson.progress}%
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Sidebar Content */}
          <div className="space-y-6">
            <motion.div variants={itemVariants} className="glass-card p-6">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-pink-500" /> قادمًا
              </h3>
              <div className="space-y-3">
                {[
                  {
                    title: "امتحان الفقه",
                    date: "15 فبراير - 9:00 ص",
                    color: "bg-gradient-to-r from-red-50 to-pink-50",
                    border: "border-red-100",
                    text: "text-red-500",
                  },
                  {
                    title: "مراجعة النحو",
                    date: "10 فبراير - 4:00 م",
                    color: "bg-gradient-to-r from-blue-50 to-purple-50",
                    border: "border-blue-100",
                    text: "text-blue-500",
                  },
                ].map((event, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ scale: 1.03, x: -5 }}
                    className={`p-4 rounded-2xl ${event.color} border ${event.border} cursor-pointer`}
                  >
                    <p className={`font-bold ${event.text}`}>{event.title}</p>
                    <p className="text-sm text-gray-500 mt-1">{event.date}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Daily Quote */}
            <motion.div
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              className="glass-card p-6 bg-gradient-to-br from-pink-50/80 to-purple-50/80"
            >
              <p className="text-sm text-gray-500 mb-2">💭 اقتباس اليوم</p>
              <p className="font-bold text-gray-700 italic leading-relaxed">
                "العلم نور، والجهل ظلمة"
              </p>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </AnimatedPage>
  );
}
