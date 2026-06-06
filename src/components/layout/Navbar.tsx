import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, Moon, Sun, Download } from 'lucide-react';
import { useState, useEffect } from 'react';
import { cn } from '../../lib/utils';
import { useTranslation } from 'react-i18next';

export function Navbar() {
  const { t, i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const [isDark, setIsDark] = useState(
    () => typeof document !== 'undefined' && document.documentElement.classList.contains('dark'),
  );
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => { setIsOpen(false); }, [location.pathname]);

  const navLinks = [
    { name: t('nav.home'), path: '/' },
    { name: t('nav.about'), path: '/about' },
    { name: t('nav.experience'), path: '/experience' },
    { name: t('nav.projects'), path: '/projects' },
    { name: t('nav.achievements'), path: '/achievements' },
    { name: t('nav.publications'), path: '/publications' },
    { name: t('nav.contact'), path: '/contact' },
  ];

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
    try { localStorage.setItem('theme', isDark ? 'dark' : 'light'); } catch { /* ignore */ }
  }, [isDark]);

  const LANGS = ['uz', 'ru', 'en'] as const;

  return (
    <>
      {/* Spacer — prevents content hiding behind the fixed navbar */}
      <div className="h-16 sm:h-24" />

      <nav
        className={cn(
          'fixed top-0 sm:top-5 w-full sm:w-[96%] lg:w-[92%] xl:w-[88%] max-w-7xl left-1/2 -translate-x-1/2 z-50 transition-all duration-300',
          scrolled || isOpen ? 'sm:top-3' : 'sm:top-5',
        )}
      >
        <div
          className={cn(
            'bg-white/90 dark:bg-gray-950/90 backdrop-blur-xl transition-all duration-300',
            isOpen ? 'border-b' : 'border-b sm:border sm:rounded-full',
            'border-gray-200 dark:border-gray-800',
            scrolled ? 'shadow-lg shadow-gray-200/20 dark:shadow-black/40' : 'shadow-sm',
            isOpen && 'sm:rounded-[2rem]',
          )}
        >
          <div className="px-4 sm:px-5 lg:px-6">
            <div className="flex h-14 sm:h-15 items-center justify-between gap-2">

              {/* Logo */}
              <Link
                to="/"
                className="shrink-0 text-xl font-display font-bold tracking-tight transition-opacity hover:opacity-80"
              >
                <span className="text-gradient">Portfolio</span>
                <span className="text-blue-500">.</span>
              </Link>

              {/* ── Desktop Nav (lg+) ── */}
              <div className="hidden lg:flex items-center gap-0.5 min-w-0 flex-1 justify-center">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={cn(
                      'px-2.5 py-1.5 rounded-full text-[12.5px] font-medium transition-all duration-200 whitespace-nowrap',
                      location.pathname === link.path
                        ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400'
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800/60 hover:text-gray-900 dark:hover:text-white',
                    )}
                  >
                    {link.name}
                  </Link>
                ))}
              </div>

              {/* Desktop right controls */}
              <div className="hidden lg:flex items-center gap-1 shrink-0">
                <Link
                  to="/cv"
                  className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-blue-500 to-blue-700 px-3 py-1.5 text-[12.5px] font-semibold text-white shadow-sm shadow-blue-600/20 hover:opacity-95 transition-opacity whitespace-nowrap"
                >
                  <Download className="w-3.5 h-3.5" />
                  {t('nav.cv')}
                </Link>

                <div className="flex items-center gap-0.5 border-l border-gray-200 dark:border-gray-700 pl-2 ml-1">
                  {LANGS.map(lang => (
                    <button
                      key={lang}
                      onClick={() => i18n.changeLanguage(lang)}
                      className={cn(
                        'text-[11px] font-bold px-2 py-1.5 rounded-full transition-colors uppercase',
                        i18n.language.startsWith(lang)
                          ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400'
                          : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white',
                      )}
                    >
                      {lang}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setIsDark(!isDark)}
                  className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800"
                  aria-label="Toggle dark mode"
                >
                  {isDark ? <Sun className="w-4 h-4 text-gray-300" /> : <Moon className="w-4 h-4 text-gray-600" />}
                </button>
              </div>

              {/* ── Mobile / Tablet controls (< lg) ── */}
              <div className="flex items-center gap-1.5 lg:hidden shrink-0">
                {/* Lang switcher */}
                <div className="flex items-center gap-0.5">
                  {LANGS.map(lang => (
                    <button
                      key={lang}
                      onClick={() => i18n.changeLanguage(lang)}
                      className={cn(
                        'text-[10px] font-bold px-1.5 py-1 rounded-full uppercase transition-colors',
                        i18n.language.startsWith(lang)
                          ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400'
                          : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800',
                      )}
                    >
                      {lang}
                    </button>
                  ))}
                </div>

                {/* Dark mode toggle */}
                <button
                  onClick={() => setIsDark(!isDark)}
                  className="p-1.5 rounded-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  aria-label="Toggle dark mode"
                >
                  {isDark ? <Sun className="w-4 h-4 text-gray-300" /> : <Moon className="w-4 h-4 text-gray-600" />}
                </button>

                {/* Hamburger */}
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  className="p-1.5 bg-gray-100 dark:bg-gray-800 rounded-full text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white border border-transparent dark:border-gray-700 transition-colors"
                  aria-label="Toggle menu"
                >
                  {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
              </div>

            </div>
          </div>

          {/* ── Mobile dropdown menu ── */}
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="lg:hidden overflow-hidden bg-white/50 dark:bg-gray-950/50 backdrop-blur-3xl sm:rounded-b-3xl border-t border-gray-200 dark:border-gray-800"
              >
                <div className="px-4 pt-2 pb-5 space-y-1">
                  {navLinks.map((link) => (
                    <Link
                      key={link.path}
                      to={link.path}
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        'block px-4 py-3 rounded-xl text-sm font-medium transition-colors',
                        location.pathname === link.path
                          ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                          : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800',
                      )}
                    >
                      {link.name}
                    </Link>
                  ))}
                  <Link
                    to="/cv"
                    onClick={() => setIsOpen(false)}
                    className="mt-2 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-blue-700 px-4 py-3 text-sm font-semibold text-white shadow-sm"
                  >
                    <Download className="w-4 h-4" />
                    {t('nav.cv')}
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </nav>
    </>
  );
}
