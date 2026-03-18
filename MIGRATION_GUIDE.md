# Data Migration to Firebase

This guide explains how to upload the extracted questions to Firebase Firestore.

## Prerequisites

1. Make sure your `.env` file has Firebase config:
```
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_PROJECT_ID=...
```

2. Install tsx globally:
```bash
npm install -g tsx
```

## Option 1: Run Migration Script (Recommended)

The migration script reads all `extracted_*.json` files and uploads to Firestore:

```bash
cd gcse-prep-app
npx tsx scripts/migrateToFirebase.ts
```

## Option 2: Manual Batch Upload via Admin Panel

You can also upload JSON files through the Admin page:

1. Go to `/admin` in the app
2. Click "Batch Upload Questions"
3. Select your `supabase_upload_*.json` file
4. Click Upload

## Files to Upload

From the project root, these files contain questions:
- `extracted_*.json` (per-paper extractions)
- `supabase_upload_*.json` (combined subject files)
- `olevel_*_master.json` (master files)

## Migration Progress

Total questions available:
- AS/A-Level: 15,560 questions (7 subjects)
- O-Level: 9,380 questions (4 subjects)
- **Total: 24,940 questions**

## After Migration

Once uploaded, the subject cards will show actual counts:
- "Accounting: 1,380 questions • ✅ Verified"
- "Biology: 1,560 questions • ✅ Verified"
- etc.

## Troubleshooting

If you see errors:
1. Check Firestore rules allow writes to `questions` collection
2. Verify Firebase config in `.env`
3. Make sure you have `questions` collection created in Firestore
