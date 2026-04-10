import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Briefcase, Award, BookOpen, LogOut, Settings, User, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { auth } from '../../firebase';
import { signOut } from 'firebase/auth';
import { cn } from '../../lib/utils';
import { useTranslation } from 'react-i18next';

interface AdminSidebarProps {
  isOpen?: boolean;
  setIsOpen?: (isOpen: boolean) => void;
  isCollapsed?: boolean;
  setIsCollapsed?: (isCollapsed: boolean) => void;
}

export function AdminSidebar({ isOpen, setIsOpen, isCollapsed, setIsCollapsed }: AdminSidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const adminLinks = [
    { name: t('admin.dashboard'), path: '/admin', icon: LayoutDashboard },
    { name: t('admin.aboutMe'), path: '/admin/about', icon: User },
    { name: t('admin.experience'), path: '/admin/experience', icon: Briefcase },
    { name: t('admin.projects'), path: '/admin/projects', icon: Settings },
    { name: t('admin.achievements'), path: '/admin/achievements', icon: Award },
    { name: t('admin.publications'), path: '/admin/publications', icon: BookOpen },
  ];

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/admin/login');
  };

  return (
    <div className={cn(
      "bg-white dark:bg-gray-950 border-r border-gray-200 dark:border-gray-800 h-screen fixed left-0 top-0 flex flex-col z-50 transition-all duration-300 ease-in-out",
      isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
      isCollapsed ? "w-20" : "w-64"
    )}>
      <div className="p-6 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between h-[73px]">
        {!isCollapsed ? (
          <Link to="/" className="text-xl font-bold tracking-tighter text-gray-900 dark:text-white truncate">
            {t('admin.adminPanel')}
          </Link>
        ) : (
          <Link to="/" className="text-xl font-bold tracking-tighter text-gray-900 dark:text-white mx-auto">
            A<span className="text-blue-600">P</span>
          </Link>
        )}
        {setIsOpen && (
          <button 
            onClick={() => setIsOpen(false)}
            className="lg:hidden p-2 -mr-2 text-gray-500 hover:text-gray-900 dark:hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>
      
      <div className="flex-1 py-6 flex flex-col gap-2 px-3 overflow-y-auto">
        {adminLinks.map((link) => {
          const Icon = link.icon;
          const isActive = location.pathname === link.path;
          return (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setIsOpen?.(false)}
              title={isCollapsed ? link.name : undefined}
              className={cn(
                "flex items-center px-3 py-2.5 rounded-xl text-sm font-medium transition-colors",
                isCollapsed ? "justify-center" : "gap-3",
                isActive
                  ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-900 hover:text-gray-900 dark:hover:text-white"
              )}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {!isCollapsed && <span className="whitespace-nowrap overflow-hidden text-ellipsis">{link.name}</span>}
            </Link>
          );
        })}
      </div>

      <div className="p-4 border-t border-gray-200 dark:border-gray-800 flex flex-col gap-2">
        {setIsCollapsed && (
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={cn(
              "hidden lg:flex items-center px-3 py-2.5 rounded-xl text-sm font-medium text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors",
              isCollapsed ? "justify-center" : "gap-3"
            )}
            title={isCollapsed ? t('admin.expand') : t('admin.collapse')}
          >
            {isCollapsed ? <ChevronRight className="w-5 h-5 flex-shrink-0" /> : <ChevronLeft className="w-5 h-5 flex-shrink-0" />}
            {!isCollapsed && <span className="whitespace-nowrap overflow-hidden text-ellipsis">{t('admin.collapse')}</span>}
          </button>
        )}
        <button
          onClick={handleLogout}
          title={isCollapsed ? t('admin.logout') : undefined}
          className={cn(
            "flex items-center px-3 py-2.5 w-full rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors",
            isCollapsed ? "justify-center" : "gap-3"
          )}
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {!isCollapsed && <span className="whitespace-nowrap overflow-hidden text-ellipsis">{t('admin.logout')}</span>}
        </button>
      </div>
    </div>
  );
}
