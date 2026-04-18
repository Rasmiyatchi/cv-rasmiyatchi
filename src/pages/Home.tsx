import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

export default function Home() {
  const { t } = useTranslation();
  const [homeImageUrl, setHomeImageUrl] = useState<string>('');

  useEffect(() => {
    const fetchHomeImage = async () => {
      try {
        const profileDoc = await getDoc(doc(db, 'profile', 'main'));
        if (profileDoc.exists() && profileDoc.data().homeImageUrl) {
          setHomeImageUrl(profileDoc.data().homeImageUrl);
        }
      } catch (error) {
        console.error("Error fetching home image:", error);
      }
    };

    fetchHomeImage();
  }, []);

  return (
    <div className="relative isolate overflow-hidden min-h-[calc(100vh-5rem)] flex flex-col justify-center">
      {/* Background gradients */}
      <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80" aria-hidden="true">
        <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" style={{ clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)' }}></div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 pb-20 pt-6 sm:pb-32 lg:flex lg:items-center lg:px-8 lg:py-20 w-full flex-grow">
        <div className="mx-auto max-w-2xl flex-shrink-0 lg:mx-0 lg:max-w-xl text-center lg:text-left pt-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <div className="mt-8 sm:mt-16 lg:mt-0 flex justify-center lg:justify-start">
              <span className="inline-flex items-center space-x-2 rounded-full bg-blue-500/10 px-4 py-1.5 text-xs sm:text-sm font-semibold leading-6 text-blue-600 dark:text-blue-400 ring-1 ring-inset ring-blue-500/20 shadow-sm shadow-blue-500/10">
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                <span>{t('home.available')}</span>
              </span>
            </div>
            <h1 className="mt-6 sm:mt-8 text-4xl sm:text-5xl lg:text-6xl font-display font-bold tracking-tight text-gray-900 dark:text-white leading-tight">
              {t('home.name')}
            </h1>
            <h2 className="mt-3 sm:mt-4 text-lg sm:text-xlg lg:text-2xl font-medium text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 leading-relaxed">
              {t('home.roles')}
            </h2>
            <div className="mt-5 sm:mt-6 space-y-4 text-sm sm:text-base lg:text-lg leading-relaxed text-gray-600 dark:text-gray-300">
              <p>{t('home.bio1')}</p>
              <p>{t('home.bio2')}</p>
            </div>
            <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4">
              <Link to="/projects" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto gap-2 text-sm sm:text-base shadow-lg shadow-blue-600/20 group hover:shadow-blue-600/30 transition-all rounded-xl">
                  {t('home.viewProjects')} 
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/contact" className="w-full sm:w-auto">
                <Button variant="outline" size="lg" className="w-full sm:w-auto text-sm sm:text-base hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors rounded-xl">
                  {t('home.contactMe')}
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
        <div className="mx-auto mt-12 sm:mt-24 lg:ml-10 lg:mt-0 lg:mr-0 lg:max-w-none flex justify-center w-full">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="w-full max-w-[260px] sm:max-w-md lg:max-w-none relative z-10"
          >
            {homeImageUrl && (
              <div className="relative group mx-auto">
                <div className="absolute -inset-1 sm:-inset-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-[2rem] sm:rounded-[2.5rem] blur-xl opacity-30 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                <img
                  src={homeImageUrl}
                  alt="Sirojiddinov Odiljon"
                  className="relative mx-auto w-full lg:w-[36rem] aspect-[4/5] lg:aspect-auto h-auto rounded-[2rem] sm:rounded-[2.5rem] bg-gray-50/5 object-cover shadow-2xl ring-1 ring-white/10"
                  referrerPolicy="no-referrer"
                  loading="lazy"
                  decoding="async"
                />
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
