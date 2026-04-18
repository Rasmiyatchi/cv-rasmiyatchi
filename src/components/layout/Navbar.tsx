import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, Moon, Sun } from 'lucide-react';
import { useState, useEffect } from 'react';
import { cn } from '../../lib/utils';
import { useTranslation } from 'react-i18next';

export function Navbar() {
  const { t, i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const [isDark, setIsDark] = useState(true);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  return (
    <>
      <div className="h-20 sm:h-24"></div> {/* Spacer to prevent content from hiding behind fixed navbar */}
      <nav 
        className={cn(
          "fixed top-0 sm:top-6 w-full sm:w-[95%] md:w-[90%] max-w-6xl left-1/2 md:-translate-x-1/2 z-50 transition-all duration-300",
          scrolled || isOpen ? "sm:top-4" : "sm:top-6"
        )}
      >
        <div 
          className={cn(
            "bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl transition-all duration-300",
            "border-b sm:border sm:rounded-full border-gray-200 dark:border-gray-800",
            scrolled ? "shadow-lg shadow-gray-200/20 dark:shadow-black/40" : "shadow-sm"
          )}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 items-center">
              <div className="flex items-center">
                <Link to="/" className="text-xl sm:text-2xl font-display font-bold tracking-tight text-gray-900 dark:text-white transition-opacity hover:opacity-80">
                  Portfolio<span className="text-blue-600">.</span>
                </Link>
              </div>

              {/* Desktop Nav */}
              <div className="hidden md:flex items-center space-x-1 lg:space-x-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={cn(
                      "px-3 py-2 rounded-full text-sm font-medium transition-all duration-200",
                      location.pathname === link.path
                        ? "bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400"
                        : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800/60 hover:text-gray-900 dark:hover:text-white"
                    )}
                  >
                    {link.name}
                  </Link>
                ))}
                
                <div className="flex items-center space-x-1 border-l border-gray-300 dark:border-gray-700 pl-4 ml-2">
                  {['uz', 'ru', 'en'].map(lang => (
                    <button 
                      key={lang}
                      onClick={() => i18n.changeLanguage(lang)} 
                      className={cn(
                        "text-xs font-bold px-2.5 py-1.5 rounded-full transition-colors uppercase", 
                        i18n.language.startsWith(lang) 
                          ? "bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400" 
                          : "text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"
                      )}
                    >
                      {lang}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setIsDark(!isDark)}
                  className="p-2 ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800"
                  aria-label="Toggle dark mode"
                >
                  {isDark ? <Sun className="w-4 h-4 text-gray-300" /> : <Moon className="w-4 h-4 text-gray-600" />}
                </button>
              </div>

              {/* Mobile Nav Toggle */}
              <div className="flex items-center md:hidden space-x-2">
                <div className="flex items-center space-x-1 mr-1">
                  {['uz', 'ru', 'en'].map(lang => (
                    <button 
                      key={lang}
                      onClick={() => i18n.changeLanguage(lang)} 
                      className={cn(
                        "text-[10px] font-bold px-2 py-1 rounded-full uppercase", 
                        i18n.language.startsWith(lang) 
                          ? "bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400" 
                          : "text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
                      )}
                    >
                      {lang}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setIsDark(!isDark)}
                  className="p-1.5 rounded-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  {isDark ? <Sun className="w-4 h-4 text-gray-300" /> : <Moon className="w-4 h-4 text-gray-600" />}
                </button>
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  className="p-1.5 bg-gray-100 dark:bg-gray-800 rounded-full text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white border border-transparent dark:border-gray-700"
                >
                  {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Nav Menu */}
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="md:hidden overflow-hidden bg-white/50 dark:bg-gray-950/50 backdrop-blur-3xl sm:rounded-b-3xl border-t border-gray-200 dark:border-gray-800"
              >
                <div className="px-4 pt-2 pb-6 space-y-1">
                  {navLinks.map((link) => (
                    <Link
                      key={link.path}
                      to={link.path}
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        "block px-4 py-3 rounded-xl text-base font-medium transition-colors",
                        location.pathname === link.path
                          ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                          : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                      )}
                    >
                      {link.name}
                    </Link>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </nav>
    </>
  );
}
