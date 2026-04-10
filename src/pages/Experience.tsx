import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Briefcase } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase';

interface Experience {
  id: string;
  role: string;
  company: string;
  duration: string;
  description: string[];
}

export default function Experience() {
  const { t } = useTranslation();
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        const q = query(collection(db, 'experiences'), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Experience));
        setExperiences(data);
      } catch (error) {
        console.error("Error fetching experiences:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchExperiences();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-display font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl mb-12">
          {t('experience.title')}
        </h1>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="space-y-12">
            {experiences.map((exp, index) => (
              <motion.div
                key={exp.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative pl-8 sm:pl-32 py-6 group"
              >
                <div className="flex flex-col sm:flex-row items-start mb-1 group-last:before:hidden before:absolute before:left-2 sm:before:left-0 before:h-full before:px-px before:bg-gray-200 dark:before:bg-gray-800 sm:before:ml-[6.5rem] before:self-start before:-translate-x-1/2 before:translate-y-3 after:absolute after:left-2 sm:after:left-0 after:w-2 after:h-2 after:bg-blue-600 after:border-4 after:box-content after:border-white dark:after:border-gray-950 after:rounded-full sm:after:ml-[6.5rem] after:-translate-x-1/2 after:translate-y-1.5">
                  <time className="sm:absolute left-0 translate-y-0.5 inline-flex items-center justify-center text-xs font-semibold uppercase w-24 h-6 mb-3 sm:mb-0 text-blue-600 bg-blue-100 dark:bg-blue-900/30 rounded-full border border-blue-200 dark:border-blue-800/50">
                    {exp.duration}
                  </time>
                  <div className="text-2xl font-display font-bold text-gray-900 dark:text-white">{exp.role}</div>
                </div>
                <div className="text-gray-600 dark:text-gray-400 text-base font-medium mb-4 flex items-center gap-2">
                  <Briefcase className="w-4 h-4" />
                  {exp.company}
                </div>
                <ul className="list-disc pl-5 space-y-3 text-gray-600 dark:text-gray-300 leading-relaxed text-base">
                  {exp.description?.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </motion.div>
            ))}
            {experiences.length === 0 && (
              <div className="text-center py-20 text-gray-500">
                No experiences found.
              </div>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
}
