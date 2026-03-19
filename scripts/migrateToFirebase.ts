/**
 * Data Migration Script - Upload extracted questions to Firebase
 * Run: npx tsx scripts/migrateToFirebase.ts
 */

import { initializeApp } from 'firebase/app'
import { getFirestore, collection, doc, writeBatch } from 'firebase/firestore'
import { config } from 'dotenv'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

const subjectMap: Record<string, { name: string; level: string }> = {
  'o_physics': { name: 'Physics', level: 'O-Level' },
  'o_biology': { name: 'Biology', level: 'O-Level' },
  'o_mathematics': { name: 'Mathematics', level: 'O-Level' },
  'o_accounting': { name: 'Accounting', level: 'O-Level' },
  'as_physics': { name: 'Physics', level: 'AS' },
  'as_biology': { name: 'Biology', level: 'AS' },
  'as_chemistry': { name: 'Chemistry', level: 'AS' },
  'as_mathematics': { name: 'Mathematics', level: 'AS' },
  'as_economics': { name: 'Economics', level: 'AS' },
  'as_accounting': { name: 'Accounting', level: 'AS' },
  'as_business': { name: 'Business', level: 'AS' },
  'as_travel': { name: 'Travel & Tourism', level: 'AS' },
}

function toCanonicalSubjectKey(raw: string): string {
  const s = String(raw || '').toLowerCase().trim()

  if (s === 'o_accounting') return 'o_level_accounting'
  if (s === 'o_biology') return 'o_level_biology'
  if (s === 'o_mathematics') return 'o_level_mathematics'
  if (s === 'o_physics') return 'o_level_physics'

  if (s === 'as_travel') return 'as_travel_tourism'

  // already canonical
  if (s.startsWith('o_level_') || s.startsWith('as_')) return s

  // fallback: treat unknown raw strings as-is
  return s
}

function listJsonFilesRecursive(rootDir: string): string[] {
  const out: string[] = []
  const stack: string[] = [rootDir]

  while (stack.length > 0) {
    const dir = stack.pop()!
    let entries: fs.Dirent[] = []
    try {
      entries = fs.readdirSync(dir, { withFileTypes: true })
    } catch {
      continue
    }

    for (const entry of entries) {
      const full = path.join(dir, entry.name)
      if (entry.isDirectory()) {
        if (entry.name === 'node_modules' || entry.name === '.git' || entry.name === 'dist') continue
        stack.push(full)
      } else if (entry.isFile() && entry.name.endsWith('.json')) {
        out.push(full)
      }
    }
  }

  return out
}

function deriveSubjectKey(data: any, filePath: string): string {
  const file = path.basename(filePath).toLowerCase()
  const subjectCode = String(data?.subject_code || data?.subjectCode || '')
  const pdfName = String(data?.pdf_name || data?.pdfName || '').toLowerCase()

  if (file.includes('9395') || pdfName.includes('9395')) return 'as_travel'
  if (file.includes('wac') || pdfName.includes('wac') || file.includes('wac11') || file.includes('wac12') || file.includes('wac13') || file.includes('wac14')) return 'as_accounting'
  if (file.includes('wbi') || pdfName.includes('wbi')) return 'as_biology'
  if (file.includes('wbs') || pdfName.includes('wbs')) return 'as_business'
  if (file.includes('wec') || pdfName.includes('wec')) return 'as_economics'
  if (file.includes('wma') || pdfName.includes('wma')) return 'as_mathematics'
  if (file.includes('wph') || pdfName.includes('wph')) return 'as_physics'
  if (file.includes('wch') || pdfName.includes('wch')) return 'as_chemistry'

  if (subjectCode === '0625' || file.includes('0625') || pdfName.includes('0625')) return 'o_physics'
  if (subjectCode === '0580' || file.includes('0580') || pdfName.includes('0580')) return 'o_mathematics'
  if (subjectCode === '5090' || file.includes('5090') || pdfName.includes('5090')) return 'o_biology'
  if (subjectCode === '7707' || file.includes('7707') || pdfName.includes('7707')) return 'o_accounting'

  const raw = String(data?.subject || '').toLowerCase().trim()
  if (raw) return raw

  return 'unknown'
}

function toUploadQuestions(data: any, filePath: string): any[] {
  if (Array.isArray(data)) return data
  if (Array.isArray(data?.questions)) return data.questions

  if (data?.subjects && typeof data.subjects === 'object') {
    const all: any[] = []
    for (const v of Object.values<any>(data.subjects)) {
      if (Array.isArray(v)) all.push(...v)
      else if (v?.questions && Array.isArray(v.questions)) all.push(...v.questions)
    }
    return all
  }

  if (Array.isArray(data?.pages)) {
    const subject = deriveSubjectKey(data, filePath)
    const year = Number(data?.year || 0) || undefined
    const session = String(data?.session || '') || undefined
    const paper = String(data?.paper || '') || undefined
    const unit = String(data?.unit || '') || undefined
    const pdf = String(data?.pdf_name || '') || undefined
    const folder = String(data?.folder || '') || undefined

    const out: any[] = []
    for (const p of data.pages) {
      const pageNumber = String(p?.page_number || p?.pageNumber || '') || undefined
      const list = Array.isArray(p?.questions) ? p.questions : []
      for (const q of list) {
        const qid = String(q?.question_id || q?.questionId || q?.id || '')
        if (!qid) continue

        const uniqueId = folder ? `${subject}-${folder}-q${qid}` : `${subject}-${path.basename(filePath, '.json')}-q${qid}`
        const opts = q?.options || {}
        const options = [
          `A. ${opts.A || ''}`,
          `B. ${opts.B || ''}`,
          `C. ${opts.C || ''}`,
          `D. ${opts.D || ''}`
        ]
        const correctLetter = String(q?.correct_answer || q?.correctAnswer || 'A')
        const correctAnswer = Math.max(0, Math.min(3, correctLetter.toUpperCase().charCodeAt(0) - 'A'.charCodeAt(0)))

        out.push({
          id: uniqueId,
          subject,
          yearGroup: subject.startsWith('o_') ? 'year11' : 'year12',
          difficulty: 'medium',
          topic: unit || 'general',
          marks: Number(q?.marks || 1) || 1,
          question: String(q?.question_text || q?.question || ''),
          options,
          correctAnswer,
          explanation: '',
          examStyle: true,
          timeLimit: 60,
          verified: false,
          source: {
            pdf,
            folder,
            year,
            session,
            paper,
            unit,
            question_number: qid,
            page: pageNumber
          },
          sourceFile: path.relative(path.resolve(__dirname, '..'), filePath)
        })
      }
    }
    return out
  }

  return []
}

async function migrateQuestions() {
  const projectRoot = path.resolve(__dirname, '..')
  const allJsonFiles = listJsonFilesRecursive(projectRoot)
  const jsonFiles = allJsonFiles.filter((fullPath) => {
    const name = path.basename(fullPath)
    return (
      (name.startsWith('extracted_') || name.startsWith('supabase_upload_') || name.includes('_master.json')) &&
      name.endsWith('.json')
    )
  })
  
  console.log(`Found ${jsonFiles.length} JSON files\n`)
  
  let allQuestions: any[] = []
  
  for (const file of jsonFiles) {
    try {
      const content = fs.readFileSync(file, 'utf-8')
      const data = JSON.parse(content)

      const questions = toUploadQuestions(data, file)
      const valid = questions.filter((q: any) => q && q.id && q.question)
      
      if (valid.length > 0) {
        allQuestions.push(...valid)
        console.log(`✓ ${path.relative(projectRoot, file)}: ${valid.length} questions`)
      }
    } catch (err) {
      console.error(`✗ ${path.relative(projectRoot, file)}:`, err instanceof Error ? err.message : 'Failed')
    }
  }
  
  // Remove duplicates
  const unique = Array.from(new Map(allQuestions.map((q: any) => [q.id, q])).values())
  console.log(`\n📊 Total: ${unique.length} unique questions\n`)
  
  if (unique.length === 0) {
    console.log('⚠️ No questions to upload')
    return
  }
  
  // Upload in batches
  const BATCH_SIZE = 500
  const questionsRef = collection(db, 'questions')
  
  for (let i = 0; i < unique.length; i += BATCH_SIZE) {
    const batch = writeBatch(db)
    const chunk = unique.slice(i, i + BATCH_SIZE)
    
    chunk.forEach((q: any) => {
      const subjectKey = toCanonicalSubjectKey(q.subject)
      const mapped = subjectMap[q.subject] || subjectMap[subjectKey] || { name: q.subject, level: 'Unknown' }
      const displaySubject = mapped.level === 'Unknown' ? String(q.subject) : `${mapped.level} ${mapped.name}`
      
      const docRef = doc(questionsRef, q.id)
      batch.set(docRef, {
        ...q,
        subject: subjectKey,
        subjectDisplay: displaySubject,
        normalizedSubject: subjectKey,
        uploadedAt: new Date().toISOString()
      })
    })
    
    await batch.commit()
    console.log(`✓ Batch ${Math.floor(i / BATCH_SIZE) + 1}: ${chunk.length} uploaded`)
    
    if (i + BATCH_SIZE < unique.length) {
      await new Promise(r => setTimeout(r, 500))
    }
  }
  
  console.log(`\n✅ Migration complete! Uploaded ${unique.length} questions`)
  
  // Show breakdown
  const counts: Record<string, number> = {}
  unique.forEach((q: any) => {
    const s = subjectMap[q.subject]?.name || q.subject
    counts[s] = (counts[s] || 0) + 1
  })
  
  console.log('\n📚 By subject:')
  Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .forEach(([s, c]) => console.log(`  • ${s}: ${c}`))
}

migrateQuestions().catch(err => {
  console.error('❌ Migration failed:', err)
  process.exit(1)
})
