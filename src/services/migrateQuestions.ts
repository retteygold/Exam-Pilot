/**
 * Simple Migration Script: Supabase → Firestore (Client SDK)
 * 
 * This script runs in the browser and can be triggered from the app.
 * Place this in your Admin panel to migrate data.
 */

import { createClient } from '@supabase/supabase-js';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useState } from 'react';

// Supabase config from env
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY || '';

let supabase: ReturnType<typeof createClient> | null = null;

if (supabaseUrl && supabaseKey) {
  supabase = createClient(supabaseUrl, supabaseKey);
}

type SupabaseQuestion = {
  id: string;
  subject: string;
  year_group: string | null;
  difficulty: 'easy' | 'medium' | 'hard' | null;
  topic: string | null;
  marks: number | null;
  question: string;
  options: string[] | null;
  correct_answer: number | null;
  explanation: string | null;
  exam_style: boolean | null;
  time_limit: number | null;
  source: any;
  table_data: any;
  verified: boolean | null;
  image_required: boolean | null;
  image_page: number | null;
  image_path: string | null;
  image_note: string | null;
  created_at?: string;
};

export async function* migrateQuestionsFromSupabase() {
  if (!supabase) {
    throw new Error('Supabase not configured. Check environment variables.');
  }

  // Fetch all questions from Supabase
  const { data: questions, error } = await supabase
    .from('questions')
    .select('*');

  if (error) {
    throw new Error(`Supabase error: ${error.message}`);
  }

  if (!questions || questions.length === 0) {
    yield { type: 'complete' as const, count: 0, migrated: 0, errors: 0, total: 0 };
    return;
  }

  const typedQuestions = questions as SupabaseQuestion[];
  const total = typedQuestions.length;
  let migrated = 0;
  let errors = 0;

  yield { type: 'start' as const, total };

  // Migrate each question
  for (const row of typedQuestions) {
    try {
      const docData = {
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

      const docRef = doc(db, 'questions', row.id);
      await setDoc(docRef, docData, { merge: true });
      
      migrated++;
      yield { type: 'progress' as const, migrated, total, current: row.id };
    } catch (err: any) {
      errors++;
      yield { type: 'error' as const, id: row.id, error: err.message };
    }
  }

  yield { type: 'complete' as const, migrated, errors, total };
}

// React hook for migration UI
export function useMigration() {
  const [status, setStatus] = useState<'idle' | 'running' | 'complete' | 'error'>('idle');
  const [progress, setProgress] = useState({ migrated: 0, total: 0, errors: 0 });
  const [logs, setLogs] = useState<string[]>([]);

  const startMigration = async () => {
    setStatus('running');
    setLogs(['Starting migration...']);
    setProgress({ migrated: 0, total: 0, errors: 0 });

    try {
      for await (const update of migrateQuestionsFromSupabase()) {
        switch (update.type) {
          case 'start':
            setProgress({ migrated: 0, total: update.total, errors: 0 });
            setLogs(l => [...l, `Found ${update.total} questions to migrate`]);
            break;
          case 'progress':
            setProgress({ migrated: update.migrated, total: update.total, errors: progress.errors });
            if (update.migrated % 10 === 0) {
              setLogs(l => [...l, `Migrated ${update.migrated}/${update.total}`]);
            }
            break;
          case 'error':
            setProgress(p => ({ ...p, errors: p.errors + 1 }));
            setLogs(l => [...l, `Error migrating ${update.id}: ${update.error}`]);
            break;
          case 'complete':
            setStatus('complete');
            setLogs(l => [...l, `✅ Migration complete! ${update.migrated} migrated, ${update.errors} errors`]);
            break;
        }
      }
    } catch (err: any) {
      setStatus('error');
      setLogs(l => [...l, `❌ Migration failed: ${err.message}`]);
    }
  };

  return { status, progress, logs, startMigration };
}

// Need to add to package.json for this to work:
// npm install @supabase/supabase-js
