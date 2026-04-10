import React, { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase';
import { compressImage } from '../../utils/fileHelpers';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { toast } from 'sonner';
import { Trash2, Edit2, Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  imageUrl: string;
  demoUrl: string;
  githubUrl: string;
  category: string;
}

export default function AdminProjects() {
  const { t } = useTranslation();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    technologies: '',
    imageUrl: '',
    demoUrl: '',
    githubUrl: '',
    category: 'All',
  });

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, 'projects'));
      const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Project));
      setProjects(data);
    } catch (error) {
      toast.error('Failed to fetch projects');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const compressedBase64 = await compressImage(file);
      setFormData(prev => ({ ...prev, imageUrl: compressedBase64 }));
      toast.success('Rasm muvaffaqiyatli yuklandi');
    } catch (error) {
      toast.error('Rasmni yuklashda xatolik yuz berdi');
    } finally {
      setUploading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const projectData = {
      ...formData,
      technologies: formData.technologies.split(',').map(t => t.trim()).filter(Boolean),
      createdAt: serverTimestamp(),
    };

    try {
      if (isEditing && currentId) {
        await updateDoc(doc(db, 'projects', currentId), projectData);
        toast.success('Project updated successfully');
      } else {
        await addDoc(collection(db, 'projects'), projectData);
        toast.success('Project added successfully');
      }
      setFormData({ title: '', description: '', technologies: '', imageUrl: '', demoUrl: '', githubUrl: '', category: 'All' });
      setIsEditing(false);
      setCurrentId(null);
      fetchProjects();
    } catch (error) {
      toast.error('Failed to save project');
    }
  };

  const handleEdit = (project: Project) => {
    setFormData({
      title: project.title,
      description: project.description,
      technologies: project.technologies?.join(', ') || '',
      imageUrl: project.imageUrl || '',
      demoUrl: project.demoUrl || '',
      githubUrl: project.githubUrl || '',
      category: project.category || 'All',
    });
    setIsEditing(true);
    setCurrentId(project.id);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'projects', id));
      toast.success('Project deleted successfully');
      fetchProjects();
    } catch (error) {
      toast.error('Failed to delete project');
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">{t('admin.manageProjects')}</h1>
      
      <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm mb-8">
        <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">{isEditing ? t('admin.edit') : t('admin.addNew')}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">{t('admin.title')}</label>
              <Input required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">{t('admin.category')}</label>
              <Input required value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">{t('admin.description')}</label>
              <Textarea required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">{t('admin.technologies')}</label>
              <Input value={formData.technologies} onChange={e => setFormData({...formData, technologies: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">{t('admin.imageUrl')} (Upload)</label>
              <Input 
                type="file" 
                accept="image/*"
                onChange={handleImageUpload} 
                disabled={uploading}
              />
              {uploading && <p className="text-sm text-blue-500 mt-1">Uploading...</p>}
              {formData.imageUrl && (
                <div className="mt-2">
                  <img src={formData.imageUrl} alt="Preview" className="h-20 w-auto rounded object-cover" />
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">{t('admin.demoUrl')}</label>
              <Input value={formData.demoUrl} onChange={e => setFormData({...formData, demoUrl: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">{t('admin.githubUrl')}</label>
              <Input value={formData.githubUrl} onChange={e => setFormData({...formData, githubUrl: e.target.value})} />
            </div>
          </div>
          <div className="flex gap-2">
            <Button type="submit">{isEditing ? t('admin.updateProject') : t('admin.addProject')}</Button>
            {isEditing && (
              <Button type="button" variant="outline" onClick={() => { setIsEditing(false); setFormData({ title: '', description: '', technologies: '', imageUrl: '', demoUrl: '', githubUrl: '', category: 'All' }); }}>
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t('admin.category')}</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t('admin.actions')}</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
            {loading ? (
              <tr><td colSpan={3} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">{t('admin.loading')}</td></tr>
            ) : projects.map((project) => (
              <tr key={project.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{project.title}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{project.category}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button onClick={() => handleEdit(project)} className="text-blue-600 hover:text-blue-900 dark:hover:text-blue-400 mr-4"><Edit2 className="w-4 h-4" /></button>
                  <button onClick={() => handleDelete(project.id)} className="text-red-600 hover:text-red-900 dark:hover:text-red-400"><Trash2 className="w-4 h-4" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
