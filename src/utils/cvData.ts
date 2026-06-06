import { collection, getDocs, doc, getDoc, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase';

export interface Skill {
  id: string;
  name: string;
  level: number;
}
export interface Experience {
  id: string;
  role: string;
  company: string;
  duration: string;
  description?: string[];
}
export interface Project {
  id: string;
  title: string;
  description: string;
  technologies?: string[];
}
export interface Achievement {
  id: string;
  title: string;
  organization: string;
  date: string;
  description?: string;
}
export interface Publication {
  id: string;
  title: string;
  journal: string;
  year: string;
  abstract?: string;
}

export interface CVData {
  imageUrl: string;
  journeyText: string;
  skills: Skill[];
  experiences: Experience[];
  projects: Project[];
  achievements: Achievement[];
  publications: Publication[];
}

// Aloqa ma'lumotlari (Contact/Footer bilan bir xil manba)
export const CONTACT = {
  email: 'odiljonsirojiddinov04@gmail.com',
  phone: '+998 90 003 49 22',
  location: 'Toshkent',
  github: 'https://github.com/Rasmiyatchi',
  linkedin: 'https://www.linkedin.com/in/odiljonsirojiddinov/',
};

const mapDocs = <T>(snap: any): T[] =>
  snap.docs.map((d: any) => ({ id: d.id, ...d.data() }) as T);

/** CV uchun barcha ma'lumotlarni Firestore'dan yig'ib oladi. */
export async function fetchCVData(): Promise<CVData> {
  const [profileSnap, skillsSnap, expSnap, projSnap, achSnap, pubSnap] = await Promise.all([
    getDoc(doc(db, 'profile', 'main')),
    getDocs(query(collection(db, 'skills'), orderBy('createdAt', 'asc'))).catch(() =>
      getDocs(collection(db, 'skills')),
    ),
    getDocs(collection(db, 'experiences')),
    getDocs(collection(db, 'projects')),
    getDocs(query(collection(db, 'achievements'), orderBy('date', 'desc'))).catch(() =>
      getDocs(collection(db, 'achievements')),
    ),
    getDocs(query(collection(db, 'publications'), orderBy('year', 'desc'))).catch(() =>
      getDocs(collection(db, 'publications')),
    ),
  ]);

  const profile = profileSnap.exists() ? profileSnap.data() : {};

  const experiences = mapDocs<Experience>(expSnap).sort((a, b) => {
    const y = (s = '') => {
      const m = s.match(/\b(19|20)\d{2}\b/g);
      return m ? Math.max(...m.map((x) => parseInt(x, 10))) : 0;
    };
    return y(b.duration) - y(a.duration);
  });

  return {
    imageUrl: profile.imageUrl || '',
    journeyText: profile.journeyText || '',
    skills: mapDocs<Skill>(skillsSnap),
    experiences,
    projects: mapDocs<Project>(projSnap),
    achievements: mapDocs<Achievement>(achSnap),
    publications: mapDocs<Publication>(pubSnap),
  };
}
