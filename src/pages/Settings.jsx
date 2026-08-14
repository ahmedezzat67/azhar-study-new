import { useState } from 'react';
import { motion } from 'framer-motion';
import { Moon, Sun, Monitor, Palette } from 'lucide-react';
import { useSettingsStore } from '../store/settingsStore';

export default function Settings() {
  const { settings, updateSettings, darkMode, toggleDarkMode } = useSettingsStore();
  const [theme, setTheme] = useState(settings.theme);

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    updateSettings({ ...settings, theme: newTheme });
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h1 className="text-2xl font-bold mb-6">الإعدادات</h1>

      <div className="glass-card p-6 space-y-6">
        <div>
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Palette className="w-5 h-5" /> الوضع
          </h3>
          <div className="grid grid-cols-3 gap-4">
            <button
              onClick={() => handleThemeChange('LIGHT')}
              className={`p-4 rounded-xl border-2 transition-all ${theme === 'LIGHT' ? 'border-pink-400 bg-pink-50 dark:bg-pink-900/20' : 'border-gray-200 dark:border-gray-700'}`}
            >
              <Sun className="w-6 h-6 mx-auto mb-2" />
              <span className="text-sm">فاتح</span>
            </button>
            <button
              onClick={() => handleThemeChange('DARK')}
              className={`p-4 rounded-xl border-2 transition-all ${theme === 'DARK' ? 'border-pink-400 bg-pink-50 dark:bg-pink-900/20' : 'border-gray-200 dark:border-gray-700'}`}
            >
              <Moon className="w-6 h-6 mx-auto mb-2" />
              <span className="text-sm">داكن</span>
            </button>
            <button
              onClick={() => handleThemeChange('SYSTEM')}
              className={`p-4 rounded-xl border-2 transition-all ${theme === 'SYSTEM' ? 'border-pink-400 bg-pink-50 dark:bg-pink-900/20' : 'border-gray-200 dark:border-gray-700'}`}
            >
              <Monitor className="w-6 h-6 mx-auto mb-2" />
              <span className="text-sm">تلقائي</span>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}