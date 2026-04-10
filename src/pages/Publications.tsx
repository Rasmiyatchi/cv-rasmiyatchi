import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import { BookOpen, Download, ExternalLink } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface Publication {
  id: string;
  title: string;
  journal: string;
  year: string;
  abstract: string;
  pdfUrl?: string;
  link?: string;
}

export default function Publications() {
  const { t } = useTranslation();
  const [publications, setPublications] = useState<Publication[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPublications = async () => {
      try {
        const q = query(collection(db, 'publications'), orderBy('year', 'desc'));
        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Publication));
        setPublications(data);
      } catch (error) {
        console.error("Error fetching publications:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPublications();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-display font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl mb-12">
          {t('publications.title')}
        </h1>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="space-y-8">
            {publications.map((pub, index) => (
              <motion.div
                key={pub.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white dark:bg-gray-900 p-8 md:p-10 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-xl transition-all duration-300"
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-6">
                  <div>
                    <h3 className="text-2xl font-display font-bold text-gray-900 dark:text-white mb-3 flex items-start gap-3">
                      <BookOpen className="w-6 h-6 text-blue-600 dark:text-blue-400 mt-1 flex-shrink-0" />
                      {pub.title}
                    </h3>
                    <p className="text-base font-medium text-blue-600 dark:text-blue-400 ml-9">
                      {pub.journal} <span className="text-gray-300 dark:text-gray-600 mx-2">•</span> {pub.year}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-3 md:ml-9">
                    {pub.pdfUrl && (
                      <a
                        href={pub.pdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 dark:text-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-xl transition-colors"
                      >
                        <Download className="w-4 h-4" /> {t('publications.pdf')}
                      </a>
                    )}
                    {pub.link && (
                      <a
                        href={pub.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors shadow-md shadow-blue-500/20"
                      >
                        <ExternalLink className="w-4 h-4" /> {t('publications.read')}
                      </a>
                    )}
                  </div>
                </div>
                <div className="md:ml-9">
                  <p className="font-semibold text-gray-900 dark:text-white mb-3 text-lg">{t('publications.abstract')}</p>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-base">
                    {pub.abstract}
                  </p>
                </div>
              </motion.div>
            ))}
            {publications.length === 0 && (
              <div className="text-center py-20 text-gray-500">
                {t('publications.noPublications')}
              </div>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
}
