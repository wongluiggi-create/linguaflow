import { useState, useRef } from 'react'
import { useAppStore } from '../store/useAppStore'
import { CURRICULUM } from '../data/curriculum'
import type { Course, CurriculumLevel } from '../types'

type View = 'list' | 'quiz' | 'result'

interface QuizLesson {
  course: Course
  level: CurriculumLevel
}

const ALL_QUIZ_LESSONS: QuizLesson[] = CURRICULUM.flatMap((level) =>
  level.courses
    .filter((c) => c.quiz && c.quiz.length > 0)
    .map((course) => ({ course, level })),
)

const TYPE_ICONS: Record<string, string> = {
  grammar:      '✏️',
  vocabulary:   '📖',
  speaking:     '🗣️',
  mixed:        '🔀',
  practical:    '🛠️',
  professional: '💼',
  reading:      '📰',
  listening:    '🎧',
  writing:      '✍️',
  exam:         '📋',
}

export default function GrammarModule() {
  const { completedCourses, markCourseComplete, launchCourseId, setLaunchCourse } = useAppStore()

  // If launched from CurriculumView with a specific course, start directly in quiz mode
  const launchLesson = launchCourseId
    ? ALL_QUIZ_LESSONS.find((l) => l.course.id === launchCourseId) ?? null
    : null

  const [view, setView] = useState<View>(() => (launchLesson ? 'quiz' : 'list'))
  const [activeLesson, setActiveLesson] = useState<QuizLesson | null>(() => launchLesson)
  const [qIdx, setQIdx] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [score, setScore] = useState(0)
  const autoAdvanceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  function openLesson(lesson: QuizLesson) {
    setActiveLesson(lesson)
    setQIdx(0)
    setSelected(null)
    setScore(0)
    setView('quiz')
  }

  function handleAnswer(optIdx: number) {
    if (selected !== null || !activeLesson?.course.quiz) return
    const quiz = activeLesson.course.quiz
    const correct = quiz[qIdx].a
    setSelected(optIdx)
    const isCorrect = optIdx === correct
    const newScore = isCorrect ? score + 1 : score
    if (isCorrect) setScore(newScore)

    if (autoAdvanceRef.current) clearTimeout(autoAdvanceRef.current)
    autoAdvanceRef.current = setTimeout(() => {
      const nextIdx = qIdx + 1
      if (nextIdx < quiz.length) {
        setQIdx(nextIdx)
        setSelected(null)
      } else {
        setScore(newScore)
        setView('result')
      }
    }, 1000)
  }

  function retry() {
    setQIdx(0)
    setSelected(null)
    setScore(0)
    setView('quiz')
  }

  function goToList() {
    if (autoAdvanceRef.current) clearTimeout(autoAdvanceRef.current)
    setLaunchCourse(null)
    setView('list')
  }

  function markComplete() {
    if (!activeLesson) return
    markCourseComplete(activeLesson.course.id, activeLesson.course.xp)
  }

  // ─── LIST VIEW ────────────────────────────────────────────────────────────
  if (view === 'list') {
    return (
      <div style={{ maxWidth: 540, margin: '0 auto' }} className="animate-in">
        <h2 style={{ fontWeight: 800, fontSize: 22, marginBottom: 4 }}>✏️ Gramática</h2>
        <p style={{ color: 'var(--muted)', fontSize: 14, marginBottom: 20 }}>
          Practica con quizzes interactivos de todos los niveles
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {ALL_QUIZ_LESSONS.map(({ course, level }) => {
            const done = completedCourses[course.id]
            return (
              <button
                key={course.id}
                onClick={() => openLesson({ course, level })}
                style={{
                  background: 'var(--surface)',
                  border: `1px solid var(--border)`,
                  borderRadius: 14,
                  padding: '14px 16px',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 14,
                  cursor: 'pointer',
                  color: 'var(--text)',
                  textAlign: 'left',
                  width: '100%',
                  fontFamily: 'inherit',
                  transition: 'border-color 0.15s, background 0.15s',
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget
                  el.style.borderColor = level.color + '88'
                  el.style.background = level.color + '0a'
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget
                  el.style.borderColor = 'var(--border)'
                  el.style.background = 'var(--surface)'
                }}
              >
                <span style={{ fontSize: 22, minWidth: 28, textAlign: 'center', marginTop: 2 }}>
                  {TYPE_ICONS[course.type] ?? '📝'}
                </span>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 5 }}>
                    {done && <span style={{ color: 'var(--mint)', marginRight: 6 }}>✓</span>}
                    {course.title}
                  </div>

                  {course.topics && (
                    <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 6 }}>
                      {course.topics.slice(0, 2).map((t) => (
                        <span
                          key={t}
                          style={{
                            background: level.color + '18',
                            color: level.color,
                            borderRadius: 6,
                            padding: '2px 8px',
                            fontSize: 11,
                            fontWeight: 500,
                          }}
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  )}

                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span
                      style={{
                        background: level.color + '22',
                        color: level.color,
                        border: `1px solid ${level.color}44`,
                        borderRadius: 20,
                        padding: '2px 8px',
                        fontSize: 11,
                        fontWeight: 700,
                      }}
                    >
                      {level.id}
                    </span>
                    <span style={{ color: level.color, fontSize: 12, fontWeight: 600 }}>
                      ● Quiz · {course.quiz?.length} preguntas
                    </span>
                  </div>
                </div>

                <span style={{ color: 'var(--gold)', fontSize: 12, fontWeight: 700, whiteSpace: 'nowrap', marginTop: 2 }}>
                  +{course.xp} XP
                </span>
              </button>
            )
          })}
        </div>
      </div>
    )
  }

  // ─── QUIZ VIEW ────────────────────────────────────────────────────────────
  if (view === 'quiz' && activeLesson) {
    const { course, level } = activeLesson
    const quiz = course.quiz!
    const q = quiz[qIdx]

    return (
      <div style={{ maxWidth: 540, margin: '0 auto' }} className="animate-in">
        {/* Back */}
        <button
          onClick={goToList}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--muted)',
            fontSize: 14,
            cursor: 'pointer',
            marginBottom: 20,
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            padding: 0,
            fontFamily: 'inherit',
          }}
        >
          ← Volver
        </button>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 16 }}>
          <span style={{ fontSize: 26 }}>{TYPE_ICONS[course.type] ?? '📝'}</span>
          <div>
            <h2 style={{ fontWeight: 800, fontSize: 19, marginBottom: 6 }}>{course.title}</h2>
            <span
              style={{
                background: level.color + '22',
                color: level.color,
                border: `1px solid ${level.color}44`,
                borderRadius: 20,
                padding: '3px 10px',
                fontSize: 11,
                fontWeight: 700,
              }}
            >
              {level.id} · {level.label}
            </span>
          </div>
        </div>

        {/* Topic pills */}
        {course.topics && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 16 }}>
            {course.topics.map((t) => (
              <span
                key={t}
                style={{
                  background: level.color + '18',
                  color: level.color,
                  borderRadius: 20,
                  padding: '4px 12px',
                  fontSize: 12,
                  fontWeight: 500,
                }}
              >
                {t}
              </span>
            ))}
          </div>
        )}

        {/* Progress bar */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 20 }}>
          {quiz.map((_, i) => (
            <div
              key={i}
              style={{
                flex: 1,
                height: 4,
                borderRadius: 99,
                background: i < qIdx ? level.color : i === qIdx ? level.color + '88' : 'var(--faint)',
                transition: 'background 0.3s',
              }}
            />
          ))}
        </div>

        {/* Question card */}
        <div
          style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 18,
            padding: '24px 22px',
            marginBottom: 16,
          }}
        >
          <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 14, fontWeight: 500 }}>
            Pregunta {qIdx + 1} de {quiz.length}
          </p>
          <p
            style={{
              fontSize: 19,
              fontStyle: 'italic',
              textAlign: 'center',
              fontWeight: 600,
              lineHeight: 1.5,
              marginBottom: 22,
            }}
          >
            {q.q}
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
            {q.opts.map((opt, i) => {
              let bg = 'var(--surface-up)'
              let border = 'var(--border)'
              let color = 'var(--text)'
              if (selected !== null) {
                if (i === q.a) { bg = '#34d39922'; border = '#34d399'; color = '#34d399' }
                else if (i === selected && i !== q.a) { bg = '#fb718522'; border = '#fb7185'; color = '#fb7185' }
              }
              return (
                <button
                  key={i}
                  onClick={() => handleAnswer(i)}
                  disabled={selected !== null}
                  style={{
                    background: bg,
                    border: `1.5px solid ${border}`,
                    borderRadius: 10,
                    padding: '12px 16px',
                    textAlign: 'left',
                    color,
                    fontSize: 15,
                    cursor: selected !== null ? 'default' : 'pointer',
                    transition: 'all 0.2s',
                    fontWeight: i === selected || i === q.a ? 600 : 400,
                    fontFamily: 'inherit',
                    width: '100%',
                  }}
                >
                  {opt}
                </button>
              )
            })}
          </div>
        </div>
      </div>
    )
  }

  // ─── RESULT VIEW ──────────────────────────────────────────────────────────
  if (view === 'result' && activeLesson) {
    const { course, level } = activeLesson
    const quiz = course.quiz!
    const isPerfect = score === quiz.length
    const alreadyDone = completedCourses[course.id]

    return (
      <div style={{ maxWidth: 480, margin: '0 auto' }} className="animate-in">
        <div
          style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 20,
            padding: 32,
            textAlign: 'center',
          }}
        >
          <p style={{ fontSize: 52, marginBottom: 12 }}>{isPerfect ? '🏆' : '📚'}</p>
          <h2 style={{ fontWeight: 800, fontSize: 24, marginBottom: 8 }}>
            {score}/{quiz.length} correctas
          </h2>
          <p style={{ color: 'var(--muted)', fontSize: 15, marginBottom: 24, lineHeight: 1.5 }}>
            {isPerfect
              ? '¡Perfecto! Dominaste esta lección.'
              : score >= Math.ceil(quiz.length / 2)
                ? '¡Buen trabajo! Sigue practicando para perfeccionarlo.'
                : 'Repasa el material e inténtalo de nuevo. ¡Tú puedes!'}
          </p>

          {isPerfect && !alreadyDone && (
            <button
              onClick={markComplete}
              style={{
                background: 'var(--mint)',
                border: 'none',
                borderRadius: 12,
                padding: '13px 24px',
                color: '#fff',
                fontWeight: 700,
                fontSize: 15,
                cursor: 'pointer',
                width: '100%',
                marginBottom: 10,
                fontFamily: 'inherit',
              }}
            >
              ✓ Marcar como completada (+{course.xp} XP)
            </button>
          )}
          {alreadyDone && (
            <p style={{ color: 'var(--mint)', fontWeight: 700, marginBottom: 10 }}>
              ✓ Ya completada · +{course.xp} XP obtenidos
            </p>
          )}

          <div style={{ marginBottom: 20 }}>
            <span
              style={{
                background: level.color + '22',
                color: level.color,
                border: `1px solid ${level.color}44`,
                borderRadius: 20,
                padding: '4px 12px',
                fontSize: 12,
                fontWeight: 700,
              }}
            >
              {level.id} · {course.title}
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <button
              onClick={retry}
              style={{
                background: 'transparent',
                border: '1.5px solid var(--border)',
                borderRadius: 10,
                padding: '11px 0',
                color: 'var(--text)',
                fontWeight: 600,
                fontSize: 14,
                cursor: 'pointer',
                fontFamily: 'inherit',
              }}
            >
              Reintentar
            </button>
            <button
              onClick={goToList}
              style={{
                background: level.color,
                border: 'none',
                borderRadius: 10,
                padding: '11px 0',
                color: '#fff',
                fontWeight: 700,
                fontSize: 14,
                cursor: 'pointer',
                fontFamily: 'inherit',
              }}
            >
              Todas las lecciones
            </button>
          </div>
        </div>
      </div>
    )
  }

  return null
}
