import React, { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc, serverTimestamp, query, orderBy, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { compressImage } from '../../utils/fileHelpers';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { toast } from 'sonner';
import { Trash2, Edit2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

interface Skill {
  id: string;
  name: string;
  level: number;
}

export default function AdminAbout() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState('');
  const [homeImageUrl, setHomeImageUrl] = useState('');
  const [journeyText, setJourneyText] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadingHome, setUploadingHome] = useState(false);
  const { t } = useTranslation();

  const [formData, setFormData] = useState({
    name: '',
    level: 50,
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch skills
      const q = query(collection(db, 'skills'), orderBy('createdAt', 'asc'));
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Skill));
      setSkills(data);

      // Fetch profile image and journey text
      const profileDoc = await getDoc(doc(db, 'profile', 'main'));
      if (profileDoc.exists()) {
        setImageUrl(profileDoc.data().imageUrl || '');
        setHomeImageUrl(profileDoc.data().homeImageUrl || '');
        setJourneyText(profileDoc.data().journeyText || '');
      }
    } catch (error) {
      toast.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await setDoc(doc(db, 'profile', 'main'), { imageUrl, homeImageUrl }, { merge: true });
      toast.success('Profile image updated successfully');
    } catch (error) {
      toast.error('Failed to update profile image');
    }
  };

  const handleSaveJourney = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await setDoc(doc(db, 'profile', 'main'), { journeyText }, { merge: true });
      toast.success('Journey text updated successfully');
    } catch (error) {
      toast.error('Failed to update journey text');
    }
  };

  const handleSaveHomeImage = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await setDoc(doc(db, 'profile', 'main'), { imageUrl, homeImageUrl }, { merge: true });
      toast.success('Home image updated successfully');
    } catch (error) {
      toast.error('Failed to update home image');
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const compressedBase64 = await compressImage(file);
      setImageUrl(compressedBase64);
      toast.success('Rasm muvaffaqiyatli yuklandi. Saqlash tugmasini bosing.');
    } catch (error) {
      toast.error('Rasmni yuklashda xatolik yuz berdi');
    } finally {
      setUploading(false);
    }
  };

  const handleHomeImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingHome(true);
    try {
      const compressedBase64 = await compressImage(file);
      setHomeImageUrl(compressedBase64);
      toast.success('Rasm muvaffaqiyatli yuklandi. Saqlash tugmasini bosing.');
    } catch (error) {
      toast.error('Rasmni yuklashda xatolik yuz berdi');
    } finally {
      setUploadingHome(false);
    }
  };

  const handleSubmitSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    const skillData = {
      name: formData.name,
      level: Number(formData.level),
      createdAt: serverTimestamp(),
    };

    try {
      if (isEditing && currentId) {
        await updateDoc(doc(db, 'skills', currentId), skillData);
        toast.success('Skill updated successfully');
      } else {
        await addDoc(collection(db, 'skills'), skillData);
        toast.success('Skill added successfully');
      }
      setFormData({ name: '', level: 50 });
      setIsEditing(false);
      setCurrentId(null);
      fetchData();
    } catch (error) {
      toast.error('Failed to save skill');
    }
  };

  const handleEditSkill = (skill: Skill) => {
    setFormData({
      name: skill.name,
      level: skill.level,
    });
    setIsEditing(true);
    setCurrentId(skill.id);
  };

  const handleDeleteSkill = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'skills', id));
      toast.success('Skill deleted successfully');
      fetchData();
    } catch (error) {
      toast.error('Failed to delete skill');
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">{t('admin.aboutMe')}</h1>
      
      {/* Profile Image Section */}
      <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm mb-8">
        <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">{t('admin.profileImage')} (About Page)</h2>
        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">{t('admin.profileImage')} (Upload)</label>
              <Input 
                type="file"
                accept="image/*"
                onChange={handleImageUpload} 
                disabled={uploading}
              />
              {uploading && <p className="text-sm text-blue-500 mt-1">Uploading...</p>}
            </div>
            <Button type="submit" disabled={uploading}>{t('admin.save')}</Button>
          </div>
          {imageUrl && (
            <div className="mt-4">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{t('admin.preview')}</p>
              <img src={imageUrl} alt="Profile Preview" className="w-32 h-32 object-cover rounded-full border-4 border-white dark:border-gray-800 shadow-lg" />
            </div>
          )}
        </form>
      </div>

      {/* Home Image Section */}
      <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm mb-8">
        <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Home Page Image</h2>
        <form onSubmit={handleSaveHomeImage} className="space-y-4">
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Home Page Image (Upload)</label>
              <Input 
                type="file"
                accept="image/*"
                onChange={handleHomeImageUpload} 
                disabled={uploadingHome}
              />
              {uploadingHome && <p className="text-sm text-blue-500 mt-1">Uploading...</p>}
            </div>
            <Button type="submit" disabled={uploadingHome}>{t('admin.save')}</Button>
          </div>
          {homeImageUrl && (
            <div className="mt-4">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{t('admin.preview')}</p>
              <img src={homeImageUrl} alt="Home Preview" className="w-64 h-48 object-cover rounded-2xl border-4 border-white dark:border-gray-800 shadow-lg" />
            </div>
          )}
        </form>
      </div>

      {/* Journey Text Section */}
      <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm mb-8">
        <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">My Journey</h2>
        <form onSubmit={handleSaveJourney} className="space-y-4">
          <div className="mb-4 bg-white text-gray-900">
            <ReactQuill 
              theme="snow" 
              value={journeyText} 
              onChange={setJourneyText} 
              className="h-64 mb-12"
            />
          </div>
          <Button type="submit">{t('admin.save')}</Button>
        </form>
      </div>

      {/* Skills Section */}
      <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm mb-8">
        <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">{isEditing ? t('admin.edit') : t('admin.addNew')}</h2>
        <form onSubmit={handleSubmitSkill} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">{t('admin.skillName')}</label>
              <Input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="e.g. React & Next.js" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">{t('admin.proficiencyLevel')}</label>
              <Input required type="number" min="0" max="100" value={formData.level} onChange={e => setFormData({...formData, level: Number(e.target.value)})} placeholder="e.g. 90" />
            </div>
          </div>
          <div className="flex gap-2">
            <Button type="submit">{isEditing ? t('admin.save') : t('admin.addNew')}</Button>
            {isEditing && (
              <Button type="button" variant="outline" onClick={() => { setIsEditing(false); setFormData({ name: '', level: 50 }); }}>
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t('admin.skillName')}</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t('admin.level')}</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t('admin.actions')}</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
            {loading ? (
              <tr><td colSpan={3} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">{t('admin.loading')}</td></tr>
            ) : skills.map((skill) => (
              <tr key={skill.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{skill.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center gap-2">
                    <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${skill.level}%` }}></div>
                    </div>
                    <span>{skill.level}%</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button onClick={() => handleEditSkill(skill)} className="text-blue-600 hover:text-blue-900 dark:hover:text-blue-400 mr-4"><Edit2 className="w-4 h-4" /></button>
                  <button onClick={() => handleDeleteSkill(skill.id)} className="text-red-600 hover:text-red-900 dark:hover:text-red-400"><Trash2 className="w-4 h-4" /></button>
                </td>
              </tr>
            ))}
            {!loading && skills.length === 0 && (
              <tr><td colSpan={3} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">{t('admin.noSkills')}</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
