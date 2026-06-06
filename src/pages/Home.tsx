import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { ArrowRight, Download, Github, Linkedin, Mail, ArrowDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { CONTACT } from '../utils/cvData';

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
        console.error('Error fetching home image:', error);
      }
    };
    fetchHomeImage();
  }, []);

  // "roles" matni "·" bilan ajratilgan — uni chiplar uchun bo'laklarga ajratamiz
  const roles = t('home.roles')
    .split('·')
    .map((r) => r.trim())
    .filter(Boolean);

  return (
    <section className="relative isolate overflow-hidden">
      <div className="mx-auto flex min-h-[calc(100vh-6rem)] max-w-7xl flex-col justify-center px-5 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid items-center gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
          {/* Chap: matn */}
          <div className="text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            >
              <span className="inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/5 px-4 py-1.5 text-xs sm:text-sm font-medium text-blue-700 dark:text-blue-300 backdrop-blur">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-500 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-blue-500" />
                </span>
                {t('home.available')}
              </span>

              <h1 className="mt-6 text-4xl sm:text-6xl lg:text-7xl font-display font-bold tracking-tight text-gray-900 dark:text-white leading-[1.05]">
                {t('home.name')}
              </h1>

              <p className="mt-4 text-lg sm:text-2xl font-semibold text-gradient leading-snug">
                {roles.slice(0, 4).join(' · ')}
              </p>

              <p className="mt-6 max-w-xl mx-auto lg:mx-0 text-sm sm:text-base lg:text-lg leading-relaxed text-gray-600 dark:text-gray-300">
                {t('home.bio1')}
              </p>

              {/* CTA tugmalari */}
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3">
                <Link to="/projects" className="w-full sm:w-auto">
                  <Button size="lg" className="w-full sm:w-auto gap-2 rounded-xl group">
                    {t('home.viewProjects')}
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link to="/cv" className="w-full sm:w-auto">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto gap-2 rounded-xl">
                    <Download className="w-4 h-4" /> {t('nav.cv')}
                  </Button>
                </Link>
              </div>

              {/* Ijtimoiy tarmoqlar */}
              <div className="mt-8 flex items-center justify-center lg:justify-start gap-3">
                {[
                  { href: CONTACT.github, icon: Github, label: 'GitHub' },
                  { href: CONTACT.linkedin, icon: Linkedin, label: 'LinkedIn' },
                  { href: `mailto:${CONTACT.email}`, icon: Mail, label: 'Email' },
                ].map(({ href, icon: Icon, label }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 dark:border-gray-800 bg-white/60 dark:bg-gray-900/60 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-500/40 hover:-translate-y-0.5 transition-all"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            </motion.div>
          </div>

          {/* O'ng: portret */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.15, ease: 'easeOut' }}
            className="relative mx-auto w-full max-w-[300px] sm:max-w-sm lg:max-w-md"
          >
            <div className="relative">
              {/* Yumshoq indigo halqa-yog'du */}
              <div className="absolute -inset-3 rounded-[2.5rem] bg-gradient-to-br from-blue-500/30 to-blue-700/20 blur-2xl opacity-60" />
              {homeImageUrl ? (
                <img
                  src={homeImageUrl}
                  alt={t('home.name')}
                  className="relative aspect-[4/5] w-full rounded-[2rem] object-cover shadow-2xl ring-1 ring-gray-900/10 dark:ring-white/10"
                  referrerPolicy="no-referrer"
                  loading="lazy"
                  decoding="async"
                />
              ) : (
                <div className="relative flex aspect-[4/5] w-full items-center justify-center rounded-[2rem] bg-gradient-to-br from-blue-500/10 to-blue-700/10 ring-1 ring-gray-900/10 dark:ring-white/10">
                  <span className="font-display text-7xl font-bold text-blue-500/40">SO</span>
                </div>
              )}

              {/* Suzuvchi nishon */}
              <div className="absolute -bottom-4 -left-4 hidden sm:flex items-center gap-2 rounded-2xl border border-gray-200/70 dark:border-gray-700/70 bg-white/90 dark:bg-gray-900/90 px-4 py-2.5 shadow-xl backdrop-blur animate-float">
                <span className="flex h-2.5 w-2.5 rounded-full bg-green-500" />
                <span className="text-xs font-semibold text-gray-800 dark:text-gray-100">
                  {CONTACT.location}
                </span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* "Men shular bilan shug'ullanaman" — rollar chiplari */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-14 lg:mt-20"
        >
          <div className="flex flex-wrap justify-center lg:justify-start gap-2.5">
            {roles.map((role) => (
              <span
                key={role}
                className="rounded-full border border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-gray-900/40 px-4 py-1.5 text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 backdrop-blur"
              >
                {role}
              </span>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Aylantirish ishorasi */}
      <div className="hidden lg:flex justify-center pb-8 -mt-4">
        <ArrowDown className="h-5 w-5 animate-bounce text-gray-400 dark:text-gray-600" />
      </div>
    </section>
  );
}
