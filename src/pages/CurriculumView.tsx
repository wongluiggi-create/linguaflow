import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppStore } from '../store/useAppStore'
import { XPBar } from '../components/ui/XPBar'
import { CURRICULUM } from '../data/curriculum'

const TYPE_ICONS: Record<string, string> = {
  grammar:      '✏️',
  vocabulary:   '📖',
  speaking:     '🗣️',
  listening:    '🎧',
  reading:      '📰',
  writing:      '✍️',
  pronunciation:'🔤',
  practical:    '🛠️',
  professional: '💼',
  mixed:        '🔀',
  exam:         '📋',
}

export default function CurriculumView() {
  const navigate = useNavigate()
  const { currentLevel, completedCourses, setLaunchCourse } = useAppStore()
  const [expandedLevel, setExpandedLevel] = useState<string>(currentLevel)

  return (
    <div style={{ maxWidth: 480, margin: '0 auto' }} className="animate-in">
      <h2 style={{ fontWeight: 800, fontSize: 22, marginBottom: 20 }}>📚 Currículo Completo</h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {CURRICULUM.map((level) => {
          const totalCourses = level.courses.length
          const completedCount = level.courses.filter((c) => completedCourses[c.id]).length
          const isExpanded = expandedLevel === level.id
          const isActive = currentLevel === level.id

          return (
            <div
              key={level.id}
              style={{
                borderRadius: 14,
                overflow: 'hidden',
                border: `1.5px solid ${isActive ? level.color + '88' : isExpanded ? level.color + '44' : 'var(--border)'}`,
                background: 'var(--surface)',
              }}
            >
              {/* Level header — click to toggle */}
              <button
                onClick={() => setExpandedLevel(isExpanded ? '' : level.id)}
                style={{
                  width: '100%',
                  background: isActive ? level.color + '12' : 'transparent',
                  border: 'none',
                  padding: '14px 16px',
                  cursor: 'pointer',
                  textAlign: 'left',
                  color: 'var(--text)',
                  fontFamily: 'inherit',
                }}
              >
                {/* Row 1: icon + name + pill + hours + arrow */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    marginBottom: 10,
                  }}
                >
                  <span style={{ fontSize: 18 }}>{level.icon}</span>
                  <span style={{ fontWeight: 700, fontSize: 15 }}>{level.label}</span>

                  {isActive && (
                    <span
                      style={{
                        background: level.color + '22',
                        color: level.color,
                        border: `1px solid ${level.color}44`,
                        borderRadius: 20,
                        padding: '1px 8px',
                        fontSize: 11,
                        fontWeight: 700,
                      }}
                    >
                      Actual
                    </span>
                  )}

                  <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ color: 'var(--muted)', fontSize: 12 }}>
                      {level.hours}h · {completedCount}/{totalCourses}
                    </span>
                    <span
                      style={{
                        color: 'var(--muted)',
                        fontSize: 16,
                        display: 'inline-block',
                        transform: isExpanded ? 'rotate(90deg)' : 'none',
                        transition: 'transform 0.2s',
                      }}
                    >
                      ›
                    </span>
                  </div>
                </div>

                {/* XPBar */}
                <XPBar value={completedCount} max={Math.max(totalCourses, 1)} color={level.color} />
              </button>

              {/* Course list */}
              {isExpanded && (
                <div style={{ borderTop: '1px solid var(--border)' }}>
                  {level.courses.map((course, idx) => {
                    const done = !!completedCourses[course.id]
                    const hasQuiz = !!(course.quiz && course.quiz.length > 0)

                    return (
                      <button
                        key={course.id}
                        onClick={() => {
                          if (hasQuiz) {
                            setLaunchCourse(course.id)
                            navigate('/app/grammar')
                          }
                        }}
                        style={{
                          width: '100%',
                          background: 'none',
                          border: 'none',
                          borderBottom:
                            idx < level.courses.length - 1 ? '1px solid var(--border)' : 'none',
                          padding: '11px 16px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 10,
                          cursor: hasQuiz ? 'pointer' : 'default',
                          color: 'var(--text)',
                          textAlign: 'left',
                          fontFamily: 'inherit',
                          transition: 'background 0.12s',
                        }}
                        onMouseEnter={(e) => {
                          if (hasQuiz)
                            (e.currentTarget as HTMLButtonElement).style.background =
                              'var(--surface-up)'
                        }}
                        onMouseLeave={(e) => {
                          ;(e.currentTarget as HTMLButtonElement).style.background = 'none'
                        }}
                      >
                        {/* Type icon */}
                        <span
                          style={{
                            fontSize: 15,
                            minWidth: 20,
                            textAlign: 'center',
                            opacity: done ? 0.45 : 1,
                          }}
                        >
                          {TYPE_ICONS[course.type] ?? '📝'}
                        </span>

                        {/* Title + quiz badge */}
                        <div style={{ flex: 1 }}>
                          <span
                            style={{
                              fontSize: 14,
                              fontWeight: done ? 400 : 500,
                              color: done ? 'var(--muted)' : 'var(--text)',
                              textDecoration: done ? 'line-through' : 'none',
                            }}
                          >
                            {course.title}
                          </span>
                          {hasQuiz && (
                            <span
                              style={{
                                color: level.color,
                                fontSize: 11,
                                fontWeight: 600,
                                marginLeft: 6,
                              }}
                            >
                              ● Quiz
                            </span>
                          )}
                        </div>

                        {/* Circular checkmark */}
                        <div
                          style={{
                            width: 22,
                            height: 22,
                            borderRadius: '50%',
                            background: done ? '#34d39933' : 'var(--faint)',
                            border: `1.5px solid ${done ? '#34d399' : 'var(--border)'}`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                            fontSize: 12,
                            color: '#34d399',
                          }}
                        >
                          {done ? '✓' : ''}
                        </div>
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
