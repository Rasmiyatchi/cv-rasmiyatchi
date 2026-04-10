import React, { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc, serverTimestamp, query, orderBy } from 'firebase/firestore';
import { db } from '../../firebase';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { toast } from 'sonner';
import { Trash2, Edit2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface Experience {
  id: string;
  role: string;
  company: string;
  duration: string;
  description: string[];
}

export default function AdminExperience() {
  const { t } = useTranslation();
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    role: '',
    company: '',
    duration: '',
    description: '',
  });

  const fetchExperiences = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, 'experiences'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Experience));
      setExperiences(data);
    } catch (error) {
      toast.error('Failed to fetch experiences');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExperiences();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const experienceData = {
      role: formData.role,
      company: formData.company,
      duration: formData.duration,
      description: formData.description.split('\n').map(d => d.trim()).filter(Boolean),
      createdAt: serverTimestamp(),
    };

    try {
      if (isEditing && currentId) {
        await updateDoc(doc(db, 'experiences', currentId), experienceData);
        toast.success('Experience updated successfully');
      } else {
        await addDoc(collection(db, 'experiences'), experienceData);
        toast.success('Experience added successfully');
      }
      setFormData({ role: '', company: '', duration: '', description: '' });
      setIsEditing(false);
      setCurrentId(null);
      fetchExperiences();
    } catch (error) {
      toast.error('Failed to save experience');
    }
  };

  const handleEdit = (experience: Experience) => {
    setFormData({
      role: experience.role,
      company: experience.company,
      duration: experience.duration,
      description: experience.description?.join('\n') || '',
    });
    setIsEditing(true);
    setCurrentId(experience.id);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'experiences', id));
      toast.success('Experience deleted successfully');
      fetchExperiences();
    } catch (error) {
      toast.error('Failed to delete experience');
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">{t('admin.manageExperience')}</h1>
      
      <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm mb-8">
        <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">{isEditing ? t('admin.edit') : t('admin.addNew')}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">{t('admin.role')}</label>
              <Input required value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} placeholder="e.g. Senior AI Engineer" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">{t('admin.company')}</label>
              <Input required value={formData.company} onChange={e => setFormData({...formData, company: e.target.value})} placeholder="e.g. Tech Innovators Inc." />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">{t('admin.duration')}</label>
              <Input required value={formData.duration} onChange={e => setFormData({...formData, duration: e.target.value})} placeholder="e.g. 2023 - Present" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">{t('admin.description')}</label>
              <Textarea required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Led the development of...&#10;Optimized machine learning models..." className="min-h-[120px]" />
            </div>
          </div>
          <div className="flex gap-2">
            <Button type="submit">{isEditing ? t('admin.updateExperience') : t('admin.addExperience')}</Button>
            {isEditing && (
              <Button type="button" variant="outline" onClick={() => { setIsEditing(false); setFormData({ role: '', company: '', duration: '', description: '' }); }}>
                {t('admin.cancel')}
              </Button>
            )}
          </div>
        </form>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
          <thead className="bg-gray-50 dark:bg-gray-800/50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t('admin.role')}</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t('admin.company')}</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t('admin.duration')}</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t('admin.actions')}</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
            {loading ? (
              <tr><td colSpan={4} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">{t('admin.loading')}</td></tr>
            ) : experiences.map((exp) => (
              <tr key={exp.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{exp.role}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{exp.company}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{exp.duration}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button onClick={() => handleEdit(exp)} className="text-blue-600 hover:text-blue-900 dark:hover:text-blue-400 mr-4"><Edit2 className="w-4 h-4" /></button>
                  <button onClick={() => handleDelete(exp.id)} className="text-red-600 hover:text-red-900 dark:hover:text-red-400"><Trash2 className="w-4 h-4" /></button>
                </td>
              </tr>
            ))}
            {!loading && experiences.length === 0 && (
              <tr><td colSpan={4} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">{t('admin.noExperiences')}</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
