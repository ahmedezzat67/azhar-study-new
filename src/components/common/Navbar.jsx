import { Link, useNavigate } from "react-router-dom";
import { BookOpen, Moon, Sun, User, LogOut } from "lucide-react";
import { useAuthStore } from "../../store/authStore";
import { useSettingsStore } from "../../store/settingsStore";

export default function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { darkMode, toggleDarkMode } = useSettingsStore();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <nav className="sticky top-0 z-50 glass-card mx-4 mt-4 px-6 py-3">
      <div className="flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-400 to-purple-400 flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold gradient-text hidden sm:inline">
            Azhar Study
          </span>
        </Link>

        <div className="flex items-center gap-4">
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            {darkMode ? (
              <Sun className="w-5 h-5" />
            ) : (
              <Moon className="w-5 h-5" />
            )}
          </button>

          {user ? (
            <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-white/50 dark:bg-gray-800/50">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-300 to-purple-300 flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <span className="font-medium hidden sm:inline">{user.name}</span>
            </div>
          ) : (
            <Link
              to="/login"
              className="px-4 py-2 rounded-xl bg-pink-500 text-white font-medium hover:bg-pink-600 transition-colors"
            >
              تسجيل الدخول
            </Link>
          )}

          {user && (
            <button
              onClick={handleLogout}
              className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 transition-colors"
            >
              <LogOut className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
