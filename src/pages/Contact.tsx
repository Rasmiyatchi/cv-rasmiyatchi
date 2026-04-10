import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Textarea } from '../components/ui/Textarea';
import { Mail, MapPin, Phone } from 'lucide-react';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';

export default function Contact() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    
    const formData = new FormData(e.currentTarget);
    formData.append("access_key", "f5f4b470-52d3-4707-8891-da2bc80f81fd"); 

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData
      });

      const data = await response.json();

      if (data.success) {
        toast.success(t('contact.success'));
        (e.target as HTMLFormElement).reset();
      } else {
        toast.error("Xabar yuborishda xatolik yuz berdi.");
      }
    } catch (error) {
      toast.error("Tarmoq xatosi yuz berdi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div>
            <h1 className="text-4xl font-display font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl mb-6">
              {t('contact.title')}
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-12 leading-relaxed">
              {t('contact.subtitle')}
            </p>
            
            <div className="space-y-8">
              <div className="flex items-center gap-5">
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-2xl text-blue-600 dark:text-blue-400">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">{t('contact.email')}</h3>
                  <p className="text-xl font-display font-semibold text-gray-900 dark:text-white">odiljonsirojiddinov04@gmail.com</p>
                </div>
              </div>
              <div className="flex items-center gap-5">
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-2xl text-blue-600 dark:text-blue-400">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">{t('contact.location')}</h3>
                  <p className="text-xl font-display font-semibold text-gray-900 dark:text-white">Toshkent</p>
                </div>
              </div>
              <div className="flex items-center gap-5">
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-2xl text-blue-600 dark:text-blue-400">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">{t('contact.phone')}</h3>
                  <p className="text-xl font-display font-semibold text-gray-900 dark:text-white">+998 90 003 49 22</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 p-8 md:p-10 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-xl">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('contact.nameLabel')}
                </label>
                <Input id="name" name="name" required placeholder="John Doe" />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('contact.emailLabel')}
                </label>
                <Input id="email" name="email" type="email" required placeholder="john@example.com" />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('contact.messageLabel')}
                </label>
                <Textarea id="message" name="message" required placeholder="..." className="min-h-[150px]" />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? t('contact.sending') : t('contact.send')}
              </Button>
            </form>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
