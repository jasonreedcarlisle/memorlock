# Follow-Up Questions for Memaday Implementation

## 1. Puzzle Storage & Loading (Admin-Curated System)
**Question**: How should admin-curated puzzles be stored and loaded in version 1?

- **Option A**: Store puzzles in a JSON file (e.g., `puzzles.json`) that gets loaded by the game
  - Pro: Simple, easy to update
  - Con: Requires file updates for each new day
- **Option B**: Hard-code initial puzzles in JavaScript, with a structure ready for future API/database
  - Pro: No file loading needed initially
  - Con: Less flexible, requires code updates
- **Option C**: Use a simple API endpoint that returns puzzle data (even if it's just serving a JSON file)
  - Pro: Ready for future database migration
  - Con: Requires server setup even for v1

**Also**: For v1, should we:
- Pre-generate puzzles for the first X days (e.g., first 30 days)?
- Or create a simple admin interface even in v1 to add puzzles?
- What format should puzzle data be in? (JSON structure details)

---

## 2. Resume Functionality - What Gets Saved?
**Question**: When a user starts a puzzle and doesn't finish, what exactly should be saved for resume capability?

- **Game State to Save**:
  - Current round number?
  - Which tiles have been matched/correctly identified?
  - Which tiles are still flipped/unmatched?
  - Time remaining (if applicable)?
  - Current score?
  - Target items remaining to find?
  
- **Resume Behavior**:
  - Should they resume exactly where they left off (same round, same tile states)?
  - Or should they restart the matching phase but keep their progress on correctly matched tiles?
  - What if they were in the viewing/memorization phase when they left?

**Also**: Should there be a time limit on resume? (e.g., if they come back 23 hours later, is it still the same day?)

---

## 3. Time Tracking - When Does the Timer Start?
**Question**: For the "average time to complete" statistic, when should the timer start counting?

- **Option A**: Timer starts when user clicks the difficulty button on home screen
- **Option B**: Timer starts when the game begins (after "Play" button, when viewing phase starts)
- **Option C**: Timer starts when user clicks "Start Round" (beginning of matching phase)
- **Option D**: Timer starts when first tile is revealed

**Also**: Should we track:
- Total time from start to finish?
- Or only time spent in the matching phase (excluding viewing/memorization time)?
- Should paused/inactive time be excluded? (e.g., if user leaves browser tab inactive for 10 minutes)

---

## 4. Day Transition & Auto-Reset Behavior
**Question**: What should happen when a user's day transitions (midnight in their timezone) while they have an in-progress game?

- **Scenario A**: User starts puzzle at 11:55 PM, plays until 12:05 AM (next day)
  - Should the puzzle automatically reset to the new day's puzzle?
  - Should they get a warning/notification that the day has changed?
  - Should their previous day's attempt be marked as incomplete/lost?

- **Scenario B**: User starts puzzle on Day 5, closes browser, returns on Day 7
  - Should the game automatically detect it's a new day and reset?
  - Should they see a message like "This puzzle was from 2 days ago. Starting today's puzzle instead"?
  - Should their Day 5 attempt be marked as incomplete (breaking streaks)?

**Also**: Should we detect and handle timezone changes? (e.g., user travels to different timezone)

---

## 5. Admin Interface & Puzzle Management (v1 vs Future)
**Question**: For version 1, how should daily puzzles be managed?

- **Option A**: No admin interface in v1 - puzzles are hard-coded or in a JSON file that developers manually update
  - Pro: Faster to implement, simpler
  - Con: Requires code/file updates for each new day
  
- **Option B**: Simple admin interface in v1 (even if basic)
  - Pro: Easier to manage daily puzzles
  - Con: More development time, requires authentication/security

**Also**: 
- Should the admin interface be part of the main game codebase, or a separate system?
- What's the minimum viable admin interface? (Create puzzle, select category, set items, preview?)
- Should there be validation to ensure puzzles are created in advance? (e.g., can't create puzzle for today if it's already past midnight?)

---

## Bonus Question: Puzzle Data Validation
**Question**: What validation should be in place for puzzle data?

- Should we validate that:
  - Easy puzzles have exactly 12 items?
  - Medium/Hard puzzles have exactly 16 items?
  - All items in a puzzle are from the same category?
  - No duplicate items in a puzzle?
  - Category exists and has enough items?

- What should happen if puzzle data is missing or invalid for a given day?
  - Show an error message?
  - Fall back to a default puzzle?
  - Prevent the game from loading?

