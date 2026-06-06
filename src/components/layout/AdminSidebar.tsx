import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Briefcase,
  Award,
  BookOpen,
  LogOut,
  FolderGit2,
  User,
  X,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
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
  const { t } = useTranslation();

  const adminLinks = [
    { name: t('admin.dashboard'), path: '/admin', icon: LayoutDashboard },
    { name: t('admin.aboutMe'), path: '/admin/about', icon: User },
    { name: t('admin.experience'), path: '/admin/experience', icon: Briefcase },
    { name: t('admin.projects'), path: '/admin/projects', icon: FolderGit2 },
    { name: t('admin.achievements'), path: '/admin/achievements', icon: Award },
    { name: t('admin.publications'), path: '/admin/publications', icon: BookOpen },
  ];

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/admin/login');
  };

  return (
    <div
      className={cn(
        'fixed left-0 top-0 z-50 flex h-screen flex-col border-r border-gray-200/70 bg-white/70 backdrop-blur-xl dark:border-gray-800/70 dark:bg-gray-900/50 transition-all duration-300 ease-in-out',
        isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
        isCollapsed ? 'w-20' : 'w-64',
      )}
    >
      {/* Logo */}
      <div className="flex h-[73px] items-center justify-between border-b border-gray-200 px-5 dark:border-gray-800">
        <Link to="/" className="flex items-center gap-2.5 overflow-hidden">
          <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 font-display text-sm font-bold text-white shadow-md shadow-blue-600/20">
            SO
          </span>
          {!isCollapsed && (
            <span className="truncate font-display text-base font-bold text-gray-900 dark:text-white">
              {t('admin.adminPanel')}
            </span>
          )}
        </Link>
        {setIsOpen && (
          <button
            onClick={() => setIsOpen(false)}
            className="-mr-2 p-2 text-gray-500 hover:text-gray-900 dark:hover:text-white lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Navigatsiya */}
      <div className="flex flex-1 flex-col gap-1 overflow-y-auto px-3 py-5">
        {!isCollapsed && (
          <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-600">
            Menu
          </p>
        )}
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
                'relative flex items-center rounded-xl px-3 py-2.5 text-sm font-medium transition-all',
                isCollapsed ? 'justify-center' : 'gap-3',
                isActive
                  ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white',
              )}
            >
              {isActive && (
                <span className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-blue-600" />
              )}
              <Icon className="h-5 w-5 flex-shrink-0" />
              {!isCollapsed && (
                <span className="overflow-hidden text-ellipsis whitespace-nowrap">{link.name}</span>
              )}
            </Link>
          );
        })}
      </div>

      {/* Pastki qism */}
      <div className="flex flex-col gap-2 border-t border-gray-200 p-4 dark:border-gray-800">
        {setIsCollapsed && (
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={cn(
              'hidden items-center rounded-xl px-3 py-2.5 text-sm font-medium text-gray-500 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 lg:flex',
              isCollapsed ? 'justify-center' : 'gap-3',
            )}
            title={isCollapsed ? t('admin.expand') : t('admin.collapse')}
          >
            {isCollapsed ? (
              <ChevronRight className="h-5 w-5 flex-shrink-0" />
            ) : (
              <ChevronLeft className="h-5 w-5 flex-shrink-0" />
            )}
            {!isCollapsed && (
              <span className="overflow-hidden text-ellipsis whitespace-nowrap">{t('admin.collapse')}</span>
            )}
          </button>
        )}
        <button
          onClick={handleLogout}
          title={isCollapsed ? t('admin.logout') : undefined}
          className={cn(
            'flex w-full items-center rounded-xl px-3 py-2.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/30',
            isCollapsed ? 'justify-center' : 'gap-3',
          )}
        >
          <LogOut className="h-5 w-5 flex-shrink-0" />
          {!isCollapsed && (
            <span className="overflow-hidden text-ellipsis whitespace-nowrap">{t('admin.logout')}</span>
          )}
        </button>
      </div>
    </div>
  );
}
