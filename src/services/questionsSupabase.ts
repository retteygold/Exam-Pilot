import { supabase } from '../lib/supabase'
import type { Question } from '../types'

export type DbQuestionRow = {
  id: string
  subject: string
  year_group: string | null
  difficulty: 'easy' | 'medium' | 'hard' | null
  topic: string | null
  marks: number | null
  question: string
  options: string[] | null
  correct_answer: number | null
  explanation: string | null
  exam_style: boolean | null
  time_limit: number | null
  source: any
  table_data: any
  verified: boolean | null
  image_required: boolean | null
  image_page: number | null
  image_path: string | null
  image_note: string | null
  created_at?: string
}

export function dbToQuestion(row: DbQuestionRow): Question {
  return {
    id: row.id,
    subject: row.subject,
    yearGroup: row.year_group || 'year10',
    difficulty: (row.difficulty || 'medium') as 'easy' | 'medium' | 'hard',
    topic: row.topic || 'general',
    marks: row.marks ?? 1,
    question: row.question,
    options: row.options,
    correctAnswer: row.correct_answer ?? 0,
    explanation: row.explanation || '',
    examStyle: row.exam_style ?? true,
    timeLimit: row.time_limit ?? 60,
    source: row.source,
    table: row.table_data || undefined,
    verified: row.verified ?? false,
    imageRequired: row.image_required ?? false,
    imagePage: row.image_page ?? undefined,
    imagePath: row.image_path ?? undefined,
    imageNote: row.image_note ?? undefined,
  }
}

export function questionToDb(q: Question): Partial<DbQuestionRow> {
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
    verified: q.verified ?? false,
    image_required: q.imageRequired ?? false,
    image_page: q.imagePage ?? null,
    image_path: q.imagePath ?? null,
    image_note: q.imageNote ?? null,
  }
}

export function canUseSupabaseQuestions(): boolean {
  return Boolean(import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY)
}

export async function fetchAllQuestionsFromSupabase(): Promise<Question[]> {
  const pageSize = 1000
  let offset = 0
  const out: Question[] = []

  while (true) {
    const { data, error } = await supabase
      .from('questions')
      .select('*')
      .order('id', { ascending: true })
      .range(offset, offset + pageSize - 1)

    if (error) throw error

    const rows = (data as DbQuestionRow[]) || []
    out.push(...rows.map(dbToQuestion))

    if (rows.length < pageSize) break
    offset += pageSize
  }

  return out
}

export async function fetchQuestionsByIdLike(idLike: string): Promise<Question[]> {
  const { data, error } = await supabase
    .from('questions')
    .select('*')
    .ilike('id', `%${idLike}%`)
    .limit(50)

  if (error) throw error
  return ((data as DbQuestionRow[]) || []).map(dbToQuestion)
}

export async function fetchRecentQuestions(limit = 50): Promise<Question[]> {
  const { data, error } = await supabase
    .from('questions')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) throw error
  return ((data as DbQuestionRow[]) || []).map(dbToQuestion)
}

export async function upsertQuestion(q: Question): Promise<void> {
  const payload = questionToDb(q)
  const { error } = await supabase.from('questions').upsert(payload, { onConflict: 'id' })
  if (error) throw error
}

export async function deleteQuestion(id: string): Promise<void> {
  const { error } = await supabase.from('questions').delete().eq('id', id)
  if (error) throw error
}
