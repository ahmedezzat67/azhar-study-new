import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useLessonsStore } from "../store/lessonsStore";
import { motion } from "framer-motion";
import {
  BookOpen,
  Heart,
  CheckCircle,
  Star,
  AlertTriangle,
  Lightbulb,
  FileText,
  Bookmark,
  PenLine,
  ChevronLeft,
} from "lucide-react";
import { Link } from "react-router-dom";
import Loading from "../components/common/Loading";

export default function LessonPage() {
  const { id } = useParams();
  const { currentLesson, fetchLesson, updateLesson, toggleFavorite } =
    useLessonsStore();
  const [activeTab, setActiveTab] = useState("content");
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});

  useEffect(() => {
    fetchLesson(id);
  }, [id]);

  useEffect(() => {
    if (currentLesson) setEditData(currentLesson);
  }, [currentLesson]);

  const handleSave = async () => {
    await updateLesson(id, editData);
    setIsEditing(false);
  };

  if (!currentLesson) return <Loading />;

  const tabs = [
    { key: "content", label: "المحتوى", icon: BookOpen },
    { key: "important", label: "مهم", icon: AlertTriangle },
    { key: "notes", label: "ملحوظاتي", icon: PenLine },
    { key: "summary", label: "الملخص", icon: FileText },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          to={`/subjects/${currentLesson.subject_id}`}
          className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <ChevronLeft className="w-6 h-6" />
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">{currentLesson.title}</h1>
          <p className="text-gray-500 text-sm">{currentLesson.description}</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() =>
              toggleFavorite(currentLesson.id, currentLesson.is_favorite)
            }
            className="p-2 rounded-xl hover:bg-pink-50 text-pink-500 transition-colors"
          >
            <Heart
              className={`w-6 h-6 ${currentLesson.is_favorite ? "fill-pink-500" : ""}`}
            />
          </button>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="p-2 rounded-xl hover:bg-blue-50 text-blue-500 transition-colors"
          >
            <PenLine className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Progress */}
      <div className="glass-card p-4 flex items-center gap-4">
        <div className="flex-1">
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium">حالة الدرس</span>
            <span className="text-sm text-gray-500">
              {currentLesson.status === "COMPLETED"
                ? "مكتمل"
                : currentLesson.status === "IN_PROGRESS"
                  ? "قيد التقدم"
                  : "لم يبدأ"}
            </span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${
                currentLesson.status === "COMPLETED"
                  ? "w-full bg-green-400"
                  : currentLesson.status === "IN_PROGRESS"
                    ? "w-1/2 bg-yellow-400"
                    : "w-0"
              }`}
            />
          </div>
        </div>
        <button
          onClick={() =>
            updateLesson(id, {
              status:
                currentLesson.status === "COMPLETED"
                  ? "NOT_STARTED"
                  : "COMPLETED",
            })
          }
          className={`px-4 py-2 rounded-xl font-medium text-sm transition-all ${
            currentLesson.status === "COMPLETED"
              ? "bg-green-100 text-green-600"
              : "bg-pink-100 text-pink-600"
          }`}
        >
          {currentLesson.status === "COMPLETED" ? "✓ مكتمل" : "تحديد كمكتمل"}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm whitespace-nowrap transition-all ${
              activeTab === tab.key
                ? "bg-gradient-to-r from-pink-400 to-purple-400 text-white shadow-lg"
                : "bg-white/50 dark:bg-gray-800/50 text-gray-500 hover:bg-pink-50"
            }`}
          >
            <tab.icon className="w-4 h-4" /> {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="glass-card p-6 min-h-[300px]">
        {activeTab === "content" && (
          <div className="space-y-4">
            <h3 className="font-bold text-lg flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-pink-500" /> محتوى الدرس
            </h3>
            {isEditing ? (
              <textarea
                value={editData.content || ""}
                onChange={(e) =>
                  setEditData({ ...editData, content: e.target.value })
                }
                className="input-field w-full h-64"
                placeholder="اكتبي محتوى الدرس هنا..."
              />
            ) : (
              <div className="prose dark:prose-invert max-w-none">
                {currentLesson.content ? (
                  <div className="whitespace-pre-wrap leading-relaxed">
                    {currentLesson.content}
                  </div>
                ) : (
                  <p className="text-gray-400 text-center py-8">
                    لا يوجد محتوى. اضغطي على ✏️ لإضافة محتوى
                  </p>
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === "important" && (
          <div className="space-y-4">
            <h3 className="font-bold text-lg flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-yellow-500" /> نقاط مهمة
            </h3>
            {isEditing ? (
              <div className="space-y-3">
                <textarea
                  value={(editData.important_points || []).join("\n")}
                  onChange={(e) =>
                    setEditData({
                      ...editData,
                      important_points: e.target.value
                        .split("\n")
                        .filter(Boolean),
                    })
                  }
                  className="input-field w-full h-48"
                  placeholder="اكتبي كل نقطة في سطر..."
                />
                <p className="text-xs text-gray-400">
                  اكتبي كل نقطة في سطر منفصل
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {(currentLesson.important_points || []).length > 0 ? (
                  (currentLesson.important_points || []).map((point, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="flex items-start gap-3 p-3 rounded-xl bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-100"
                    >
                      <Star className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" />
                      <p className="text-gray-700 dark:text-gray-200">
                        {point}
                      </p>
                    </motion.div>
                  ))
                ) : (
                  <p className="text-gray-400 text-center py-8">
                    لا توجد نقاط مهمة. اضغطي على ✏️ لإضافة
                  </p>
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === "notes" && (
          <div className="space-y-4">
            <h3 className="font-bold text-lg flex items-center gap-2">
              <PenLine className="w-5 h-5 text-blue-500" /> ملحوظاتي
            </h3>
            {isEditing ? (
              <textarea
                value={editData.notes || ""}
                onChange={(e) =>
                  setEditData({ ...editData, notes: e.target.value })
                }
                className="input-field w-full h-64"
                placeholder="اكتبي ملحوظاتك هنا..."
              />
            ) : (
              <div className="prose dark:prose-invert max-w-none">
                {currentLesson.notes ? (
                  <div className="whitespace-pre-wrap leading-relaxed bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl">
                    {currentLesson.notes}
                  </div>
                ) : (
                  <p className="text-gray-400 text-center py-8">
                    لا توجد ملحوظات. اضغطي على ✏️ لإضافة ملحوظات
                  </p>
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === "summary" && (
          <div className="space-y-4">
            <h3 className="font-bold text-lg flex items-center gap-2">
              <FileText className="w-5 h-5 text-green-500" /> ملخص الدرس
            </h3>
            {isEditing ? (
              <textarea
                value={editData.summary || ""}
                onChange={(e) =>
                  setEditData({ ...editData, summary: e.target.value })
                }
                className="input-field w-full h-64"
                placeholder="اكتبي ملخص الدرس هنا..."
              />
            ) : (
              <div className="prose dark:prose-invert max-w-none">
                {currentLesson.summary ? (
                  <div className="whitespace-pre-wrap leading-relaxed">
                    {currentLesson.summary}
                  </div>
                ) : (
                  <p className="text-gray-400 text-center py-8">
                    لا يوجد ملخص. اضغطي على ✏️ لإضافة ملخص
                  </p>
                )}
              </div>
            )}
          </div>
        )}

        {isEditing && (
          <div className="flex justify-end gap-2 mt-4">
            <button
              onClick={() => setIsEditing(false)}
              className="btn-secondary"
            >
              إلغاء
            </button>
            <button onClick={handleSave} className="btn-primary">
              حفظ التغييرات
            </button>
          </div>
        )}
      </div>

      {/* Keywords & Definitions */}
      {(currentLesson.keywords?.length > 0 ||
        currentLesson.definitions?.length > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {currentLesson.keywords?.length > 0 && (
            <div className="glass-card p-6">
              <h3 className="font-bold mb-3 flex items-center gap-2">
                <Bookmark className="w-5 h-5 text-purple-500" /> الكلمات
                المفتاحية
              </h3>
              <div className="flex flex-wrap gap-2">
                {currentLesson.keywords.map((kw, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 text-sm"
                  >
                    {kw}
                  </span>
                ))}
              </div>
            </div>
          )}
          {currentLesson.definitions?.length > 0 && (
            <div className="glass-card p-6">
              <h3 className="font-bold mb-3 flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-yellow-500" /> التعريفات
              </h3>
              <div className="space-y-2">
                {currentLesson.definitions.map((def, i) => (
                  <div
                    key={i}
                    className="p-2 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 text-sm"
                  >
                    <span className="font-bold">{def.term}:</span> {def.meaning}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
}
