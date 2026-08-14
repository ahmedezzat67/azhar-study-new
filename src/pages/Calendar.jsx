import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Calendar as CalendarIcon,
  Clock,
  Plus,
  Trash2,
  BookOpen,
  AlertCircle,
  Star,
} from "lucide-react";
import { useCalendarStore } from "../store/calendarStore";
import { format } from "date-fns";
import { ar } from "date-fns/locale";

export default function Calendar() {
  const { events, fetchEvents, createEvent, deleteEvent } = useCalendarStore();
  const [showAdd, setShowAdd] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: "",
    date: "",
    type: "exam",
    description: "",
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    await createEvent({
      ...newEvent,
      date: new Date(newEvent.date).toISOString(),
    });
    setShowAdd(false);
    setNewEvent({ title: "", date: "", type: "exam", description: "" });
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case "exam":
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      case "review":
        return <BookOpen className="w-5 h-5 text-blue-500" />;
      case "memorize":
        return <Star className="w-5 h-5 text-green-500" />;
      default:
        return <CalendarIcon className="w-5 h-5 text-pink-500" />;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case "exam":
        return "bg-red-50 text-red-600 border-red-100";
      case "review":
        return "bg-blue-50 text-blue-600 border-blue-100";
      case "memorize":
        return "bg-green-50 text-green-600 border-green-100";
      default:
        return "bg-pink-50 text-pink-600 border-pink-100";
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

  const today = new Date();
  const upcoming = events
    .filter((e) => new Date(e.date) >= today)
    .sort((a, b) => new Date(a.date) - new Date(b.date));
  const past = events
    .filter((e) => new Date(e.date) < today)
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h1 className="text-2xl font-bold gradient-text">التقويم الدراسي 📅</h1>
        <button
          onClick={() => setShowAdd(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-5 h-5" /> إضافة حدث
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <Clock className="w-5 h-5 text-pink-500" /> الأحداث القادمة
          </h2>
          {upcoming.length === 0 ? (
            <div className="glass-card p-8 text-center text-gray-500">
              لا توجد أحداث قادمة
            </div>
          ) : (
            <div className="space-y-3">
              {upcoming.map((event, i) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ scale: 1.01 }}
                  className="glass-card p-4 flex items-center gap-4"
                >
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center ${getTypeColor(event.type)}`}
                  >
                    {getTypeIcon(event.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold">{event.title}</h3>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full border ${getTypeColor(event.type)}`}
                      >
                        {getTypeLabel(event.type)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">{event.description}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {format(new Date(event.date), "EEEE, d MMMM yyyy", {
                        locale: ar,
                      })}
                    </p>
                  </div>
                  <button
                    onClick={() => deleteEvent(event.id)}
                    className="p-2 rounded-lg hover:bg-red-50 text-red-400 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </motion.div>
              ))}
            </div>
          )}

          {past.length > 0 && (
            <>
              <h2 className="text-lg font-bold flex items-center gap-2 mt-8">
                <Clock className="w-5 h-5 text-gray-400" /> أحداث سابقة
              </h2>
              <div className="space-y-3 opacity-60">
                {past.slice(0, 5).map((event, i) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.05 }}
                    className="glass-card p-4 flex items-center gap-4"
                  >
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-gray-100 text-gray-400">
                      {getTypeIcon(event.type)}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-500">{event.title}</h3>
                      <p className="text-xs text-gray-400">
                        {format(new Date(event.date), "EEEE, d MMMM yyyy", {
                          locale: ar,
                        })}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </>
          )}
        </div>

        <div className="space-y-4">
          <div className="glass-card p-6">
            <h3 className="font-bold mb-4">إحصائيات</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 rounded-xl bg-red-50 dark:bg-red-900/20">
                <span className="text-sm text-red-600">امتحانات</span>
                <span className="font-bold text-red-600">
                  {events.filter((e) => e.type === "exam").length}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-xl bg-blue-50 dark:bg-blue-900/20">
                <span className="text-sm text-blue-600">مراجعات</span>
                <span className="font-bold text-blue-600">
                  {events.filter((e) => e.type === "review").length}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-xl bg-green-50 dark:bg-green-900/20">
                <span className="text-sm text-green-600">حفظ</span>
                <span className="font-bold text-green-600">
                  {events.filter((e) => e.type === "memorize").length}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showAdd && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="glass-card p-6 w-full max-w-md"
          >
            <h2 className="text-xl font-bold mb-4">إضافة حدث جديد</h2>
            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  العنوان
                </label>
                <input
                  type="text"
                  value={newEvent.title}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, title: e.target.value })
                  }
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  التاريخ
                </label>
                <input
                  type="date"
                  value={newEvent.date}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, date: e.target.value })
                  }
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">النوع</label>
                <select
                  value={newEvent.type}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, type: e.target.value })
                  }
                  className="input-field"
                >
                  <option value="exam">امتحان</option>
                  <option value="review">مراجعة</option>
                  <option value="memorize">حفظ</option>
                  <option value="other">أخرى</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">الوصف</label>
                <textarea
                  value={newEvent.description}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, description: e.target.value })
                  }
                  className="input-field"
                  rows={3}
                />
              </div>
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
