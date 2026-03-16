#!/usr/bin/env node
/**
 * Upload AS subjects only to Firebase Firestore
 * Small batch size with delays to avoid quota limits
 */

import dotenv from 'dotenv';
dotenv.config();

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, writeBatch } from 'firebase/firestore';
import fs from 'fs';
import path from 'path';

// Firebase config
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID
};

console.log('🔥 Firebase Project:', firebaseConfig.projectId);

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// AS subjects only
const asSubjects = [
  { file: 'as_economics_questions.json', subject: 'as_economics', code: 'WEC11', name: 'AS Economics' },
  { file: 'as_mathematics_questions.json', subject: 'as_mathematics', code: 'WMA11', name: 'AS Mathematics' },
  { file: 'as_physics_questions.json', subject: 'as_physics', code: 'WPH11', name: 'AS Physics' },
  { file: 'as_biology_wbi11_questions_new.json', subject: 'as_biology', code: 'WBI11', name: 'AS Biology' },
  { file: 'as_chemistry_wch_questions_new.json', subject: 'as_chemistry', code: 'WCH', name: 'AS Chemistry' },
];

const publicDir = path.join(process.cwd(), 'public');

async function uploadASSubjects() {
  console.log('📚 Uploading AS subjects to Firebase...\n');
  
  let totalUploaded = 0;
  let totalFailed = 0;
  
  for (const { file, subject, code, name } of asSubjects) {
    const filePath = path.join(publicDir, file);
    
    if (!fs.existsSync(filePath)) {
      console.log(`⚠️  File not found: ${file}`);
      continue;
    }
    
    console.log(`\n📖 ${name}`);
    
    try {
      const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      const questions = data.questions || [];
      
      console.log(`   Found ${questions.length} questions`);
      
      if (questions.length === 0) {
        console.log(`   ⏭️  Skipping - no questions`);
        continue;
      }
      
      // Small batches with delays
      const batchSize = 50;
      const delayMs = 3000; // 3 second delay
      
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
          console.log(`   ✅ Batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(questions.length/batchSize)} (${chunk.length} questions)`);
          
          if (i + batchSize < questions.length) {
            process.stdout.write(`   ⏳ Waiting...`);
            await new Promise(r => setTimeout(r, delayMs));
            process.stdout.write(' ✓\n');
          }
        } catch (err) {
          console.error(`   ❌ Batch failed:`, err.message);
        }
      }
      
      totalUploaded += questions.length;
      console.log(`   ✓ ${name}: ${questions.length} questions uploaded`);
      
    } catch (error) {
      console.error(`   ❌ Error with ${name}:`, error.message);
      totalFailed++;
    }
  }
  
  console.log(`\n🎉 AS Subjects Upload Complete!`);
  console.log(`   Total: ${totalUploaded} questions uploaded`);
  console.log(`   Failed files: ${totalFailed}`);
  console.log(`\n✨ You can now view/edit these questions in the Admin panel at /admin`);
  
  process.exit(0);
}

uploadASSubjects().catch(err => {
  console.error('❌ Fatal error:', err);
  process.exit(1);
});
