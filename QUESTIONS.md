# Top 10 Clarifying Questions for Memaday

## 1. Timezone & Day Boundaries
**Question**: What timezone should determine when a "day" changes? Should it be:
- User's local timezone (each user's day changes at their local midnight)?
- A fixed timezone (e.g., EST/EDT, UTC)?
- Server timezone (if we add a backend later)?

**Impact**: This affects when new puzzles are available and when streaks reset.

---

## 2. Streak Reset Logic
**Question**: How should streaks reset?
- **Days played streak**: Should it reset if a user misses a day, or only if they explicitly don't play for X consecutive days?
- **Win streaks**: Should they reset only on a loss, or also if the user doesn't play that difficulty for a day?
- Should there be a "streak freeze" or grace period (e.g., one missed day doesn't break the streak)?

**Impact**: Affects user motivation and retention strategies.

---

## 3. Multiple Attempts Per Day
**Question**: Can users attempt the same daily puzzle multiple times?
- **Option A**: Unlimited attempts, but only first completion counts toward streaks
- **Option B**: One attempt per day per difficulty (if they lose, they can't retry)
- **Option C**: Limited attempts (e.g., 3 attempts per day per difficulty)

**Impact**: Affects game difficulty and user experience.

---

## 4. Archive Access & Replay Rules
**Question**: What are the rules for playing archived (past) games?
- Can users replay past games they already completed?
- Do archived games count toward any statistics (total games played, etc.)?
- Should archived games show the user's original score/result, or allow them to try again?
- Should there be a limit on how far back users can access (e.g., last 30 days, all time)?

**Impact**: Affects storage requirements and user engagement features.

---

## 5. User Identification & Data Persistence
**Question**: How should we handle user identification and data?
- **Option A**: Anonymous localStorage only (data lost if user clears browser data)
- **Option B**: Generate a persistent user ID that can be exported/imported
- **Option C**: Plan for future backend integration (design data structure to be backend-ready)
- Should we support multiple "profiles" or accounts on the same device?

**Impact**: Affects data structure design and future scalability.

---

## 6. Scoring & Win Conditions
**Question**: What constitutes a "win" vs. a "loss"?
- Is it simply completing all rounds (matching all tiles), regardless of score?
- Or is there a minimum score threshold to count as a win?
- Should partial completion (e.g., completing 3 out of 4 rounds) count as anything?

**Impact**: Affects win streak calculations and user satisfaction.

---

## 7. Difficulty Selection & Switching
**Question**: Can users play multiple difficulties on the same day?
- Should they be able to play Easy, Medium, and Hard all on the same day?
- If they start Easy and don't finish, can they switch to Medium and come back to Easy later?
- Should there be any restrictions or incentives for playing all three difficulties?

**Impact**: Affects UI design and user flow.

---

## 8. Puzzle Category Selection
**Question**: How should categories be selected for daily puzzles?
- **Option A**: Rotate through categories sequentially (day 1 = category 0, day 2 = category 1, etc.)
- **Option B**: Use day number to deterministically select category (e.g., hash function)
- **Option C**: Pre-defined schedule (manually curated list)
- Should all three difficulties on the same day use the same category, or different categories?

**Impact**: Affects puzzle variety and generation algorithm.

---

## 9. Sharing & Social Features
**Question**: What sharing features should be included?
- Should there be a shareable result format (like Wordle's grid)?
- Should it show difficulty level, score, rounds completed?
- Should it include emoji representation of performance?
- Any plans for leaderboards or comparing with friends?

**Impact**: Affects viral growth potential and feature scope.

---

## 10. Future Backend Considerations
**Question**: Should the initial implementation be designed with future backend migration in mind?
- Should we structure data in a way that could easily sync to a server later?
- Should we include user IDs and data structures that would work with a database?
- Or should we keep it simple and client-side only for now?

**Impact**: Affects code architecture and technical debt.

---

## Bonus Questions (if you want to address these too):

### 11. First Day Experience
**Question**: For users who start playing after January 19, 2025:
- Should they be able to play all past games from day 1?
- Or should they only see games from the day they first started playing?
- Should there be a "tutorial" or "practice" mode separate from daily challenges?

### 12. Visual Design
**Question**: Should Memaday have a distinct visual identity from MemoryDawg?
- Different color scheme?
- Different logo/branding?
- Similar but with daily challenge theming (calendar icons, etc.)?

### 13. Statistics & Analytics
**Question**: What statistics should be tracked and displayed?
- Average score per difficulty?
- Completion rate?
- Best performance metrics?
- Calendar heatmap of completions?

