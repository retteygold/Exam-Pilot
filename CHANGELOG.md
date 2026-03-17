# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

### Added
- Kids dashboard for younger students (LKG–Grade 8).
- Kids accounts saved in Firebase Firestore (profiles + sessions + achievements).
- Kids login options (Firebase Auth)
  - Name + 4-digit code
  - Email + password
  - Google sign-in
- Expanded profile setup to include LKG/UKG and Grades 1–12.
- Expanded exam/subject selection list to include:
  - LKG/UKG foundation items.
  - Primary subjects.
  - Lower Secondary subjects.
- New kids games: Quiz Race, Speed Challenge, Knowledge Battle.
- Reward popup system with confetti for achievements and wins.
- Sound effects system for kids games (correct/wrong/win/level-up).
- Kids leaderboards
  - Per-game leaderboard
  - Overall leaderboard (all games combined)
  - Grade topper (top 1 per grade)
- Kids country selection (country + flag) with searchable picker

### Fixed
- Setup page scrolling and bottom button visibility.
- Admin page TypeScript build issues.
- KidsDashboard TypeScript unused variable build errors.
- Kids games: integrated rewards + sounds across existing games.
- Kids signup error messaging (name-taken vs permissions/setup failures)

## [2026-03-15]

### Added
- `extract.md` documentation explaining extraction + Supabase upload pipeline.

### Added (Extraction Data)
- O-Level Physics 0625 extraction (2020–2025): 197 papers (3 batches), 3,940 MCQs.

### Notes
- Supabase upload JSON files regenerated after extraction updates.
