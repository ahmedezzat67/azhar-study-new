import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Plus,
  Search,
  BookOpen,
  MoreVertical,
  Trash2,
  Edit,
} from "lucide-react";
import { useSubjectsStore } from "../store/subjectsStore";
import { useAuthStore } from "../store/authStore";
import { Link } from "react-router-dom";
import Loading from "../components/common/Loading";
import EmptyState from "../components/common/EmptyState";

const subjectIcons = {
  فقه: "BookOpen",
  نحو: "PenTool",
  تفسير: "BookMarked",
  حديث: "Scroll",
  عقيدة: "Star",
  default: "BookOpen",
};

const defaultSubjects = [
  {
    name: "الفقه الإسلامي",
    description: "أحكام العبادات والمعاملات",
    color: "#ec4899",
    icon: "BookOpen",
    order: 1,
  },
  {
    name: "النحو العربي",
    description: "قواعد اللغة العربية والإعراب",
    color: "#8b5cf6",
    icon: "PenTool",
    order: 2,
  },
  {
    name: "التفسير",
    description: "تفسير القرآن الكريم",
    color: "#3b82f6",
    icon: "BookMarked",
    order: 3,
  },
  {
    name: "الحديث الشريف",
    description: "علوم الحديث وأحاديث النبي ﷺ",
    color: "#f59e0b",
    icon: "Scroll",
    order: 4,
  },
];

export default function Subjects() {
  const { subjects, fetchSubjects, createSubject, deleteSubject, isLoading } =
    useSubjectsStore();
  const { hasPermission, isAdmin } = useAuthStore();
  const [search, setSearch] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [newSubject, setNewSubject] = useState({
    name: "",
    description: "",
    color: "#ec4899",
  });

  useEffect(() => {
    fetchSubjects();
  }, []);

  const handleAddDefault = async () => {
    for (const sub of defaultSubjects) {
      await createSubject(sub);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    await createSubject({
      ...newSubject,
      icon: "BookOpen",
      order: subjects.length + 1,
    });
    setShowAddModal(false);
    setNewSubject({ name: "", description: "", color: "#ec4899" });
  };

  const filtered = subjects.filter(
    (s) =>
      s.name?.toLowerCase().includes(search.toLowerCase()) ||
      s.description?.toLowerCase().includes(search.toLowerCase()),
  );

  if (isLoading) return <Loading />;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h1 className="text-2xl font-bold gradient-text">المواد الدراسية 📚</h1>
        <div className="flex gap-2">
          {subjects.length === 0 && isAdmin() && (
            <button
              onClick={handleAddDefault}
              className="btn-secondary flex items-center gap-2 text-sm"
            >
              <Plus className="w-4 h-4" /> إضافة مواد افتراضية
            </button>
          )}
          {hasPermission("canCreateSubject") && (
            <button
              onClick={() => setShowAddModal(true)}
              className="btn-primary flex items-center gap-2"
            >
              <Plus className="w-5 h-5" /> إضافة مادة
            </button>
          )}
        </div>
      </div>

      <div className="relative">
        <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="البحث في المواد..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input-field pr-12"
        />
      </div>

      {filtered.length === 0 ? (
        <EmptyState message="لا توجد مواد مطابقة للبحث" />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((subject, i) => (
            <motion.div
              key={subject.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ scale: 1.03, y: -5 }}
              className="glass-card p-6 relative overflow-hidden group"
            >
              <div
                className="absolute top-0 left-0 w-full h-1.5"
                style={{ background: subject.color || "#ec4899" }}
              />
              <div className="flex items-start justify-between mb-4">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center text-white text-2xl"
                  style={{
                    background: `linear-gradient(135deg, ${subject.color || "#ec4899"}, ${subject.color ? subject.color + "80" : "#f472b6"})`,
                  }}
                >
                  <BookOpen className="w-7 h-7" />
                </div>
                {isAdmin() && (
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                    <button
                      onClick={() => deleteSubject(subject.id)}
                      className="p-2 rounded-lg hover:bg-red-50 text-red-500"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
              <Link to={`/subjects/${subject.id}`}>
                <h3 className="text-xl font-bold mb-2 group-hover:text-pink-500 transition-colors">
                  {subject.name}
                </h3>
                <p className="text-sm text-gray-500 mb-4 line-clamp-2">
                  {subject.description}
                </p>
                <div className="flex items-center justify-between text-sm text-gray-400">
                  <span className="flex items-center gap-1">
                    <BookOpen className="w-4 h-4" />{" "}
                    {subject.lessons?.length || 0} درس
                  </span>
                  <span className="text-pink-500 font-medium">
                    عرض المادة →
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}

      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="glass-card p-6 w-full max-w-md"
          >
            <h2 className="text-xl font-bold mb-4">إضافة مادة جديدة</h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  اسم المادة
                </label>
                <input
                  type="text"
                  value={newSubject.name}
                  onChange={(e) =>
                    setNewSubject({ ...newSubject, name: e.target.value })
                  }
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">الوصف</label>
                <textarea
                  value={newSubject.description}
                  onChange={(e) =>
                    setNewSubject({
                      ...newSubject,
                      description: e.target.value,
                    })
                  }
                  className="input-field"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">اللون</label>
                <input
                  type="color"
                  value={newSubject.color}
                  onChange={(e) =>
                    setNewSubject({ ...newSubject, color: e.target.value })
                  }
                  className="w-full h-10 rounded-xl cursor-pointer"
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
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
