import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RotateCcw, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";

const sampleCards = [
  {
    id: 1,
    front: "ما هي أركان الصلاة؟",
    back: "القيام، الركوع، السجود، الجلوس بين السجدتين، التشهد الأخير، السلام",
  },
  {
    id: 2,
    front: 'من هو الفاعل في الجملة: "كتب الطالب الدرس"؟',
    back: "الطالب",
  },
  {
    id: 3,
    front: 'ما معنى "الرحمن"؟',
    back: "ذو الرحمة الواسعة التي تشمل كل شيء",
  },
  { id: 4, front: "كم عدد سور القرآن الكريم؟", back: "114 سورة" },
];

export default function Flashcards() {
  const [current, setCurrent] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const next = () => {
    setFlipped(false);
    setTimeout(() => setCurrent((c) => (c + 1) % sampleCards.length), 200);
  };

  const prev = () => {
    setFlipped(false);
    setTimeout(
      () =>
        setCurrent((c) => (c - 1 + sampleCards.length) % sampleCards.length),
      200,
    );
  };

  const card = sampleCards[current];

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
          {current + 1} / {sampleCards.length}
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
          className="w-full max-w-md h-64 cursor-pointer perspective-1000"
          onClick={() => setFlipped(!flipped)}
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
                      {card.back}
                    </p>
                  </>
                ) : (
                  <>
                    <p className="text-xl font-bold text-gray-700 dark:text-gray-200 mb-4">
                      {card.front}
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
        {sampleCards.map((_, i) => (
          <div
            key={i}
            className={`w-2 h-2 rounded-full transition-all ${
              i === current ? "bg-pink-500 w-6" : "bg-gray-300"
            }`}
          />
        ))}
      </div>
    </motion.div>
  );
}
