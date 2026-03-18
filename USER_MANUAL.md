# Exam Pilot - User Manual

## 1. Who this app is for
- **LKG/UKG to Grade 8:** Kids dashboard (game-style learning).
- **Grade 9 to Grade 12:** Exam practice using past paper MCQs (O-Level / IGCSE / AS).

---

## 2. First time setup
1. Open the app.
2. Complete **Profile Setup**:
   - Gender
   - Age
   - Grade (LKG/UKG/Grade 1–12)
   - Skill level (Beginner / Intermediate / Advanced)
   - Choose exam/subject
3. Tap **Continue** until setup finishes.

After setup, you will be routed automatically:
- **LKG–Grade 8** → Kids Dashboard
- **Grade 9–12** → Main student dashboard

---

## 3. Kids Dashboard (LKG–Grade 8)
The Kids Dashboard is designed for fast engagement:
- **Quick Quiz** (short questions)
- **Puzzle Time**
- **Memory Match**
- **Word Builder**
- **Math Race**
- **Science Explorer**

New advanced games:
- **Quiz Race**
- **Speed Challenge**
- **Knowledge Battle**

Each activity gives points/stars and builds habit with streaks.

### 3.1 Kids Login
Kids can have their own accounts.

Kids can log in using:
- Name + 4-digit code
- Email + password
- Google sign-in

If you sign in with Google / email for the first time, the app may ask you to complete your profile (grade, country, avatar).

Kids profiles, game sessions, and achievements are saved in the database (Firebase Firestore), so they work after refresh and across devices.

### 3.2 Kids Profile
Kids can set:
- Grade
- Avatar
- Country (type-to-search, includes worldwide countries)

### 3.3 Rewards + Sounds
Kids games include:
- **Sound effects** for click, correct, wrong, level-up, and win.
- **Reward popups** with confetti for achievements and milestones.

If sound does not play:
- Tap once on the page (some browsers block sound until the first interaction).

---

## 4. Exam Practice (Grade 9–12)
### 4.1 Practice
1. Go to **Papers**.
2. Select subject/paper.
3. Start quiz.

### 4.2 Results
After completing a quiz:
- Review correct/incorrect answers.
- Track accuracy.

### 4.3 Stats
Use **Stats** to see:
- Accuracy
- Correct count
- Attempted questions

---

## 5. Admin (Question Management)
> Route: `/admin`

Admin can:
- Add/edit questions
- Paste or upload images
- View PDF page images (if available in `public/pdf_images/...`) to verify the question

---

## 6. Troubleshooting
- **Setup not scrolling / button missing:** refresh and ensure you’re on latest deployment.
- **New features not visible:** clear browser cache or hard refresh.
- **PWA / installed app not updating:** close the app and reopen, or clear site data to refresh the service worker cache.

---

## 7. Support / Updates
For extraction + data pipeline details, see `extract.md`.

### 7.1 How to push updates (for the developer)
Any time you change any file and want to deploy the latest version:

```bash
git add -A
git commit -m "Describe your change"
git push
```

If your Vercel project is connected to GitHub, it will auto-deploy from `main`.

---

## 8. Developer Setup (Firebase)

### 8.1 Enable Firebase Auth providers
Firebase Console → Authentication → Sign-in method:
- Enable Email/Password
- Enable Google

If deploying on Vercel, add the domain:
- Firebase Console → Authentication → Settings → Authorized domains
- Add `exam-pilot-three.vercel.app` (and any custom domain)

### 8.2 Firestore Security Rules
Paste the following into Firebase Console → Firestore Database → Rules and publish:

```js
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    function signedIn() {
      return request.auth != null;
    }

    // Public reads (convenience)
    match /{document=**} {
      allow read: if true;
    }

    // TEMP: initial upload for questions
    match /questions/{questionId} {
      allow write: if true;
    }

    // Users collection
    match /users/{userId} {
      allow create, read, update, delete: if signedIn() && request.auth.uid == userId;
    }

    // Exam results collection
    match /exam_results/{docId} {
      allow create: if signedIn() && request.resource.data.userId == request.auth.uid;
      allow read, update, delete: if signedIn() && resource.data.userId == request.auth.uid;
    }

    // Kids profile stored at kidsProfiles/{uid}
    match /kidsProfiles/{kidId} {
      allow create, read, update, delete: if signedIn() && request.auth.uid == kidId;
    }

    function isOwnerCreate() {
      return signedIn() && request.resource.data.kidId == request.auth.uid;
    }
    function isOwnerExisting() {
      return signedIn() && resource.data.kidId == request.auth.uid;
    }

    match /kidsSessions/{docId} {
      allow create: if isOwnerCreate();
      allow read, update, delete: if isOwnerExisting();
    }

    match /kidsAchievements/{docId} {
      allow create: if isOwnerCreate();
      allow read, update, delete: if isOwnerExisting();
    }

    match /kidsGameProgress/{docId} {
      allow create: if isOwnerCreate();
      allow read, update, delete: if isOwnerExisting();
    }

    match /kidsSkillPath/{docId} {
      allow create: if isOwnerCreate();
      allow read, update, delete: if isOwnerExisting();
    }

    match /kidsGameBestScores/{docId} {
      allow create, update, delete: if isOwnerCreate();
    }

    match /kidsOverallScores/{kidId} {
      allow create, update, delete: if signedIn() && request.auth.uid == kidId;
    }
  }
}
```
