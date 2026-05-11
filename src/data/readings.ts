import type { ReadingArticle } from '../types'

export const READINGS: ReadingArticle[] = [
  {
    level: 'A2',
    title: 'A Day in the City',
    topic: 'Daily Life',
    readTime: '2 min',
    content:
      'Maria wakes up at 7 o\'clock every morning. She lives in a small apartment in the city centre. First, she has breakfast — usually coffee and toast. Then she takes the bus to work.\n\nMaria works at a bookshop near the main square. She loves her job because she can read books during her lunch break. Her colleagues are friendly and the customers are interesting.\n\nAfter work, Maria sometimes goes to the gym or meets friends for dinner. She usually gets home by 9 o\'clock and watches television before sleeping.',
    questions: [
      {
        q: 'What time does Maria wake up?',
        opts: ["6 o'clock", "7 o'clock", "8 o'clock", "9 o'clock"],
        a: 1,
      },
      {
        q: 'Where does Maria work?',
        opts: ['A café', 'A gym', 'A bookshop', 'A school'],
        a: 2,
      },
      {
        q: 'What does she do during lunch?',
        opts: ['Goes to the gym', 'Reads books', 'Watches TV', 'Cooks'],
        a: 1,
      },
    ],
    vocab: ['apartment', 'colleagues', 'customers', 'centre', 'usually'],
  },
  {
    level: 'B1',
    title: 'The Psychology of Habits',
    topic: 'Science & Psychology',
    readTime: '3 min',
    content:
      'Scientists have discovered that nearly 40% of our daily actions are habits rather than conscious decisions. A habit is formed through a three-step loop: a cue, a routine, and a reward. Understanding this loop is the key to changing behaviour.\n\nThe cue is a trigger that tells your brain to begin an automatic routine. This could be a time of day, an emotional state, or a specific location. Once the routine is completed, your brain receives a reward — a positive feeling that reinforces the behaviour.\n\nTo build a new habit, experts recommend starting very small. Instead of running five kilometres immediately, begin with just five minutes. The consistency matters more than the intensity. Over time, the brain begins to crave the reward, and the behaviour becomes automatic.',
    questions: [
      {
        q: 'What percentage of daily actions are habits?',
        opts: ['25%', '40%', '60%', '80%'],
        a: 1,
      },
      {
        q: 'What are the three steps of a habit loop?',
        opts: [
          'Think, act, reflect',
          'Cue, routine, reward',
          'Start, continue, stop',
          'Plan, do, review',
        ],
        a: 1,
      },
      {
        q: 'What do experts recommend when building a habit?',
        opts: [
          'Start big and intense',
          'Work with others',
          'Start very small',
          'Reward yourself with food',
        ],
        a: 2,
      },
    ],
    vocab: ['conscious', 'behaviour', 'trigger', 'consistency', 'reinforce'],
  },
  {
    level: 'B2',
    title: 'The Future of Remote Work',
    topic: 'Business & Technology',
    readTime: '4 min',
    content:
      'The pandemic permanently altered the relationship between employers and employees. What began as a temporary necessity rapidly evolved into a fundamental renegotiation of where, when, and how people work. Studies suggest that over 70% of knowledge workers now prefer some form of hybrid arrangement.\n\nHowever, the transition has not been without friction. Managers struggle with questions of oversight, collaboration, and company culture. Junior employees, meanwhile, report feeling disconnected from mentors and career advancement opportunities that once arose naturally through proximity.\n\nThe most successful organisations have responded by redesigning their offices as collaboration hubs rather than individual workstations. They measure performance by output, not presence. This shift demands a new kind of leadership — one built on trust, clarity of expectations, and genuine investment in employee wellbeing.',
    questions: [
      {
        q: 'What do 70% of knowledge workers prefer?',
        opts: [
          'Full remote work',
          'A hybrid arrangement',
          'Full office work',
          'Four-day weeks',
        ],
        a: 1,
      },
      {
        q: 'What do junior employees report?',
        opts: [
          'Higher salaries',
          'Better balance',
          'Feeling disconnected',
          'More responsibilities',
        ],
        a: 2,
      },
      {
        q: 'How are successful organisations redesigning offices?',
        opts: [
          'Making them smaller',
          'As collaboration hubs',
          'Eliminating them entirely',
          'Adding more desks',
        ],
        a: 1,
      },
    ],
    vocab: ['hybrid', 'oversight', 'proximity', 'collaboration', 'wellbeing'],
  },
]
