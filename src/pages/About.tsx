import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { collection, getDocs, doc, getDoc, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import 'react-quill-new/dist/quill.snow.css'; // For basic styling of the rich text output

interface Skill {
  id: string;
  name: string;
  level: number;
}

export default function About() {
  const { t } = useTranslation();
  const [skills, setSkills] = useState<Skill[]>([]);
  const [imageUrl, setImageUrl] = useState<string>('');
  const [journeyText, setJourneyText] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch skills
        const q = query(collection(db, 'skills'), orderBy('createdAt', 'asc'));
        const querySnapshot = await getDocs(q);
        const skillsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Skill));
        setSkills(skillsData);

        // Fetch profile image and journey text
        const profileDoc = await getDoc(doc(db, 'profile', 'main'));
        if (profileDoc.exists()) {
          setImageUrl(profileDoc.data().imageUrl || '');
          setJourneyText(profileDoc.data().journeyText || '');
        }
      } catch (error) {
        console.error("Error fetching about data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col md:flex-row md:items-center text-center md:text-left gap-8 mb-12">
          {imageUrl && (
            <motion.img 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              src={imageUrl} 
              alt="Profile" 
              className="w-48 h-48 mx-auto md:mx-0 rounded-full object-cover border-4 border-white dark:border-gray-800 shadow-xl"
              referrerPolicy="no-referrer"
              loading="lazy"
              decoding="async"
            />
          )}
          <h1 className="text-4xl font-display font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
            {t('about.title')}
          </h1>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div>
            <h2 className="text-3xl font-display font-bold text-gray-900 dark:text-white mb-6">
              {t('about.journey')}
            </h2>
            <div className="prose prose-lg dark:prose-invert max-w-none text-gray-600 dark:text-gray-300 leading-relaxed ql-editor px-0">
              {journeyText ? (
                <div dangerouslySetInnerHTML={{ __html: journeyText }} />
              ) : (
                <>
                  <p>{t('about.p1')}</p>
                  <p className="mt-6">{t('about.p2')}</p>
                  <p className="mt-6">{t('about.p3')}</p>
                </>
              )}
            </div>
          </div>

          <div>
            <h2 className="text-3xl font-display font-bold text-gray-900 dark:text-white mb-8">
              {t('about.skills')}
            </h2>
            {loading ? (
              <div className="flex justify-center py-10">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <div className="space-y-6">
                {skills.map((skill, index) => (
                  <div key={skill.id}>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{skill.name}</span>
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{skill.level}%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-2.5">
                      <motion.div
                        className="bg-blue-600 h-2.5 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${skill.level}%` }}
                        transition={{ duration: 1, delay: index * 0.1 }}
                      ></motion.div>
                    </div>
                  </div>
                ))}
                {skills.length === 0 && (
                  <p className="text-gray-500">No skills added yet.</p>
                )}
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
