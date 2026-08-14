import { useState } from "react";
import { motion } from "framer-motion";
import {
  Calendar as CalendarIcon,
  Clock,
  BookOpen,
  AlertCircle,
} from "lucide-react";

const events = [
  {
    id: 1,
    title: "امتحان الفقه",
    date: "2026-08-20",
    time: "09:00",
    type: "exam",
    subject: "الفقه",
  },
  {
    id: 2,
    title: "مراجعة النحو",
    date: "2026-08-22",
    time: "16:00",
    type: "review",
    subject: "النحو",
  },
  {
    id: 3,
    title: "حفظ سورة النساء",
    date: "2026-08-25",
    time: "10:00",
    type: "memorize",
    subject: "القرآن",
  },
  {
    id: 4,
    title: "اختبار التفسير",
    date: "2026-08-28",
    time: "11:00",
    type: "exam",
    subject: "التفسير",
  },
];

const getTypeColor = (type) => {
  switch (type) {
    case "exam":
      return "bg-red-100 text-red-600 dark:bg-red-900/30";
    case "review":
      return "bg-blue-100 text-blue-600 dark:bg-blue-900/30";
    case "memorize":
      return "bg-green-100 text-green-600 dark:bg-green-900/30";
    default:
      return "bg-gray-100 text-gray-600";
  }
};

const getTypeLabel = (type) => {
  switch (type) {
    case "exam":
      return "امتحان";
    case "review":
      return "مراجعة";
    case "memorize":
      return "حفظ";
    default:
      return "أخرى";
  }
};

export default function Calendar() {
  const [selectedDate, setSelectedDate] = useState(new Date());

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <h1 className="text-2xl font-bold gradient-text">التقويم الدراسي 📅</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="glass-card p-6">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-pink-500" /> الأحداث القادمة
            </h2>

            <div className="space-y-3">
              {events.map((event, i) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ scale: 1.02, x: 5 }}
                  className="flex items-center gap-4 p-4 rounded-2xl bg-white/50 dark:bg-gray-800/50 border border-transparent hover:border-pink-200 transition-all cursor-pointer"
                >
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center ${getTypeColor(event.type)}`}
                  >
                    {event.type === "exam" ? (
                      <AlertCircle className="w-6 h-6" />
                    ) : event.type === "review" ? (
                      <BookOpen className="w-6 h-6" />
                    ) : (
                      <CalendarIcon className="w-6 h-6" />
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold">{event.title}</h3>
                      <span
                        className={`px-2 py-0.5 rounded-lg text-xs ${getTypeColor(event.type)}`}
                      >
                        {getTypeLabel(event.type)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">{event.subject}</p>
                  </div>

                  <div className="text-right">
                    <p className="font-medium text-sm">{event.date}</p>
                    <p className="text-xs text-gray-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {event.time}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="glass-card p-6 text-center">
            <CalendarIcon className="w-16 h-16 text-pink-400 mx-auto mb-4" />
            <p className="text-lg font-bold mb-2">اليوم</p>
            <p className="text-3xl font-bold gradient-text">
              {new Date().getDate()}
            </p>
            <p className="text-gray-500">
              {new Date().toLocaleDateString("ar-SA", {
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>

          <div className="glass-card p-6">
            <h3 className="font-bold mb-3">إحصائيات الشهر</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">الامتحانات</span>
                <span className="font-bold text-red-500">2</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">المراجعات</span>
                <span className="font-bold text-blue-500">1</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">الحفظ</span>
                <span className="font-bold text-green-500">1</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
