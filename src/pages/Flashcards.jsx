import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Plus,
  Shuffle,
} from "lucide-react";
import { useFlashcardsStore } from "../store/flashcardsStore";
import { useParams } from "react-router-dom";

export default function Flashcards() {
  const { id } = useParams();
  const { flashcards, fetchFlashcards, createFlashcard } = useFlashcardsStore();
  const [current, setCurrent] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [newCard, setNewCard] = useState({ question: "", answer: "" });

  useEffect(() => {
    if (id) fetchFlashcards(id);
  }, [id]);

  const next = () => {
    setFlipped(false);
    setTimeout(() => setCurrent((c) => (c + 1) % flashcards.length), 200);
  };
  const prev = () => {
    setFlipped(false);
    setTimeout(
      () => setCurrent((c) => (c - 1 + flashcards.length) % flashcards.length),
      200,
    );
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    await createFlashcard({ ...newCard, lesson_id: id });
    setShowAdd(false);
    setNewCard({ question: "", answer: "" });
  };

  if (flashcards.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-6"
      >
        <h1 className="text-2xl font-bold gradient-text">
          البطاقات التعليمية 🎴
        </h1>
        <div className="glass-card p-8 text-center">
          <p className="text-gray-500 mb-4">لا توجد بطاقات في هذا الدرس</p>
          <button onClick={() => setShowAdd(true)} className="btn-primary">
            إضافة بطاقة
          </button>
        </div>
        {showAdd && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="glass-card p-6 w-full max-w-md"
            >
              <h2 className="text-xl font-bold mb-4">إضافة بطاقة</h2>
              <form onSubmit={handleAdd} className="space-y-4">
                <input
                  placeholder="السؤال"
                  value={newCard.question}
                  onChange={(e) =>
                    setNewCard({ ...newCard, question: e.target.value })
                  }
                  className="input-field"
                  required
                />
                <input
                  placeholder="الإجابة"
                  value={newCard.answer}
                  onChange={(e) =>
                    setNewCard({ ...newCard, answer: e.target.value })
                  }
                  className="input-field"
                  required
                />
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAdd(false)}
                    className="btn-secondary flex-1"
                  >
                    إلغاء
                  </button>
                  <button type="submit" className="btn-primary flex-1">
                    إضافة
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </motion.div>
    );
  }

  const card = flashcards[current];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="text-center">
        <h1 className="text-2xl font-bold gradient-text mb-2">
          البطاقات التعليمية 🎴
        </h1>
        <p className="text-gray-500">اضغطي على البطاقة لتقلبيها</p>
      </div>

      <div className="flex justify-center mb-4">
        <span className="px-4 py-1 rounded-full bg-pink-100 dark:bg-pink-900/30 text-pink-600 text-sm font-medium">
          {current + 1} / {flashcards.length}
        </span>
      </div>

      <div className="flex justify-center items-center gap-4">
        <button
          onClick={prev}
          className="p-3 rounded-full bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all hover:scale-110"
        >
          <ChevronRight className="w-6 h-6 text-pink-500" />
        </button>

        <div
          onClick={() => setFlipped(!flipped)}
          className="w-full max-w-md h-64 cursor-pointer perspective-1000"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={current + (flipped ? "-back" : "-front")}
              initial={{ rotateY: flipped ? -90 : 90, opacity: 0 }}
              animate={{ rotateY: 0, opacity: 1 }}
              exit={{ rotateY: flipped ? 90 : -90, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className={`w-full h-full rounded-3xl shadow-xl flex items-center justify-center p-8 text-center ${
                flipped
                  ? "bg-gradient-to-br from-purple-400 to-pink-400 text-white"
                  : "glass-card"
              }`}
            >
              <div>
                {flipped ? (
                  <>
                    <Sparkles className="w-8 h-8 mx-auto mb-4 opacity-80" />
                    <p className="text-xl font-bold leading-relaxed">
                      {card.answer}
                    </p>
                  </>
                ) : (
                  <>
                    <p className="text-xl font-bold text-gray-700 dark:text-gray-200 mb-4">
                      {card.question}
                    </p>
                    <p className="text-sm text-gray-400">اضغطي للإجابة</p>
                  </>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <button
          onClick={next}
          className="p-3 rounded-full bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all hover:scale-110"
        >
          <ChevronLeft className="w-6 h-6 text-pink-500" />
        </button>
      </div>

      <div className="flex justify-center gap-2 mt-4">
        {flashcards.map((_, i) => (
          <div
            key={i}
            className={`w-2 h-2 rounded-full transition-all ${i === current ? "bg-pink-500 w-6" : "bg-gray-300"}`}
          />
        ))}
      </div>
    </motion.div>
  );
}
