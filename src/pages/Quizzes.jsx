import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Trophy,
  CheckCircle,
  XCircle,
  ArrowLeft,
  RotateCcw,
} from "lucide-react";
import { useQuizzesStore } from "../store/quizzesStore";
import { useParams } from "react-router-dom";

export default function Quizzes() {
  const { id } = useParams();
  const { quizzes, fetchQuizzes, submitQuiz } = useQuizzesStore();
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    if (id) fetchQuizzes(id);
  }, [id]);

  const handleStart = (quiz) => {
    setActiveQuiz(quiz);
    setAnswers({});
    setSubmitted(false);
    setScore(0);
  };

  const handleSubmit = async () => {
    const ans = Object.values(answers);
    if (ans.length < activeQuiz.questions.length) return;
    const newScore = await submitQuiz(activeQuiz.id, answers);
    setScore(newScore);
    setSubmitted(true);
  };

  if (activeQuiz) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-6 max-w-2xl mx-auto"
      >
        <div className="flex items-center gap-4">
          <button
            onClick={() => setActiveQuiz(null)}
            className="p-2 rounded-xl hover:bg-gray-100"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-bold">{activeQuiz.title}</h1>
        </div>

        <div className="space-y-6">
          {activeQuiz.questions.map((q, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass-card p-6"
            >
              <p className="font-bold mb-4">
                {i + 1}. {q.question}
              </p>
              <div className="space-y-2">
                {q.options.map((opt, j) => {
                  const isSelected = answers[i] === j;
                  const isCorrect = submitted && j === q.correctAnswer;
                  const isWrong =
                    submitted && isSelected && j !== q.correctAnswer;
                  return (
                    <button
                      key={j}
                      onClick={() =>
                        !submitted && setAnswers({ ...answers, [i]: j })
                      }
                      disabled={submitted}
                      className={`w-full p-3 rounded-xl text-right transition-all ${
                        isCorrect
                          ? "bg-green-100 text-green-700 border-2 border-green-400"
                          : isWrong
                            ? "bg-red-100 text-red-700 border-2 border-red-400"
                            : isSelected
                              ? "bg-pink-100 text-pink-700 border-2 border-pink-400"
                              : "bg-gray-50 dark:bg-gray-800 hover:bg-pink-50 border-2 border-transparent"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {isCorrect && <CheckCircle className="w-5 h-5" />}
                        {isWrong && <XCircle className="w-5 h-5" />}
                        <span>{opt}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          ))}
        </div>

        {!submitted ? (
          <button
            onClick={handleSubmit}
            disabled={Object.keys(answers).length < activeQuiz.questions.length}
            className="btn-primary w-full py-3"
          >
            إرسال الإجابات
          </button>
        ) : (
          <div className="glass-card p-6 text-center">
            <Trophy
              className={`w-16 h-16 mx-auto mb-4 ${score >= 70 ? "text-yellow-400" : "text-gray-400"}`}
            />
            <h2 className="text-2xl font-bold mb-2">النتيجة: {score}%</h2>
            <p className="text-gray-500 mb-4">
              {score >= 70 ? "أحسنتِ! 🎉" : "حاولي مرة أخرى 💪"}
            </p>
            <button
              onClick={() => handleStart(activeQuiz)}
              className="btn-secondary flex items-center gap-2 mx-auto"
            >
              <RotateCcw className="w-4 h-4" /> إعادة الاختبار
            </button>
          </div>
        )}
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <h1 className="text-2xl font-bold gradient-text">الاختبارات 📝</h1>
      {quizzes.length === 0 ? (
        <div className="glass-card p-8 text-center">
          <p className="text-gray-500">لا توجد اختبارات في هذا الدرس</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {quizzes.map((quiz, i) => (
            <motion.div
              key={quiz.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ scale: 1.01 }}
              className="glass-card p-6 cursor-pointer"
              onClick={() => handleStart(quiz)}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-lg">{quiz.title}</h3>
                  <p className="text-sm text-gray-500">
                    {quiz.questions?.length || 0} سؤال
                  </p>
                </div>
                {quiz.score !== null && (
                  <div
                    className={`px-4 py-2 rounded-xl font-bold ${quiz.score >= 70 ? "bg-green-100 text-green-600" : "bg-yellow-100 text-yellow-600"}`}
                  >
                    {quiz.score}%
                  </div>
                )}
                <Trophy className="w-6 h-6 text-pink-400" />
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
