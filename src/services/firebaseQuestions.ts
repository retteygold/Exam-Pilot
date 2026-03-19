import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit as limitQuery,
  startAfter,
  type QueryDocumentSnapshot,
  serverTimestamp,
  increment,
  writeBatch
} from 'firebase/firestore'
import { db } from '../lib/firebase'
import type { Question } from '../types'

// Collection references
const QUESTIONS_COLLECTION = 'questions'
const USERS_COLLECTION = 'users'
const EXAM_RESULTS_COLLECTION = 'exam_results'
const SUBJECTS_COLLECTION = 'subjects'

// ===== QUESTION SERVICES =====

export interface FirestoreQuestion extends Omit<Question, 'id'> {
  id?: string
  createdAt?: Date
  updatedAt?: Date
  imageUrl?: string  // Cloudinary URL
}

/**
 * Create a new question in Firestore
 */
export async function createQuestion(
  question: FirestoreQuestion
): Promise<string> {
  const id = question.id || `q_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  const docRef = doc(db, QUESTIONS_COLLECTION, id)
  
  await setDoc(docRef, {
    ...question,
    id,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  })
  
  return id
}

/**
 * Batch create multiple questions
 */
export async function batchCreateQuestions(
  questions: FirestoreQuestion[]
): Promise<string[]> {
  const batch = writeBatch(db)
  const ids: string[] = []
  
  questions.forEach((question) => {
    const id = question.id || `q_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const docRef = doc(db, QUESTIONS_COLLECTION, id)
    ids.push(id)
    
    batch.set(docRef, {
      ...question,
      id,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    })
  })
  
  await batch.commit()
  return ids
}

/**
 * Get a single question by ID
 */
export async function getQuestion(id: string): Promise<Question | null> {
  const docRef = doc(db, QUESTIONS_COLLECTION, id)
  const snapshot = await getDoc(docRef)
  
  if (!snapshot.exists()) return null
  
  const data = snapshot.data()
  return {
    ...data,
    id: snapshot.id
  } as Question
}

/**
 * Get all questions with optional filters
 */
export async function getQuestions(
  filters?: {
    subject?: string
    yearGroup?: string
    difficulty?: 'easy' | 'medium' | 'hard'
    verified?: boolean
    topic?: string
  },
  pageSize: number = 100,
  lastDoc?: QueryDocumentSnapshot
): Promise<{ questions: Question[]; lastDoc: QueryDocumentSnapshot | null }> {
  console.log('[DEBUG] getQuestions called with filters:', filters)
  
  let q = query(
    collection(db, QUESTIONS_COLLECTION),
    orderBy('createdAt', 'desc'),
    limitQuery(pageSize)
  )
  
  // Apply filters
  if (filters?.subject) {
    console.log('[DEBUG] Adding subject filter:', filters.subject)
    q = query(q, where('subject', '==', filters.subject))
  }
  if (filters?.yearGroup) {
    console.log('[DEBUG] Adding yearGroup filter:', filters.yearGroup)
    q = query(q, where('yearGroup', '==', filters.yearGroup))
  }
  if (filters?.difficulty) {
    console.log('[DEBUG] Adding difficulty filter:', filters.difficulty)
    q = query(q, where('difficulty', '==', filters.difficulty))
  }
  if (filters?.verified !== undefined) {
    console.log('[DEBUG] Adding verified filter:', filters.verified)
    q = query(q, where('verified', '==', filters.verified))
  }
  
  if (lastDoc) {
    q = query(q, startAfter(lastDoc))
  }
  
  try {
    console.log('[DEBUG] Executing Firestore query...')
    const snapshot = await getDocs(q)
    console.log('[DEBUG] Query returned', snapshot.docs.length, 'documents')

    if (snapshot.docs.length === 0) {
      try {
        const probe = query(
          collection(db, QUESTIONS_COLLECTION),
          limitQuery(Math.min(pageSize, 20))
        )
        const probeSnap = await getDocs(probe)
        console.log(
          '[DEBUG] Probe query (no orderBy) returned',
          probeSnap.docs.length,
          'documents'
        )
        if (probeSnap.docs.length > 0) {
          const sample = probeSnap.docs[0]?.data() as any
          console.log('[DEBUG] Probe sample keys:', Object.keys(sample || {}))
        }
      } catch (probeErr) {
        console.error('[DEBUG] Probe query error:', probeErr)
      }
    }
    
    const questions = snapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id
    })) as Question[]
    
    console.log('[DEBUG] First 3 questions:', questions.slice(0, 3))
    
    const newLastDoc = snapshot.docs[snapshot.docs.length - 1] || null
    
    return { questions, lastDoc: newLastDoc }
  } catch (error) {
    console.error('[DEBUG] Firestore query error:', error)
    throw error
  }
}

/**
 * Get questions by subject and paper
 */
export async function getQuestionsByPaper(
  subject: string,
  year: number,
  session: string,
  paper: string
): Promise<Question[]> {
  const q = query(
    collection(db, QUESTIONS_COLLECTION),
    where('subject', '==', subject),
    where('source.year', '==', year),
    where('source.session', '==', session),
    where('source.paper', '==', paper),
    orderBy('source.question_number', 'asc')
  )
  
  const snapshot = await getDocs(q)
  return snapshot.docs.map((doc) => ({
    ...doc.data(),
    id: doc.id
  })) as Question[]
}

/**
 * Update a question
 */
export async function updateQuestion(
  id: string,
  updates: Partial<FirestoreQuestion>
): Promise<void> {
  const docRef = doc(db, QUESTIONS_COLLECTION, id)
  await updateDoc(docRef, {
    ...updates,
    updatedAt: serverTimestamp()
  })
}

/**
 * Update question with image URL from Cloudinary
 */
export async function updateQuestionImage(
  questionId: string,
  imageUrl: string
): Promise<void> {
  const docRef = doc(db, QUESTIONS_COLLECTION, questionId)
  await updateDoc(docRef, {
    imageUrl,
    updatedAt: serverTimestamp()
  })
}

/**
 * Delete a question
 */
export async function deleteQuestion(id: string): Promise<void> {
  await deleteDoc(doc(db, QUESTIONS_COLLECTION, id))
}

// ===== USER SERVICES =====

export interface FirestoreUser {
  id: string
  email?: string
  name?: string
  grade?: string
  skillLevel?: 'Beginner' | 'Intermediate' | 'Advanced' | ''
  exam?: string
  gender?: string
  age?: string
  role?: 'student' | 'admin'
  createdAt?: Date
  updatedAt?: Date
}

/**
 * Create or update user profile
 */
export async function saveUser(user: FirestoreUser): Promise<void> {
  const docRef = doc(db, USERS_COLLECTION, user.id)
  const snapshot = await getDoc(docRef)
  
  if (snapshot.exists()) {
    await updateDoc(docRef, {
      ...user,
      updatedAt: serverTimestamp()
    })
  } else {
    await setDoc(docRef, {
      ...user,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    })
  }
}

/**
 * Get user by ID
 */
export async function getUser(id: string): Promise<FirestoreUser | null> {
  const docRef = doc(db, USERS_COLLECTION, id)
  const snapshot = await getDoc(docRef)
  
  if (!snapshot.exists()) return null
  
  return {
    ...snapshot.data(),
    id: snapshot.id
  } as FirestoreUser
}

// ===== EXAM RESULTS SERVICES =====

export interface FirestoreExamResult {
  id?: string
  userId: string
  paperId: string
  subject: string
  year: number
  session: string
  paper: string
  mode: 'practice' | 'exam'
  score: number
  totalMarks: number
  percentage: number
  timeSpent: number
  answers: Record<string, { selected: number; correct: boolean; timeSpent: number }>
  completedAt: Date
}

/**
 * Save exam result
 */
export async function saveExamResult(
  result: FirestoreExamResult
): Promise<string> {
  const id = result.id || `er_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  const docRef = doc(db, EXAM_RESULTS_COLLECTION, id)
  
  await setDoc(docRef, {
    ...result,
    id,
    completedAt: serverTimestamp()
  })
  
  return id
}

/**
 * Get user's exam history
 */
export async function getUserExamResults(
  userId: string,
  limit: number = 50
): Promise<FirestoreExamResult[]> {
  const q = query(
    collection(db, EXAM_RESULTS_COLLECTION),
    where('userId', '==', userId),
    orderBy('completedAt', 'desc'),
    limitQuery(limit)
  )
  
  const snapshot = await getDocs(q)
  return snapshot.docs.map((doc) => ({
    ...doc.data(),
    id: doc.id
  })) as FirestoreExamResult[]
}

/**
 * Get user's completed papers
 */
export async function getUserCompletedPapers(userId: string): Promise<string[]> {
  const q = query(
    collection(db, EXAM_RESULTS_COLLECTION),
    where('userId', '==', userId),
    orderBy('completedAt', 'desc')
  )
  
  const snapshot = await getDocs(q)
  const papers = new Set<string>()
  
  snapshot.docs.forEach((doc) => {
    const data = doc.data()
    if (data.paperId) {
      papers.add(data.paperId)
    }
  })
  
  return Array.from(papers)
}

// ===== SUBJECT SERVICES =====

export interface FirestoreSubject {
  id: string
  name: string
  icon: string
  color: string
  questionCount: number
}

/**
 * Get all subjects
 */
export async function getSubjects(): Promise<FirestoreSubject[]> {
  const snapshot = await getDocs(collection(db, SUBJECTS_COLLECTION))
  return snapshot.docs.map((doc) => ({
    ...doc.data(),
    id: doc.id
  })) as FirestoreSubject[]
}

/**
 * Update subject question count
 */
export async function updateSubjectQuestionCount(
  subjectId: string,
  delta: number
): Promise<void> {
  const docRef = doc(db, SUBJECTS_COLLECTION, subjectId)
  await updateDoc(docRef, {
    questionCount: increment(delta),
    updatedAt: serverTimestamp()
  })
}

// ===== STATS SERVICES =====

/**
 * Get user stats
 */
export async function getUserStats(userId: string): Promise<{
  totalExams: number
  totalQuestions: number
  correctAnswers: number
  averageScore: number
  papersCompleted: string[]
}> {
  const q = query(
    collection(db, EXAM_RESULTS_COLLECTION),
    where('userId', '==', userId)
  )
  
  const snapshot = await getDocs(q)
  
  let totalExams = 0
  let totalQuestions = 0
  let correctAnswers = 0
  let totalPercentage = 0
  const papersCompleted = new Set<string>()
  
  snapshot.docs.forEach((doc) => {
    const data = doc.data()
    totalExams++
    totalQuestions += data.totalMarks || 0
    correctAnswers += data.score || 0
    totalPercentage += data.percentage || 0
    if (data.paperId) {
      papersCompleted.add(data.paperId)
    }
  })
  
  return {
    totalExams,
    totalQuestions,
    correctAnswers,
    averageScore: totalExams > 0 ? Math.round(totalPercentage / totalExams) : 0,
    papersCompleted: Array.from(papersCompleted)
  }
}
