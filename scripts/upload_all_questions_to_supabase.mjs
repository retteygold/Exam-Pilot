import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment')
}

const supabase = createClient(supabaseUrl, supabaseKey)

function loadQuestions(jsonPath) {
  console.log(`Checking: ${jsonPath} - exists: ${fs.existsSync(jsonPath)}`)
  if (!fs.existsSync(jsonPath)) return []
  const raw = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'))
  const count = raw.questions?.length || 0
  console.log(`Loaded ${count} questions from ${jsonPath}`)
  return raw.questions || []
}

function mapToDb(q) {
  return {
    id: q.id,
    subject: q.subject,
    year_group: q.yearGroup,
    difficulty: q.difficulty,
    topic: q.topic,
    marks: q.marks,
    question: q.question,
    options: q.options,
    correct_answer: q.correctAnswer,
    explanation: q.explanation,
    exam_style: q.examStyle,
    time_limit: q.timeLimit,
    source: q.source,
    table_data: q.table || null,
    verified: q.verified || false,
    image_required: q.imageRequired || false,
    image_page: q.imagePage ?? null,
    image_path: q.imagePath ?? null,
    image_note: q.imageNote ?? null,
  }
}

async function main() {
  const __filename = fileURLToPath(import.meta.url)
  const __dirname = path.dirname(__filename)
  const root = path.join(__dirname, '..')
  const sources = [
    path.join(root, 'public', 'questions.json'),
    path.join(root, 'public', 'biology_questions.json'),
    path.join(root, 'public', 'igcse_biology_0610_questions.json'),
  ]

  const all = sources.flatMap(loadQuestions).map(mapToDb)
  // Deduplicate by ID to prevent upsert conflicts
  const uniqueById = new Map()
  for (const q of all) {
    if (!uniqueById.has(q.id)) {
      uniqueById.set(q.id, q)
    } else {
      console.log(`Duplicate ID skipped: ${q.id}`)
    }
  }
  const unique = Array.from(uniqueById.values())
  console.log(`Total questions: ${all.length}, Unique: ${unique.length}`)

  const batchSize = 500
  for (let i = 0; i < unique.length; i += batchSize) {
    const batch = unique.slice(i, i + batchSize)
    const { error } = await supabase.from('questions').upsert(batch, { onConflict: 'id' })
    if (error) throw error
    console.log(`Uploaded ${i + batch.length}/${unique.length}`)
  }

  console.log('Done')
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
