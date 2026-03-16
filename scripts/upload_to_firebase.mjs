#!/usr/bin/env node
/**
 * Upload all extracted questions from JSON files to Firebase Firestore
 * Images will reference Cloudinary URLs if they exist
 */

import dotenv from 'dotenv';
dotenv.config();

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc, writeBatch } from 'firebase/firestore';
import fs from 'fs';
import path from 'path';

// Firebase config from environment
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID
};

console.log('🔥 Firebase Config:', { projectId: firebaseConfig.projectId });

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Question files to upload with their subject mappings
const questionFiles = [
  // AS-A-Level Subjects
  { file: 'as_economics_questions.json', subject: 'as_economics', code: 'WEC11' },
  { file: 'as_mathematics_questions.json', subject: 'as_mathematics', code: 'WMA11' },
  { file: 'as_physics_questions.json', subject: 'as_physics', code: 'WPH11' },
  { file: 'as_biology_wbi11_questions_new.json', subject: 'as_biology', code: 'WBI11' },
  { file: 'as_chemistry_wch_questions_new.json', subject: 'as_chemistry', code: 'WCH' },
  { file: 'as_a_level_questions_new.json', subject: 'as_combined', code: 'AS' },
  
  // O-Level Subjects
  { file: 'o_level_accounting_7707_questions.json', subject: 'o_accounting', code: '7707' },
  { file: 'o_level_biology_questions.json', subject: 'o_biology', code: '5090' },
  { file: 'biology_questions.json', subject: 'biology', code: 'IGCSE' },
  { file: 'igcse_biology_0610_questions_new.json', subject: 'igcse_biology', code: '0610' },
];

const publicDir = path.join(process.cwd(), 'public');

async function uploadQuestions() {
  console.log('📚 Starting upload of questions to Firebase...\n');
  
  let totalUploaded = 0;
  let totalFailed = 0;
  
  for (const { file, subject, code } of questionFiles) {
    const filePath = path.join(publicDir, file);
    
    if (!fs.existsSync(filePath)) {
      console.log(`⚠️  File not found: ${file}`);
      continue;
    }
    
    console.log(`\n📖 Processing: ${file} (${subject})`);
    
    try {
      const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      const questions = data.questions || [];
      
      console.log(`   Found ${questions.length} questions`);
      
      if (questions.length === 0) {
        console.log(`   ⏭️  Skipping - no questions`);
        continue;
      }
      
      // Upload in batches of 100 (smaller to avoid quota)
      const batchSize = 100;
      const delayMs = 2000; // 2 second delay between batches
      
      for (let i = 0; i < questions.length; i += batchSize) {
        const batch = writeBatch(db);
        const chunk = questions.slice(i, i + batchSize);
        
        for (const q of chunk) {
          const questionId = q.id || `${subject}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
          
          const questionData = {
            ...q,
            id: questionId,
            subject: q.subject || subject,
            yearGroup: q.yearGroup || 'year12',
            code: q.code || code,
            uploadedAt: new Date().toISOString(),
            sourceFile: file
          };
          
          const docRef = doc(collection(db, 'questions'), questionId);
          batch.set(docRef, questionData, { merge: true });
        }
        
        try {
          await batch.commit();
          console.log(`   ✅ Uploaded batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(questions.length/batchSize)} (${chunk.length} questions)`);
          
          // Delay between batches to avoid quota
          if (i + batchSize < questions.length) {
            process.stdout.write(`   ⏳ Waiting ${delayMs/1000}s for rate limit...`);
            await new Promise(r => setTimeout(r, delayMs));
            process.stdout.write(' done\n');
          }
        } catch (err) {
          console.error(`   ❌ Batch failed:`, err.message);
          console.log(`   ⚠️  Continuing with next batch...`);
        }
      }
      
      totalUploaded += questions.length;
      console.log(`   ✓ Completed: ${questions.length} questions uploaded`);
      
    } catch (error) {
      console.error(`   ❌ Error uploading ${file}:`, error.message);
      totalFailed++;
    }
  }
  
  console.log(`\n🎉 Upload Complete!`);
  console.log(`   Total uploaded: ${totalUploaded} questions`);
  console.log(`   Failed files: ${totalFailed}`);
  console.log(`\n✨ Questions are now available in Firebase Firestore`);
  console.log(`   You can now edit them in the Admin panel at /admin`);
  
  process.exit(0);
}

// Check environment variables
const requiredEnv = ['VITE_FIREBASE_API_KEY', 'VITE_FIREBASE_PROJECT_ID'];
const missing = requiredEnv.filter(e => !process.env[e]);

if (missing.length > 0) {
  console.error('❌ Missing environment variables:', missing.join(', '));
  console.log('📝 Please ensure your .env file has all Firebase credentials');
  process.exit(1);
}

uploadQuestions().catch(err => {
  console.error('❌ Fatal error:', err);
  process.exit(1);
});
