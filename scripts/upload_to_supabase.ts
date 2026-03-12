import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment')
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function uploadQuestions() {
  // Load questions
  const questionsPath = path.join(__dirname, '..', 'public', 'questions.json')
  const biologyPath = path.join(__dirname, '..', 'public', 'biology_questions.json')
  
  let allQuestions = []
  
  // Load Accounting questions
  if (fs.existsSync(questionsPath)) {
    const data = JSON.parse(fs.readFileSync(questionsPath, 'utf-8'))
    const questions = data.questions.map(q => ({
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
      table_data: q.table,
      verified: q.verified,
      image_required: q.imageRequired,
      image_page: q.imagePage,
      image_path: q.imagePath,
      image_note: q.imageNote
    }))
    allQuestions.push(...questions)
    console.log(`Loaded ${questions.length} Accounting questions`)
  }
  
  // Load Biology questions
  if (fs.existsSync(biologyPath)) {
    const data = JSON.parse(fs.readFileSync(biologyPath, 'utf-8'))
    const questions = data.questions.map(q => ({
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
      table_data: q.table,
      verified: q.verified,
      image_required: q.imageRequired,
      image_page: q.imagePage,
      image_path: q.imagePath,
      image_note: q.imageNote
    }))
    allQuestions.push(...questions)
    console.log(`Loaded ${questions.length} Biology questions`)
  }
  
  console.log(`Total questions to upload: ${allQuestions.length}`)
  
  // Upload in batches of 100
  const batchSize = 100
  for (let i = 0; i < allQuestions.length; i += batchSize) {
    const batch = allQuestions.slice(i, i + batchSize)
    
    const { data, error } = await supabase
      .from('questions')
      .upsert(batch, { onConflict: 'id' })
    
    if (error) {
      console.error(`Error uploading batch ${i / batchSize + 1}:`, error)
    } else {
      console.log(`Uploaded batch ${i / batchSize + 1} (${batch.length} questions)`)
    }
  }
  
  console.log('Upload complete!')
}

uploadQuestions().catch(console.error)
