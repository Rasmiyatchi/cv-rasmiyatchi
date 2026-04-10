import { Link, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import { Menu, X, Moon, Sun } from 'lucide-react';
import { useState, useEffect } from 'react';
import { cn } from '../../lib/utils';
import { useTranslation } from 'react-i18next';

export function Navbar() {
  const { t, i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const [isDark, setIsDark] = useState(true);

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
    <nav className="fixed top-0 w-full z-50 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-display font-bold tracking-tight text-gray-900 dark:text-white">
              Portfolio<span className="text-blue-600">.</span>
            </Link>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-blue-600",
                  location.pathname === link.path
                    ? "text-blue-600 dark:text-blue-400"
                    : "text-gray-600 dark:text-gray-300"
                )}
              >
                {link.name}
              </Link>
            ))}
            
            <div className="flex items-center space-x-1 border-l border-gray-300 dark:border-gray-700 pl-4 ml-2">
              <button onClick={() => i18n.changeLanguage('uz')} className={cn("text-xs font-bold px-2 py-1 rounded transition-colors", i18n.language === 'uz' ? "bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400" : "text-gray-500 hover:text-gray-900 dark:hover:text-white")}>UZ</button>
              <button onClick={() => i18n.changeLanguage('ru')} className={cn("text-xs font-bold px-2 py-1 rounded transition-colors", i18n.language === 'ru' ? "bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400" : "text-gray-500 hover:text-gray-900 dark:hover:text-white")}>RU</button>
              <button onClick={() => i18n.changeLanguage('en')} className={cn("text-xs font-bold px-2 py-1 rounded transition-colors", i18n.language.startsWith('en') ? "bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400" : "text-gray-500 hover:text-gray-900 dark:hover:text-white")}>EN</button>
            </div>

            <button
              onClick={() => setIsDark(!isDark)}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ml-2"
            >
              {isDark ? <Sun className="w-5 h-5 text-gray-300" /> : <Moon className="w-5 h-5 text-gray-600" />}
            </button>
          </div>

          {/* Mobile Nav Toggle */}
          <div className="flex items-center md:hidden space-x-2">
            <div className="flex items-center space-x-1 mr-2">
              <button onClick={() => i18n.changeLanguage('uz')} className={cn("text-xs font-bold px-1.5 py-1 rounded", i18n.language === 'uz' ? "bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400" : "text-gray-500")}>UZ</button>
              <button onClick={() => i18n.changeLanguage('ru')} className={cn("text-xs font-bold px-1.5 py-1 rounded", i18n.language === 'ru' ? "bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400" : "text-gray-500")}>RU</button>
              <button onClick={() => i18n.changeLanguage('en')} className={cn("text-xs font-bold px-1.5 py-1 rounded", i18n.language.startsWith('en') ? "bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400" : "text-gray-500")}>EN</button>
            </div>
            <button
              onClick={() => setIsDark(!isDark)}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              {isDark ? <Sun className="w-5 h-5 text-gray-300" /> : <Moon className="w-5 h-5 text-gray-600" />}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav Menu */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="md:hidden bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800"
        >
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "block px-3 py-2 rounded-md text-base font-medium",
                  location.pathname === link.path
                    ? "bg-gray-100 dark:bg-gray-800 text-blue-600 dark:text-blue-400"
                    : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                )}
              >
                {link.name}
              </Link>
            ))}
          </div>
        </motion.div>
      )}
    </nav>
  );
}
