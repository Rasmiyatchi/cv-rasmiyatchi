import React, { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { toast } from 'sonner';
import { Trash2, Edit2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface Achievement {
  id: string;
  title: string;
  organization: string;
  date: string;
  description: string;
}

export default function AdminAchievements() {
  const { t } = useTranslation();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    organization: '',
    date: '',
    description: '',
  });

  const fetchAchievements = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, 'achievements'));
      const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Achievement));
      setAchievements(data);
    } catch (error) {
      toast.error('Failed to fetch achievements');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAchievements();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const achievementData = {
      ...formData,
      createdAt: serverTimestamp(),
    };

    try {
      if (isEditing && currentId) {
        await updateDoc(doc(db, 'achievements', currentId), achievementData);
        toast.success('Achievement updated successfully');
      } else {
        await addDoc(collection(db, 'achievements'), achievementData);
        toast.success('Achievement added successfully');
      }
      setFormData({ title: '', organization: '', date: '', description: '' });
      setIsEditing(false);
      setCurrentId(null);
      fetchAchievements();
    } catch (error) {
      toast.error('Failed to save achievement');
    }
  };

  const handleEdit = (achievement: Achievement) => {
    setFormData({
      title: achievement.title,
      organization: achievement.organization,
      date: achievement.date,
      description: achievement.description,
    });
    setIsEditing(true);
    setCurrentId(achievement.id);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'achievements', id));
      toast.success('Achievement deleted successfully');
      fetchAchievements();
    } catch (error) {
      toast.error('Failed to delete achievement');
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">{t('admin.manageAchievements')}</h1>
      
      <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm mb-8">
        <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">{isEditing ? t('admin.edit') : t('admin.addNew')}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">{t('admin.title')}</label>
              <Input required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">{t('admin.organization')}</label>
              <Input required value={formData.organization} onChange={e => setFormData({...formData, organization: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">{t('admin.date')}</label>
              <Input required value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">{t('admin.description')}</label>
              <Textarea required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
            </div>
          </div>
          <div className="flex gap-2">
            <Button type="submit">{isEditing ? t('admin.save') : t('admin.addNew')}</Button>
            {isEditing && (
              <Button type="button" variant="outline" onClick={() => { setIsEditing(false); setFormData({ title: '', organization: '', date: '', description: '' }); }}>
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t('admin.title')}</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t('admin.organization')}</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t('admin.actions')}</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
            {loading ? (
              <tr><td colSpan={3} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">{t('admin.loading')}</td></tr>
            ) : achievements.map((achievement) => (
              <tr key={achievement.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{achievement.title}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{achievement.organization}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button onClick={() => handleEdit(achievement)} className="text-blue-600 hover:text-blue-900 dark:hover:text-blue-400 mr-4"><Edit2 className="w-4 h-4" /></button>
                  <button onClick={() => handleDelete(achievement.id)} className="text-red-600 hover:text-red-900 dark:hover:text-red-400"><Trash2 className="w-4 h-4" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
