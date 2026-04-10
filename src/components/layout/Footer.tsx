import { Link } from 'react-router-dom';
import { Github, Linkedin, Facebook, Mail } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-white dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0">
            <Link to="/" className="text-xl font-bold tracking-tighter text-gray-900 dark:text-white">
              Portfolio<span className="text-blue-600">.</span>
            </Link>
            <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm">
              Building digital experiences that matter.
            </p>
          </div>
          
          <div className="flex space-x-6">
            <a href="https://github.com/Rasmiyatchi" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
              <span className="sr-only">GitHub</span>
              <Github className="h-5 w-5" />
            </a>
            <a href="https://www.linkedin.com/in/odiljonsirojiddinov/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
              <span className="sr-only">LinkedIn</span>
              <Linkedin className="h-5 w-5" />
            </a>
            <a href="https://www.facebook.com/odiljonsirojiddinov" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
              <span className="sr-only">Facebook</span>
              <Facebook className="h-5 w-5" />
            </a>
            <a href="mailto:odiljonsirojiddinov04@gmail.com" className="text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
              <span className="sr-only">Email</span>
              <Mail className="h-5 w-5" />
            </a>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-800 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} Portfolio. All rights reserved.
          </p>
          <Link to="/admin/login" className="text-gray-400 hover:text-gray-900 dark:hover:text-white text-sm mt-4 md:mt-0 transition-colors">
            Admin Login
          </Link>
        </div>
      </div>
    </footer>
  );
}
