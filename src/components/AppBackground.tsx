/**
 * Butun sayt uchun global "aurora + grain" fon qatlami.
 * Bir marta App'da chiziladi, barcha sahifalar ortida (fixed, -z-10) turadi.
 * Light va dark rejimda ham jonli, lekin xotirjam (indigo/slate) ko'rinadi.
 */
const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

export function AppBackground() {
  return (
    <div aria-hidden className="fixed inset-0 -z-10 overflow-hidden">
      {/* Asosiy fon */}
      <div className="absolute inset-0 bg-[#eef1fb] dark:bg-[#070b1a]" />

      {/* Aurora yog'dular */}
      <div className="absolute -top-48 -left-24 h-[42rem] w-[42rem] rounded-full bg-blue-500/20 dark:bg-blue-600/20 blur-[140px]" />
      <div className="absolute -top-24 right-[-12%] h-[34rem] w-[34rem] rounded-full bg-indigo-400/15 dark:bg-indigo-500/15 blur-[140px]" />
      <div className="absolute bottom-[-20%] left-1/4 h-[40rem] w-[40rem] rounded-full bg-indigo-500/15 dark:bg-indigo-600/15 blur-[150px]" />

      {/* Donador (grain) tekstura */}
      <div
        className="absolute inset-0 opacity-[0.04] dark:opacity-[0.07] mix-blend-overlay dark:mix-blend-soft-light"
        style={{ backgroundImage: GRAIN }}
      />
    </div>
  );
}
