# GCSE Exam Prep

A comprehensive **React + TypeScript (TSX)** PWA for GCSE exam preparation (Grades 8-10). Features real past paper questions, progress tracking, and offline support.

## 🚀 Features

- **📱 PWA** - Installable on mobile and desktop, works offline
- **📝 Real Questions** - 381+ Accounting questions from past papers
- **📊 Progress Tracking** - localStorage persistence with accuracy, streaks, stats
- **✅ Quiz Mode** - Multiple choice with instant feedback and explanations
- **📈 Statistics Dashboard** - Visual progress tracking
- **🎨 Dark Theme** - Modern UI optimized for study sessions
- **📲 Mobile First** - Responsive design for phones, tablets, PC

## 🛠️ Tech Stack

- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Charts**: Recharts
- **PWA**: Vite PWA Plugin

## 📁 Project Structure

```
gcse-prep-app/
├── src/
│   ├── components/     # React components
│   │   └── Layout.tsx  # App layout with navigation
│   ├── pages/          # Route pages
│   │   ├── Home.tsx    # Subject selection, stats
│   │   ├── Quiz.tsx    # Question quiz interface
│   │   ├── Results.tsx # Quiz completion screen
│   │   └── Stats.tsx   # Progress dashboard
│   ├── hooks/          # Custom React hooks
│   │   └── useProgress.ts  # localStorage progress
│   ├── types/          # TypeScript types
│   │   └── index.ts    # Question, Progress types
│   ├── App.tsx         # Main app with routing
│   ├── main.tsx        # Entry point
│   └── index.css       # Tailwind + global styles
├── public/
│   └── questions.json  # 381 past paper questions
├── package.json
├── vite.config.ts      # Vite + PWA config
├── tailwind.config.js
└── vercel.json         # Deployment config
```

## 🚀 Quick Start

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

## 📦 Deployment

### Vercel (Recommended)

1. Push to GitHub:
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/gcse-exam-prep.git
git push -u origin main
```

2. Deploy on Vercel:
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Framework: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Click Deploy

### GitHub Pages

1. Update `vite.config.ts`:
```ts
export default defineConfig({
  base: '/gcse-exam-prep/',
  // ... rest of config
})
```

2. Build and deploy:
```bash
npm run build
npx gh-pages -d dist
```

## 📊 Data Format

Questions loaded from `public/questions.json`:

```json
{
  "metadata": {
    "subject": "Accounting (7707)",
    "total_questions": 381
  },
  "questions": [
    {
      "id": "7707-y2024-p11-q1",
      "subject": "accounting",
      "topic": "bookkeeping",
      "marks": 1,
      "question": "Which task is performed by a book-keeper?",
      "options": ["A", "B", "C", "D"],
      "correctAnswer": 2,
      "explanation": "...",
      "source": { "pdf": "...", "year": 2024 }
    }
  ]
}
```

## 🔧 Configuration

### Adding More Subjects

1. Add subject data to `public/`
2. Update `src/pages/Home.tsx` subject cards
3. Update `src/types/index.ts` if needed

### Customizing Theme

Edit `tailwind.config.js`:
```js
colors: {
  primary: '#3b82f6',    // Change primary color
  secondary: '#10b981',
  // ...
}
```

## 📱 PWA Installation

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
2. Or go to menu → "Install GCSE Exam Prep"

## 📝 License

MIT - Feel free to use for your own exam prep!

---

Built with ❤️ for students preparing for GCSE exams.
