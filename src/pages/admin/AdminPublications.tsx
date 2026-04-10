import React, { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase';
import { fileToBase64 } from '../../utils/fileHelpers';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { toast } from 'sonner';
import { Trash2, Edit2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface Publication {
  id: string;
  title: string;
  journal: string;
  year: string;
  abstract: string;
  pdfUrl?: string;
  link?: string;
}

export default function AdminPublications() {
  const { t } = useTranslation();
  const [publications, setPublications] = useState<Publication[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    journal: '',
    year: '',
    abstract: '',
    pdfUrl: '',
    link: '',
  });

  const fetchPublications = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, 'publications'));
      const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Publication));
      setPublications(data);
    } catch (error) {
      toast.error('Failed to fetch publications');
    } finally {
      setLoading(false);
    }
  };

  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 1024 * 1024) { // 1MB limit for Firestore document size
      toast.error('Fayl hajmi juda katta. Iltimos, 1MB dan kichik PDF yuklang yoki havolasini kiriting.');
      return;
    }

    setUploading(true);
    try {
      const base64 = await fileToBase64(file);
      setFormData(prev => ({ ...prev, pdfUrl: base64 }));
      toast.success('PDF muvaffaqiyatli yuklandi');
    } catch (error) {
      toast.error('PDF yuklashda xatolik yuz berdi');
    } finally {
      setUploading(false);
    }
  };

  useEffect(() => {
    fetchPublications();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const publicationData = {
      ...formData,
      createdAt: serverTimestamp(),
    };

    try {
      if (isEditing && currentId) {
        await updateDoc(doc(db, 'publications', currentId), publicationData);
        toast.success('Publication updated successfully');
      } else {
        await addDoc(collection(db, 'publications'), publicationData);
        toast.success('Publication added successfully');
      }
      setFormData({ title: '', journal: '', year: '', abstract: '', pdfUrl: '', link: '' });
      setIsEditing(false);
      setCurrentId(null);
      fetchPublications();
    } catch (error) {
      toast.error('Failed to save publication');
    }
  };

  const handleEdit = (publication: Publication) => {
    setFormData({
      title: publication.title,
      journal: publication.journal,
      year: publication.year,
      abstract: publication.abstract,
      pdfUrl: publication.pdfUrl || '',
      link: publication.link || '',
    });
    setIsEditing(true);
    setCurrentId(publication.id);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'publications', id));
      toast.success('Publication deleted successfully');
      fetchPublications();
    } catch (error) {
      toast.error('Failed to delete publication');
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">{t('admin.managePublications')}</h1>
      
      <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm mb-8">
        <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">{isEditing ? t('admin.edit') : t('admin.addNew')}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">{t('admin.title')}</label>
              <Input required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">{t('admin.journal')}</label>
              <Input required value={formData.journal} onChange={e => setFormData({...formData, journal: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">{t('admin.year')}</label>
              <Input required value={formData.year} onChange={e => setFormData({...formData, year: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">{t('admin.pdfUrl')} (Upload)</label>
              <Input 
                type="file" 
                accept="application/pdf"
                onChange={handlePdfUpload} 
                disabled={uploading}
              />
              {uploading && <p className="text-sm text-blue-500 mt-1">Uploading...</p>}
              {formData.pdfUrl && (
                <p className="text-sm text-green-500 mt-1">PDF uploaded</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">{t('admin.externalLink')}</label>
              <Input value={formData.link} onChange={e => setFormData({...formData, link: e.target.value})} />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">{t('admin.abstract')}</label>
              <Textarea required value={formData.abstract} onChange={e => setFormData({...formData, abstract: e.target.value})} />
            </div>
          </div>
          <div className="flex gap-2">
            <Button type="submit">{isEditing ? t('admin.save') : t('admin.addNew')}</Button>
            {isEditing && (
              <Button type="button" variant="outline" onClick={() => { setIsEditing(false); setFormData({ title: '', journal: '', year: '', abstract: '', pdfUrl: '', link: '' }); }}>
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t('admin.journal')}</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t('admin.actions')}</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
            {loading ? (
              <tr><td colSpan={3} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">{t('admin.loading')}</td></tr>
            ) : publications.map((publication) => (
              <tr key={publication.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{publication.title}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{publication.journal}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button onClick={() => handleEdit(publication)} className="text-blue-600 hover:text-blue-900 dark:hover:text-blue-400 mr-4"><Edit2 className="w-4 h-4" /></button>
                  <button onClick={() => handleDelete(publication.id)} className="text-red-600 hover:text-red-900 dark:hover:text-red-400"><Trash2 className="w-4 h-4" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
