import { motion } from "framer-motion";
import { Trophy, Star, Zap, BookOpen, Flame, Crown } from "lucide-react";

const achievements = [
  {
    id: 1,
    title: "أول درس",
    description: "أكملي أول درس",
    icon: BookOpen,
    unlocked: true,
    color: "from-blue-400 to-cyan-400",
  },
  {
    id: 2,
    title: "المثابرة",
    description: "ادرسي 7 أيام متتالية",
    icon: Flame,
    unlocked: true,
    color: "from-orange-400 to-red-400",
  },
  {
    id: 3,
    title: "العبقري",
    description: "احصلي على 100% في اختبار",
    icon: Star,
    unlocked: false,
    color: "from-yellow-400 to-amber-400",
  },
  {
    id: 4,
    title: "سريعة البديهة",
    description: "أكملي اختبار في أقل من 5 دقائق",
    icon: Zap,
    unlocked: false,
    color: "from-purple-400 to-pink-400",
  },
  {
    id: 5,
    title: "الملكة",
    description: "أكملي 50 درس",
    icon: Crown,
    unlocked: false,
    color: "from-pink-400 to-rose-400",
  },
  {
    id: 6,
    title: "البطلة",
    description: "احصلي على 10 إنجازات",
    icon: Trophy,
    unlocked: false,
    color: "from-green-400 to-emerald-400",
  },
];

export default function Achievements() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold gradient-text mb-2">إنجازاتك 🏆</h1>
        <p className="text-gray-500">
          {achievements.filter((a) => a.unlocked).length} /{" "}
          {achievements.length} إنجاز
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {achievements.map((ach, i) => (
          <motion.div
            key={ach.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            whileHover={ach.unlocked ? { scale: 1.05 } : {}}
            className={`glass-card p-6 text-center relative overflow-hidden ${
              ach.unlocked ? "" : "opacity-50 grayscale"
            }`}
          >
            {ach.unlocked && (
              <div className="absolute top-2 right-2">
                <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
              </div>
            )}

            <div
              className={`w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br ${ach.color} flex items-center justify-center mb-4 ${
                ach.unlocked ? "pulse-glow" : ""
              }`}
            >
              <ach.icon className="w-8 h-8 text-white" />
            </div>

            <h3 className="font-bold text-lg mb-1">{ach.title}</h3>
            <p className="text-sm text-gray-500">{ach.description}</p>

            {ach.unlocked ? (
              <span className="inline-block mt-3 px-3 py-1 rounded-full bg-green-100 text-green-600 text-xs font-medium">
                مكتمل ✓
              </span>
            ) : (
              <span className="inline-block mt-3 px-3 py-1 rounded-full bg-gray-100 text-gray-400 text-xs font-medium">
                قيد التقدم
              </span>
            )}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
