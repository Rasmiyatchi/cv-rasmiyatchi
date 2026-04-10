import { Outlet, Navigate } from 'react-router-dom';
import { AdminSidebar } from './AdminSidebar';
import { useAuth } from '../../contexts/AuthContext';
import { useState } from 'react';
import { Menu } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useTranslation } from 'react-i18next';

export function AdminLayout() {
  const { user, loading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { i18n } = useTranslation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-gray-950 font-sans text-gray-900 dark:text-gray-100">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-gray-900/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <AdminSidebar 
        isOpen={sidebarOpen} 
        setIsOpen={setSidebarOpen} 
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
      />
      
      <div className={cn(
        "flex-1 flex flex-col min-h-screen w-full transition-all duration-300 ease-in-out",
        isCollapsed ? "lg:ml-20" : "lg:ml-64"
      )}>
        {/* Mobile header */}
        <div className="lg:hidden sticky top-0 z-30 flex items-center justify-between px-4 py-3 bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800">
          <div className="text-lg font-bold tracking-tighter text-gray-900 dark:text-white truncate mr-2">
            Admin<span className="text-blue-600">Panel</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="flex items-center gap-0.5 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
              <button onClick={() => i18n.changeLanguage('uz')} className={cn("text-[10px] font-bold px-1.5 py-1 rounded transition-colors", i18n.language === 'uz' ? "bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm" : "text-gray-500 hover:text-gray-900 dark:hover:text-white")}>UZ</button>
              <button onClick={() => i18n.changeLanguage('ru')} className={cn("text-[10px] font-bold px-1.5 py-1 rounded transition-colors", i18n.language === 'ru' ? "bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm" : "text-gray-500 hover:text-gray-900 dark:hover:text-white")}>RU</button>
              <button onClick={() => i18n.changeLanguage('en')} className={cn("text-[10px] font-bold px-1.5 py-1 rounded transition-colors", i18n.language.startsWith('en') ? "bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm" : "text-gray-500 hover:text-gray-900 dark:hover:text-white")}>EN</button>
            </div>
            <button 
              onClick={() => setSidebarOpen(true)}
              className="p-1.5 text-gray-600 dark:text-gray-300"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Desktop Header (Language Switcher) */}
        <div className="hidden lg:flex justify-end px-8 py-4 bg-transparent">
          <div className="flex items-center gap-1 bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 p-1 rounded-lg shadow-sm">
            <button onClick={() => i18n.changeLanguage('uz')} className={cn("text-xs font-bold px-2 py-1 rounded transition-colors", i18n.language === 'uz' ? "bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400" : "text-gray-500 hover:text-gray-900 dark:hover:text-white")}>UZ</button>
            <button onClick={() => i18n.changeLanguage('ru')} className={cn("text-xs font-bold px-2 py-1 rounded transition-colors", i18n.language === 'ru' ? "bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400" : "text-gray-500 hover:text-gray-900 dark:hover:text-white")}>RU</button>
            <button onClick={() => i18n.changeLanguage('en')} className={cn("text-xs font-bold px-2 py-1 rounded transition-colors", i18n.language.startsWith('en') ? "bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400" : "text-gray-500 hover:text-gray-900 dark:hover:text-white")}>EN</button>
          </div>
        </div>

        <main className="flex-1 p-4 sm:p-8 pt-4 lg:pt-4 overflow-x-hidden w-full max-w-[100vw]">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
