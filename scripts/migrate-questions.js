#!/usr/bin/env node
/**
 * Migration Script: Supabase → Firebase Firestore
 * 
 * This script migrates questions from Supabase to Firebase Firestore.
 * 
 * Usage:
 *   node scripts/migrate-questions.js
 * 
 * Prerequisites:
 *   - Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env
 *   - Set Firebase config in .env (VITE_FIREBASE_* variables)
 *   - Run: npm install @supabase/supabase-js firebase dotenv
 */

require('dotenv').config({ path: '.env' });

const { createClient } = require('@supabase/supabase-js');
const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

// Check environment variables
const requiredEnvVars = [
  'SUPABASE_URL',
  'SUPABASE_SERVICE_ROLE_KEY'
];

const missingVars = requiredEnvVars.filter(v => !process.env[v]);
if (missingVars.length > 0) {
  console.error('❌ Missing required environment variables:', missingVars.join(', '));
  process.exit(1);
}

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Initialize Firebase Admin SDK
// Note: This requires a service account key file
// Download from Firebase Console → Project Settings → Service Accounts → Generate new private key
let db;
try {
  const serviceAccount = require('./serviceAccountKey.json');
  const app = initializeApp({
    credential: cert(serviceAccount)
  });
  db = getFirestore(app);
  console.log('✅ Firebase Admin initialized');
} catch (error) {
  console.error('❌ Failed to initialize Firebase Admin:');
  console.error('   You need to download a service account key from Firebase Console:');
  console.error('   1. Go to Firebase Console → Project Settings → Service Accounts');
  console.error('   2. Click "Generate new private key"');
  console.error('   3. Save as scripts/serviceAccountKey.json');
  console.error('\n   Error:', error.message);
  process.exit(1);
}

// Map Supabase row to Firestore document
function mapSupabaseToFirestore(row) {
  return {
    id: row.id,
    subject: row.subject,
    year_group: row.year_group,
    difficulty: row.difficulty,
    topic: row.topic,
    marks: row.marks,
    question: row.question,
    options: row.options,
    correct_answer: row.correct_answer,
    explanation: row.explanation,
    exam_style: row.exam_style,
    time_limit: row.time_limit,
    source: row.source,
    table_data: row.table_data,
    verified: row.verified,
    image_required: row.image_required,
    image_page: row.image_page,
    image_path: row.image_path,
    image_note: row.image_note,
    created_at: row.created_at || new Date().toISOString()
  };
}

async function migrateQuestions() {
  console.log('🚀 Starting migration from Supabase to Firestore...\n');

  try {
    // Fetch all questions from Supabase
    console.log('📥 Fetching questions from Supabase...');
    const { data: questions, error, count } = await supabase
      .from('questions')
      .select('*', { count: 'exact' });

    if (error) {
      throw new Error(`Supabase error: ${error.message}`);
    }

    if (!questions || questions.length === 0) {
      console.log('⚠️ No questions found in Supabase');
      return;
    }

    console.log(`✅ Found ${questions.length} questions in Supabase\n`);

    // Migrate to Firestore
    console.log('📤 Writing to Firestore...');
    const batch = db.batch();
    const questionsRef = db.collection('questions');

    let migratedCount = 0;
    let errorCount = 0;

    for (const row of questions) {
      try {
        const docData = mapSupabaseToFirestore(row);
        const docRef = questionsRef.doc(row.id);
        batch.set(docRef, docData, { merge: true });
        migratedCount++;

        // Commit batch every 500 documents (Firestore limit)
        if (migratedCount % 500 === 0) {
          await batch.commit();
          console.log(`   Progress: ${migratedCount}/${questions.length}...`);
        }
      } catch (err) {
        console.error(`   ❌ Failed to migrate question ${row.id}:`, err.message);
        errorCount++;
      }
    }

    // Commit remaining documents
    await batch.commit();

    console.log('\n✅ Migration complete!');
    console.log(`   📊 Total questions: ${questions.length}`);
    console.log(`   ✅ Migrated: ${migratedCount}`);
    console.log(`   ❌ Errors: ${errorCount}`);

  } catch (error) {
    console.error('\n❌ Migration failed:', error.message);
    process.exit(1);
  }
}

// Run migration
migrateQuestions();
