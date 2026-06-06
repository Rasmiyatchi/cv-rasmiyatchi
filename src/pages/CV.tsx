import { useEffect, useState, type ReactNode, type CSSProperties, type ElementType } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Download,
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Github,
  Linkedin,
  Briefcase,
  Award,
  BookOpen,
  FolderGit2,
  Sparkles,
  Code2,
  Cpu,
  Database,
  Network,
  Terminal,
  Layers,
  GitBranch,
  Binary,
} from 'lucide-react';
import { fetchCVData, CONTACT, type CVData } from '../utils/cvData';

// Neural dot grid background pattern
const NEURAL_DOTS =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40'%3E%3Ccircle cx='20' cy='20' r='1' fill='%236366f1' fill-opacity='0.25'/%3E%3C/svg%3E\")";

// Decorative tech icon positions (inline styles to avoid purge issues)
const DECO: { Icon: ElementType; style: CSSProperties }[] = [
  { Icon: Code2,    style: { top: '7%',  left: '3%',   width: 56, height: 56, opacity: 0.06, transform: 'rotate(-12deg)' } },
  { Icon: Cpu,      style: { top: '14%', right: '3%',  width: 72, height: 72, opacity: 0.05, transform: 'rotate(7deg)'  } },
  { Icon: Database, style: { top: '42%', left: '1.5%', width: 44, height: 44, opacity: 0.07, transform: 'rotate(3deg)'  } },
  { Icon: Network,  style: { top: '58%', right: '2%',  width: 60, height: 60, opacity: 0.06, transform: 'rotate(-5deg)' } },
  { Icon: Terminal, style: { bottom: '12%', left: '4%',   width: 40, height: 40, opacity: 0.07, transform: 'rotate(12deg)'  } },
  { Icon: GitBranch,style: { top: '29%',   left: '1%',   width: 36, height: 36, opacity: 0.05, transform: 'rotate(-3deg)'  } },
  { Icon: Layers,   style: { bottom: '27%',right: '1.5%',width: 44, height: 44, opacity: 0.06, transform: 'rotate(9deg)'   } },
  { Icon: Binary,   style: { bottom: '6%', right: '4%',  width: 32, height: 32, opacity: 0.05, transform: 'rotate(-6deg)'  } },
];

function SectionTitle({ icon: Icon, children }: { icon: any; children: ReactNode }) {
  return (
    <h2 className="flex items-center gap-2 text-[15px] font-bold uppercase tracking-wider text-blue-700 border-b-2 border-blue-100 pb-1.5 mb-3 mt-6">
      <Icon className="w-4 h-4 text-blue-500" />
      {children}
    </h2>
  );
}

export default function CV() {
  const { t } = useTranslation();
  const [data, setData] = useState<CVData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCVData()
      .then(setData)
      .catch((e) => console.error("CV ma'lumotlarini olishda xato:", e))
      .finally(() => setLoading(false));
  }, []);

  const handleDownload = () => {
    const prev = document.title;
    document.title = 'Sirojiddinov_Odiljon_CV';
    window.print();
    setTimeout(() => { document.title = prev; }, 500);
  };

  return (
    <div className="relative min-h-screen print:bg-white">
      {/* ── Dark blue background + decorative layer (hidden when printing) ── */}
      <div className="no-print absolute inset-0 overflow-hidden" aria-hidden>
        {/* Base dark blue gradient */}
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(135deg, #0f172a 0%, #0a1628 45%, #0d1f3c 100%)' }}
        />
        {/* Neural dot grid */}
        <div
          className="absolute inset-0"
          style={{ backgroundImage: NEURAL_DOTS, backgroundSize: '40px 40px', opacity: 0.35 }}
        />
        {/* Glow blobs */}
        <div className="absolute -top-20 -left-20 h-72 w-72 rounded-full bg-blue-600/25 blur-[100px]" />
        <div className="absolute -bottom-20 -right-20 h-80 w-80 rounded-full bg-indigo-700/20 blur-[120px]" />
        <div className="absolute top-1/2 -translate-y-1/2 -left-20 h-56 w-56 rounded-full bg-blue-800/20 blur-[90px]" />
        {/* Tech icons */}
        {DECO.map(({ Icon, style }, i) => (
          <Icon key={i} className="absolute text-blue-300" style={style} />
        ))}
      </div>

      {/* ── Page content ── */}
      <div className="relative py-6 sm:py-10 print:py-0">
        {/* Controls bar — hidden when printing */}
        <div className="no-print sticky top-4 z-10 mx-auto mb-6 flex max-w-[820px] items-center justify-between gap-3 px-4">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-xl bg-white/10 backdrop-blur px-4 py-2.5 text-sm font-semibold text-white shadow-md ring-1 ring-white/20 hover:bg-white/20 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            {t('nav.home')}
          </Link>
          <button
            onClick={handleDownload}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-blue-700 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/40 hover:opacity-95 hover:-translate-y-0.5 transition"
          >
            <Download className="w-4 h-4" />
            {t('cv.download')}
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-32">
            <div className="h-9 w-9 animate-spin rounded-full border-[3px] border-blue-600/30 border-t-blue-600" />
          </div>
        ) : (
          <article
            className="cv-sheet mx-auto w-full max-w-[820px] bg-white text-gray-800 shadow-2xl shadow-black/50 print:shadow-none print:max-w-none"
            style={{ printColorAdjust: 'exact', WebkitPrintColorAdjust: 'exact' } as CSSProperties}
          >
            {/* Header */}
            <header className="bg-gradient-to-r from-blue-500 to-blue-700 px-8 py-8 text-white sm:px-12">
              <div className="flex flex-col items-center gap-5 text-center sm:flex-row sm:text-left">
                {data?.imageUrl ? (
                  <img
                    src={data.imageUrl}
                    alt=""
                    className="h-24 w-24 flex-shrink-0 rounded-full object-cover ring-4 ring-white/40"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="flex h-24 w-24 flex-shrink-0 items-center justify-center rounded-full bg-white/20 ring-4 ring-white/30">
                    <Sparkles className="h-10 w-10 text-white/80" />
                  </div>
                )}
                <div className="min-w-0">
                  <h1 className="text-3xl font-bold leading-tight tracking-tight">{t('home.name')}</h1>
                  <p className="mt-1 text-sm font-medium text-white/90">{t('home.roles')}</p>
                  <div className="mt-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs text-white/90 sm:justify-start">
                    <a href={`mailto:${CONTACT.email}`} className="inline-flex items-center gap-1.5">
                      <Mail className="h-3.5 w-3.5" /> {CONTACT.email}
                    </a>
                    <span className="inline-flex items-center gap-1.5">
                      <Phone className="h-3.5 w-3.5" /> {CONTACT.phone}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5" /> {CONTACT.location}
                    </span>
                    <a href={CONTACT.github} className="inline-flex items-center gap-1.5">
                      <Github className="h-3.5 w-3.5" /> GitHub
                    </a>
                    <a href={CONTACT.linkedin} className="inline-flex items-center gap-1.5">
                      <Linkedin className="h-3.5 w-3.5" /> LinkedIn
                    </a>
                  </div>
                </div>
              </div>
            </header>

            <div className="px-8 pb-10 pt-2 sm:px-12">
              {/* Journey */}
              {data?.journeyText ? (
                <section>
                  <SectionTitle icon={Sparkles}>{t('about.journey')}</SectionTitle>
                  <div
                    className="cv-prose text-[13px] leading-relaxed text-gray-700"
                    dangerouslySetInnerHTML={{ __html: data.journeyText }}
                  />
                </section>
              ) : (
                <section>
                  <SectionTitle icon={Sparkles}>{t('about.journey')}</SectionTitle>
                  <p className="text-[13px] leading-relaxed text-gray-700">
                    {t('home.bio1')} {t('home.bio2')}
                  </p>
                </section>
              )}

              {/* Skills */}
              {data && data.skills.length > 0 && (
                <section>
                  <SectionTitle icon={Award}>{t('about.skills')}</SectionTitle>
                  <div className="grid grid-cols-1 gap-x-8 gap-y-2.5 sm:grid-cols-2">
                    {data.skills.map((s) => (
                      <div key={s.id}>
                        <div className="mb-1 flex justify-between text-[12px] font-medium text-gray-700">
                          <span>{s.name}</span>
                          <span className="text-gray-500">{s.level}%</span>
                        </div>
                        <div className="h-1.5 w-full rounded-full bg-gray-200">
                          <div
                            className="h-1.5 rounded-full bg-gradient-to-r from-blue-500 to-blue-700"
                            style={{ width: `${s.level}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Experience */}
              {data && data.experiences.length > 0 && (
                <section className="break-inside-avoid">
                  <SectionTitle icon={Briefcase}>{t('experience.title')}</SectionTitle>
                  <div className="space-y-4">
                    {data.experiences.map((exp) => (
                      <div key={exp.id} className="break-inside-avoid">
                        <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                          <h3 className="text-[14px] font-bold text-gray-900">{exp.role}</h3>
                          <span className="text-[11px] font-semibold text-blue-600">{exp.duration}</span>
                        </div>
                        <p className="text-[12.5px] font-medium text-blue-700">{exp.company}</p>
                        {exp.description && exp.description.length > 0 && (
                          <ul className="mt-1 list-disc space-y-0.5 pl-5 text-[12.5px] leading-relaxed text-gray-700 marker:text-blue-400">
                            {exp.description.map((d, i) => (
                              <li key={i}>{d}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Projects */}
              {data && data.projects.length > 0 && (
                <section className="break-inside-avoid">
                  <SectionTitle icon={FolderGit2}>{t('projects.title')}</SectionTitle>
                  <div className="space-y-3">
                    {data.projects.map((p) => (
                      <div key={p.id} className="break-inside-avoid">
                        <h3 className="text-[13.5px] font-bold text-gray-900">{p.title}</h3>
                        <p className="text-[12.5px] leading-relaxed text-gray-700">{p.description}</p>
                        {p.technologies && p.technologies.length > 0 && (
                          <p className="mt-0.5 text-[11px] font-medium text-blue-600">
                            {p.technologies.join(' · ')}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Achievements */}
              {data && data.achievements.length > 0 && (
                <section className="break-inside-avoid">
                  <SectionTitle icon={Award}>{t('achievements.title')}</SectionTitle>
                  <div className="space-y-2.5">
                    {data.achievements.map((a) => (
                      <div key={a.id} className="break-inside-avoid">
                        <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                          <h3 className="text-[13.5px] font-bold text-gray-900">{a.title}</h3>
                          <span className="text-[11px] font-semibold text-blue-600">{a.date}</span>
                        </div>
                        <p className="text-[12px] font-medium text-blue-700">{a.organization}</p>
                        {a.description && (
                          <p className="text-[12.5px] leading-relaxed text-gray-700">{a.description}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Publications */}
              {data && data.publications.length > 0 && (
                <section className="break-inside-avoid">
                  <SectionTitle icon={BookOpen}>{t('publications.title')}</SectionTitle>
                  <div className="space-y-2.5">
                    {data.publications.map((pub) => (
                      <div key={pub.id} className="break-inside-avoid">
                        <h3 className="text-[13.5px] font-bold text-gray-900">{pub.title}</h3>
                        <p className="text-[12px] font-medium text-blue-700">
                          {pub.journal} · {pub.year}
                        </p>
                        {pub.abstract && (
                          <p className="text-[12.5px] leading-relaxed text-gray-700">{pub.abstract}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>
          </article>
        )}
      </div>
    </div>
  );
}
