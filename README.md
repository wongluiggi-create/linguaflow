# 🌍 LinguaFlow

Plataforma completa para aprender inglés de A1 a C1, construida con React + Vite + TypeScript + Firebase.

## Stack
- React 18 + TypeScript
- Vite (bundler)
- React Router v6
- Zustand (estado global)
- Firebase (Auth + Firestore)
- Web Speech API (listening + speaking)
- Claude API (AI Tutor + Speaking feedback)

## Setup

1. Clona el repositorio
2. `npm install`
3. Copia `.env.example` a `.env.local` y completa las variables:

```env
# Firebase
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=

# Anthropic
VITE_ANTHROPIC_API_KEY=
```

### Firebase Setup
1. Crea un proyecto en https://console.firebase.google.com
2. Activa Authentication → Google provider
3. Activa Firestore Database en modo producción
4. Copia las credenciales del proyecto web a .env.local
5. Despliega las reglas de Firestore: `firebase deploy --only firestore:rules`

### Claude API
1. Obtén tu API key en https://console.anthropic.com
2. Añádela como `VITE_ANTHROPIC_API_KEY` en .env.local

## Desarrollo
```
npm run dev
```

## Build
```
npm run build
```

## Módulos incluidos
- 🎯 Test de Nivel (A1–C1)
- 📖 Vocabulario (flashcards con spaced repetition)
- ✏️ Gramática (quizzes del currículo A1–C1)
- 🎧 Listening (dictado con Web Speech API)
- 📰 Reading (textos con comprensión)
- 🗣️ Speaking (reconocimiento de voz + feedback de IA)
- 🤖 AI Tutor (conversación adaptativa con Claude)
- 📚 Currículo completo (7 niveles, 80+ cursos)

## Currículo
Basado en una estructura oficial de inglés con 7 niveles:

A1 (19h) → A2 (19h) → B1 (28h) → B2 (21h) → C1 (15h) + Inglés Específico (14h) + Inglés de Negocios (9h)
