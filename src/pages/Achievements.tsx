import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import { Award, Calendar } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface Achievement {
  id: string;
  title: string;
  organization: string;
  date: string;
  description: string;
}

export default function Achievements() {
  const { t } = useTranslation();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAchievements = async () => {
      try {
        const q = query(collection(db, 'achievements'), orderBy('date', 'desc'));
        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Achievement));
        setAchievements(data);
      } catch (error) {
        console.error("Error fetching achievements:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAchievements();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-display font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl mb-12">
          {t('achievements.title')}
        </h1>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {achievements.map((achievement, index) => (
              <motion.div
                key={achievement.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white dark:bg-gray-900 p-8 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-center gap-5 mb-6">
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-2xl text-blue-600 dark:text-blue-400">
                    <Award className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-display font-bold text-gray-900 dark:text-white mb-1">
                      {achievement.title}
                    </h3>
                    <p className="text-base font-medium text-gray-500 dark:text-gray-400">
                      {achievement.organization}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-blue-600 dark:text-blue-400 mb-4 bg-blue-50 dark:bg-blue-900/20 w-fit px-3 py-1.5 rounded-full">
                  <Calendar className="w-4 h-4" />
                  {achievement.date}
                </div>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-base">
                  {achievement.description}
                </p>
              </motion.div>
            ))}
            {achievements.length === 0 && (
              <div className="col-span-full text-center py-20 text-gray-500">
                {t('achievements.noAchievements')}
              </div>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
}
