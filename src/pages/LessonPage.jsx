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
  PlayCircle,
  Layers,
  BrainCircuit,
  Sigma,
  ClipboardList,
  XCircle,
  Sparkles,
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
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchLesson(id);
  }, [id]);

  useEffect(() => {
    if (currentLesson) {
      // Deep copy to avoid reference issues
      setEditData(JSON.parse(JSON.stringify(currentLesson)));
    }
  }, [currentLesson]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Clean data: remove undefined, keep empty strings and arrays
      const cleanData = {};
      Object.keys(editData).forEach((key) => {
        const val = editData[key];
        if (
          val !== undefined &&
          key !== "id" &&
          key !== "created_at" &&
          key !== "subject_id"
        ) {
          cleanData[key] = val;
        }
      });

      console.log("Saving lesson data:", cleanData);
      await updateLesson(id, cleanData);

      // Refresh lesson data after save
      await fetchLesson(id);
      setIsEditing(false);
      alert("✅ تم الحفظ بنجاح!");
    } catch (error) {
      console.error("Save failed:", error);
      alert("❌ فشل الحفظ: " + (error.message || "حدث خطأ"));
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (currentLesson) {
      setEditData(JSON.parse(JSON.stringify(currentLesson)));
    }
    setIsEditing(false);
  };

  if (!currentLesson) return <Loading />;

  const tabs = [
    { key: "content", label: "المحتوى", icon: BookOpen },
    { key: "important", label: "مهم", icon: AlertTriangle },
    { key: "key_ideas", label: "أفكار رئيسية", icon: Lightbulb },
    { key: "understanding", label: "الفهم", icon: BrainCircuit },
    { key: "notes", label: "ملحوظاتي", icon: PenLine },
    { key: "summary", label: "الملخص", icon: FileText },
    { key: "formulas", label: "قوانين", icon: Sigma },
    { key: "exam_notes", label: "امتحان", icon: ClipboardList },
    { key: "common_mistakes", label: "أخطاء شائعة", icon: XCircle },
  ];

  // Helper to safely get array from JSONB
  const getArray = (field) => {
    const val = currentLesson[field];
    if (!val) return [];
    if (Array.isArray(val)) return val;
    try {
      return JSON.parse(val);
    } catch {
      return [];
    }
  };

  // Helper for editing arrays (newline separated)
  const arrayToText = (arr) => (Array.isArray(arr) ? arr.join("\n") : "");
  const textToArray = (text) =>
    text
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center gap-4 flex-wrap">
        <Link
          to={`/subjects/${currentLesson.subject_id}`}
          className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors shrink-0"
        >
          <ChevronLeft className="w-6 h-6" />
        </Link>
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold truncate">{currentLesson.title}</h1>
          <p className="text-gray-500 text-sm">{currentLesson.description}</p>
        </div>
        <div className="flex gap-2 shrink-0">
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
            className={`p-2 rounded-xl transition-colors ${isEditing ? "bg-blue-100 text-blue-600" : "hover:bg-blue-50 text-blue-500"}`}
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
              className={`h-full rounded-full transition-all duration-500 ${
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
              : "bg-pink-100 text-pink-600 hover:bg-pink-200"
          }`}
        >
          {currentLesson.status === "COMPLETED" ? "✓ مكتمل" : "تحديد كمكتمل"}
        </button>
      </div>

      {/* Quick Actions */}
      <div className="flex gap-3 overflow-x-auto pb-2">
        <Link to={`/lessons/${id}/flashcards`}>
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-50 dark:bg-purple-900/20 text-purple-600 text-sm font-medium hover:bg-purple-100 transition-colors whitespace-nowrap">
            <Layers className="w-4 h-4" /> البطاقات
          </div>
        </Link>
        <Link to={`/lessons/${id}/quizzes`}>
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-orange-50 dark:bg-orange-900/20 text-orange-600 text-sm font-medium hover:bg-orange-100 transition-colors whitespace-nowrap">
            <PlayCircle className="w-4 h-4" /> الاختبار
          </div>
        </Link>
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
        {/* ===== CONTENT ===== */}
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

        {/* ===== IMPORTANT ===== */}
        {activeTab === "important" && (
          <div className="space-y-4">
            <h3 className="font-bold text-lg flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-yellow-500" /> نقاط مهمة
            </h3>
            {isEditing ? (
              <div className="space-y-3">
                <textarea
                  value={arrayToText(editData.important_points)}
                  onChange={(e) =>
                    setEditData({
                      ...editData,
                      important_points: textToArray(e.target.value),
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
                {getArray("important_points").length > 0 ? (
                  getArray("important_points").map((point, i) => (
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

        {/* ===== KEY IDEAS ===== */}
        {activeTab === "key_ideas" && (
          <div className="space-y-4">
            <h3 className="font-bold text-lg flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-amber-500" /> الأفكار الرئيسية
            </h3>
            {isEditing ? (
              <div className="space-y-3">
                <textarea
                  value={arrayToText(editData.key_ideas)}
                  onChange={(e) =>
                    setEditData({
                      ...editData,
                      key_ideas: textToArray(e.target.value),
                    })
                  }
                  className="input-field w-full h-48"
                  placeholder="اكتبي كل فكرة في سطر..."
                />
                <p className="text-xs text-gray-400">
                  اكتبي كل فكرة في سطر منفصل
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {getArray("key_ideas").length > 0 ? (
                  getArray("key_ideas").map((idea, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="flex items-start gap-3 p-3 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-100"
                    >
                      <Sparkles className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                      <p className="text-gray-700 dark:text-gray-200">{idea}</p>
                    </motion.div>
                  ))
                ) : (
                  <p className="text-gray-400 text-center py-8">
                    لا توجد أفكار رئيسية. اضغطي على ✏️ لإضافة
                  </p>
                )}
              </div>
            )}
          </div>
        )}

        {/* ===== UNDERSTANDING ===== */}
        {activeTab === "understanding" && (
          <div className="space-y-4">
            <h3 className="font-bold text-lg flex items-center gap-2">
              <BrainCircuit className="w-5 h-5 text-indigo-500" /> الفهم
              والاستيعاب
            </h3>
            {isEditing ? (
              <textarea
                value={editData.understanding || ""}
                onChange={(e) =>
                  setEditData({ ...editData, understanding: e.target.value })
                }
                className="input-field w-full h-64"
                placeholder="اكتبي فهمك للدرس هنا..."
              />
            ) : (
              <div className="prose dark:prose-invert max-w-none">
                {currentLesson.understanding ? (
                  <div className="whitespace-pre-wrap leading-relaxed bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-xl">
                    {currentLesson.understanding}
                  </div>
                ) : (
                  <p className="text-gray-400 text-center py-8">
                    لا يوجد فهم مسجل. اضغطي على ✏️ لإضافة
                  </p>
                )}
              </div>
            )}
          </div>
        )}

        {/* ===== NOTES ===== */}
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

        {/* ===== SUMMARY ===== */}
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

        {/* ===== FORMULAS ===== */}
        {activeTab === "formulas" && (
          <div className="space-y-4">
            <h3 className="font-bold text-lg flex items-center gap-2">
              <Sigma className="w-5 h-5 text-cyan-500" /> القوانين والصيغ
            </h3>
            {isEditing ? (
              <div className="space-y-3">
                <textarea
                  value={arrayToText(editData.formulas)}
                  onChange={(e) =>
                    setEditData({
                      ...editData,
                      formulas: textToArray(e.target.value),
                    })
                  }
                  className="input-field w-full h-48"
                  placeholder="اكتبي كل قانون/صيغة في سطر..."
                />
                <p className="text-xs text-gray-400">
                  اكتبي كل قانون في سطر منفصل
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {getArray("formulas").length > 0 ? (
                  getArray("formulas").map((formula, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="flex items-start gap-3 p-3 rounded-xl bg-cyan-50 dark:bg-cyan-900/20 border border-cyan-100"
                    >
                      <Sigma className="w-5 h-5 text-cyan-500 shrink-0 mt-0.5" />
                      <p className="text-gray-700 dark:text-gray-200 font-mono">
                        {formula}
                      </p>
                    </motion.div>
                  ))
                ) : (
                  <p className="text-gray-400 text-center py-8">
                    لا توجد قوانين. اضغطي على ✏️ لإضافة
                  </p>
                )}
              </div>
            )}
          </div>
        )}

        {/* ===== EXAM NOTES ===== */}
        {activeTab === "exam_notes" && (
          <div className="space-y-4">
            <h3 className="font-bold text-lg flex items-center gap-2">
              <ClipboardList className="w-5 h-5 text-red-500" /> ملاحظات
              الامتحان
            </h3>
            {isEditing ? (
              <textarea
                value={editData.exam_notes || ""}
                onChange={(e) =>
                  setEditData({ ...editData, exam_notes: e.target.value })
                }
                className="input-field w-full h-64"
                placeholder="اكتبي ملاحظات الامتحان هنا..."
              />
            ) : (
              <div className="prose dark:prose-invert max-w-none">
                {currentLesson.exam_notes ? (
                  <div className="whitespace-pre-wrap leading-relaxed bg-red-50 dark:bg-red-900/20 p-4 rounded-xl border border-red-100">
                    {currentLesson.exam_notes}
                  </div>
                ) : (
                  <p className="text-gray-400 text-center py-8">
                    لا توجد ملاحظات امتحان. اضغطي على ✏️ لإضافة
                  </p>
                )}
              </div>
            )}
          </div>
        )}

        {/* ===== COMMON MISTAKES ===== */}
        {activeTab === "common_mistakes" && (
          <div className="space-y-4">
            <h3 className="font-bold text-lg flex items-center gap-2">
              <XCircle className="w-5 h-5 text-rose-500" /> أخطاء شائعة
            </h3>
            {isEditing ? (
              <div className="space-y-3">
                <textarea
                  value={arrayToText(editData.common_mistakes)}
                  onChange={(e) =>
                    setEditData({
                      ...editData,
                      common_mistakes: textToArray(e.target.value),
                    })
                  }
                  className="input-field w-full h-48"
                  placeholder="اكتبي كل خطأ في سطر..."
                />
                <p className="text-xs text-gray-400">
                  اكتبي كل خطأ في سطر منفصل
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {getArray("common_mistakes").length > 0 ? (
                  getArray("common_mistakes").map((mistake, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="flex items-start gap-3 p-3 rounded-xl bg-rose-50 dark:bg-rose-900/20 border border-rose-100"
                    >
                      <XCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                      <p className="text-gray-700 dark:text-gray-200">
                        {mistake}
                      </p>
                    </motion.div>
                  ))
                ) : (
                  <p className="text-gray-400 text-center py-8">
                    لا توجد أخطاء مسجلة. اضغطي على ✏️ لإضافة
                  </p>
                )}
              </div>
            )}
          </div>
        )}

        {isEditing && (
          <div className="flex justify-end gap-2 mt-4">
            <button
              onClick={handleCancel}
              className="btn-secondary"
              disabled={isSaving}
            >
              إلغاء
            </button>
            <button
              onClick={handleSave}
              className="btn-primary flex items-center gap-2"
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  جاري الحفظ...
                </>
              ) : (
                "حفظ التغييرات"
              )}
            </button>
          </div>
        )}
      </div>

      {/* Keywords & Definitions */}
      {(getArray("keywords").length > 0 ||
        getArray("definitions").length > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {getArray("keywords").length > 0 && (
            <div className="glass-card p-6">
              <h3 className="font-bold mb-3 flex items-center gap-2">
                <Bookmark className="w-5 h-5 text-purple-500" /> الكلمات
                المفتاحية
              </h3>
              <div className="flex flex-wrap gap-2">
                {getArray("keywords").map((kw, i) => (
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
          {getArray("definitions").length > 0 && (
            <div className="glass-card p-6">
              <h3 className="font-bold mb-3 flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-yellow-500" /> التعريفات
              </h3>
              <div className="space-y-2">
                {getArray("definitions").map((def, i) => (
                  <div
                    key={i}
                    className="p-2 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 text-sm"
                  >
                    <span className="font-bold">
                      {typeof def === "object" ? def.term : def}:
                    </span>{" "}
                    {typeof def === "object" ? def.meaning : ""}
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
