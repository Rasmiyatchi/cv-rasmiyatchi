import { useAuth } from '../../contexts/AuthContext';
import { motion } from 'motion/react';
import { User, Briefcase, FolderGit2, Award, BookOpen, ArrowUpRight, Eye, Download } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function Dashboard() {
  const { user } = useAuth();
  const { t } = useTranslation();

  const cards = [
    { name: t('admin.aboutMe'), icon: User, link: '/admin/about' },
    { name: t('admin.manageExperience'), icon: Briefcase, link: '/admin/experience' },
    { name: t('admin.manageProjects'), icon: FolderGit2, link: '/admin/projects' },
    { name: t('admin.manageAchievements'), icon: Award, link: '/admin/achievements' },
    { name: t('admin.managePublications'), icon: BookOpen, link: '/admin/publications' },
  ];

  return (
    <div className="mx-auto max-w-6xl">
      {/* Salomlashuv banneri */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 to-blue-800 p-7 sm:p-9 text-white shadow-xl shadow-blue-600/20"
      >
        <div className="absolute -top-16 -right-10 h-56 w-56 rounded-full bg-white/10 blur-2xl" />
        <div className="relative">
          <p className="text-sm font-medium text-blue-100">{user?.email}</p>
          <h1 className="mt-1 text-2xl sm:text-3xl font-display font-bold">{t('admin.welcome')}</h1>
          <p className="mt-2 max-w-lg text-sm text-blue-100/90">{t('admin.manageContent')}</p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-xl bg-white/15 px-4 py-2 text-sm font-semibold backdrop-blur hover:bg-white/25 transition"
            >
              <Eye className="h-4 w-4" /> {t('nav.home')}
            </Link>
            <Link
              to="/cv"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-50 transition"
            >
              <Download className="h-4 w-4" /> {t('nav.cv')}
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Boshqaruv kartalari */}
      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card, index) => {
          const Icon = card.icon;
          return (
            <Link key={card.name} to={card.link}>
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.05 * index }}
                className="group h-full rounded-2xl border border-gray-200 dark:border-gray-800 bg-white/70 dark:bg-gray-900/55 backdrop-blur-xl p-6 shadow-sm transition-all hover:-translate-y-1 hover:border-blue-500/40 hover:shadow-lg hover:shadow-blue-500/10"
              >
                <div className="flex items-start justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 ring-1 ring-blue-500/10 transition-colors group-hover:bg-blue-600 group-hover:text-white">
                    <Icon className="h-6 w-6" />
                  </div>
                  <ArrowUpRight className="h-5 w-5 text-gray-300 dark:text-gray-600 transition-all group-hover:text-blue-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">{card.name}</h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {t('admin.manageContent')}
                </p>
              </motion.div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
