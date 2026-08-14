import { Link, useLocation } from 'react-router-dom';
import { Home, BookOpen, Calendar, Trophy, BarChart3, Settings, Heart, RotateCcw, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { cn } from '../../utils/helpers';

const menuItems = [
  { path: '/', icon: Home, label: 'الرئيسية' },
  { path: '/subjects', icon: BookOpen, label: 'المواد' },
  { path: '/favorites', icon: Heart, label: 'المفضلة' },
  { path: '/review', icon: RotateCcw, label: 'المراجعة' },
  { path: '/calendar', icon: Calendar, label: 'التقويم' },
  { path: '/achievements', icon: Trophy, label: 'الإنجازات' },
  { path: '/statistics', icon: BarChart3, label: 'الإحصائيات' },
  { path: '/settings', icon: Settings, label: 'الإعدادات' },
];

export default function Sidebar() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <button 
        onClick={() => setMobileOpen(!mobileOpen)}
        className="lg:hidden fixed bottom-6 left-6 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-pink-400 to-purple-400 text-white shadow-lg flex items-center justify-center"
      >
        {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      <aside className={cn(
        "fixed right-0 top-20 w-64 h-[calc(100vh-6rem)] p-4 overflow-y-auto transition-transform duration-300 z-40",
        "lg:translate-x-0",
        mobileOpen ? "translate-x-0" : "translate-x-full"
      )}>
        <div className="glass-card p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300',
                  isActive
                    ? 'bg-gradient-to-r from-pink-400 to-purple-400 text-white shadow-lg'
                    : 'hover:bg-white/50 dark:hover:bg-gray-700/50'
                )}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </aside>
    </>
  );
}