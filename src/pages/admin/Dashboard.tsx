import { useAuth } from '../../contexts/AuthContext';
import { motion } from 'motion/react';
import { Settings, Briefcase, Award, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function Dashboard() {
  const { user } = useAuth();
  const { t } = useTranslation();

  const stats = [
    { name: t('admin.manageProjects'), icon: Settings, link: '/admin/projects', color: 'bg-blue-500' },
    { name: t('admin.manageAchievements'), icon: Award, link: '/admin/achievements', color: 'bg-purple-500' },
    { name: t('admin.managePublications'), icon: BookOpen, link: '/admin/publications', color: 'bg-green-500' },
    { name: t('admin.manageExperience'), icon: Briefcase, link: '/admin/experience', color: 'bg-orange-500' },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
        {t('admin.welcome')}
      </h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        {t('admin.manageContent')}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Link key={stat.name} to={stat.link}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-all cursor-pointer h-full"
              >
                <div className={`w-12 h-12 rounded-xl ${stat.color} text-white flex items-center justify-center mb-4`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {stat.name}
                </h3>
              </motion.div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
