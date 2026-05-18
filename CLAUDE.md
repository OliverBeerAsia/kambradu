# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Kambradu** is a Progressive Web App (PWA) designed to help learners of endangered languages document their learning journey and build language proficiency. The initial focus is on Kristang (Malacca Creole Portuguese), with the vision to expand to other Malaysian endangered languages.

### Mission
Making it easier to learn endangered languages by providing tools for self-directed learning, progress tracking, and community connection - especially for languages that lack traditional learning resources, native speakers nearby, or cultural assets like films and books.

### Core Philosophy
- **Bottom-Up Learning**: Empowering individual learners to document vocabulary, sentences, recipes, songs, and cultural knowledge
- **Emotional Connection**: Learning is emotionally satisfying when you document your heritage
- **Accessibility**: PWA approach ensures access across devices and socio-economic situations
- **Gentle UX**: Friendly, encouraging interface appealing to all ages

## Technology Stack

- **Frontend**: React with Next.js (PWA configuration)
- **Backend/Database**: Firebase/Firestore
- **Authentication**: Firebase Auth
- **Storage**: Firebase Storage (for audio recordings, images)
- **Offline Support**: Service Workers + IndexedDB/Firestore offline persistence

## Project Structure

```
kambradu/
├── public/               # Static assets, PWA manifest, icons
├── src/
│   ├── app/             # Next.js 13+ app directory
│   │   ├── (auth)/      # Authentication routes
│   │   ├── journal/     # Journal/notes feature
│   │   ├── lexicon/     # Lexicon builder feature
│   │   ├── learn/       # Learning structure/schedule
│   │   └── layout.tsx   # Root layout with PWA setup
│   ├── components/      # Reusable React components
│   │   ├── journal/
│   │   ├── lexicon/
│   │   ├── learn/
│   │   └── ui/          # Base UI components
│   ├── lib/
│   │   ├── firebase/    # Firebase configuration and helpers
│   │   ├── hooks/       # Custom React hooks
│   │   └── utils/       # Utility functions
│   ├── types/           # TypeScript type definitions
│   └── styles/          # Global styles, Tailwind config
├── firebase.json        # Firebase configuration
├── next.config.js       # Next.js configuration (with PWA plugin)
└── package.json
```

## Development Commands

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint

# Type checking
npm run type-check

# Deploy to Firebase Hosting
npm run deploy
```

## MVP Features (Phase 1)

### 1. Journal/Notes
- Rich text editor for documenting words, phrases, recipes, songs, stories
- Markdown support for formatting
- Tag system for categorization (vocabulary, grammar, culture, recipes, etc.)
- Search and filter capabilities
- Timestamps and learning streak tracking

### 2. Lexicon Builder
- Personal mini-dictionary creation
- Fields per entry: Kristang word, English translation, pronunciation notes, example sentences, audio recording
- Categories/parts of speech tagging
- Search functionality
- Export to PDF or CSV for offline study

### 3. Learning Structure & Support
- Daily learning reminders (push notifications via PWA)
- Weekly goal setting
- Progress tracking dashboard
- Learning path suggestions based on language learning theory
- Calendar view of learning activity
- Achievement badges for milestones

## Key Technical Considerations

### PWA Requirements
- Manifest file with proper icons (192x192, 512x512)
- Service worker for offline functionality
- Installable on home screen
- Works offline with Firestore persistence
- Fast loading with Next.js optimization

### Firebase Setup
- Firestore collections:
  - `users/{userId}` - user profiles, settings, preferences
  - `journals/{userId}/entries/{entryId}` - journal entries
  - `lexicons/{userId}/words/{wordId}` - personal dictionary entries
  - `learningGoals/{userId}/goals/{goalId}` - goals and progress
  - `kristangResources/` - shared Kristang learning content (future)

### Authentication Flow
- Firebase Auth with email/password (keep it simple for MVP)
- Optional: Google Sign-In for easier onboarding
- User profile includes: display name, learning start date, language focus (Kristang for MVP)

### Offline-First Design
- All user-generated content (journal, lexicon) must work offline
- Sync when online using Firestore offline persistence
- Queue audio uploads for when connection is available
- Show sync status indicators in UI

## Language Learning Principles Embedded

Based on "Multi Track Attack" and "All Japanese All The Time" methodologies:
- **Immersion**: Encourage daily interaction with the language
- **Comprehensible Input**: Start with basic phrases, build progressively
- **Positive Reinforcement**: Gentle UX, celebration of progress, no punishment for breaks
- **Habit Formation**: Daily reminders, streak tracking, but flexible
- **Personalization**: Learner builds their own content library
- **Audio-First**: Recording and playback central to oral language traditions

## Kristang-Specific Context

- Kristang is a Portuguese-Malay creole spoken in Melaka, Malaysia
- Critically endangered with ~1000 speakers
- Primarily oral tradition, limited written resources
- Reference dictionary available (see `kristang dictionary.pdf`)
- Community-driven revitalization efforts ongoing
- Cultural connection through food, songs, family stories

## Future Expansion (Post-MVP)

### Phase 2: Top-Down Features
- Language courses (curated lessons with audio/video)
- Shared dictionaries and resources
- Subtitling tools for video content
- User-generated content sharing

### Phase 3: Social & Community
- Connect with other learners (Facebook/email integration)
- Share journal entries publicly (opt-in)
- Community challenges and group goals
- Elder speaker video repository

### Phase 4: Multi-Language
- Extend to other Malaysian endangered languages (Chitty Malay, Kanaq, Jakun, Ten'edn)
- Language switcher in settings
- Community admins can add new languages
- Shared infrastructure across all languages

## Design Principles

- **Encouraging**: Use warm colors, friendly micro-copy, positive reinforcement
- **Simple**: Avoid overwhelming users; progressive disclosure of features
- **Accessible**: Large touch targets, readable fonts, high contrast
- **Respectful**: Honor the cultural significance of language preservation
- **Intergenerational**: Design for both youth and elders

## Important Notes

- This is a passion project with deep cultural significance
- Performance matters: many users may have older devices or slower connections
- Privacy is paramount: user learning data is personal and sensitive
- Audio quality is important for oral language preservation
- The goal is language revitalization, not just an app - community impact is the measure of success

## Resources

- Vision document: `Kambradu (V1.2).pdf`
- Kristang reference: `kristang dictionary.pdf`
- Language learning methodology: Multi Track Attack (Barry Farber), AJATT (Khatzumoto)
