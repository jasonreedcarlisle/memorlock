# Memaday - Daily Memory Challenge Game Plan

## Overview
Memaday is a daily memory challenge game based on MemoryDawg, where users solve one memory puzzle per day. Similar to NYT Wordle or Connections, all users playing on a given day (at the same difficulty level) receive the same puzzle. The game tracks user progress, streaks, and maintains an archive of past daily challenges. The game will be hosted at memaday.com, starting with a client-side implementation that will later migrate to a database-backed system.

## Core Features

### 1. Daily Challenge System
- **Game Numbering**: Games are numbered sequentially starting with #1 on January 19, 2025
- **Daily Reset**: New puzzle set generated each day at midnight in the user's local timezone
- **Three Games Per Day**: Three separate puzzles for Easy, Medium, and Hard difficulty levels (all use the same category/items, but different grid sizes and timing)
- **Deterministic Generation**: Same seed/algorithm ensures all users get identical puzzles for a given day + difficulty combination
- **Admin-Curated**: Puzzles are manually curated by an admin through a management interface (not randomly generated)

### 2. Home Screen & Difficulty Selection
- **Difficulty Selection**: Users select Easy, Medium, or Hard directly on the home screen (similar to NYT Pips game)
- **One Difficulty Per Day**: Once a user selects a difficulty level, they can only play that difficulty for that day. They cannot switch to another difficulty on the same day.
- **Resume Capability**: 
  - If a user starts a puzzle and doesn't finish, they can resume from where they left off if they return later the same day
  - Resume time limit: 23 hours and 59 minutes (same calendar day)
  - If calendar day changes before time limit expires, user can no longer resume
  - If user returns next day or later, puzzle resets and streaks are reset
  - Resume popup: Show "Resume" popup similar to NYT Pips game when user returns to in-progress game
- **Visual Indicators**: Show current day's game number, date, and whether user has completed today's challenge
- **Streak Display**: Show user's current streaks (attempt streak, win streak, longest streak)
- **How to Play Link**: Add a "How to Play" link on the home page with instructions modified for Memaday

### 3. Game Mechanics (Based on MemoryDawg)
- **Memory Tile Matching**: Same core gameplay as MemoryDawg
  - Tiles revealed sequentially
  - Memorization phase
  - Matching phase with multiple rounds
  - Scoring system
- **Difficulty Differences**:
  - Easy: 12 tiles (3x4 grid), longer reveal time, "Show All" option
  - Medium: 16 tiles (4x4 grid), medium reveal time, "Show All" option
  - Hard: 16 tiles (4x4 grid), shorter reveal time, no "Show All" option

### 4. User Tracking & Persistence
- **User Identification**: 
  - **Version 1**: All users are anonymous with generated unique user IDs (stored in localStorage)
  - **Future Version**: Support for email-based login/persistent IDs (architecture designed to support this migration)
  - Anonymous users can play daily games but cannot access archive
- **Progress Tracking**:
  - **Attempt Streak**: Number of consecutive days with a completed game played (resets if user misses a day, no grace period)
  - **Win Streak**: Number of consecutive days with a correctly solved game (resets if user misses a day or loses)
  - **Longest Streak**: Track the user's longest attempt streak in the past
  - **Win Percentage**: Number of games with a correct solve divided by total games played (including unfinished games)
  - **Average Time to Complete**: For all correctly solved puzzles, the average time it took to complete
  - Completion status for each day's challenges
  - Round-by-round performance (for future comparison metrics)
- **Timer Tracking**:
  - Timer starts when viewing/memorization phase begins (Option B)
  - Timer ends when user solves the puzzle correctly
  - Count total time from start to finish
  - **Exclude inactive time**: When browser tab is hidden/inactive, timer pauses
  - Overall timer displayed showing total time spent across all rounds
- **Storage**: All data stored in localStorage (client-side only for v1, but structured to support future database migration)

### 5. Daily Puzzle Generation & Storage
- **Puzzle Storage Format**: 
  - Puzzles stored in JSON file (e.g., `puzzles.json`)
  - Pre-generate first 30 days of puzzles (puzzle #1 through #30, starting January 19, 2025)
  - App automatically handles puzzle loading - no manual daily updates required
- **Admin-Curated System**: 
  - Puzzles are manually curated by an admin through a management interface
  - All three difficulty levels (Easy, Medium, Hard) use the same category and items
  - Differences between difficulties: grid size (Easy: 12 tiles, Medium/Hard: 16 tiles) and reveal timing
  - Puzzle data stored in a format that can be loaded deterministically for a given day number
- **Auto-Generation**: 
  - If admin has not added a puzzle for a given day, system automatically generates one
  - Auto-generation uses examples from MemoryDawg game
  - Auto-generation avoids using the same set of items from any puzzles over the past 10 days
- **Puzzle Validation**:
  - Every puzzle must have exactly 16 answers mapped to positions 1-16
  - Easy puzzles use positions 1-12
  - Medium & Hard puzzles use positions 1-16
  - Each number maps to a specific tile location (same for all players)
  - Show error message if puzzle data is missing or invalid
- **Admin Interface** (Minimum Viable):
  - Allow admin to see the answers associated with different tiles for every day
  - Allow admin to update puzzle answers
  - Admin interface location: TBD (separate from game code, best practice to be determined)

### 6. Archive System
- **Access Requirements**: 
  - Only users with email-based accounts can access the archive
  - Anonymous users must convert to an email account to access archive
  - For v1: Archive feature will be prepared but may be disabled until login system is implemented
- **Archive Limits**: 
  - Users can access games up to 90 days in the past
  - Cannot access games before puzzle #1 (January 19, 2025)
  - For new users: Can play back up to 90 days from their first play date (but not before puzzle #1)
- **Archive Display**: List of past games with:
  - Game number
  - Date
  - User's completion status
  - User's score (if completed)
- **Replay Rules**: 
  - Users can replay any archived game, including ones they've already completed
  - Archive games give credit for trying and completing, but do NOT repair streaks
  - Archive completions tracked separately from daily challenge completions

### 7. Win/Completion Tracking & Resume State
- **Win Condition**: Solving the puzzle in any round at any difficulty level (no minimum score required)
- **One Attempt Per Day**: Users get exactly one attempt per day. Once they select a difficulty, they can only play that difficulty for that day.
- **Resume State Saved**:
  - Current round number
  - All tiles correctly guessed in previous rounds (stay revealed)
  - Any tiles placed/selected in current round (exact state preserved)
  - Current score
  - Overall timer (total time spent across all rounds)
  - User resumes starting the current round exactly where they left off
- **Resume Behavior**:
  - If user is in viewing/memorization phase when they leave: Obscure the screen so they can't keep memorizing while timer is paused
  - If user is in matching phase: Show resume popup, resume from exact state
  - Resume popup similar to NYT Pips game (shows "Your game is paused", "Ready to keep playing?", "Resume" button)
- **Completion Tracking**: 
  - Mark as completed when user finishes a puzzle (win or loss)
  - Track whether it was a win or loss
  - Record score, round-by-round performance, and time to complete
  - Track which round the puzzle was solved in (for future comparison metrics)
- **Streak Logic**:
  - **Attempt Streak**: Increments if user completes a game on a given day, resets if user misses a day (no grace period)
  - **Win Streak**: Increments only on wins, resets on loss or missed day (no grace period)
  - **Longest Streak**: Track the highest attempt streak the user has ever achieved
- **Future Metrics**: In future versions, show average number of rounds it takes players to complete puzzles (similar to NYT Connections stats) so users can see how they compare

### 8. UI/UX Changes from MemoryDawg
- **Home Screen Redesign**:
  - Large difficulty selection buttons (Easy, Medium, Hard)
  - Display current game number and date
  - Show streak information (attempt streak, win streak, longest streak)
  - Show completion status for today's challenge (if user has already selected a difficulty)
  - Show in-progress indicator if user has started but not finished today's puzzle
  - "How to Play" link with Memaday-specific instructions
  - Archive link/button (only visible/accessible for logged-in users in future version)
- **Game Screen**:
  - Display current game number and date
  - Show which difficulty is being played
  - Show overall timer (total time spent across all rounds, excluding inactive time)
  - Remove "Play Again" option (replaced with "Back to Home")
  - Resume capability: If user returns same day, show resume popup
- **Resume Popup** (NYT Pips style):
  - Modal overlay with "Your game is paused" message
  - "Ready to keep playing?" text
  - "Resume" button (prominent, black, rounded)
  - Close button (X) in top right
  - If in viewing phase, obscure background so user can't see tiles
- **Settings Modal**:
  - Remove difficulty level selector (difficulty selected on home screen)
  - Keep background color picker
  - Remove category selection (admin-curated, not user-selectable)
- **Win/Completion Modal**:
  - Modify to show daily challenge completion
  - Display streak information
  - Show stats: attempt streak, win streak, win percentage, average time
  - Remove "Play Again" button, add "Back to Home"
  - Keep sharing functionality (same as MemoryDawg)
- **Stats Screen**:
  - **Attempt Streak**: Current consecutive days with completed game
  - **Win Streak**: Current consecutive days with correctly solved game
  - **Longest Streak**: Highest attempt streak ever achieved
  - **Win Percentage**: Games won / total games played (including unfinished)
  - **Average Time to Complete**: Average time for all correctly solved puzzles
  - Calendar view showing completion history (future enhancement)

### 9. Technical Implementation

#### File Structure
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

#### Key Components

**daily.js**:
- `getDayNumber(date)`: Calculate game number from date (Jan 19, 2025 = #1)
- `generateDailyPuzzle(dayNumber, difficulty)`: Deterministic puzzle generation
- `getUserProgress(userId)`: Retrieve user's progress
- `saveUserProgress(userId, progress)`: Save user's progress
- `checkCompletion(dayNumber, difficulty, userId)`: Check if user completed a challenge
- `updateStreaks(userId, dayNumber, difficulty, won)`: Update streak counters

**game.js** (modified):
- Remove random category selection, use daily puzzle instead
- Remove "Play Again" functionality
- Add "Back to Home" button
- Integrate with daily.js for puzzle loading
- Track completion and update user progress

**archive.js**:
- `getArchiveList()`: Get list of past games
- `loadArchiveGame(dayNumber, difficulty)`: Load a past game
- `getArchiveStats()`: Get statistics about archived games

#### Data Storage Structure (localStorage)

```javascript
{
  "memaday_userId": "uuid-string", // Anonymous ID for v1, will support email in future
  "memaday_progress": {
    "userId": "uuid-string",
    "attemptStreak": 5, // Consecutive days with completed game
    "winStreak": 4, // Consecutive days with correctly solved game
    "longestStreak": 7, // Highest attempt streak ever achieved
    "lastPlayedDate": "2025-01-23", // ISO date string
    "lastPlayedDifficulty": "medium", // Which difficulty was played today
    "totalGamesPlayed": 15, // Total games attempted (including unfinished)
    "totalGamesWon": 12, // Total games won
    "winPercentage": 0.80, // totalGamesWon / totalGamesPlayed
    "totalTimeSpent": 45000, // Total time in seconds for all won games (active time only)
    "averageTimeToComplete": 3750, // Average time in seconds (totalTimeSpent / totalGamesWon)
    "completions": {
      "1": { // day number
        "difficulty": "medium", // Which difficulty was played
        "completed": true,
        "won": true,
        "score": 1000,
        "roundsCompleted": 3, // Which round it was solved in
        "timeToComplete": 4200, // Time in seconds (active time only)
        "date": "2025-01-19",
        "startedAt": "2025-01-19T10:30:00Z", // Timestamp when viewing phase started
        "completedAt": "2025-01-19T10:37:00Z" // Timestamp when puzzle solved
      },
      "2": { ... }
    },
    "inProgress": { // Current day's in-progress game (if exists)
      "dayNumber": 5,
      "difficulty": "hard",
      "date": "2025-01-23",
      "startedAt": "2025-01-23T14:00:00Z",
      "currentRound": 2,
      "score": 500,
      "correctTiles": [0, 1, 2, 3], // Tile indices that are correctly matched
      "currentRoundMatches": { // Current round's selections
        "targetItem": "Apple",
        "selectedTile": 5
      },
      "overallTimer": 180, // Total active time in seconds
      "phase": "matching" // "viewing" or "matching"
    },
    "archiveCompletions": { // Separate tracking for archive games
      "1": {
        "difficulty": "easy",
        "completed": true,
        "won": true,
        "score": 1200,
        "date": "2025-01-19",
        "playedAt": "2025-01-25T14:00:00Z" // When archive game was played
      }
    }
  }
}
```

### 10. Puzzle Generation & Storage

**Puzzle Data Structure**:
```javascript
{
  "dayNumber": 1,
  "date": "2025-01-19",
  "category": "Fruits", // or category index
  "answers": {
    "1": "Apple",    // Position 1-16, each maps to specific tile location
    "2": "Banana",   // Easy uses 1-12, Medium/Hard use 1-16
    "3": "Orange",
    ...
    "16": "Watermelon"
  },
  "difficulties": {
    "easy": {
      "numTiles": 12,
      "revealTime": 90, // seconds
      "positions": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] // Which positions to use
    },
    "medium": {
      "numTiles": 16,
      "revealTime": 60, // seconds
      "positions": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]
    },
    "hard": {
      "numTiles": 16,
      "revealTime": 45, // seconds
      "positions": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]
    }
  }
}
```

**Puzzle Loading**:
```javascript
function loadDailyPuzzle(dayNumber, difficulty) {
  // Load puzzle data for the given day number
  const puzzle = getPuzzleData(dayNumber);
  
  if (!puzzle) {
    // Auto-generate if missing
    puzzle = autoGeneratePuzzle(dayNumber);
  }
  
  // Validate puzzle has 16 answers mapped 1-16
  validatePuzzle(puzzle);
  
  // Get items for this difficulty (Easy: positions 1-12, Medium/Hard: positions 1-16)
  const positions = puzzle.difficulties[difficulty].positions;
  const items = positions.map(pos => puzzle.answers[pos.toString()]);
  
  // Items are placed in specific tile locations (same for all players)
  // No shuffling - each position maps to a specific tile location
  
  return {
    dayNumber: puzzle.dayNumber,
    date: puzzle.date,
    category: puzzle.category,
    difficulty: difficulty,
    items: items, // In order of positions (not shuffled)
    positions: positions, // Which positions are used
    revealTime: puzzle.difficulties[difficulty].revealTime,
    tileMapping: createTileMapping(positions) // Map position to tile index
  };
}

function autoGeneratePuzzle(dayNumber) {
  // Auto-generate using MemoryDawg examples
  // Avoid using same items from past 10 days
  const recentItems = getRecentItems(dayNumber - 10, dayNumber - 1);
  return generatePuzzleAvoidingItems(dayNumber, recentItems);
}

function validatePuzzle(puzzle) {
  // Validate exactly 16 answers mapped 1-16
  if (!puzzle.answers || Object.keys(puzzle.answers).length !== 16) {
    throw new Error("Puzzle must have exactly 16 answers mapped 1-16");
  }
  for (let i = 1; i <= 16; i++) {
    if (!puzzle.answers[i.toString()]) {
      throw new Error(`Puzzle missing answer for position ${i}`);
    }
  }
}
```

**Tile Location Mapping**:
- Each position (1-16) maps to a specific tile location on the grid
- Easy: Positions 1-12 map to tiles 0-11 (in order: top-left to bottom-right)
- Medium/Hard: Positions 1-16 map to tiles 0-15 (in order: top-left to bottom-right)
- All players see the same item in the same tile location for a given day + difficulty

### 11. Timezone & Date Handling
- **Timezone**: User's local timezone determines day boundaries
- **Timezone Changes**: Only impact when the calendar day begins (no special handling needed beyond normal day detection)
- **Date Rollover**: Handle midnight transitions gracefully
- **Active Play at Midnight**:
  - If user is actively playing as clock strikes midnight, allow them to finish their current game
  - Game counts toward the previous day's puzzle (when puzzle was started)
  - All tiles remain from previous day until user refreshes or pauses
  - If user refreshes or pauses after midnight, they are taken back to home screen for current day's puzzle
- **Return After Days**:
  - If user returns days later (e.g., started Day 5, returns on Day 7), game automatically detects it's a new day and resets
  - Previous day's attempt (Day 5) is marked as incomplete, breaking streaks
- **Day Calculation**: Calculate day number based on user's local date
  - January 19, 2025 = Day #1
  - Each subsequent day increments the day number
  - Use ISO date strings for consistency

### 12. Edge Cases & Special Scenarios
- **First-time users**: Generate anonymous user ID, initialize progress with empty stats
- **Users playing past games**: Archive games tracked separately, don't count toward streaks
- **Users playing same game multiple times**: Only first completion of daily challenge counts
- **Resume same day**: 
  - If user starts puzzle and returns same day (within 23:59 limit), allow resume from saved state
  - Show resume popup (NYT Pips style) when returning to in-progress game
  - If in viewing phase, obscure screen during pause
- **Resume next day**: 
  - If user returns next day or later, puzzle resets and streaks reset if they missed the day
  - Previous day's attempt marked as incomplete (breaking streaks)
- **Difficulty selection**: Once difficulty is selected for the day, lock it in (cannot change)
- **Archive access**: Only for logged-in users (future version), 90-day limit, can replay any archived game
- **Missing puzzle data**: Show error message if puzzle data is missing or invalid
- **Tab visibility**: Timer pauses when browser tab is hidden/inactive, resumes when visible

### 13. Future Enhancements (Not in v1)
- Email-based login system
- Archive access for logged-in users
- Comparison metrics (how user stacks up vs. other players)
- Average rounds to complete (shown to users)
- Admin interface for puzzle curation
- Database backend migration
- Calendar view of completion history
- Leaderboards and social features

## Implementation Notes

### Version 1 Scope
- Anonymous users only
- Client-side storage (localStorage)
- Daily challenge gameplay
- Streak tracking (attempt, win, longest)
- Basic stats (win percentage, average time)
- Archive system prepared but may be disabled until login is implemented
- Same visual design as MemoryDawg with modified Settings and completion modal

### Future Version Scope
- Email-based authentication
- Archive access for logged-in users
- Admin puzzle management interface
- Database backend
- Comparison metrics and leaderboards
- Enhanced statistics and analytics

