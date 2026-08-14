import { useState } from "react";
import { motion } from "framer-motion";
import {
  Trophy,
  Clock,
  Star,
  ChevronRight,
  CheckCircle,
  XCircle,
} from "lucide-react";
import EmptyState from "../components/common/EmptyState";

const sampleQuizzes = [
  {
    id: 1,
    title: "اختبار أركان الصلاة",
    subject: "الفقه",
    questions: 10,
    duration: 15,
    difficulty: "EASY",
    completed: false,
    score: null,
  },
  {
    id: 2,
    title: "اختبار الفاعل والمفعول به",
    subject: "النحو",
    questions: 15,
    duration: 20,
    difficulty: "MEDIUM",
    completed: true,
    score: 80,
  },
  {
    id: 3,
    title: "اختبار سورة البقرة",
    subject: "التفسير",
    questions: 20,
    duration: 25,
    difficulty: "HARD",
    completed: false,
    score: null,
  },
];

export default function Quizzes() {
  const [activeTab, setActiveTab] = useState("all");

  const filtered =
    activeTab === "all"
      ? sampleQuizzes
      : activeTab === "completed"
        ? sampleQuizzes.filter((q) => q.completed)
        : sampleQuizzes.filter((q) => !q.completed);

  const getDifficultyColor = (d) => {
    switch (d) {
      case "EASY":
        return "bg-green-100 text-green-600 dark:bg-green-900/30";
      case "MEDIUM":
        return "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30";
      case "HARD":
        return "bg-red-100 text-red-600 dark:bg-red-900/30";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const getDifficultyLabel = (d) => {
    switch (d) {
      case "EASY":
        return "سهل";
      case "MEDIUM":
        return "متوسط";
      case "HARD":
        return "صعب";
      default:
        return "غير محدد";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold gradient-text">الاختبارات 📝</h1>
        <div className="flex gap-2">
          {[
            { key: "all", label: "الكل" },
            { key: "pending", label: "قيد الانتظار" },
            { key: "completed", label: "مكتمل" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                activeTab === tab.key
                  ? "bg-gradient-to-r from-pink-400 to-purple-400 text-white shadow-lg"
                  : "bg-white/50 dark:bg-gray-800/50 text-gray-500 hover:bg-pink-50"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4">
        {filtered.map((quiz, i) => (
          <motion.div
            key={quiz.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ scale: 1.01, x: -5 }}
            className="glass-card p-6 cursor-pointer group"
          >
            <div className="flex items-center gap-4">
              <div
                className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
                  quiz.completed
                    ? "bg-green-100 dark:bg-green-900/30"
                    : "bg-pink-100 dark:bg-pink-900/30"
                }`}
              >
                {quiz.completed ? (
                  <CheckCircle className="w-7 h-7 text-green-500" />
                ) : (
                  <Trophy className="w-7 h-7 text-pink-500" />
                )}
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="font-bold text-lg">{quiz.title}</h3>
                  <span
                    className={`px-2 py-0.5 rounded-lg text-xs font-medium ${getDifficultyColor(quiz.difficulty)}`}
                  >
                    {getDifficultyLabel(quiz.difficulty)}
                  </span>
                </div>
                <p className="text-sm text-gray-500">{quiz.subject}</p>

                <div className="flex items-center gap-4 mt-2 text-sm text-gray-400">
                  <span className="flex items-center gap-1">
                    <Star className="w-4 h-4" /> {quiz.questions} سؤال
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" /> {quiz.duration} دقيقة
                  </span>
                  {quiz.completed && (
                    <span className="text-green-500 font-bold">
                      النتيجة: {quiz.score}%
                    </span>
                  )}
                </div>
              </div>

              <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-pink-400 transition-colors" />
            </div>
          </motion.div>
        ))}
      </div>

      {filtered.length === 0 && (
        <EmptyState message="لا توجد اختبارات في هذا القسم" />
      )}
    </motion.div>
  );
}
