# CV / Portfolio — Sirojiddinov Odiljon

React 19 + Vite + TypeScript + Tailwind CSS v4 asosidagi ko'p tilli (UZ / RU / EN)
portfolio sayt. Kontent Firebase (Firestore + Auth) orqali admin paneldan boshqariladi.

## Texnologiyalar

- **React 19** + **React Router 7**
- **Vite 6** (build + dev server)
- **Tailwind CSS v4** (`@tailwindcss/vite`)
- **Firebase** — Firestore (ma'lumotlar), Auth (admin kirish), Storage
- **motion** (animatsiyalar), **i18next** (tarjima), **sonner** (toast), **react-quill-new** (matn muharriri)

## Lokal ishga tushirish

**Talab:** Node.js 18+

```bash
npm install
npm run dev      # http://localhost:3000
```

Boshqa skriptlar:

```bash
npm run build    # ishlab chiqarish uchun build (dist/)
npm run preview  # build natijasini ko'rib chiqish
npm run lint     # TypeScript tekshiruvi (tsc --noEmit)
```

## Firebase ulash (yangi loyiha)

Firebase konfiguratsiyasi **environment o'zgaruvchilari** orqali beriladi, shuning uchun
boshqa Firebase loyihasiga o'tish uchun kodga tegmasdan faqat `.env.local` faylini
to'ldirish kifoya.

1. `.env.example` faylini `.env.local` deb nusxalang.
2. [Firebase Console](https://console.firebase.google.com/) > **Project settings**
   > **Your apps** (Web ilova) bo'limidagi qiymatlar bilan to'ldiring:

   ```env
   VITE_FIREBASE_API_KEY="..."
   VITE_FIREBASE_AUTH_DOMAIN="your-project.firebaseapp.com"
   VITE_FIREBASE_PROJECT_ID="your-project-id"
   VITE_FIREBASE_STORAGE_BUCKET="your-project.appspot.com"
   VITE_FIREBASE_MESSAGING_SENDER_ID="..."
   VITE_FIREBASE_APP_ID="..."
   ```

3. Firebase Console'da quyidagilarni yoqing:
   - **Authentication → Sign-in method → Email/Password**
   - **Firestore Database** (yangi baza yarating)
   - `firestore.rules` faylidagi qoidalarni Firestore'ga joylashtiring.
     > Eslatma: qoidalardagi admin email manzilini o'zingiznikiga moslang.

> Eslatma: Firebase web konfiguratsiyasi maxfiy emas (u client bundle ichida bo'ladi),
> shuning uchun standart qiymatlar `src/firebase.ts` ichida ham mavjud. `.env.local`
> qiymatlari berilsa, ular ustun keladi.

## Admin panel

- Kirish: `/admin/login`
- Boshqaruv: loyihalar, tajriba, yutuqlar, nashrlar, "Men haqimda" va ko'nikmalar.

## Loyiha tuzilishi

```
src/
  components/   # layout (Navbar, Footer, Sidebar) va UI (Button, Input ...)
  contexts/     # AuthContext (Firebase Auth holati)
  pages/        # public sahifalar + admin/ sahifalari
  firebase.ts   # Firebase init (env asosida)
  i18n.ts       # tarjimalar (uz, ru, en)
  index.css     # Tailwind + dizayn tizimi (gradientlar, animatsiyalar)
```
