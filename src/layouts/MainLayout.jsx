import { Outlet } from "react-router-dom";
import { useEffect } from "react";
import { useAuthStore } from "../store/authStore";
import { useSettingsStore } from "../store/settingsStore";
import Navbar from "../components/common/Navbar";
import Sidebar from "../components/common/Sidebar";

export default function MainLayout() {
  const { loadUser } = useAuthStore();
  const { loadSettings } = useSettingsStore();

  useEffect(() => {
    loadUser();
    loadSettings();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 sparkle-bg">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6 mr-0 lg:mr-64 transition-all duration-300">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
