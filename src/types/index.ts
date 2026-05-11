export type LevelId = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'ESP' | 'Biz'
export type CourseType =
  | 'grammar'
  | 'vocabulary'
  | 'speaking'
  | 'listening'
  | 'reading'
  | 'writing'
  | 'pronunciation'
  | 'practical'
  | 'professional'
  | 'mixed'
  | 'exam'

export interface QuizQuestion {
  q: string
  opts: string[]
  a: number
}

export interface Course {
  id: string
  title: string
  type: CourseType
  xp: number
  topics?: string[]
  quiz?: QuizQuestion[]
}

export interface CurriculumLevel {
  id: LevelId
  label: string
  hours: number
  icon: string
  desc: string
  color: string
  courses: Course[]
}

export interface VocabWord {
  word: string
  phonetic: string
  definition: string
  example: string
  tip?: string
}

export interface ReadingArticle {
  level: LevelId
  title: string
  topic: string
  readTime: string
  content: string
  questions: { q: string; opts: string[]; a: number }[]
  vocab: string[]
}

export interface ListenSentence {
  text: string
  level: LevelId
}

export interface SpeakingPrompt {
  text: string
  level: LevelId
}

export interface UserProgress {
  uid: string
  currentLevel: LevelId
  xp: number
  wordsLearned: number
  streak: number
  completedCourses: Record<string, boolean>
  lastActiveDate: string
}
