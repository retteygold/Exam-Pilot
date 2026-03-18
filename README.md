# Exam Pilot

A **React + TypeScript** web app for students from **LKG/UKG through Grade 12**.

- **Younger students (LKG–Grade 8)** see a **Kids Dashboard** with game-like learning.
- **Older students (Grade 9–12)** practice with **Cambridge past paper MCQs** (O-Level / IGCSE / AS).

## Features

- **Student onboarding**
  - Profile setup flow (age, grade, skill level, exam)
- **Kids Dashboard (LKG–Grade 8)**
  - Game-style cards (Quick Quiz, Puzzle Time, Memory Match, Word Builder, Math Race, Science Explorer)
  - Advanced games: Quiz Race, Speed Challenge, Knowledge Battle
  - Reward popups (confetti) + sound effects (correct/wrong/win/level-up)
  - Stars / streak UI and achievements
  - Kids accounts stored in Firebase Firestore (profiles + sessions + achievements)
  - Kids authentication (Firebase Auth)
    - Name + 4-digit code
    - Email + password
    - Google sign-in
  - Leaderboards
    - Per-game leaderboard
    - Overall leaderboard (all games combined)
    - Grade topper (top 1 per grade)
  - Country selection on kids profile (country + flag)
- **Exam practice (Grade 9–12)**
  - Practice / exam-style quiz flow
  - Results + stats
- **Admin (question management)**
  - Create/update questions
  - Paste/upload images
  - PDF page image viewer (from `public/pdf_images/...`) for verification
- **Extraction pipeline (scripts)**
  - Batch scripts generate per-paper JSON
  - Upload-ready JSON generation for Supabase

## Tech Stack

- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Charts**: Recharts
- **PWA**: Vite PWA Plugin
- **Auth**: Firebase Authentication
- **Database**: Firebase Firestore (questions + users + exam results + kids data)
- **Image Hosting**: Cloudinary (question images / uploads)

## Project Structure

```
gcse-prep-app/
├── src/
│   ├── components/     # React components
│   │   └── Layout.tsx  # App layout with navigation
│   ├── pages/          # Route pages
│   │   ├── ProfileSetup.tsx   # Student onboarding (/setup)
│   │   ├── KidsDashboard.tsx  # LKG–Grade 8 dashboard
│   │   ├── Home.tsx           # Grade 9–12 dashboard
│   │   ├── PaperSelect.tsx    # Select paper/subject
│   │   ├── Quiz.tsx           # Question quiz interface
│   │   ├── Results.tsx        # Quiz completion screen
│   │   ├── Stats.tsx          # Progress dashboard
│   │   └── Admin.tsx          # Admin tools (/admin)
│   ├── hooks/          # Custom React hooks
│   │   └── useAuth.tsx
│   ├── types/          # TypeScript types
│   │   └── index.ts    # Question, Progress types
│   ├── App.tsx         # Main app with routing
│   ├── main.tsx        # Entry point
│   └── index.css       # Tailwind + global styles
├── public/
│   ├── pdf_images/     # Extracted PDF page images (per paper)
│   └── *.json          # Question banks (if used)
├── scripts/            # Extraction + Supabase upload scripts
├── extracted_*.json    # Per-paper extracted JSON output
├── supabase_upload_*.json # Upload-ready JSON output
├── package.json
├── vite.config.ts      # Vite + PWA config
├── tailwind.config.js
└── vercel.json         # Deployment config
```

## Quick Start

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Environment Variables

Create a `.env` file (local) or set these on Vercel.

Required for Firebase:

```bash
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

These are read in `src/lib/firebase.ts`.

Required for Cloudinary uploads (Admin image upload):

```bash
VITE_CLOUDINARY_CLOUD_NAME=
VITE_CLOUDINARY_UPLOAD_PRESET=
```

## Firebase Setup (Required)

### Enable Authentication Providers

In Firebase Console → Authentication → Sign-in method, enable:

- Email/Password
- Google

Also enable:

- Anonymous (used by “Continue Without Login”)

If using Google sign-in on Vercel, also add your domain:

- Firebase Console → Authentication → Settings → Authorized domains
- Add `exam-pilot-three.vercel.app` (and any custom domain)

### Firestore Security Rules

The app requires Firestore rules that allow authenticated users to read/write their own data (`users/{uid}`, `exam_results/*`) and authenticated kids to read/write their own kids collections.

Note: this project also currently allows public reads (for convenience) and has a temporary open write rule for `questions` during initial upload.

See `USER_MANUAL.md` for the exact rules snippet to paste into Firestore.

## Deployment

### Vercel (Recommended)

1. Push to GitHub:
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/exam-pilot.git
git push -u origin main
```

2. Deploy on Vercel:
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Root Directory: `gcse-prep-app`
   - Framework: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Click Deploy

### How to push updates (auto-deploy)

Any time you change any file and want Vercel to deploy the latest version:

```bash
git add -A
git commit -m "Describe your change"
git push
```

Vercel will automatically build and deploy from the `main` branch.

### GitHub Pages

1. Update `vite.config.ts`:
```ts
export default defineConfig({
  base: '/exam-pilot/',
  // ... rest of config
})
```

2. Build and deploy:
```bash
npm run build
npx gh-pages -d dist
```

## Data Format

The extraction scripts produce **per-paper JSON** files in the format:

- `extracted_O_Level_Physics_0625_s24_qp_11.json`

Then `scripts/create_supabase_upload.py` combines those into:

- `supabase_upload_*.json`

For full details, see `extract.md`.

## Adding / Updating Subjects

- Add extracted paper JSONs (`extracted_*.json`)
- Re-run `scripts/create_supabase_upload.py`
- Upload the resulting `supabase_upload_*.json` to your database

### Customizing Theme

Edit `tailwind.config.js`:
```js
colors: {
  primary: '#3b82f6',    // Change primary color
  secondary: '#10b981',
  // ...
}
```

## PWA Installation

### iOS Safari
1. Open app in Safari
2. Tap Share button
3. "Add to Home Screen"

### Android Chrome
1. Open app in Chrome
2. Tap menu (⋮)
3. "Add to Home screen"

### Desktop Chrome
1. Click install icon in address bar
2. Or go to menu → "Install Exam Pilot"

## License

MIT - Feel free to use for your own exam prep!

---

Built for students preparing for exams.
