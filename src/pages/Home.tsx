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
    <div className="relative isolate overflow-hidden">
      {/* Background gradients */}
      <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80" aria-hidden="true">
        <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" style={{ clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)' }}></div>
      </div>

      <div className="mx-auto max-w-7xl px-6 pb-24 pt-10 sm:pb-32 lg:flex lg:px-8 lg:py-40">
        <div className="mx-auto max-w-2xl flex-shrink-0 lg:mx-0 lg:max-w-xl lg:pt-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="mt-24 sm:mt-32 lg:mt-16">
              <a href="#" className="inline-flex space-x-6">
                <span className="rounded-full bg-blue-500/10 px-3 py-1 text-sm font-semibold leading-6 text-blue-600 dark:text-blue-400 ring-1 ring-inset ring-blue-500/20">
                  {t('home.available')}
                </span>
              </a>
            </div>
            <h1 className="mt-10 text-4xl font-display font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl">
              {t('home.name')}
            </h1>
            <h2 className="mt-4 text-xl sm:text-2xl font-medium text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 leading-relaxed">
              {t('home.roles')}
            </h2>
            <div className="mt-6 space-y-4 text-lg leading-relaxed text-gray-600 dark:text-gray-300">
              <p>{t('home.bio1')}</p>
              <p>{t('home.bio2')}</p>
            </div>
            <div className="mt-10 flex items-center gap-x-6">
              <Link to="/projects">
                <Button size="lg" className="gap-2">
                  {t('home.viewProjects')} <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link to="/contact">
                <Button variant="outline" size="lg">
                  {t('home.contactMe')}
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
        <div className="mx-auto mt-16 flex max-w-2xl sm:mt-24 lg:ml-10 lg:mt-0 lg:mr-0 lg:max-w-none lg:flex-none xl:ml-32">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="w-full max-w-3xl flex-none sm:max-w-5xl lg:max-w-none"
          >
            {homeImageUrl && (
              <img
                src={homeImageUrl}
                alt="Sirojiddinov Odiljon"
                className="w-full sm:w-[36rem] h-auto rounded-2xl bg-gray-50/5 object-cover shadow-2xl ring-1 ring-white/10"
                referrerPolicy="no-referrer"
                loading="lazy"
                decoding="async"
                width={800}
                height={600}
              />
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
