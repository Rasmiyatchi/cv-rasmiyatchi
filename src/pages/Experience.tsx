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
        const q = query(collection(db, 'experiences'));
        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Experience));
        
        // Custom sorting logic by extracting year from duration (e.g. "2021", "2020 - 2023")
        const sortedData = data.sort((a, b) => {
          // Extract 4-digit years from duration strings
          const extractYear = (duration: string) => {
            const matches = duration.match(/\b(19|20)\d{2}\b/g);
            if (!matches) return 0;
            // If multiple years (e.g. "2020 - 2023"), get the maximum (latest) year
            return Math.max(...matches.map(y => parseInt(y, 10)));
          };
          
          const yearA = extractYear(a.duration || '');
          const yearB = extractYear(b.duration || '');
          
          // If years are different, sort by year descending
          if (yearA !== yearB) return yearB - yearA;
          
          // If years are same or not found, fallback to standard comparison or creation time
          return (b as any).createdAt?.toMillis() - (a as any).createdAt?.toMillis() || 0;
        });

        setExperiences(sortedData);
      } catch (error) {
        console.error("Error fetching experiences:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchExperiences();
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24 mt-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center mb-16">
          <h1 className="text-4xl font-display font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl mb-6">
            {t('experience.title')}
          </h1>
          <div className="w-20 h-1.5 bg-blue-600 mx-auto rounded-full"></div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="relative border-l-2 border-gray-100 dark:border-gray-800/80 ml-3 md:ml-6 space-y-12 pb-12">
            {experiences.map((exp, index) => (
              <motion.div
                key={exp.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative pl-8 md:pl-12"
              >
                {/* Timeline Dot */}
                <div className="absolute -left-[9px] top-8 flex items-center justify-center">
                  <div className="h-4 w-4 rounded-full bg-blue-600 ring-4 ring-white dark:ring-gray-950 shadow-sm" />
                </div>

                {/* Content Card */}
                <div className="group bg-white dark:bg-gray-900/40 rounded-3xl p-6 md:p-8 border border-gray-100 dark:border-gray-800/60 shadow-sm hover:shadow-xl hover:shadow-blue-500/5 hover:border-blue-100 dark:hover:border-blue-900/30 transition-all duration-300">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {exp.role}
                      </h3>
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 font-medium text-lg">
                        <Briefcase className="w-5 h-5 text-blue-500" />
                        {exp.company}
                      </div>
                    </div>
                    {/* Flexible Duration Badge */}
                    <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 text-sm font-bold self-start shrink-0 border border-blue-100 dark:border-blue-800/30 shadow-sm transition-colors group-hover:bg-blue-100 dark:group-hover:bg-blue-900/40">
                      {exp.duration}
                    </div>
                  </div>
                  
                  <div className="w-full h-px bg-gradient-to-r from-gray-100 dark:from-gray-800 to-transparent mb-6"></div>

                  <ul className="space-y-4">
                    {exp.description?.map((item, i) => (
                      <li key={i} className="flex gap-4 text-gray-600 dark:text-gray-300 leading-relaxed text-base">
                        <span className="w-2 h-2 rounded-full bg-blue-400 dark:bg-blue-500 mt-2 shrink-0 shadow-sm opacity-80" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
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
