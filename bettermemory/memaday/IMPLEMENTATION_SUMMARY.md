# Memaday Implementation Summary

This document memorializes all decisions, answers, and the final implementation plan for Memaday.

## Original Requirements Summary

- Daily challenge game based on MemoryDawg
- One puzzle per day per difficulty (Easy, Medium, Hard)
- Same puzzle for all users on a given day + difficulty
- Game numbering starts #1 on January 19, 2025
- Track user streaks (attempt streak, win streak, longest streak)
- Archive system for past games (90-day limit)
- Difficulty selection on home screen (like NYT Pips)
- Visual design same as MemoryDawg with modifications

## Answers to Initial Questions

### 1. Timezone & Day Boundaries
**Answer**: User's local timezone determines when a "day" changes. Each user's day changes at their local midnight.

### 2. Streak Reset Logic
**Answer**: 
- Streaks reset if user misses a day (no grace period)
- Track longest streak in the past (highest attempt streak ever achieved)
- Attempt streak: resets if user misses a day
- Win streak: resets on loss or missed day

### 3. Multiple Attempts Per Day
**Answer**: 
- One attempt per day per difficulty
- Once user selects a difficulty, they can only play that difficulty for that day
- Cannot switch to another difficulty on the same day

### 4. Archive Access & Replay Rules
**Answer**: 
- Only users with email addresses (logged in) can access archive
- Anonymous users can play daily game but need email account for archive
- Users can replay any archived game (including ones already completed)
- Archive games give credit but do NOT repair streaks
- 90-day limit on archive access (but not before puzzle #1)

### 5. User Identification & Data Persistence
**Answer**: 
- Version 1: All users anonymous with generated UUIDs (localStorage)
- Architecture designed to support future email-based login
- Data structure ready for database migration

### 6. Scoring & Win Conditions
**Answer**: 
- Win = solving puzzle in any round at any difficulty (no minimum score)
- Future: Show average rounds to complete (comparison metrics)

### 7. Difficulty Selection & Switching
**Answer**: 
- Cannot play multiple difficulties on same day
- If user starts and doesn't finish, can resume same day at same difficulty
- If user returns next day, puzzle resets and streaks reset

### 8. Puzzle Category Selection
**Answer**: 
- Option C: Admin-curated puzzles
- All three difficulty levels use same category/items
- Admin interface to manage puzzles

### 9. Sharing & Social Features
**Answer**: 
- Same sharing options as MemoryDawg (for now)

### 10. Future Backend Considerations
**Answer**: 
- Yes, plan for memaday.com
- Client-side only in v1, but structure for database migration
- Architecture supports future backend

### 11. First Day Experience
**Answer**: 
- Users can play back up to 90 days (but only to puzzle #1)
- Add "How to Play" link on home page

### 12. Visual Design
**Answer**: 
- Same visual design as MemoryDawg
- Modify Settings (remove difficulty selector)
- Modify completion modal

### 13. Statistics & Analytics
**Answer**: 
- **A) Attempt Streak**: Consecutive days with completed game
- **B) Win Streak**: Consecutive days with correctly solved game
- **C) Win Percentage**: Games won / total games played (including unfinished)
- **D) Average Time to Complete**: Average time for all correctly solved puzzles
- **E) Future**: Comparison metrics (how user stacks up vs. other players)

## Answers to Follow-Up Questions

### 1. Puzzle Storage & Loading
**Answer**: 
- Store puzzles in JSON file (`puzzles.json`)
- Pre-generate first 30 days of puzzles (puzzle #1 through #30)
- App automatically handles puzzle loading (no manual daily updates)
- If admin hasn't added puzzle, system auto-generates one
- Auto-generation uses MemoryDawg examples
- Auto-generation avoids using same items from past 10 days

### 2. Resume Functionality - What Gets Saved
**Answer**: 
- **Save**: Current round, all correctly guessed tiles from previous rounds, any tiles placed in current round, current score, overall timer
- **Resume**: User starts current round exactly where they left off
- **Resume Popup**: Similar to NYT Pips game ("Your game is paused", "Ready to keep playing?", "Resume" button)
- **Viewing Phase**: If user is in viewing/memorization phase, obscure screen so they can't keep memorizing while paused
- **Time Limit**: 23 hours and 59 minutes (same calendar day)
- **Day Change**: If calendar day changes, user can no longer resume

### 3. Time Tracking - When Does Timer Start
**Answer**: 
- **Option B**: Timer starts when viewing/memorization phase begins
- Timer ends when user solves puzzle correctly
- Count total time from start to finish
- **Exclude inactive time**: When browser tab is hidden/inactive, timer pauses
- Overall timer shows total time spent across all rounds

### 4. Day Transition & Auto-Reset Behavior
**Answer**: 
- **Scenario A (Active at Midnight)**: 
  - Allow user to finish current game if actively playing at midnight
  - Game counts toward previous day's puzzle (when puzzle was started)
  - All tiles remain from previous day until user refreshes or pauses
  - If user refreshes/pauses after midnight, taken to home screen for current day
- **Scenario B (Return Days Later)**: 
  - Automatically detect it's a new day and reset
  - Previous day's attempt marked as incomplete (breaking streaks)
- **Timezone Changes**: Only impact when calendar day begins (no special handling)

### 5. Admin Interface & Puzzle Management
**Answer**: 
- Option A is fine if app can make changes itself (no manual updates required)
- Admin interface should allow admin to:
  - See answers associated with different tiles for every day
  - Update puzzle answers
- If admin hasn't added puzzle, system auto-generates one
- Auto-generation avoids using same items from past 10 days
- Admin interface location: TBD (best practice to be determined)

### Bonus: Puzzle Data Validation
**Answer**: 
- Validate every puzzle has exactly 16 answers mapped 1-16
- Easy puzzles use positions 1-12
- Medium & Hard puzzles use positions 1-16
- Every number maps to specific tile location (same for all players)
- Show error message if puzzle data is missing or invalid
- No category validation needed

## Key Implementation Details

### Puzzle Structure
- **16 answers mapped 1-16**: Each position maps to specific tile location
- **Easy**: Uses positions 1-12
- **Medium/Hard**: Uses positions 1-16
- **No shuffling**: Items placed in specific tile locations (same for all players)
- **Deterministic**: Same day + difficulty = same puzzle for all users

### Resume State
- Current round number
- All correctly guessed tiles from previous rounds
- Any tiles placed/selected in current round
- Current score
- Overall timer (total active time)
- Phase (viewing or matching)

### Timer Behavior
- Starts: When viewing/memorization phase begins
- Ends: When puzzle solved correctly
- Pauses: When browser tab is hidden/inactive
- Resumes: When browser tab becomes visible/active
- Tracks: Total active time across all rounds

### Day Transition Rules
- **Active at midnight**: Finish current game, counts toward previous day
- **Refresh/pause after midnight**: Go to current day's puzzle
- **Return days later**: Auto-detect new day, reset, mark previous incomplete
- **Resume limit**: 23:59 same calendar day

### Statistics Tracked
1. **Attempt Streak**: Consecutive days with completed game
2. **Win Streak**: Consecutive days with correctly solved game
3. **Longest Streak**: Highest attempt streak ever achieved
4. **Win Percentage**: Games won / total games played (including unfinished)
5. **Average Time to Complete**: Average time for all correctly solved puzzles

### File Structure
```
memaday/
├── index.html          # Main HTML (home screen + game screen)
├── game.js            # Game logic (modified from MemoryDawg)
├── daily.js           # Daily puzzle generation & user tracking
├── archive.js         # Archive management
├── puzzles.json       # Pre-generated puzzles (first 30 days)
├── style.css          # Styling (adapted from MemoryDawg)
├── index.js           # Server (if needed, or static hosting)
├── package.json
└── images/            # Same image assets as MemoryDawg
```

## Version 1 Scope

### Included
- Anonymous users only
- Client-side storage (localStorage)
- Daily challenge gameplay
- Streak tracking (attempt, win, longest)
- Basic stats (win percentage, average time)
- Resume functionality
- Pre-generated first 30 days of puzzles
- Auto-generation for missing puzzles
- Same visual design as MemoryDawg (with modifications)

### Excluded (Future Versions)
- Email-based authentication
- Archive access (prepared but disabled until login)
- Admin interface (basic structure ready)
- Database backend
- Comparison metrics
- Calendar view
- Leaderboards

## Ready to Build

All questions answered, plan finalized. Ready to begin implementation.

