import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import { ExternalLink, Github } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  imageUrl: string;
  demoUrl: string;
  githubUrl: string;
  category: string;
}

export default function Projects() {
  const { t } = useTranslation();
  const [projects, setProjects] = useState<Project[]>([]);
  const [filter, setFilter] = useState('All');
  const [loading, setLoading] = useState(true);

  const categories = [t('projects.all'), 'AI', 'Web', 'Education'];

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const q = query(collection(db, 'projects'));
        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Project));
        
        // Custom sorting logic by extracting year from title or description
        const sortedData = data.sort((a, b) => {
          const extractYear = (text1: string, text2: string) => {
            const combinedText = `${text1 || ''} ${text2 || ''}`;
            const matches = combinedText.match(/\b(19|20)\d{2}\b/g);
            if (!matches) return 0;
            return Math.max(...matches.map(y => parseInt(y, 10)));
          };
          
          const yearA = extractYear(a.title, a.description);
          const yearB = extractYear(b.title, b.description);
          
          if (yearA !== yearB) return yearB - yearA;
          
          // Fallback to createdAt if years are not found
          return (b as any).createdAt?.toMillis() - (a as any).createdAt?.toMillis() || 0;
        });

        setProjects(sortedData);
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const filteredProjects = filter === t('projects.all') || filter === 'All'
    ? projects 
    : projects.filter(p => p.category === filter);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-display font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl mb-8">
          {t('projects.title')}
        </h1>

        <div className="flex flex-wrap gap-4 mb-12">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                filter === cat
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                  : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group relative flex flex-col justify-between bg-white dark:bg-gray-900 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-xl transition-all duration-300"
              >
                <div>
                  <div className="aspect-video w-full overflow-hidden bg-gray-100 dark:bg-gray-800">
                    {project.imageUrl ? (
                      <img
                        src={project.imageUrl}
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out"
                        referrerPolicy="no-referrer"
                        loading="lazy"
                        decoding="async"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">No image</div>
                    )}
                  </div>
                  <div className="p-6 md:p-8">
                    <h3 className="text-2xl font-display font-bold text-gray-900 dark:text-white mb-3">
                      {project.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 text-base mb-6 leading-relaxed">
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.technologies?.map(tech => (
                        <span key={tech} className="px-3 py-1 text-xs font-semibold bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full border border-blue-100 dark:border-blue-800/50">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="p-6 md:p-8 pt-0 flex gap-6 mt-auto">
                  {project.demoUrl && (
                    <a href={project.demoUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                      <ExternalLink className="w-4 h-4" /> {t('projects.demo')}
                    </a>
                  )}
                  {project.githubUrl && (
                    <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                      <Github className="w-4 h-4" /> {t('projects.code')}
                    </a>
                  )}
                </div>
              </motion.div>
            ))}
            {filteredProjects.length === 0 && (
              <div className="col-span-full text-center py-20 text-gray-500">
                {t('projects.noProjects')}
              </div>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
}
