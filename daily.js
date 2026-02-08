/**
 * Memaday - Daily Puzzle Management & User Tracking
 * Handles daily puzzle loading, user progress tracking, and streak management
 */

class DailyManager {
    constructor() {
        this.puzzles = null; // Will be loaded from puzzles.json
        // Puzzle #1 starts on January 20, 2026
        this.startDate = new Date(2026, 0, 20); // January 20, 2026 (month is 0-indexed)
        this.loadPuzzles();
    }

    /**
     * Load puzzles from puzzles.json
     */
    async loadPuzzles() {
        try {
            const response = await fetch('puzzles.json');
            this.puzzles = await response.json();
        } catch (error) {
            console.error('Error loading puzzles:', error);
            this.puzzles = {};
        }
    }

    /**
     * Calculate day number from date (January 20, 2026 = Day #1)
     */
    getDayNumber(date = new Date()) {
        // Create start date in local timezone
        const start = new Date(this.startDate);
        start.setHours(0, 0, 0, 0);
        
        // Create current date in local timezone
        const current = new Date(date);
        current.setHours(0, 0, 0, 0);
        
        // Calculate difference in days
        const diffTime = current - start;
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        
        // Return day number (1-based)
        return diffDays + 1; // Day #1 is January 20, 2026
    }

    /**
     * Get current day number based on user's local timezone
     */
    getCurrentDayNumber() {
        return this.getDayNumber(new Date());
    }

    /**
     * Get date string in YYYY-MM-DD format for a given day number
     */
    getDateFromDayNumber(dayNumber) {
        // Create date in local timezone (January 20, 2026 = day 1)
        const date = new Date(this.startDate);
        date.setDate(date.getDate() + (dayNumber - 1));
        
        // Format as YYYY-MM-DD in local timezone
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    /**
     * Validate puzzle has exactly 16 answers mapped 1-16
     */
    validatePuzzle(puzzle) {
        if (!puzzle || !puzzle.answers) {
            throw new Error('Puzzle data is missing');
        }
        
        const answers = puzzle.answers;
        if (Object.keys(answers).length !== 16) {
            throw new Error('Puzzle must have exactly 16 answers mapped 1-16');
        }
        
        for (let i = 1; i <= 16; i++) {
            if (!answers[i.toString()]) {
                throw new Error(`Puzzle missing answer for position ${i}`);
            }
        }
        
        return true;
    }

    /**
     * Auto-generate a puzzle if admin hasn't added one
     * Uses MemoryDawg categories and avoids items from past 10 days
     */
    autoGeneratePuzzle(dayNumber) {
        // Get recent items from past 10 days
        const recentItems = this.getRecentItems(dayNumber);
        
        // Available categories from MemoryDawg
        const categories = [
            ['Apple', 'Banana', 'Orange', 'Grape', 'Strawberry', 'Blueberry', 'Mango', 'Pineapple', 'Kiwi', 'Watermelon', 'Peach', 'Cherry', 'Pear', 'Plum', 'Lemon', 'Lime'],
            ['Dog', 'Cat', 'Bird', 'Fish', 'Rabbit', 'Hamster', 'Turtle', 'Snake', 'Lizard', 'Frog', 'Horse', 'Cow', 'Pig', 'Sheep', 'Goat', 'Chicken'],
            ['Red', 'Blue', 'Green', 'Yellow', 'Orange', 'Purple', 'Pink', 'Black', 'White', 'Gray', 'Brown', 'Cyan', 'Magenta', 'Indigo', 'Turquoise', 'Maroon'],
            ['Car', 'Bike', 'Bus', 'Train', 'Plane', 'Boat', 'Truck', 'Motorcycle', 'Scooter', 'Helicopter', 'Subway', 'Taxi', 'Van', 'SUV', 'Convertible', 'Sedan'],
            ['Pizza', 'Burger', 'Pasta', 'Sushi', 'Taco', 'Salad', 'Soup', 'Sandwich', 'Steak', 'Chicken', 'Fish', 'Rice', 'Bread', 'Cake', 'Ice Cream', 'Cookie'],
            ['Sun', 'Moon', 'Star', 'Cloud', 'Rain', 'Snow', 'Wind', 'Storm', 'Lightning', 'Rainbow', 'Aurora', 'Comet', 'Planet', 'Galaxy', 'Nebula', 'Meteor'],
            ['Guitar', 'Piano', 'Drums', 'Violin', 'Flute', 'Trumpet', 'Saxophone', 'Cello', 'Harp', 'Banjo', 'Ukulele', 'Clarinet', 'Trombone', 'Bass', 'Harmonica', 'Accordion'],
            ['Book', 'Pen', 'Paper', 'Pencil', 'Eraser', 'Ruler', 'Notebook', 'Marker', 'Highlighter', 'Stapler', 'Scissors', 'Glue', 'Folder', 'Binder', 'Calculator', 'Compass']
        ];
        
        // Select category based on day number (rotate through)
        const categoryIndex = (dayNumber - 1) % categories.length;
        let category = categories[categoryIndex];
        
        // Filter out items used in recent days
        const availableItems = category.filter(item => !recentItems.has(item));
        
        // If not enough items, use all items from category
        const itemsToUse = availableItems.length >= 16 ? availableItems.slice(0, 16) : category.slice(0, 16);
        
        // Create answers object with positions 1-16
        const answers = {};
        itemsToUse.forEach((item, index) => {
            answers[(index + 1).toString()] = item;
        });
        
        // Fill remaining positions if needed
        for (let i = itemsToUse.length + 1; i <= 16; i++) {
            answers[i.toString()] = category[(i - 1) % category.length];
        }
        
        return {
            dayNumber: dayNumber,
            date: this.getDateFromDayNumber(dayNumber),
            category: `Category ${categoryIndex + 1}`,
            answers: answers,
            difficulties: {
                easy: {
                    numTiles: 12,
                    revealTime: 90,
                    positions: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
                },
                medium: {
                    numTiles: 16,
                    revealTime: 60,
                    positions: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]
                },
                hard: {
                    numTiles: 16,
                    revealTime: 45,
                    positions: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]
                }
            }
        };
    }

    /**
     * Get items used in puzzles from past 10 days
     */
    getRecentItems(dayNumber) {
        const recentItems = new Set();
        const startDay = Math.max(1, dayNumber - 10);
        
        for (let day = startDay; day < dayNumber; day++) {
            const puzzle = this.getPuzzleData(day);
            if (puzzle && puzzle.answers) {
                Object.values(puzzle.answers).forEach(item => {
                    if (typeof item === 'string') {
                        recentItems.add(item);
                    } else if (item && item.name) {
                        recentItems.add(item.name);
                    }
                });
            }
        }
        
        return recentItems;
    }

    /**
     * Get puzzle data for a given day number
     */
    getPuzzleData(dayNumber) {
        if (!this.puzzles) {
            return null;
        }
        
        const puzzleKey = dayNumber.toString();
        return this.puzzles[puzzleKey] || null;
    }

    /**
     * Load daily puzzle for a given day number and difficulty
     */
    loadDailyPuzzle(dayNumber, difficulty) {
        // Get puzzle data (or auto-generate if missing)
        let puzzle = this.getPuzzleData(dayNumber);
        
        if (!puzzle) {
            puzzle = this.autoGeneratePuzzle(dayNumber);
        }
        
        // Validate puzzle
        try {
            this.validatePuzzle(puzzle);
        } catch (error) {
            console.error(`Puzzle validation failed for day ${dayNumber}:`, error);
            throw error;
        }
        
        // Get items for this difficulty
        const positions = puzzle.difficulties[difficulty].positions;
        const items = positions.map(pos => {
            const answer = puzzle.answers[pos.toString()];
            // Handle both string items and image objects
            if (typeof answer === 'string') {
                return answer;
            } else if (answer && answer.url && answer.name) {
                return answer;
            } else {
                return answer;
            }
        });
        
        // Create tile mapping (position to tile index)
        const tileMapping = {};
        positions.forEach((pos, index) => {
            tileMapping[pos] = index;
        });
        
        return {
            dayNumber: puzzle.dayNumber,
            date: puzzle.date,
            category: puzzle.category,
            difficulty: difficulty,
            items: items, // In order of positions (not shuffled)
            positions: positions,
            revealTime: puzzle.difficulties[difficulty].revealTime,
            tileMapping: tileMapping,
            numTiles: puzzle.difficulties[difficulty].numTiles
        };
    }

    /**
     * Get or create user ID
     */
    getUserId() {
        // Migrate from memaday keys (legacy Memorlock) if present
        const legacyUserId = localStorage.getItem('memaday_userId');
        let userId = localStorage.getItem('hippomemory_userId');
        if (!userId && legacyUserId) {
            userId = legacyUserId;
            localStorage.setItem('hippomemory_userId', userId);
        } else if (!userId) {
            userId = this.generateUserId();
            localStorage.setItem('hippomemory_userId', userId);
        }
        return userId;
    }

    /**
     * Generate a unique user ID
     */
    generateUserId() {
        return 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    /**
     * Recalculate solve distribution from all completion records
     */
    recalculateSolveDistribution(progress) {
        // Initialize solve distribution
        const distribution = {1: 0, 2: 0, 3: 0, 4: 0};
        
        // Count wins by round from all completions
        Object.values(progress.completions).forEach(completion => {
            if (completion.won && completion.roundsCompleted >= 1 && completion.roundsCompleted <= 4) {
                distribution[completion.roundsCompleted] = (distribution[completion.roundsCompleted] || 0) + 1;
            }
        });
        
        return distribution;
    }

    /**
     * Get user progress
     */
    getUserProgress() {
        const userId = this.getUserId();
        // Migrate from memaday keys (legacy Memorlock) if present
        const progressKey = 'hippomemory_progress';
        let progressJson = localStorage.getItem(progressKey);
        if (!progressJson) {
            const legacyProgress = localStorage.getItem('memaday_progress');
            if (legacyProgress) {
                localStorage.setItem(progressKey, legacyProgress);
                progressJson = legacyProgress;
            }
        }
        
        if (!progressJson) {
            return this.initializeUserProgress(userId);
        }
        
        try {
            const progress = JSON.parse(progressJson);
            // Ensure userId matches
            if (progress.userId !== userId) {
                // User ID changed, initialize new progress
                return this.initializeUserProgress(userId);
            }
            // Ensure solveDistribution exists (for backward compatibility)
            if (!progress.solveDistribution) {
                progress.solveDistribution = {1: 0, 2: 0, 3: 0, 4: 0};
            }
            // Ensure fastestTime exists (for backward compatibility)
            if (progress.fastestTime === undefined) {
                progress.fastestTime = null;
            }
            
            // Recalculate solve distribution from completion records to ensure accuracy
            // This fixes cases where solve distribution might be out of sync
            const recalculated = this.recalculateSolveDistribution(progress);
            const currentTotal = (progress.solveDistribution[1] || 0) + 
                                 (progress.solveDistribution[2] || 0) + 
                                 (progress.solveDistribution[3] || 0) + 
                                 (progress.solveDistribution[4] || 0);
            const recalculatedTotal = recalculated[1] + recalculated[2] + recalculated[3] + recalculated[4];
            
            // If totals don't match, use recalculated distribution
            if (currentTotal !== recalculatedTotal || currentTotal !== progress.totalGamesWon) {
                progress.solveDistribution = recalculated;
                // Save the corrected progress
                this.saveUserProgress(progress);
            }
            
            return progress;
        } catch (error) {
            console.error('Error parsing user progress:', error);
            return this.initializeUserProgress(userId);
        }
    }

    /**
     * Initialize user progress with default values
     */
    initializeUserProgress(userId) {
        return {
            userId: userId,
            attemptStreak: 0,
            winStreak: 0,
            longestStreak: 0,
            lastPlayedDate: null,
            lastPlayedDifficulty: null,
            totalGamesPlayed: 0,
            totalGamesWon: 0,
            winPercentage: 0,
            totalTimeSpent: 0,
            averageTimeToComplete: 0,
            fastestTime: null, // Fastest completion time in seconds
            solveDistribution: { // Track which round puzzles are solved in
                1: 0,
                2: 0,
                3: 0,
                4: 0
            },
            completions: {},
            inProgress: null
        };
    }

    /**
     * Save user progress
     */
    saveUserProgress(progress) {
        const progressKey = 'hippomemory_progress';
        localStorage.setItem(progressKey, JSON.stringify(progress));
    }

    /**
     * Check if user has completed a challenge for a given day
     */
    checkCompletion(dayNumber, difficulty) {
        const progress = this.getUserProgress();
        const completion = progress.completions[dayNumber.toString()];
        
        if (!completion) {
            return { completed: false, won: false };
        }
        
        return {
            completed: completion.completed || false,
            won: completion.won || false,
            score: completion.score || 0,
            roundsCompleted: completion.roundsCompleted || 0,
            timeToComplete: completion.timeToComplete || 0
        };
    }

    /**
     * Update streaks when user completes a game
     */
    updateStreaks(dayNumber, difficulty, won, progress = null) {
        // Use provided progress or get fresh
        if (!progress) {
            progress = this.getUserProgress();
        }
        
        const today = this.getDateFromDayNumber(dayNumber);
        const todayStr = today;
        
        // Update last played date
        const lastPlayedDate = progress.lastPlayedDate;
        const isNewDay = !lastPlayedDate || lastPlayedDate !== todayStr;
        
        if (isNewDay) {
            // Check if streak should continue or reset
            if (lastPlayedDate) {
                const lastDate = new Date(lastPlayedDate);
                const currentDate = new Date(todayStr);
                const daysDiff = Math.floor((currentDate - lastDate) / (1000 * 60 * 60 * 24));
                
                if (daysDiff > 1) {
                    // Streak broken (missed a day)
                    progress.attemptStreak = 1;
                    progress.winStreak = won ? 1 : 0;
                } else {
                    // Consecutive day
                    progress.attemptStreak += 1;
                    if (won) {
                        progress.winStreak += 1;
                    } else {
                        progress.winStreak = 0;
                    }
                }
            } else {
                // First time playing
                progress.attemptStreak = 1;
                progress.winStreak = won ? 1 : 0;
            }
            
            // Update longest streak
            if (progress.attemptStreak > progress.longestStreak) {
                progress.longestStreak = progress.attemptStreak;
            }
        } else {
            // Same day - if they won and didn't win before, update win streak
            // But if they already completed today, don't update streaks again
            // (This handles the case where they play multiple times in one day, which shouldn't happen but just in case)
        }
        
        progress.lastPlayedDate = todayStr;
        progress.lastPlayedDifficulty = difficulty;
        
        // Don't save here - let recordCompletion save it
    }

    /**
     * Record game completion
     */
    recordCompletion(dayNumber, difficulty, won, score, roundsCompleted, timeToComplete, userGuesses = null) {
        const progress = this.getUserProgress();
        const today = this.getDateFromDayNumber(dayNumber);
        
        // Update completion record
        if (!progress.completions[dayNumber.toString()]) {
            progress.completions[dayNumber.toString()] = {};
        }
        
        const completion = progress.completions[dayNumber.toString()];
        completion.difficulty = difficulty;
        completion.completed = true;
        completion.won = won;
        completion.score = score;
        completion.roundsCompleted = roundsCompleted;
        completion.timeToComplete = timeToComplete;
        completion.date = today;
        completion.completedAt = new Date().toISOString();
        
        // Store user guesses if provided
        if (userGuesses) {
            completion.userGuesses = userGuesses;
        }
        
        // Update statistics
        progress.totalGamesPlayed += 1;
        if (won) {
            progress.totalGamesWon += 1;
            progress.totalTimeSpent += timeToComplete;
            progress.averageTimeToComplete = progress.totalTimeSpent / progress.totalGamesWon;
            
            // Update fastest time
            if (progress.fastestTime === null || timeToComplete < progress.fastestTime) {
                progress.fastestTime = timeToComplete;
            }
            
            // Update solve distribution (which round the puzzle was solved in)
            if (roundsCompleted >= 1 && roundsCompleted <= 4) {
                progress.solveDistribution[roundsCompleted] = (progress.solveDistribution[roundsCompleted] || 0) + 1;
            }
        }
        progress.winPercentage = progress.totalGamesWon / progress.totalGamesPlayed;
        
        // Update streaks BEFORE saving
        this.updateStreaks(dayNumber, difficulty, won, progress);
        
        this.saveUserProgress(progress);
    }

    /**
     * Check if user has an in-progress game for today
     */
    hasInProgressGame(dayNumber) {
        const progress = this.getUserProgress();
        if (!progress.inProgress) {
            return false;
        }
        
        // Check if in-progress game is for the current day
        return progress.inProgress.dayNumber === dayNumber;
    }

    /**
     * Get in-progress game state
     */
    getInProgressGame() {
        const progress = this.getUserProgress();
        return progress.inProgress;
    }

    /**
     * Save in-progress game state
     */
    saveInProgressGame(gameState) {
        const progress = this.getUserProgress();
        progress.inProgress = gameState;
        this.saveUserProgress(progress);
    }

    /**
     * Clear in-progress game state
     */
    clearInProgressGame() {
        const progress = this.getUserProgress();
        progress.inProgress = null;
        this.saveUserProgress(progress);
    }
}

// Create global instance
const dailyManager = new DailyManager();

