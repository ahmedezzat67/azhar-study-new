import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { BookOpen, Heart, Eye, EyeOff } from "lucide-react";
import { useAuthStore } from "../store/authStore";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { register, isLoading, error, clearError } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    clearError();
    return () => clearError();
  }, [clearError]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password.length < 6) {
      toast.error("كلمة المرور يجب أن تكون 6 أحرف على الأقل");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("كلمتا المرور غير متطابقتين");
      return;
    }

    const success = await register({ name, email, password });
    if (success) {
      toast.success("تم إنشاء الحساب وتسجيل الدخول بنجاح!");
      navigate("/");
    }
    // لو success = false، الـ error هيتعرض في الـ div اللي تحت
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-8 w-full max-w-md mx-auto mt-10"
    >
      <div className="text-center mb-8">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-pink-400 to-purple-400 flex items-center justify-center mb-4">
          <BookOpen className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-2xl font-bold gradient-text mb-2">إنشاء حساب</h1>
        <p className="text-gray-500">انضمي إلى Azhar Study</p>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm text-center">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">الاسم</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input-field w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-pink-400 focus:ring-2 focus:ring-pink-100 outline-none transition-all"
            placeholder="سارة أحمد"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">
            البريد الإلكتروني
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input-field w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-pink-400 focus:ring-2 focus:ring-pink-100 outline-none transition-all"
            placeholder="example@email.com"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">كلمة المرور</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-pink-400 focus:ring-2 focus:ring-pink-100 outline-none transition-all pr-10"
              placeholder="••••••••"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>
          <p className="text-xs text-gray-400 mt-1">6 أحرف على الأقل</p>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">
            تأكيد كلمة المرور
          </label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="input-field w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-pink-400 focus:ring-2 focus:ring-pink-100 outline-none transition-all"
            placeholder="••••••••"
            required
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="btn-primary w-full py-2 rounded-xl bg-gradient-to-r from-pink-400 to-purple-400 text-white font-medium hover:shadow-lg transition-all disabled:opacity-50"
        >
          {isLoading ? "جاري الإنشاء..." : "إنشاء حساب"}
        </button>
      </form>

      <div className="mt-6 text-center space-y-3">
        <p className="text-sm text-gray-500">
          لديك حساب بالفعل؟{" "}
          <Link
            to="/login"
            className="text-pink-500 hover:text-pink-600 font-medium"
          >
            تسجيل الدخول
          </Link>
        </p>
        <p className="text-sm text-gray-500 flex items-center justify-center gap-1">
          مصمم بـ <Heart className="w-4 h-4 text-pink-400 fill-pink-400" /> لكِ
        </p>
      </div>
    </motion.div>
  );
}