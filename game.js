class MemoryGame {
    constructor() {
        this.score = 0;
        this.gameStarted = false;
        this.viewingPhase = false;
        this.memoryPhase = false;
        this.tiles = [];
        this.tileItems = []; // Store the actual items for each tile
        this.currentRound = 0;
        this.maxRounds = 4;
        this.currentMatches = new Map(); // Map from targetItem to tileIndex - matches made in current round
        this.correctTiles = new Set(); // Set of tile indices that are correctly identified
        this.finalUserGuesses = new Map(); // Map from tileIndex to guessedItem - final guesses when game ends
        this.showingAnswers = false; // Whether we're currently showing correct answers or user guesses
        this.matchCount = 0;
        this.targetItems = []; // List of items to match (shuffled)
        this.currentTargetIndex = 0; // Index of current target item
        this.currentTarget = null; // Current target item to find
        this.swapMode = false; // Whether we're in swap mode
        this.swapWord = null; // The word being swapped
        this.swapOldTileIndex = null; // The tile index where the word was previously
        this.revealTimer = null; // Timer for the reveal countdown
        this.revealTimeRemaining = 90; // Will be set based on difficulty
        this.revealTimeouts = []; // Array to store setTimeout IDs for sequential tile reveals
        this.winStreak = 0; // Current win streak
        this.roundScores = []; // Track score for each round
        this.incorrectMatches = new Set(); // Track incorrect matches from previous rounds (format: "targetItem|tileIndex")
        this.difficultyLevel = 'medium'; // Difficulty level: 'easy', 'medium', or 'hard'
        this.pendingDifficultyChange = null; // Difficulty change that will be applied after current game completes
        this.backgroundColor = '#764ba2'; // Default purple background color
        this.selectedCategoryIndex = null; // Selected category for testing (null = random)
        this.pendingCategoryChange = null; // Category change that will be applied after current game completes
        
        // Available background color options
        this.colorOptions = [
            { name: 'Purple', value: '#764ba2' },
            { name: 'Red', value: '#E74C3C' },
            { name: 'Orange', value: '#FF8C42' },
            { name: 'Yellow', value: '#F1C40F' },
            { name: 'Green', value: '#2ECC71' },
            { name: 'Blue', value: '#3498DB' },
            { name: 'Teal', value: '#1ABC9C' },
            { name: 'Hot Pink', value: '#FF1493' },
            { name: 'Brown', value: '#8B4513' },
            { name: 'Black', value: '#2C3E50' },
            { name: 'Neon Green', value: '#39FF14' },
            { name: 'Maroon', value: '#800000' }
        ];
        
        this.categories = [
            ['Apple', 'Banana', 'Orange', 'Grape', 'Strawberry', 'Blueberry', 'Mango', 'Pineapple', 'Kiwi', 'Watermelon', 'Peach', 'Cherry', 'Pear', 'Plum', 'Lemon', 'Lime'],
            ['Dog', 'Cat', 'Bird', 'Fish', 'Rabbit', 'Hamster', 'Turtle', 'Snake', 'Lizard', 'Frog', 'Horse', 'Cow', 'Pig', 'Sheep', 'Goat', 'Chicken'],
            ['Red', 'Blue', 'Green', 'Yellow', 'Orange', 'Purple', 'Pink', 'Black', 'White', 'Gray', 'Brown', 'Cyan', 'Magenta', 'Indigo', 'Turquoise', 'Maroon'],
            ['Car', 'Bike', 'Bus', 'Train', 'Plane', 'Boat', 'Truck', 'Motorcycle', 'Scooter', 'Helicopter', 'Subway', 'Taxi', 'Van', 'SUV', 'Convertible', 'Sedan'],
            ['Pizza', 'Burger', 'Pasta', 'Sushi', 'Taco', 'Salad', 'Soup', 'Sandwich', 'Steak', 'Chicken', 'Fish', 'Rice', 'Bread', 'Cake', 'Ice Cream', 'Cookie'],
            ['Sun', 'Moon', 'Star', 'Cloud', 'Rain', 'Snow', 'Wind', 'Storm', 'Lightning', 'Rainbow', 'Aurora', 'Comet', 'Planet', 'Galaxy', 'Nebula', 'Meteor'],
            ['Guitar', 'Piano', 'Drums', 'Violin', 'Flute', 'Trumpet', 'Saxophone', 'Cello', 'Harp', 'Banjo', 'Ukulele', 'Clarinet', 'Trombone', 'Bass', 'Harmonica', 'Accordion'],
            ['Book', 'Pen', 'Paper', 'Pencil', 'Eraser', 'Ruler', 'Notebook', 'Marker', 'Highlighter', 'Stapler', 'Scissors', 'Glue', 'Folder', 'Binder', 'Calculator', 'Compass'],
            ['⭐', '🌟', '✨', '💫', '🌠', '🔯', '✡️', '☀️', '🌙', '☄️', '🌌', '🌉', '🌆', '🌃', '🌅', '🌄'],
            ['❤️', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '🧡', '💔', '❣️', '💕', '💞', '💓', '💗', '💖'],
            ['🎵', '🎶', '🎤', '🎧', '🎸', '🎹', '🥁', '🎺', '🎷', '🎻', '🪕', '🎼', '🎯', '🎲', '🎰', '🎪'],
            ['⚽', '🏀', '🏈', '⚾', '🎾', '🏐', '🏉', '🎱', '🏓', '🏸', '🥊', '🏹', '⛳', '🏌️', '🏄', '🏊'],
            ['🚗', '🚕', '🚙', '🚌', '🚎', '🏎️', '🚓', '🚑', '🚒', '🚐', '🛻', '🚚', '🚛', '🚜', '🏍️', '🛵'],
            ['🍎', '🍌', '🍊', '🍇', '🍓', '🫐', '🥭', '🍍', '🥝', '🍉', '🍑', '🍒', '🍐', '🫒', '🍋', '🍈'],
            ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐽', '🐸', '🐵'],
            ['🔴', '🟠', '🟡', '🟢', '🔵', '🟣', '⚫', '⚪', '🟤', '🟥', '🟧', '🟨', '🟩', '🟦', '⬛', '⬜'],
            ['Washington', 'Lincoln', 'Roosevelt', 'Jefferson', 'Kennedy', 'Reagan', 'Obama', 'Trump', 'Biden', 'Adams', 'Jackson', 'Wilson', 'Eisenhower', 'Johnson', 'Nixon', 'Clinton'],
            ['United States', 'Canada', 'Mexico', 'Brazil', 'United Kingdom', 'France', 'Germany', 'Italy', 'Spain', 'Japan', 'China', 'India', 'Australia', 'Russia', 'South Korea', 'Argentina'],
            ['California', 'Texas', 'Florida', 'New York', 'Illinois', 'Pennsylvania', 'Ohio', 'Georgia', 'North Carolina', 'Michigan', 'New Jersey', 'Virginia', 'Washington', 'Arizona', 'Massachusetts', 'Tennessee'],
            ['New York', 'Los Angeles', 'Chicago', 'Houston', 'London', 'Paris', 'Tokyo', 'Sydney', 'Toronto', 'Miami', 'San Francisco', 'Boston', 'Rome', 'Barcelona', 'Dubai', 'Singapore'],
            ['Tom Hanks', 'Meryl Streep', 'Leonardo DiCaprio', 'Jennifer Lawrence', 'Brad Pitt', 'Angelina Jolie', 'Denzel Washington', 'Emma Stone', 'Robert De Niro', 'Scarlett Johansson', 'Will Smith', 'Natalie Portman', 'Morgan Freeman', 'Cate Blanchett', 'Johnny Depp', 'Julia Roberts'],
            ['Kansas City Chiefs', 'Buffalo Bills', 'Dallas Cowboys', 'Green Bay Packers', 'San Francisco 49ers', 'Pittsburgh Steelers', 'New England Patriots', 'Denver Broncos', 'Seattle Seahawks', 'Baltimore Ravens', 'Miami Dolphins', 'Las Vegas Raiders', 'Philadelphia Eagles', 'New York Giants', 'Chicago Bears', 'Los Angeles Rams'],
            ['♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓', '☯️', '☮️', '☸️', '⚛️'],
            // Famous People (Images) - using images from /images folder
            [
                {url: 'images/AngelinaJolie.jpg', name: 'Angelina Jolie'},
                {url: 'images/BradPitt.jpg', name: 'Brad Pitt'},
                {url: 'images/CateBlanchett.jpg', name: 'Cate Blanchett'},
                {url: 'images/DenzelWashington.jpg', name: 'Denzel Washington'},
                {url: 'images/EmmaStone.jpg', name: 'Emma Stone'},
                {url: 'images/JenniferLawrence.jpg', name: 'Jennifer Lawrence'},
                {url: 'images/JohnnyDepp.jpg', name: 'Johnny Depp'},
                {url: 'images/JuliaRoberts.jpg', name: 'Julia Roberts'},
                {url: 'images/LeonardoDiCaprio.jpg', name: 'Leonardo DiCaprio'},
                {url: 'images/MerylStreep.jpg', name: 'Meryl Streep'},
                {url: 'images/MorganFreeman.jpg', name: 'Morgan Freeman'},
                {url: 'images/NataliePortman.jpg', name: 'Natalie Portman'},
                {url: 'images/RobertDeNiro.jpg', name: 'Robert De Niro'},
                {url: 'images/ScarlettJohansson.jpg', name: 'Scarlett Johansson'},
                {url: 'images/TomHanks.jpg', name: 'Tom Hanks'},
                {url: 'images/WillSmith.jpg', name: 'Will Smith'}
            ]
        ];
        
        this.roundEvaluated = false; // Track if current round has been evaluated
        
        this.initializeGame();
    }
    
    initializeGame() {
        const playBtn = document.getElementById('play-btn');
        const nextBtn = document.getElementById('next-btn');
        const gameBoard = document.getElementById('game-board');
        const howToPlayBtn = document.getElementById('how-to-play-btn');
        const closeHowToPlay = document.getElementById('close-how-to-play');
        const statsLink = document.getElementById('stats-link');
        const closeStats = document.getElementById('close-stats');
        const settingsLink = document.getElementById('settings-link');
        const closeSettings = document.getElementById('close-settings');
        
        // Set up home screen
        this.setupHomeScreen();
        
        // Set up difficulty selection dropdown and start button (direct + delegation so Start always works)
        const difficultySelect = document.getElementById('difficulty-select');
        const startGameBtn = document.getElementById('start-game-btn');
        const self = this;
        const handleStartClick = () => {
            const sel = document.getElementById('difficulty-select');
            const selectedDifficulty = sel ? sel.value : 'medium';
            self.selectDifficulty(selectedDifficulty);
        };
        if (startGameBtn) {
            startGameBtn.addEventListener('click', (e) => { e.preventDefault(); handleStartClick(); });
        }
        const homeScreen = document.getElementById('home-screen');
        if (homeScreen) {
            homeScreen.addEventListener('click', (e) => {
                if (e.target && e.target.id === 'start-game-btn') {
                    e.preventDefault();
                    handleStartClick();
                }
            });
        }
        
        // Set up How to Play link on home screen
        const howToPlayLink = document.getElementById('how-to-play-link');
        if (howToPlayLink) {
            howToPlayLink.addEventListener('click', (e) => {
                e.preventDefault();
                this.showModal('how-to-play-modal');
            });
        }
        
        // Set up Reset Today link (development/testing)
        const resetTodayLink = document.getElementById('reset-today-link');
        if (resetTodayLink) {
            resetTodayLink.addEventListener('click', (e) => {
                e.preventDefault();
                this.resetToday();
            });
        }
        
        // Set up Admire Puzzle button
        const admirePuzzleBtn = document.getElementById('admire-puzzle-btn');
        if (admirePuzzleBtn) {
            admirePuzzleBtn.addEventListener('click', () => {
                this.showAdmirePuzzle();
            });
        }
        if (nextBtn) {
            nextBtn.addEventListener('click', () => this.handleNextButton());
        }
        
        // Set up toolbar (with null checks)
        if (howToPlayBtn) {
            howToPlayBtn.addEventListener('click', () => this.showModal('how-to-play-modal'));
        }
        if (closeHowToPlay) {
            closeHowToPlay.addEventListener('click', () => this.hideModal('how-to-play-modal'));
        }
        if (statsLink) {
            statsLink.addEventListener('click', (e) => {
                e.preventDefault();
                this.showStatsModal();
            });
        }
        if (closeStats) {
            closeStats.addEventListener('click', () => this.hideModal('stats-modal'));
        }
        if (settingsLink) {
            settingsLink.addEventListener('click', (e) => {
                e.preventDefault();
                this.showModal('settings-modal');
            });
        }
        if (closeSettings) {
            closeSettings.addEventListener('click', () => this.hideModal('settings-modal'));
        }
        
        // Set up win modal
        const shareBtn = document.getElementById('share-btn');
        const shareResultsFinalBtn = document.getElementById('share-results-final-btn');
        const closeWinModal = document.getElementById('close-win-modal');
        const playAgainModalBtn = document.getElementById('play-again-modal-btn');
        const playAgainBtn = document.getElementById('play-again-btn');
        
        // Share button handler - show modal with shareable text
        const handleShareButton = (e) => {
            e.preventDefault();
            e.stopPropagation();
            // Remove active state from button to prevent it from getting stuck
            const button = e.currentTarget;
            if (button) {
                button.blur(); // Remove focus to prevent stuck state
            }
            // Get share text and show modal
            try {
                const shareText = this.getShareText();
                this.showShareModal(shareText);
            } catch (err) {
                console.error('Error getting share text:', err);
            }
        };
        
        if (shareBtn) {
            shareBtn.addEventListener('click', handleShareButton);
        }
        if (shareResultsFinalBtn) {
            shareResultsFinalBtn.addEventListener('click', handleShareButton);
        }
        
        // Setup share modal handlers
        const closeShareModal = document.getElementById('close-share-modal');
        const closeShareModalBtn = document.getElementById('close-share-modal-btn');
        const copyShareBtn = document.getElementById('copy-share-btn');
        
        if (closeShareModal) {
            closeShareModal.addEventListener('click', () => {
                this.hideModal('share-modal');
            });
        }
        if (closeShareModalBtn) {
            closeShareModalBtn.addEventListener('click', () => {
                this.hideModal('share-modal');
            });
        }
        if (copyShareBtn) {
            copyShareBtn.addEventListener('click', () => {
                this.copyShareText();
            });
        }
        if (closeWinModal) {
            closeWinModal.addEventListener('click', () => {
                this.hideModal('win-modal');
                this.showAllTilesAfterGame();
                // Show play again container with both buttons on game screen
                const playAgainContainer = document.getElementById('play-again-container');
                if (playAgainContainer) {
                    playAgainContainer.style.display = 'block';
                    // Force a reflow to ensure display change is applied
                    playAgainContainer.offsetHeight;
                }
                
                // Show "See Answers" button if game was not won
                const seeAnswersBtn = document.getElementById('see-answers-btn');
                const tileCount = this.getTileCount();
                const won = this.correctTiles.size === tileCount;
                if (seeAnswersBtn && !won) {
                    seeAnswersBtn.style.display = 'block';
                } else if (seeAnswersBtn) {
                    seeAnswersBtn.style.display = 'none';
                }
            });
        }
        // Back to Home buttons
        const backToHomeModalBtn = document.getElementById('back-to-home-modal-btn');
        const backToHomeBtn = document.getElementById('back-to-home-btn');
        
        if (backToHomeModalBtn) {
            backToHomeModalBtn.addEventListener('click', () => {
                this.hideModal('win-modal');
                this.backToHome();
            });
        }
        if (backToHomeBtn) {
            backToHomeBtn.addEventListener('click', () => {
                this.backToHome();
            });
        }
        
        // Set up See Answers button
        const seeAnswersBtn = document.getElementById('see-answers-btn');
        if (seeAnswersBtn) {
            seeAnswersBtn.addEventListener('click', () => {
                this.toggleAnswersView();
            });
        }
        
        // Handle improve link - open Memory Mastery
        const improveLink = document.getElementById('improve-link');
        if (improveLink) {
            improveLink.addEventListener('click', (e) => {
                e.preventDefault();
                // Try to open Memory Mastery - use the same host but port 8000
                try {
                    // Memory Mastery URL - will be configured when that app is deployed
                    // For now, this link is disabled/not functional
                    console.log('Memory Mastery integration coming soon');
                    alert('Memory Mastery integration coming soon!');
                } catch (err) {
                    console.error('Error opening Memory Mastery:', err);
                }
            });
        }
        
        // Close modals when clicking outside (except win modal - it should stay open)
        document.querySelectorAll('.modal').forEach(modal => {
            if (modal.id !== 'win-modal') {
                modal.addEventListener('click', (e) => {
                    if (e.target === modal) {
                        this.hideModal(modal.id);
                    }
                });
            }
        });
        
        // Load win streak from localStorage
        this.loadWinStreak();
        
        // Load difficulty level setting from localStorage
        this.loadDifficultySetting();
        
        // Load background color setting from localStorage
        this.loadBackgroundColorSetting();
        
        // Apply background color
        this.applyBackgroundColor();
        
        // Set up background color picker
        this.setupBackgroundColorPicker();
        
        // Initialize daily puzzle system
        this.currentDayNumber = null;
        this.currentPuzzle = null;
        this.gameStartTime = null;
        this.overallTimer = 0;
        this.timerInterval = null;
        this.tabVisible = true;
        
        // Track tab visibility for timer
        document.addEventListener('visibilitychange', () => {
            this.tabVisible = !document.hidden;
        });
        
        gameBoard.innerHTML = '';
    }
    
    loadDifficultySetting() {
        const saved = localStorage.getItem('memoryDawgDifficulty');
        if (saved && ['easy', 'medium', 'hard'].includes(saved)) {
            this.difficultyLevel = saved;
        } else {
            this.difficultyLevel = 'medium'; // Default
        }
        this.updateDifficultySettings();
    }
    
    saveDifficultySetting() {
        localStorage.setItem('memoryDawgDifficulty', this.difficultyLevel);
    }
    
    updateDifficultySettings() {
        // Update reveal time based on difficulty
        switch(this.difficultyLevel) {
            case 'easy':
                this.revealTimeRemaining = 180; // 3:00 minutes
                break;
            case 'medium':
                this.revealTimeRemaining = 90; // 1:30 minutes
                break;
            case 'hard':
                this.revealTimeRemaining = 45; // 0:45 seconds
                break;
        }
    }
    
    getTileCount() {
        return this.difficultyLevel === 'easy' ? 12 : 16;
    }
    
    // setupDifficultySelector and updateDifficultySelector removed - difficulty selected on home screen
    
    showModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'block';
        }
    }
    
    hideModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'none';
        }
    }
    
    showDifficultyChangeModal(newDifficulty) {
        // Store the pending difficulty change first
        this.pendingDifficultyChange = newDifficulty;
        
        // Create modal if it doesn't exist
        let modal = document.getElementById('difficulty-change-modal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'difficulty-change-modal';
            modal.className = 'modal';
            modal.style.display = 'none';
            modal.innerHTML = `
                <div class="modal-content">
                    <div class="modal-header">
                        <h2>Change Difficulty</h2>
                    </div>
                    <div class="modal-body">
                        <p>Continue current game or start new game?</p>
                        <div style="display: flex; gap: 10px; justify-content: center; margin-top: 20px;">
                            <button id="continue-current-game-btn" class="btn btn-primary">Continue</button>
                            <button id="start-new-game-btn" class="btn btn-secondary">Start New</button>
                        </div>
                    </div>
                </div>
            `;
            document.body.appendChild(modal);
        }
        
        // Set up event listeners each time (to ensure they use the current pendingDifficultyChange)
        // Store the current pendingDifficultyChange in a local variable for the closures
        const pendingDiff = this.pendingDifficultyChange;
        
        const continueBtn = document.getElementById('continue-current-game-btn');
        const startNewBtn = document.getElementById('start-new-game-btn');
        
        // Remove old listeners by cloning and replacing
        const newContinueBtn = continueBtn.cloneNode(true);
        continueBtn.parentNode.replaceChild(newContinueBtn, continueBtn);
        const newStartNewBtn = startNewBtn.cloneNode(true);
        startNewBtn.parentNode.replaceChild(newStartNewBtn, startNewBtn);
        
        // Get the new button elements after replacement
        const updatedContinueBtn = document.getElementById('continue-current-game-btn');
        const updatedStartNewBtn = document.getElementById('start-new-game-btn');
        
        // Add new listeners that use the stored pendingDiff value
        updatedContinueBtn.addEventListener('click', () => {
            // Store the pending difficulty change but don't apply it until game completes
            // This keeps the current game's difficulty intact
            this.pendingDifficultyChange = pendingDiff;
            // Update the select in settings modal to show the pending change
            const difficultySelect = document.getElementById('difficulty-level');
            if (difficultySelect) {
                difficultySelect.value = pendingDiff;
            }
            // Don't save the difficulty yet - it will be saved when the game completes
            this.hideModal('difficulty-change-modal');
            this.hideModal('settings-modal');
        });
        
        updatedStartNewBtn.addEventListener('click', () => {
            // Start new game with new difficulty
            this.difficultyLevel = pendingDiff;
            this.pendingDifficultyChange = null; // Clear pending change
            this.updateDifficultySettings();
            this.saveDifficultySetting();
            // Update the dropdown to reflect the new difficulty
            // updateDifficultySelector removed
            this.resetGame();
            this.tiles = [];
            const gameBoard = document.getElementById('game-board');
            if (gameBoard) {
                gameBoard.innerHTML = '';
            }
            this.startGame();
            this.hideModal('difficulty-change-modal');
            this.hideModal('settings-modal');
        });
        
        // Show the modal
        this.showModal('difficulty-change-modal');
    }
    
    showCategoryChangeModal(newCategoryIndex) {
        // Store the pending category change first
        const pendingCategory = newCategoryIndex;
        this.pendingCategoryChange = pendingCategory;
        
        // Create modal if it doesn't exist
        let modal = document.getElementById('category-change-modal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'category-change-modal';
            modal.className = 'modal';
            modal.style.display = 'none';
            modal.innerHTML = `
                <div class="modal-content">
                    <div class="modal-header">
                        <h2>Change Category</h2>
                    </div>
                    <div class="modal-body">
                        <p>Continue current game or start new game?</p>
                        <div style="display: flex; gap: 10px; justify-content: center; margin-top: 20px;">
                            <button id="continue-current-category-btn" class="btn btn-primary">Continue</button>
                            <button id="start-new-category-btn" class="btn btn-secondary">Start New</button>
                        </div>
                    </div>
                </div>
            `;
            document.body.appendChild(modal);
        }
        
        // Remove old listeners by cloning and replacing
        const continueBtn = document.getElementById('continue-current-category-btn');
        const startNewBtn = document.getElementById('start-new-category-btn');
        
        const newContinueBtn = continueBtn.cloneNode(true);
        continueBtn.parentNode.replaceChild(newContinueBtn, continueBtn);
        const newStartNewBtn = startNewBtn.cloneNode(true);
        startNewBtn.parentNode.replaceChild(newStartNewBtn, startNewBtn);
        
        // Get the new button elements after replacement
        const updatedContinueBtn = document.getElementById('continue-current-category-btn');
        const updatedStartNewBtn = document.getElementById('start-new-category-btn');
        
        // Add new listeners that use the stored pendingCategory value
        updatedContinueBtn.addEventListener('click', () => {
            // Store the pending category change but don't apply it until game completes
            this.pendingCategoryChange = pendingCategory;
            
            // Update the select in settings modal to show the pending change
            const categorySelect = document.getElementById('category-select');
            if (categorySelect) {
                if (pendingCategory === null) {
                    categorySelect.value = '';
                } else {
                    categorySelect.value = pendingCategory.toString();
                }
            }
            // Don't save the category yet - it will be saved when the game completes
            this.hideModal('category-change-modal');
            this.hideModal('settings-modal');
        });
        
        updatedStartNewBtn.addEventListener('click', () => {
            // Start new game with new category
            this.selectedCategoryIndex = pendingCategory;
            this.pendingCategoryChange = null; // Clear pending change
            if (pendingCategory === null) {
                localStorage.removeItem('memoryDawgSelectedCategory');
            } else {
                localStorage.setItem('memoryDawgSelectedCategory', pendingCategory.toString());
            }
            this.resetGame();
            this.tiles = [];
            const gameBoard = document.getElementById('game-board');
            if (gameBoard) {
                gameBoard.innerHTML = '';
            }
            this.startGame();
            this.hideModal('category-change-modal');
            this.hideModal('settings-modal');
        });
        
        // Show the modal
        this.showModal('category-change-modal');
    }
    
    loadBackgroundColorSetting() {
        const saved = localStorage.getItem('memoryDawgBackgroundColor');
        if (saved && this.colorOptions.some(opt => opt.value === saved)) {
            this.backgroundColor = saved;
        }
    }
    
    saveBackgroundColorSetting() {
        localStorage.setItem('memoryDawgBackgroundColor', this.backgroundColor);
    }
    
    applyBackgroundColor() {
        const html = document.documentElement;
        const homeScreen = document.querySelector('.home-screen');
        const gameScreenWrapper = document.querySelector('.game-screen-wrapper');
        const body = document.body;
        
        // Set CSS variable for use in CSS
        if (html) {
            html.style.setProperty('--bg-color', this.backgroundColor);
            // Apply to html element to cover status bar area on iOS
            html.style.backgroundColor = this.backgroundColor;
        }
        
        if (body) {
            body.style.setProperty('--bg-color', this.backgroundColor);
        }
        
        // Apply directly to home screen
        if (homeScreen) {
            homeScreen.style.backgroundColor = this.backgroundColor;
        }
        
        // Apply directly to game screen wrapper (for immediate effect)
        if (gameScreenWrapper) {
            gameScreenWrapper.style.backgroundColor = this.backgroundColor;
        }
        
        // Apply directly to body when game is active
        if (body && body.classList.contains('game-active')) {
            body.style.backgroundColor = this.backgroundColor;
        }
    }
    
    setupBackgroundColorPicker() {
        const colorOptionsContainer = document.getElementById('color-options');
        if (!colorOptionsContainer) return;
        
        colorOptionsContainer.innerHTML = '';
        
        this.colorOptions.forEach(option => {
            const colorBtn = document.createElement('button');
            colorBtn.type = 'button';
            colorBtn.className = 'color-option';
            colorBtn.style.backgroundColor = option.value;
            colorBtn.setAttribute('data-color', option.value);
            colorBtn.setAttribute('title', option.name);
            colorBtn.setAttribute('aria-label', option.name);
            
            // Add checkmark if this is the selected color
            if (option.value === this.backgroundColor) {
                colorBtn.classList.add('selected');
                colorBtn.innerHTML = '✓';
            }
            
            colorBtn.addEventListener('click', () => {
                // Remove selected class from all buttons
                document.querySelectorAll('.color-option').forEach(btn => {
                    btn.classList.remove('selected');
                    btn.innerHTML = '';
                });
                
                // Add selected class to clicked button
                colorBtn.classList.add('selected');
                colorBtn.innerHTML = '✓';
                
                // Update background color
                this.backgroundColor = option.value;
                this.saveBackgroundColorSetting();
                this.applyBackgroundColor();
            });
            
            colorOptionsContainer.appendChild(colorBtn);
        });
    }
    
    setupCategorySelector() {
        const categorySelect = document.getElementById('category-select');
        if (!categorySelect) return;
        
        // Category names for the dropdown
        const categoryNames = [
            'Fruits',
            'Animals',
            'Colors',
            'Vehicles',
            'Food',
            'Weather & Space',
            'Musical Instruments',
            'School Supplies',
            'Stars & Symbols',
            'Hearts',
            'Music & Entertainment',
            'Sports',
            'Vehicles (Emoji)',
            'Fruits (Emoji)',
            'Animals (Emoji)',
            'Colored Shapes',
            'US Presidents',
            'Countries',
            'US States',
            'Major Cities',
            'Famous Actors & Actresses',
            'NFL Football Teams',
            'Zodiac Signs & Elements',
            'Famous People (Photos)'
        ];
        
        // Populate category options (skip the first "Random" option which is already in HTML)
        categoryNames.forEach((name, index) => {
            const option = document.createElement('option');
            option.value = index.toString();
            option.textContent = name;
            categorySelect.appendChild(option);
        });
        
        // Load saved category selection
        const savedCategory = localStorage.getItem('memoryDawgSelectedCategory');
        if (savedCategory !== null) {
            const categoryIndex = parseInt(savedCategory, 10);
            if (categoryIndex >= 0 && categoryIndex < this.categories.length) {
                this.selectedCategoryIndex = categoryIndex;
                categorySelect.value = categoryIndex.toString();
            }
        } else {
            categorySelect.value = '';
        }
        
        // Handle category selection change
        categorySelect.addEventListener('change', (e) => {
            const selectedValue = e.target.value;
            const newCategoryIndex = selectedValue === '' ? null : parseInt(selectedValue, 10);
            const currentCategoryIndex = this.pendingCategoryChange !== null ? this.pendingCategoryChange : this.selectedCategoryIndex;
            
            // Check if this is actually a change
            if (newCategoryIndex !== currentCategoryIndex) {
                // Check if game is in progress
                const gameInProgress = this.gameStarted && (
                    this.viewingPhase || 
                    this.memoryPhase || 
                    (this.currentRound > 0 && this.currentRound <= this.maxRounds)
                );
                
                if (gameInProgress) {
                    // Show modal for category change
                    this.showCategoryChangeModal(newCategoryIndex);
                    // Revert the select to current category until user chooses
                    if (currentCategoryIndex === null) {
                        categorySelect.value = '';
                    } else {
                        categorySelect.value = currentCategoryIndex.toString();
                    }
                    return;
                }
                
                // No game in progress, just update the category
                this.selectedCategoryIndex = newCategoryIndex;
                this.pendingCategoryChange = null; // Clear any pending change
                if (newCategoryIndex === null) {
                    localStorage.removeItem('memoryDawgSelectedCategory');
                } else {
                    localStorage.setItem('memoryDawgSelectedCategory', newCategoryIndex.toString());
                }
            }
        });
    }
    
    loadWinStreak() {
        const savedStreak = localStorage.getItem('memoryDawgWinStreak');
        const lastPlayDate = localStorage.getItem('memoryDawgLastPlayDate');
        const today = new Date().toDateString();
        
        if (savedStreak && lastPlayDate === today) {
            // Already played today, keep current streak
            this.winStreak = parseInt(savedStreak, 10);
        } else if (savedStreak && lastPlayDate !== today) {
            // Different day, reset streak
            this.winStreak = 0;
            localStorage.setItem('memoryDawgWinStreak', '0');
        } else {
            // First time playing
            this.winStreak = 0;
        }
    }
    
    updateWinStreak() {
        this.winStreak++;
        localStorage.setItem('memoryDawgWinStreak', this.winStreak.toString());
        localStorage.setItem('memoryDawgLastPlayDate', new Date().toDateString());
    }
    
    sharePuzzle() {
        const tileCount = this.getTileCount();
        const totalCorrect = this.score;
        const won = totalCorrect === tileCount;
        
        // Create Wordle-style visual representation
        let shareLines = ['Memaday'];
        shareLines.push(''); // Empty line
        
        // Calculate cumulative correct tiles per round
        let cumulativeCorrect = 0;
        this.roundScores.forEach((roundScore, index) => {
            const roundNum = index + 1;
            cumulativeCorrect += roundScore; // Add new correct tiles from this round
            const incorrectInRound = Math.max(0, tileCount - cumulativeCorrect);
            
            // Create emoji pattern: 🟩 for correct, ⬜ for incorrect
            // Ensure pattern length matches tile count
            const correctCount = Math.min(cumulativeCorrect, tileCount);
            const pattern = '🟩'.repeat(correctCount) + '⬜'.repeat(incorrectInRound);
            shareLines.push(`Round ${roundNum}: ${pattern} (${correctCount}/${tileCount})`);
        });
        
        shareLines.push(''); // Empty line
        shareLines.push(`Total: ${totalCorrect}/${tileCount} correct`);
        
        if (won) {
            shareLines.push('🎉 Perfect!');
        }
        
        // Get win streak from dailyManager
        const progress = dailyManager.getUserProgress();
        shareLines.push(`Streak: ${progress.winStreak || 0}`);
        shareLines.push('');
        shareLines.push('Play at: hippomemory.com');
        
        const shareText = shareLines.join('\n');
        
        // Show share modal with the text
        this.showShareModal(shareText);
    }
    
    showShareModal(shareText) {
        // Show modal with shareable text
        const shareModal = document.getElementById('share-modal');
        const shareTextArea = document.getElementById('share-text-area');
        
        if (shareModal && shareTextArea) {
            shareTextArea.value = shareText;
            // Select all text for easy copying
            shareTextArea.select();
            this.showModal('share-modal');
        }
    }
    
    copyShareText() {
        // Copy text from the textarea to clipboard
        const shareTextArea = document.getElementById('share-text-area');
        if (!shareTextArea) return;
        
        const text = shareTextArea.value;
        
        // Try modern clipboard API first
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text).then(() => {
                this.showCopySuccess();
            }).catch(() => {
                // Fallback to older method
                this.fallbackCopyText(text);
            });
        } else {
                // Fallback for older browsers
            this.fallbackCopyText(text);
        }
    }
    
    fallbackCopyText(text) {
        // Fallback copy method for older browsers
                const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
                document.body.appendChild(textArea);
        textArea.focus();
                textArea.select();
        
        try {
            const successful = document.execCommand('copy');
            if (successful) {
                this.showCopySuccess();
            } else {
                console.log('Copy command failed');
            }
        } catch (err) {
            console.log('Copy failed:', err);
        }
        
                document.body.removeChild(textArea);
    }
    
    showCopySuccess() {
        // Update the copy button to show success
        const copyBtn = document.getElementById('copy-share-btn');
        if (copyBtn) {
            const originalText = copyBtn.textContent;
            copyBtn.textContent = 'Copied!';
            copyBtn.style.backgroundColor = '#4CAF50';
            setTimeout(() => {
                copyBtn.textContent = originalText;
                copyBtn.style.backgroundColor = '';
            }, 2000);
        }
    }
    
    getShareText() {
        const tileCount = this.getTileCount();
        const totalCorrect = this.score;
        const won = totalCorrect === tileCount;
        
        // Create Wordle-style visual representation
        let shareLines = ['Memaday'];
        shareLines.push(''); // Empty line
        
        // Calculate cumulative correct tiles per round
        let cumulativeCorrect = 0;
        this.roundScores.forEach((roundScore, index) => {
            const roundNum = index + 1;
            cumulativeCorrect += roundScore; // Add new correct tiles from this round
            const incorrectInRound = Math.max(0, tileCount - cumulativeCorrect);
            
            // Create emoji pattern: 🟩 for correct, ⬜ for incorrect
            // Ensure pattern length matches tile count
            const correctCount = Math.min(cumulativeCorrect, tileCount);
            const pattern = '🟩'.repeat(correctCount) + '⬜'.repeat(incorrectInRound);
            shareLines.push(`Round ${roundNum}: ${pattern} (${correctCount}/${tileCount})`);
        });
        
        shareLines.push(''); // Empty line
        shareLines.push(`Total: ${totalCorrect}/${tileCount} correct`);
        
        if (won) {
            shareLines.push('🎉 Perfect!');
        }
        
        // Get win streak from dailyManager
        const progress = dailyManager.getUserProgress();
        shareLines.push(`Streak: ${progress.winStreak || 0}`);
        shareLines.push('');
        shareLines.push('Play at: hippomemory.com');
        
        return shareLines.join('\n');
    }
    
    showConfetti() {
        // Create confetti container
        const confettiContainer = document.createElement('div');
        confettiContainer.id = 'confetti-container';
        confettiContainer.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 10000;
            overflow: hidden;
        `;
        document.body.appendChild(confettiContainer);
        
        // Confetti colors
        const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff', '#ffa500', '#800080'];
        
        // Create confetti particles
        const particleCount = 100;
        const duration = 4000; // 4 seconds
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            const color = colors[Math.floor(Math.random() * colors.length)];
            const size = Math.random() * 10 + 5; // 5-15px
            const startX = Math.random() * 100; // 0-100% of screen width
            const startY = -10; // Start above screen
            const endY = 100 + Math.random() * 20; // End below screen
            const rotation = Math.random() * 360;
            const rotationSpeed = (Math.random() - 0.5) * 720; // -360 to 360 degrees
            const horizontalDrift = (Math.random() - 0.5) * 100; // -50 to 50px
            
            particle.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                background-color: ${color};
                left: ${startX}%;
                top: ${startY}%;
                border-radius: ${Math.random() > 0.5 ? '50%' : '0'};
                opacity: 0.9;
                transform: rotate(${rotation}deg);
            `;
            
            confettiContainer.appendChild(particle);
            
            // Animate particle
            particle.animate([
                {
                    transform: `translate(0, 0) rotate(${rotation}deg)`,
                    opacity: 0.9
                },
                {
                    transform: `translate(${horizontalDrift}px, ${endY}vh) rotate(${rotation + rotationSpeed}deg)`,
                    opacity: 0
                }
            ], {
                duration: duration + Math.random() * 1000, // 4-5 seconds
                easing: 'cubic-bezier(0.5, 0, 0.5, 1)',
                fill: 'forwards'
            });
        }
        
        // Remove confetti container after animation
        setTimeout(() => {
            if (confettiContainer.parentNode) {
                confettiContainer.parentNode.removeChild(confettiContainer);
            }
        }, duration + 1000);
    }
    
    showFireworks() {
        // Create fireworks container
        const fireworksContainer = document.createElement('div');
        fireworksContainer.id = 'fireworks-container';
        fireworksContainer.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 10000;
            overflow: hidden;
        `;
        document.body.appendChild(fireworksContainer);
        
        // Fireworks colors - brighter, more vibrant
        const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff', '#ffa500', '#ff1493', '#00ff00', '#ffd700'];
        
        // Create multiple firework bursts
        const burstCount = 8; // Number of firework bursts
        const duration = 7000; // 7 seconds (longer than confetti)
        
        for (let burst = 0; burst < burstCount; burst++) {
            // Delay each burst
            const burstDelay = (burst * 600) + Math.random() * 300; // Stagger bursts
            
            setTimeout(() => {
                // Random position for each burst
                const burstX = 20 + Math.random() * 60; // 20-80% of screen width
                const burstY = 20 + Math.random() * 40; // 20-60% of screen height
                
                // Create particles for this burst
                const particleCount = 80; // More particles per burst
                
                for (let i = 0; i < particleCount; i++) {
                    const particle = document.createElement('div');
                    const color = colors[Math.floor(Math.random() * colors.length)];
                    const size = Math.random() * 12 + 8; // 8-20px (bigger than confetti)
                    
                    // Calculate angle and distance for radial explosion
                    const angle = (Math.PI * 2 * i) / particleCount + Math.random() * 0.5;
                    const distance = 100 + Math.random() * 150; // 100-250px distance
                    const endX = Math.cos(angle) * distance;
                    const endY = Math.sin(angle) * distance;
                    
                    // Random rotation
                    const rotation = Math.random() * 360;
                    const rotationSpeed = (Math.random() - 0.5) * 1080; // -540 to 540 degrees
                    
                    particle.style.cssText = `
                        position: absolute;
                        width: ${size}px;
                        height: ${size}px;
                        background-color: ${color};
                        left: ${burstX}%;
                        top: ${burstY}%;
                        border-radius: ${Math.random() > 0.3 ? '50%' : '0'};
                        opacity: 1;
                        transform: rotate(${rotation}deg);
                        box-shadow: 0 0 ${size}px ${color};
                    `;
                    
                    fireworksContainer.appendChild(particle);
                    
                    // Animate particle with radial explosion
                    particle.animate([
                        {
                            transform: `translate(0, 0) rotate(${rotation}deg) scale(1)`,
                            opacity: 1
                        },
                        {
                            transform: `translate(${endX}px, ${endY}px) rotate(${rotation + rotationSpeed}deg) scale(0.3)`,
                            opacity: 0
                        }
                    ], {
                        duration: 2000 + Math.random() * 1000, // 2-3 seconds per particle
                        easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                        fill: 'forwards'
                    });
                }
            }, burstDelay);
        }
        
        // Remove fireworks container after animation
        setTimeout(() => {
            if (fireworksContainer.parentNode) {
                fireworksContainer.parentNode.removeChild(fireworksContainer);
            }
        }, duration + 1000);
    }
    
    showModal(modalId) {
        document.getElementById(modalId).style.display = 'flex';
    }
    
    hideModal(modalId) {
        document.getElementById(modalId).style.display = 'none';
    }
    
    handleNextButton() {
        console.log('handleNextButton called, roundEvaluated:', this.roundEvaluated, 'viewingPhase:', this.viewingPhase);
        
        // If we're in the viewing phase, skip the timer and start the round
        if (this.viewingPhase) {
            this.clearRevealTimer();
            this.clearRevealTimeouts();
            // Make sure all tiles are flipped before starting memory phase
            this.tiles.forEach(tile => {
                tile.classList.add('flipped');
                tile.classList.remove('matched', 'correct', 'incorrect', 'revealed', 'tile-has-image');
                tile.textContent = '';
                tile.innerHTML = '';
                this.setQuestionMarkSize(tile);
            });
            this.flipTiles();
            this.startMemoryPhase();
            return;
        }
        
        if (this.roundEvaluated) {
            // Round is evaluated, continue to next round (or complete game)
            this.continueToNextRound();
        } else {
            // Round not evaluated yet, submit/evaluate the round
            // Check if this will complete the game
            const tileCount = this.getTileCount();
            if (this.correctTiles.size === tileCount || this.currentRound >= this.maxRounds) {
                // Last round, evaluate and then complete
                this.evaluateRound();
                // gameComplete will be called automatically by continueToNextRound
            } else {
                this.evaluateRound();
            }
        }
    }
    
    isImageItem(item) {
        // Check if item is an image object with url property
        return item && typeof item === 'object' && item.url && typeof item.url === 'string';
    }
    
    getItemValue(item) {
        // Get the value to use for matching (name for images, item itself for text)
        if (this.isImageItem(item)) {
            return item.name || item.url;
        }
        return item;
    }
    
    formatTileContent(item) {
        // Handle both text and image items
        if (!item) return '';
        
        // If it's an image item, return HTML for image
        if (this.isImageItem(item)) {
            return `<img src="${item.url}" alt="${item.name || ''}" class="tile-image" />`;
        }
        
        // Otherwise, treat as text
        const text = String(item);
        return this.formatTileText(text);
    }
    
    setTileContent(tile, item) {
        // Set tile content and manage image class
        const formattedContent = this.formatTileContent(item);
        tile.innerHTML = formattedContent;
        
        // Add or remove tile-has-image class based on content type
        if (this.isImageItem(item)) {
            tile.classList.add('tile-has-image');
        } else {
            tile.classList.remove('tile-has-image');
            this.adjustTileFontSize(tile);
        }
    }
    
    formatTileText(text) {
        if (!text) return '';
        
        // Check if content is emoji/symbol (single character or mostly emoji)
        const isEmoji = /^[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]$/u.test(text.trim()) || 
                       (text.length <= 2 && /[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u.test(text));
        
        // If it's an emoji or less than 10 characters, return as-is
        if (isEmoji || text.length < 10) {
            return text;
        }
        
        // Don't hyphenate text that already contains a space (e.g., "New Jersey")
        if (text.indexOf(' ') !== -1) {
            return text;
        }
        
        // For words 10+ characters without spaces, split in the middle with hyphen and line break
        const midpoint = Math.floor(text.length / 2);
        const firstPart = text.substring(0, midpoint);
        const secondPart = text.substring(midpoint);
        
        // Break in the middle with hyphen, preserving original case
        return firstPart + '-<br>' + secondPart;
    }
    
    adjustTileFontSize(tile) {
        // Skip font size adjustment if tile contains an image
        if (tile.querySelector('.tile-image')) {
            return;
        }
        
        // Get text from innerHTML or textContent (handle line breaks)
        // Remove HTML tags and line breaks for length calculation
        const rawText = tile.textContent || tile.innerText || '';
        if (!rawText) return;
        
        // Remove hyphens and extra whitespace for emoji detection
        const cleanText = rawText.replace(/[-]/g, '').trim();
        
        // Check if content is emoji/symbol (single character or mostly emoji)
        const isEmoji = /^[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]$/u.test(cleanText) || 
                       (cleanText.length <= 2 && /[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u.test(cleanText));
        
        // Wait for tile to be fully rendered
        requestAnimationFrame(() => {
            // Reset font size to check natural size
            tile.style.fontSize = '';
            const tileWidth = tile.offsetWidth || tile.clientWidth;
            const tileHeight = tile.offsetHeight || tile.clientHeight;
            // Use clean text length (without hyphens) for calculations
            const textLength = cleanText.length;
            
            if (tileWidth === 0 || tileHeight === 0) {
                // Tile not yet rendered, try again
                setTimeout(() => this.adjustTileFontSize(tile), 50);
                return;
            }
            
            // Calculate appropriate font size based on text length and tile size
            const minDimension = Math.min(tileWidth, tileHeight);
            
            // For emojis/symbols, use larger base size
            let baseSize;
            if (isEmoji) {
                baseSize = minDimension * 0.50; // Emojis need more space
            } else {
                // Balanced base size for readability while ensuring fit
                baseSize = minDimension * 0.24;
                
                // Scale based on text length - balanced approach
                if (textLength >= 20) {
                    baseSize = baseSize * (10 / textLength);
                } else if (textLength >= 16) {
                    baseSize = baseSize * (11 / textLength);
                } else if (textLength >= 12) {
                    baseSize = baseSize * (9 / textLength);
                } else if (textLength >= 10) {
                    baseSize = baseSize * (8.5 / textLength);
                } else if (textLength >= 8) {
                    baseSize = baseSize * 0.80;
                } else if (textLength >= 6) {
                    baseSize = baseSize * 0.85;
                }
            }
            
            // Ensure minimum and maximum readable sizes
            const minSize = isEmoji ? minDimension * 0.30 : Math.max(9, minDimension * 0.11);
            const maxSize = isEmoji ? minDimension * 0.70 : minDimension * 0.30;
            let fontSize = Math.max(minSize, Math.min(maxSize, baseSize));
            
            // Set initial font size
            tile.style.fontSize = `${fontSize}px`;
            
            // Check if text still overflows and reduce further if needed (only for non-emoji)
            if (!isEmoji) {
                requestAnimationFrame(() => {
                    // Check both width and height overflow
                    const scrollWidth = tile.scrollWidth;
                    const clientWidth = tile.clientWidth;
                    const scrollHeight = tile.scrollHeight;
                    const clientHeight = tile.clientHeight;
                    
                    let adjustedSize = fontSize;
                    
                    // Adjust for width overflow
                    if (scrollWidth > clientWidth && adjustedSize > minSize) {
                        const widthRatio = clientWidth / scrollWidth;
                        adjustedSize = adjustedSize * widthRatio * 0.92; // Slightly more aggressive to ensure fit
                    }
                    
                    // Adjust for height overflow (use the smaller of the two)
                    if (scrollHeight > clientHeight && adjustedSize > minSize) {
                        const heightRatio = clientHeight / scrollHeight;
                        const heightAdjusted = adjustedSize * heightRatio * 0.92;
                        adjustedSize = Math.min(adjustedSize, heightAdjusted);
                    }
                    
                    // Apply the final size, ensuring it's not below minimum
                    if (adjustedSize < fontSize) {
                        tile.style.fontSize = `${Math.max(minSize, adjustedSize)}px`;
                    }
                });
            }
        });
    }
    
    setupHomeScreen() {
        // Set date and puzzle number immediately so they're never wrong
        let dayNumber = 1;
        let todayFormatted = '';
        try {
            if (typeof dailyManager !== 'undefined' && dailyManager.getCurrentDayNumber) {
                dayNumber = dailyManager.getCurrentDayNumber();
            }
            const today = new Date();
            todayFormatted = today.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
        } catch (e) {
            console.error('setupHomeScreen date error', e);
            const today = new Date();
            todayFormatted = today.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
        }
        const gameNumberEl = document.getElementById('home-game-number');
        const gameDateEl = document.getElementById('home-game-date');
        if (gameNumberEl) gameNumberEl.textContent = `#${dayNumber}`;
        if (gameDateEl) gameDateEl.textContent = todayFormatted;

        // Defer streaks / in-progress check so DOM and dailyManager are ready
        const runDeferred = () => {
            try {
                this.updateHomeStreaks();
                this.checkInProgressGame(dayNumber);
                this.updateResetTodayLink(dayNumber);
            } catch (e) {
                console.error('setupHomeScreen deferred error', e);
            }
        };
        if (typeof requestAnimationFrame !== 'undefined') {
            requestAnimationFrame(runDeferred);
        } else {
            setTimeout(runDeferred, 0);
        }
    }
    
    updateResetTodayLink(dayNumber) {
        const resetLink = document.getElementById('reset-today-link');
        if (!resetLink) return;
        if (typeof dailyManager === 'undefined') return;

        const hostname = window.location.hostname;
        const isLocal = hostname === 'localhost' || hostname === '127.0.0.1' || hostname.startsWith('192.168.') || hostname.startsWith('10.');
        const isStaging = hostname.includes('staging');
        const isProduction = hostname.includes('hippomemory.com') && !isStaging; // Exclude staging from production check

        if (isProduction) {
            resetLink.style.display = 'none';
            return;
        }
        const progress = dailyManager.getUserProgress();
        const completion = dailyManager.checkCompletion(dayNumber, progress.lastPlayedDifficulty || 'medium');
        const hasInProgress = dailyManager.hasInProgressGame(dayNumber);
        
        // Show link if on localhost or staging, and user has completed or has in-progress game
        if ((isLocal || isStaging) && (completion.completed || hasInProgress)) {
            resetLink.style.display = 'inline-block';
        } else {
            resetLink.style.display = 'none';
        }
    }
    
    resetToday() {
        const dayNumber = dailyManager.getCurrentDayNumber();
        const progress = dailyManager.getUserProgress();
        
        // Check if user has made an attempt today
        const completion = dailyManager.checkCompletion(dayNumber, progress.lastPlayedDifficulty || 'medium');
        const hasInProgress = dailyManager.hasInProgressGame(dayNumber);
        
        if (!completion.completed && !hasInProgress) {
            // No attempt today, nothing to reset
            return;
        }
        
        // Confirm with user
        if (!confirm('Reset today\'s attempt? This will erase your progress for today and revert statistics to the start of the day.')) {
            return;
        }
        
        // Get the completion record for today
        const todayCompletion = progress.completions[dayNumber.toString()];
        
        if (todayCompletion) {
            // Store stats before today's attempt
            const statsBeforeToday = {
                totalGamesPlayed: progress.totalGamesPlayed - 1,
                totalGamesWon: progress.totalGamesWon - (todayCompletion.won ? 1 : 0),
                totalTimeSpent: progress.totalTimeSpent - (todayCompletion.won ? todayCompletion.timeToComplete : 0),
                fastestTime: progress.fastestTime,
                solveDistribution: {...progress.solveDistribution}
            };
            
            // Revert solve distribution
            if (todayCompletion.won && todayCompletion.roundsCompleted >= 1 && todayCompletion.roundsCompleted <= 4) {
                statsBeforeToday.solveDistribution[todayCompletion.roundsCompleted] = 
                    Math.max(0, (statsBeforeToday.solveDistribution[todayCompletion.roundsCompleted] || 0) - 1);
            }
            
            // Revert fastest time if this was the fastest
            if (todayCompletion.won && progress.fastestTime === todayCompletion.timeToComplete) {
                // Find the next fastest time from other completions
                let nextFastest = null;
                Object.values(progress.completions).forEach(comp => {
                    if (comp.won && comp.timeToComplete && comp.timeToComplete !== todayCompletion.timeToComplete) {
                        if (nextFastest === null || comp.timeToComplete < nextFastest) {
                            nextFastest = comp.timeToComplete;
                        }
                    }
                });
                statsBeforeToday.fastestTime = nextFastest;
            }
            
            // Revert average time
            if (statsBeforeToday.totalGamesWon > 0) {
                statsBeforeToday.averageTimeToComplete = statsBeforeToday.totalTimeSpent / statsBeforeToday.totalGamesWon;
            } else {
                statsBeforeToday.averageTimeToComplete = 0;
            }
            
            // Revert win percentage
            statsBeforeToday.winPercentage = statsBeforeToday.totalGamesPlayed > 0 
                ? statsBeforeToday.totalGamesWon / statsBeforeToday.totalGamesPlayed 
                : 0;
            
            // Check if we need to revert streaks
            const today = dailyManager.getDateFromDayNumber(dayNumber);
            const lastPlayedDate = progress.lastPlayedDate;
            
            // If today was the last played date, we need to revert streaks
            if (lastPlayedDate === today) {
                // Check if there was a previous completion
                const previousCompletions = Object.keys(progress.completions)
                    .map(d => parseInt(d))
                    .filter(d => d < dayNumber)
                    .sort((a, b) => b - a); // Sort descending
                
                if (previousCompletions.length > 0) {
                    // Find the most recent previous completion
                    const prevDay = previousCompletions[0];
                    const prevCompletion = progress.completions[prevDay.toString()];
                    const prevDate = prevCompletion.date;
                    
                    // Calculate days between previous and today
                    const prevDateObj = new Date(prevDate);
                    const todayDateObj = new Date(today);
                    const daysDiff = Math.floor((todayDateObj - prevDateObj) / (1000 * 60 * 60 * 24));
                    
                    if (daysDiff > 1) {
                        // There was a gap, so streaks should be 0
                        progress.attemptStreak = 0;
                        progress.winStreak = 0;
                    } else {
                        // Consecutive days - revert to previous streak values
                        // Recalculate streaks from history
                        this.recalculateStreaks(progress, prevDay);
                    }
                    progress.lastPlayedDate = prevDate;
                } else {
                    // No previous completions, reset streaks
                    progress.attemptStreak = 0;
                    progress.winStreak = 0;
                    progress.lastPlayedDate = null;
                }
            }
            
            // Apply reverted stats
            progress.totalGamesPlayed = statsBeforeToday.totalGamesPlayed;
            progress.totalGamesWon = statsBeforeToday.totalGamesWon;
            progress.totalTimeSpent = statsBeforeToday.totalTimeSpent;
            progress.averageTimeToComplete = statsBeforeToday.averageTimeToComplete;
            progress.winPercentage = statsBeforeToday.winPercentage;
            progress.fastestTime = statsBeforeToday.fastestTime;
            progress.solveDistribution = statsBeforeToday.solveDistribution;
            
            // Remove today's completion
            delete progress.completions[dayNumber.toString()];
        }
        
        // Clear in-progress game
        dailyManager.clearInProgressGame();
        
        // Clear last played difficulty if it was today
        const today = dailyManager.getDateFromDayNumber(dayNumber);
        if (progress.lastPlayedDate === today) {
            // Find the most recent previous completion to set lastPlayedDifficulty
            const previousCompletions = Object.keys(progress.completions)
                .map(d => parseInt(d))
                .sort((a, b) => b - a);
            
            if (previousCompletions.length > 0) {
                const prevDay = previousCompletions[0];
                const prevCompletion = progress.completions[prevDay.toString()];
                progress.lastPlayedDifficulty = prevCompletion.difficulty;
            } else {
                progress.lastPlayedDifficulty = null;
            }
        }
        
        // Save updated progress
        dailyManager.saveUserProgress(progress);
        
        // Refresh home screen
        this.setupHomeScreen();
        
        // Show Difficulty + Start, hide Admire Puzzle
        const difficultySelection = document.getElementById('difficulty-selection');
        const admirePuzzleArea = document.getElementById('admire-puzzle-area');
        if (difficultySelection) difficultySelection.style.display = '';
        if (admirePuzzleArea) admirePuzzleArea.style.display = 'none';
        
        const startGameBtn = document.getElementById('start-game-btn');
        if (startGameBtn) {
            startGameBtn.disabled = false;
            startGameBtn.textContent = 'Start';
        }
    }
    
    recalculateStreaks(progress, upToDay) {
        // Simple recalculation - count consecutive days from the end
        let attemptStreak = 0;
        let winStreak = 0;
        
        for (let day = upToDay; day >= 1; day--) {
            const completion = progress.completions[day.toString()];
            if (!completion || !completion.completed) {
                break;
            }
            attemptStreak++;
            if (completion.won) {
                winStreak++;
            } else {
                winStreak = 0;
            }
        }
        
        progress.attemptStreak = attemptStreak;
        progress.winStreak = winStreak;
    }
    
    updateHomeStreaks() {
        if (typeof dailyManager === 'undefined') return;
        try {
            const progress = dailyManager.getUserProgress();
            const playedEl = document.getElementById('home-stat-played');
            const streakEl = document.getElementById('home-stat-streak');
            const winPercentEl = document.getElementById('home-stat-win-percent');
            if (playedEl) playedEl.textContent = progress.totalGamesPlayed || 0;
            if (streakEl) streakEl.textContent = progress.winStreak || 0;
            if (winPercentEl) {
                const winPercent = progress.totalGamesPlayed > 0
                    ? Math.round((progress.totalGamesWon / progress.totalGamesPlayed) * 100)
                    : 0;
                winPercentEl.textContent = `${winPercent}%`;
            }
        } catch (e) {
            console.error('updateHomeStreaks error', e);
        }
    }
    
    checkInProgressGame(dayNumber) {
        const difficultySelection = document.getElementById('difficulty-selection');
        const admirePuzzleArea = document.getElementById('admire-puzzle-area');
        const difficultySelect = document.getElementById('difficulty-select');
        const startGameBtn = document.getElementById('start-game-btn');
        const statusEl = document.getElementById('home-status-message');
        const setStatus = (text) => {
            if (statusEl) {
                statusEl.textContent = text || '';
                statusEl.style.display = text ? 'block' : 'none';
            }
        };
        const showDifficultyAndStart = () => {
            if (difficultySelection) difficultySelection.style.display = 'flex';
            if (admirePuzzleArea) admirePuzzleArea.style.display = 'none';
            if (startGameBtn) {
                startGameBtn.disabled = false;
                startGameBtn.textContent = 'Start';
            }
        };
        const showAdmireOnly = () => {
            if (difficultySelection) difficultySelection.style.display = 'none';
            if (admirePuzzleArea) admirePuzzleArea.style.display = 'flex';
            if (startGameBtn) {
                startGameBtn.disabled = true;
                startGameBtn.textContent = 'Start';
            }
            setStatus('');
        };
        
        try {
            if (typeof dailyManager === 'undefined') {
                showDifficultyAndStart();
                setStatus('');
            } else {
                const selectedDifficulty = difficultySelect ? difficultySelect.value : 'medium';
                if (dailyManager.hasInProgressGame(dayNumber)) {
                    const inProgress = dailyManager.getInProgressGame();
                    showDifficultyAndStart();
                    if (startGameBtn && inProgress) {
                        if (inProgress.difficulty === selectedDifficulty) {
                            startGameBtn.disabled = false;
                            startGameBtn.textContent = 'Resume';
                            setStatus('');
                        } else {
                            startGameBtn.disabled = true;
                            startGameBtn.textContent = 'Start';
                            const cap = inProgress.difficulty.charAt(0).toUpperCase() + inProgress.difficulty.slice(1);
                            setStatus('You have an in-progress ' + cap + ' game. Select "' + cap + '" above to Resume, or use "Reset Today" below to start over.');
                        }
                    }
                } else {
                    const progress = dailyManager.getUserProgress();
                    const completion = dailyManager.checkCompletion(dayNumber, selectedDifficulty);
                    if (completion && completion.completed === true) {
                        showAdmireOnly();
                        setStatus('');
                    } else {
                        showDifficultyAndStart();
                        setStatus('');
                    }
                }
            }
        } catch (e) {
            console.error('checkInProgressGame error', e);
            showDifficultyAndStart();
            setStatus('');
        }
        
        if (difficultySelect && !difficultySelect.hasAttribute('data-listener-added')) {
            difficultySelect.setAttribute('data-listener-added', 'true');
            difficultySelect.addEventListener('change', () => {
                this.checkInProgressGame(dayNumber);
            });
        }
    }
    
    resetToday() {
        const dayNumber = dailyManager.getCurrentDayNumber();
        const progress = dailyManager.getUserProgress();
        
        // Check if user has made an attempt today
        const completion = dailyManager.checkCompletion(dayNumber, progress.lastPlayedDifficulty || 'medium');
        const hasInProgress = dailyManager.hasInProgressGame(dayNumber);
        
        if (!completion.completed && !hasInProgress) {
            // No attempt today, nothing to reset
            return;
        }
        
        // Confirm with user
        if (!confirm('Reset today\'s attempt? This will erase your progress for today and revert statistics to the start of the day.')) {
            return;
        }
        
        // Get the completion record for today
        const todayCompletion = progress.completions[dayNumber.toString()];
        
        if (todayCompletion) {
            // Store stats before today's attempt
            const statsBeforeToday = {
                totalGamesPlayed: progress.totalGamesPlayed - 1,
                totalGamesWon: progress.totalGamesWon - (todayCompletion.won ? 1 : 0),
                totalTimeSpent: progress.totalTimeSpent - (todayCompletion.won ? todayCompletion.timeToComplete : 0),
                fastestTime: progress.fastestTime,
                solveDistribution: {...progress.solveDistribution}
            };
            
            // Revert solve distribution
            if (todayCompletion.won && todayCompletion.roundsCompleted >= 1 && todayCompletion.roundsCompleted <= 4) {
                statsBeforeToday.solveDistribution[todayCompletion.roundsCompleted] = 
                    Math.max(0, (statsBeforeToday.solveDistribution[todayCompletion.roundsCompleted] || 0) - 1);
            }
            
            // Revert fastest time if this was the fastest
            if (todayCompletion.won && progress.fastestTime === todayCompletion.timeToComplete) {
                // Find the next fastest time from other completions
                let nextFastest = null;
                Object.values(progress.completions).forEach(comp => {
                    if (comp.won && comp.timeToComplete && comp.timeToComplete !== todayCompletion.timeToComplete) {
                        if (nextFastest === null || comp.timeToComplete < nextFastest) {
                            nextFastest = comp.timeToComplete;
                        }
                    }
                });
                statsBeforeToday.fastestTime = nextFastest;
            }
            
            // Revert average time
            if (statsBeforeToday.totalGamesWon > 0) {
                statsBeforeToday.averageTimeToComplete = statsBeforeToday.totalTimeSpent / statsBeforeToday.totalGamesWon;
            } else {
                statsBeforeToday.averageTimeToComplete = 0;
            }
            
            // Revert win percentage
            statsBeforeToday.winPercentage = statsBeforeToday.totalGamesPlayed > 0 
                ? statsBeforeToday.totalGamesWon / statsBeforeToday.totalGamesPlayed 
                : 0;
            
            // Check if we need to revert streaks
            const today = dailyManager.getDateFromDayNumber(dayNumber);
            const lastPlayedDate = progress.lastPlayedDate;
            
            // If today was the last played date, we need to revert streaks
            if (lastPlayedDate === today) {
                // Check if there was a previous completion
                const previousCompletions = Object.keys(progress.completions)
                    .map(d => parseInt(d))
                    .filter(d => d < dayNumber)
                    .sort((a, b) => b - a); // Sort descending
                
                if (previousCompletions.length > 0) {
                    // Find the most recent previous completion
                    const prevDay = previousCompletions[0];
                    const prevCompletion = progress.completions[prevDay.toString()];
                    const prevDate = prevCompletion.date;
                    
                    // Calculate days between previous and today
                    const prevDateObj = new Date(prevDate);
                    const todayDateObj = new Date(today);
                    const daysDiff = Math.floor((todayDateObj - prevDateObj) / (1000 * 60 * 60 * 24));
                    
                    if (daysDiff > 1) {
                        // There was a gap, so streaks should be 0
                        progress.attemptStreak = 0;
                        progress.winStreak = 0;
                    } else {
                        // Consecutive days - recalculate streaks from history
                        this.recalculateStreaks(progress, prevDay);
                    }
                    progress.lastPlayedDate = prevDate;
                } else {
                    // No previous completions, reset streaks
                    progress.attemptStreak = 0;
                    progress.winStreak = 0;
                    progress.lastPlayedDate = null;
                }
            }
            
            // Apply reverted stats
            progress.totalGamesPlayed = statsBeforeToday.totalGamesPlayed;
            progress.totalGamesWon = statsBeforeToday.totalGamesWon;
            progress.totalTimeSpent = statsBeforeToday.totalTimeSpent;
            progress.averageTimeToComplete = statsBeforeToday.averageTimeToComplete;
            progress.winPercentage = statsBeforeToday.winPercentage;
            progress.fastestTime = statsBeforeToday.fastestTime;
            progress.solveDistribution = statsBeforeToday.solveDistribution;
            
            // Remove today's completion
            delete progress.completions[dayNumber.toString()];
        }
        
        // Clear in-progress game
        dailyManager.clearInProgressGame();
        
        // Clear last played difficulty if it was today
        const today = dailyManager.getDateFromDayNumber(dayNumber);
        if (progress.lastPlayedDate === today) {
            // Find the most recent previous completion to set lastPlayedDifficulty
            const previousCompletions = Object.keys(progress.completions)
                .map(d => parseInt(d))
                .sort((a, b) => b - a);
            
            if (previousCompletions.length > 0) {
                const prevDay = previousCompletions[0];
                const prevCompletion = progress.completions[prevDay.toString()];
                progress.lastPlayedDifficulty = prevCompletion.difficulty;
            } else {
                progress.lastPlayedDifficulty = null;
            }
        }
        
        // Save updated progress
        dailyManager.saveUserProgress(progress);
        
        // Refresh home screen
        this.setupHomeScreen();
        
        // Show Difficulty + Start, hide Admire Puzzle
        const difficultySelection = document.getElementById('difficulty-selection');
        const admirePuzzleArea = document.getElementById('admire-puzzle-area');
        if (difficultySelection) difficultySelection.style.display = '';
        if (admirePuzzleArea) admirePuzzleArea.style.display = 'none';
        
        const startGameBtn = document.getElementById('start-game-btn');
        if (startGameBtn) {
            startGameBtn.disabled = false;
            startGameBtn.textContent = 'Start';
        }
    }
    
    showAdmirePuzzle() {
        const dayNumber = dailyManager.getCurrentDayNumber();
        const progress = dailyManager.getUserProgress();
        const completionRecord = progress.completions[dayNumber.toString()];
        // Use difficulty they played at (dropdown is hidden after completion)
        const selectedDifficulty = (completionRecord && completionRecord.difficulty) || progress.lastPlayedDifficulty || 'medium';
        
        // Set difficulty level
        this.difficultyLevel = selectedDifficulty;
        this.currentDayNumber = dayNumber;
        
        // Load puzzle
        try {
            this.currentPuzzle = dailyManager.loadDailyPuzzle(dayNumber, selectedDifficulty);
        } catch (error) {
            console.error('Error loading puzzle:', error);
            alert('Error loading puzzle. Please try again.');
            return;
        }
        
        // Get completion data
        const completion = dailyManager.checkCompletion(dayNumber, selectedDifficulty);
        
        // Initialize game state to show completed puzzle
        this.gameStarted = true;
        this.tileItems = this.getDailyPuzzleItems();
        this.correctTiles = new Set();
        this.finalUserGuesses = new Map();
        this.showingAnswers = false;
        this.score = completion.score || 0;
        this.currentRound = completion.roundsCompleted || 1;
        this.overallTimer = completion.timeToComplete || 0;
        
        // Show game screen (skip auto-start)
        this.showGameScreen(true);
        
        // Create tiles like in a normal game
        this.createTiles();
        
        // Restore user guesses from completion record and determine which tiles were correct
        this.finalUserGuesses.clear();
        this.correctTiles.clear();
        
        if (completionRecord && completionRecord.userGuesses) {
            // Restore guesses and determine correct tiles by comparing guesses to correct answers
            completionRecord.userGuesses.forEach((guess, index) => {
                const correctAnswer = this.tileItems[index];
                let restoredGuess = null;
                
                if (guess !== undefined && guess !== null) {
                    // Restore guess - handle both string and object formats
                    if (typeof guess === 'string') {
                        restoredGuess = guess;
                    } else if (guess && typeof guess === 'object' && guess.name) {
                        // Image item
                        restoredGuess = guess;
                    } else {
                        // Fallback to correct answer
                        restoredGuess = correctAnswer;
                    }
                } else {
                    // Fallback to correct answer
                    restoredGuess = correctAnswer;
                }
                
                this.finalUserGuesses.set(index, restoredGuess);
                
                // Determine if this tile was correct by comparing guess to correct answer
                const guessValue = this.isImageItem(restoredGuess) ? restoredGuess.name : restoredGuess;
                const correctValue = this.isImageItem(correctAnswer) ? correctAnswer.name : correctAnswer;
                
                if (guessValue === correctValue) {
                    this.correctTiles.add(index);
                }
            });
        } else {
            // No stored guesses - if game was won, all tiles are correct
            // Otherwise, we can't know which were correct, so assume none (will show all as incorrect)
            if (completion.won) {
                for (let i = 0; i < this.tileItems.length; i++) {
                    this.correctTiles.add(i);
                    this.finalUserGuesses.set(i, this.tileItems[i]);
                }
            } else {
                // Old completion record without guesses - initialize with correct answers
                // but mark none as correct (since we don't know)
                for (let i = 0; i < this.tileItems.length; i++) {
                    this.finalUserGuesses.set(i, this.tileItems[i]);
                }
            }
        }
        
        // Mark that we're in admire mode (so showAllTilesAfterGame knows not to try to read from currentMatches)
        this.isAdmireMode = true;
        
        // Show all tiles in their final state (like after game completion)
        this.showAllTilesAfterGame();
        
        // Reset admire mode flag after setup
        this.isAdmireMode = false;
        
        // Update UI with completion data
        this.updateUI();
        this.updateTimerDisplay();
        
        // Update overall timer in the info bar
        const overallTimerEl = document.getElementById('overall-timer');
        if (overallTimerEl && this.overallTimer !== undefined) {
            const mins = Math.floor(this.overallTimer / 60);
            const secs = Math.floor(this.overallTimer % 60);
            overallTimerEl.textContent = `${mins}:${secs.toString().padStart(2, '0')}`;
        }
        
        // Show round results message
        const tileCount = this.getTileCount();
        const correctCount = this.correctTiles.size;
        if (correctCount === tileCount && this.currentRound === 1) {
            this.showMessage(`Perfect! Round ${this.currentRound} complete: ${correctCount}/${tileCount} correct`, 'success');
        } else {
            this.showMessage(`Round ${this.currentRound} complete: ${correctCount}/${tileCount} correct`, correctCount > 0 ? 'success' : 'error');
        }
        
        // Hide game controls and show play again container
        this.setupAdmireMode();
    }
    
    setupAdmireMode() {
        // Hide game controls
        const nextBtn = document.getElementById('next-btn');
        const showAllBtn = document.getElementById('show-all-btn');
        
        if (nextBtn) nextBtn.style.display = 'none';
        if (showAllBtn) showAllBtn.style.display = 'none';
        
        // Keep score, round, and timer visible - they're already updated
        // Don't hide them like before
        
        // Show play again container (which has the Home button)
        const playAgainContainer = document.getElementById('play-again-container');
        if (playAgainContainer) {
            playAgainContainer.style.display = 'block';
        }
        
        // Show "See Answers" button if game was not won
        const seeAnswersBtn = document.getElementById('see-answers-btn');
        const tileCount = this.getTileCount();
        const won = this.correctTiles.size === tileCount;
        if (seeAnswersBtn && !won) {
            seeAnswersBtn.style.display = 'block';
        }
        
        // Disable tile clicks
        this.tiles.forEach(tile => {
            tile.style.pointerEvents = 'none';
            tile.style.cursor = 'default';
        });
    }
    
    updateTimerDisplay() {
        const timerDisplay = document.getElementById('timer-display');
        if (timerDisplay && this.overallTimer !== undefined) {
            const mins = Math.floor(this.overallTimer / 60);
            const secs = Math.floor(this.overallTimer % 60);
            timerDisplay.textContent = `${mins}:${secs.toString().padStart(2, '0')}`;
            timerDisplay.style.display = 'block';
        }
    }
    
    recalculateStreaks(progress, upToDay) {
        // Simple recalculation - count consecutive days from the end
        let attemptStreak = 0;
        let winStreak = 0;
        
        for (let day = upToDay; day >= 1; day--) {
            const completion = progress.completions[day.toString()];
            if (!completion || !completion.completed) {
                break;
            }
            attemptStreak++;
            if (completion.won) {
                winStreak++;
            } else {
                winStreak = 0;
            }
        }
        
        progress.attemptStreak = attemptStreak;
        progress.winStreak = winStreak;
    }
    
    selectDifficulty(difficulty) {
        this.difficultyLevel = difficulty;
        try {
            if (typeof dailyManager === 'undefined') {
                this.showGameScreen();
                return;
            }
            const dayNumber = dailyManager.getCurrentDayNumber();
            const completion = dailyManager.checkCompletion(dayNumber, difficulty);
            if (completion && completion.completed) {
                this.checkInProgressGame(dayNumber);
                return;
            }
            if (dailyManager.hasInProgressGame(dayNumber)) {
                const inProgress = dailyManager.getInProgressGame();
                if (inProgress.difficulty === difficulty) {
                    this.resumeGame(inProgress);
                    return;
                }
                alert(`You have an in-progress ${inProgress.difficulty} puzzle. Please complete it first.`);
                return;
            }
        } catch (e) {
            console.error('selectDifficulty error', e);
        }
        this.showGameScreen();
    }
    
    backToHome() {
        const homeScreen = document.getElementById('home-screen');
        const gameScreen = document.getElementById('game-screen');
        
        if (homeScreen && gameScreen) {
            gameScreen.style.display = 'none';
            homeScreen.style.display = 'flex';
            document.body.classList.remove('game-active');
            
            // Reset game state
            this.resetGame();
            
            // Update home screen
            this.setupHomeScreen();
        }
    }
    
    showGameScreen(skipStart = false) {
        console.log('showGameScreen called, gameStarted:', this.gameStarted);
        const homeScreen = document.getElementById('home-screen');
        const gameScreen = document.getElementById('game-screen');
        
        if (!homeScreen || !gameScreen) {
            console.error('Home screen or game screen not found!', { homeScreen, gameScreen });
            return;
        }
        
        homeScreen.style.display = 'none';
        gameScreen.style.display = 'flex';
        document.body.classList.add('game-active');
        
        // Apply background color to body when game is active
        this.applyBackgroundColor();
        
        // Automatically start the game when coming from home screen (unless in admire mode)
        if (!this.gameStarted && !skipStart) {
            console.log('Starting game...');
            this.startGame();
        }
    }
    
    getDailyPuzzleItems() {
        // Load puzzle from daily manager
        if (!this.currentPuzzle) {
            const dayNumber = dailyManager.getCurrentDayNumber();
            this.currentDayNumber = dayNumber;
            try {
                this.currentPuzzle = dailyManager.loadDailyPuzzle(dayNumber, this.difficultyLevel);
            } catch (error) {
                console.error('Error loading daily puzzle:', error);
                alert('Error loading puzzle. Please try again.');
                this.backToHome();
                return [];
            }
        }
        
        // Return items in order (not shuffled - positions are fixed)
        return this.currentPuzzle.items || [];
    }
    
    createTiles() {
        const items = this.getDailyPuzzleItems();
        if (items.length === 0) {
            return; // Error loading puzzle
        }
        
        const tileCount = items.length;
        this.tileItems = [...items]; // Store items for evaluation
        const gameBoard = document.getElementById('game-board');
        gameBoard.innerHTML = '';
        this.tiles = [];
        
        // Set grid layout based on tile count
        if (tileCount === 12) {
            // 4x3 grid for Easy mode (4 columns, 3 rows)
            gameBoard.style.gridTemplateColumns = 'repeat(4, 1fr)';
        } else {
            // 4x4 grid for Medium/Hard mode
            gameBoard.style.gridTemplateColumns = 'repeat(4, 1fr)';
        }
        // Set consistent row spacing for all modes
        gameBoard.style.rowGap = '8px';
        gameBoard.style.minHeight = 'auto'; // Remove min-height constraint for all modes
        
        items.forEach((item, index) => {
            const tile = document.createElement('div');
            tile.className = 'tile flipped';
            tile.dataset.index = index;
            tile.textContent = '';
            tile.addEventListener('click', () => this.handleTileClick(index));
            gameBoard.appendChild(tile);
            this.tiles.push(tile);
        });
        
        // Set question mark sizes after tiles are rendered
        setTimeout(() => {
            this.tiles.forEach(tile => {
                this.setQuestionMarkSize(tile);
            });
        }, 0);
        
        // Update game day info
        if (this.currentPuzzle) {
            const gameDayInfo = document.getElementById('game-day-info');
            if (gameDayInfo) {
                gameDayInfo.textContent = `#${this.currentPuzzle.dayNumber}`;
            }
        }
    }
    
    startGame() {
        console.log('startGame called, gameStarted:', this.gameStarted);
        if (this.gameStarted) {
            console.log('Game already started, returning');
            return;
        }
        
        this.gameStarted = true;
        this.score = 0;
        this.roundScores = [];
        this.currentRound = 0;
        this.correctTiles.clear();
        this.matchCount = 0;
        this.incorrectMatches.clear();
        this.gameStartTime = Date.now();
        this.overallTimer = 0;
        
        // Start overall timer
        this.startOverallTimer();
        
        this.updateUI();
        
        const nextBtn = document.getElementById('next-btn');
        if (nextBtn) {
            nextBtn.disabled = true;
            nextBtn.textContent = 'Next';
            nextBtn.style.display = 'block'; // Ensure button is visible
        }
        this.roundEvaluated = false;
        
        // Hide timer and show all button
        const timerDisplay = document.getElementById('timer-display');
        const showAllBtn = document.getElementById('show-all-btn');
        if (timerDisplay) {
            timerDisplay.style.display = 'none';
        }
        if (showAllBtn) {
            showAllBtn.style.display = 'none';
        }
        
        // Load puzzle and set reveal time
        if (this.currentPuzzle) {
            this.revealTimeRemaining = this.currentPuzzle.revealTime;
        } else {
            this.updateDifficultySettings();
        }
        
        this.showMessage('Memorize the tiles!', 'info');
        this.createTiles();
        this.startViewingPhase();
    }
    
    startOverallTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
        }
        
        this.timerInterval = setInterval(() => {
            if (this.tabVisible && this.gameStarted) {
                this.overallTimer += 1;
                this.updateOverallTimerDisplay();
            }
        }, 1000);
    }
    
    stopOverallTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    }
    
    updateOverallTimerDisplay() {
        const timerEl = document.getElementById('overall-timer');
        if (timerEl) {
            const minutes = Math.floor(this.overallTimer / 60);
            const seconds = this.overallTimer % 60;
            timerEl.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        }
    }
    
    startViewingPhase() {
        this.viewingPhase = true;
        this.memoryPhase = false;
        this.revealedTiles = [];
        
        // Disable tile clicks during viewing phase
        this.tiles.forEach(tile => {
            tile.classList.add('viewing-phase');
        });
        
        // Reveal tiles one by one with 2 second pause between each
        this.revealTilesSequentially();
    }
    
    revealTilesSequentially() {
        this.showMessage('Memorize the content and position of each tile above.', 'info');
        
        const showAllBtn = document.getElementById('show-all-btn');
        const nextBtn = document.getElementById('next-btn');
        const timerDisplay = document.getElementById('timer-display');
        
        // Update timer based on difficulty
        this.updateDifficultySettings();
        
        // Clear any existing reveal timeouts
        this.clearRevealTimeouts();
        
        // For Easy and Medium difficulty, show "Show All" button
        if (this.difficultyLevel === 'easy' || this.difficultyLevel === 'medium') {
            // Show "Show All" button
            if (showAllBtn) {
                showAllBtn.style.display = 'block';
                showAllBtn.onclick = () => {
                    // Clear all pending sequential reveal timeouts
                    this.clearRevealTimeouts();
                    
                    // Reveal all tiles immediately
                    this.tiles.forEach((tile, index) => {
                        tile.classList.remove('flipped');
                        this.setTileContent(tile, this.tileItems[index]);
                    });
                    
                    // Enable Next button immediately
                    if (nextBtn) {
                        nextBtn.disabled = false;
                        nextBtn.textContent = 'Start Round';
                        nextBtn.style.display = 'block'; // Ensure button is visible
                    }
                    
                    // Hide Show All button
                    if (showAllBtn) {
                        showAllBtn.style.display = 'none';
                    }
                    
                    // Keep timer visible and running - don't clear it
                    // Timer will continue counting down
                };
            }
        } else {
            // Hide Show All button for Hard
            if (showAllBtn) {
                showAllBtn.style.display = 'none';
            }
            }
            
            // Show and start the countdown timer
            if (timerDisplay) {
                timerDisplay.style.display = 'block';
            }
            this.updateTimerDisplay();
            this.startRevealTimer();
            
            // Wait 1 second before revealing the first tile
        const initialTimeout = setTimeout(() => {
                // Reveal each tile one by one
                this.tiles.forEach((tile, index) => {
                const tileTimeout = setTimeout(() => {
                        tile.classList.remove('flipped');
                        this.setTileContent(tile, this.tileItems[index]);
                        
                    // After the last tile is revealed, enable the Next button and hide Show All button
                        if (index === this.tiles.length - 1) {
                            if (nextBtn) {
                                nextBtn.disabled = false;
                                nextBtn.textContent = 'Start Round';
                            }
                        // Hide Show All button after all tiles are revealed
                        const showAllBtn = document.getElementById('show-all-btn');
                        if (showAllBtn) {
                            showAllBtn.style.display = 'none';
                            }
                            // Timer will handle starting the round when it reaches 0
                        }
                    }, index * 2000); // 2 second pause between each tile
                this.revealTimeouts.push(tileTimeout);
                });
            }, 1000); // 1 second delay before first tile
        this.revealTimeouts.push(initialTimeout);
    }
    
    startRevealTimer() {
        // Clear any existing timer
        if (this.revealTimer) {
            clearInterval(this.revealTimer);
        }
        
        // Update timer every second
        this.revealTimer = setInterval(() => {
            this.revealTimeRemaining--;
            this.updateTimerDisplay();
            
            // When timer reaches 0, start the memory phase
            if (this.revealTimeRemaining <= 0) {
                this.clearRevealTimer();
                this.flipTiles();
                this.startMemoryPhase();
            }
        }, 1000);
    }
    
    clearRevealTimer() {
        if (this.revealTimer) {
            clearInterval(this.revealTimer);
            this.revealTimer = null;
        }
        const timerDisplay = document.getElementById('timer-display');
        if (timerDisplay) {
        timerDisplay.style.display = 'none';
        }
    }
    
    clearRevealTimeouts() {
        // Clear all pending setTimeout calls for sequential tile reveals
        this.revealTimeouts.forEach(timeoutId => {
            clearTimeout(timeoutId);
        });
        this.revealTimeouts = [];
    }
    
    updateTimerDisplay() {
        const timerDisplay = document.getElementById('timer-display');
        const minutes = Math.floor(this.revealTimeRemaining / 60);
        const seconds = this.revealTimeRemaining % 60;
        timerDisplay.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }
    
    flipTiles() {
        // Clear the reveal timer and any pending reveal timeouts
        this.clearRevealTimer();
        this.clearRevealTimeouts();
        
        // Hide Show All button when transitioning from reveal to memory phase
        const showAllBtn = document.getElementById('show-all-btn');
        if (showAllBtn) {
            showAllBtn.style.display = 'none';
        }
        
        this.tiles.forEach(tile => {
            // Reset tile completely - remove all classes and clear text
            tile.classList.remove('matched', 'correct', 'incorrect', 'revealed', 'viewing-phase');
            tile.classList.add('flipped');
            tile.classList.remove('tile-has-image');
            tile.textContent = '';
            tile.innerHTML = '';
            // Set consistent question mark size based on tile size
            this.setQuestionMarkSize(tile);
        });
        this.showMessage('Now click tiles to reveal and remember!', 'info');
    }
    
    setQuestionMarkSize(tile) {
        // Calculate question mark size as a percentage of tile size
        const tileSize = Math.min(tile.offsetWidth, tile.offsetHeight);
        const questionMarkSize = tileSize * 0.4; // 40% of tile size
        tile.style.setProperty('--question-mark-size', `${questionMarkSize}px`);
    }
    
    startMemoryPhase() {
        this.viewingPhase = false;
        this.memoryPhase = true;
        this.currentRound = 1;
        this.currentMatches = new Map();
        this.matchCount = 0;
        this.correctTiles.clear();
        this.incorrectMatches.clear(); // Reset incorrect matches for new game
        this.swapMode = false;
        this.swapWord = null;
        this.swapOldTileIndex = null;
        
        // Hide Show All button when memory phase starts
        const showAllBtn = document.getElementById('show-all-btn');
        if (showAllBtn) {
            showAllBtn.style.display = 'none';
        }
        
        // Reset button state
        const nextBtn = document.getElementById('next-btn');
        nextBtn.disabled = true;
        nextBtn.textContent = 'Next';
        this.roundEvaluated = false;
        
        // Enable tile clicks for memory phase
        this.tiles.forEach(tile => {
            tile.classList.remove('viewing-phase');
        });
        
        // Create shuffled list of items to match (only unmatched items)
        const unmatchedItems = this.tileItems.filter((item, index) => !this.correctTiles.has(index));
        this.targetItems = [...unmatchedItems].sort(() => Math.random() - 0.5);
        this.currentTargetIndex = 0;
        
        if (this.targetItems.length > 0) {
            this.currentTarget = this.targetItems[this.currentTargetIndex];
            const tileCount = this.getTileCount();
            const remaining = tileCount - this.correctTiles.size;
            const targetDisplay = this.isImageItem(this.currentTarget) ? this.currentTarget.name : this.currentTarget;
            if (this.isImageItem(this.currentTarget)) {
                const imageHtml = `<img src="${this.currentTarget.url}" alt="${this.currentTarget.name}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 8px; vertical-align: middle; margin: 0 8px;" />`;
                this.showMessage(`Round ${this.currentRound}: Find "${targetDisplay}" ${imageHtml}`, 'info', true);
            } else {
                this.showMessage(`Round ${this.currentRound}: Find "${targetDisplay}"`, 'info');
            }
        } else {
            // All tiles are already correct (shouldn't happen at start, but handle it)
            this.currentTarget = null;
            this.showMessage('All tiles are already matched!', 'info');
        }
    }
    
    // Helper function to check if a word can be placed on a tile
    // Returns true if the placement is allowed, false if it should be blocked
    // CRITICAL: This function ONLY checks if THIS SPECIFIC WORD was incorrectly placed on THIS SPECIFIC TILE
    // It does NOT check any other words or any other tiles
    canPlaceWord(word, tileIndex) {
        // Validate inputs
        if (!word || tileIndex === undefined || tileIndex === null) {
            return false;
        }
        
        // Don't allow placing on already correct tiles
        if (this.correctTiles.has(tileIndex)) {
            return false;
        }
        
        // In Hard mode, allow repeating incorrect guesses (skip the check)
        if (this.difficultyLevel === 'hard') {
            return true;
        }
        
        // For Easy and Medium modes, check if THIS SPECIFIC WORD was incorrectly placed on THIS SPECIFIC TILE before
        // We only block if the EXACT same word was incorrectly placed on the EXACT same tile
        // Format: "word|tileIndex"
        // Use getItemValue to get the comparable value (handles both text and image items)
        const wordValue = this.getItemValue(word);
        const matchKey = `${wordValue}|${tileIndex}`;
        const isBlocked = this.incorrectMatches.has(matchKey);
        
        return !isBlocked;
    }
    
    handleTileClick(index) {
        if (!this.memoryPhase || this.viewingPhase) {
            return;
        }
        
        // If round is evaluated (complete), allow clicking incorrect tiles to highlight the Next button
        if (this.roundEvaluated) {
            const tile = this.tiles[index];
            if (tile.classList.contains('incorrect')) {
                this.highlightNextButton();
            }
            return;
        }
        
        // Don't allow clicking already correct tiles
        if (this.correctTiles.has(index)) {
            return;
        }
        
        const tile = this.tiles[index];
        
        // Handle swap mode FIRST - when in swap mode, we're placing swapWord, not currentTarget
        if (this.swapMode) {
            this.handleSwap(index);
            return;
        }
        
        // Check if this target word can be placed on this tile
        // This check only applies when NOT in swap mode
        if (!this.canPlaceWord(this.currentTarget, index)) {
            this.showErrorToast(`Already guessed! Try another spot.`);
            return;
        }
        
        // Check if this target word is already matched to another tile
        if (this.currentMatches.has(this.currentTarget)) {
            // Enter swap mode
            this.swapMode = true;
            this.swapWord = this.currentTarget;
            this.swapOldTileIndex = this.currentMatches.get(this.currentTarget);
            
            // Clear the old tile
            const oldTile = this.tiles[this.swapOldTileIndex];
            oldTile.classList.remove('matched');
            oldTile.classList.add('flipped');
            oldTile.innerHTML = '';
            oldTile.textContent = '';
            oldTile.classList.remove('tile-has-image');
            this.setQuestionMarkSize(oldTile);
            
            // Remove from matches
            this.currentMatches.delete(this.currentTarget);
            this.matchCount--;
            
            const swapWordDisplay = this.isImageItem(this.swapWord) ? this.swapWord.name : this.swapWord;
            if (this.isImageItem(this.swapWord)) {
                const imageHtml = `<img src="${this.swapWord.url}" alt="${this.swapWord.name}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 8px; vertical-align: middle; margin: 0 8px;" />`;
                this.showMessage(`"${swapWordDisplay}" was already matched.<br>Click a tile to place "${swapWordDisplay}" ${imageHtml}`, 'info', true);
            } else {
                this.showMessage(`"${swapWordDisplay}" was already matched. Click a tile to place it there.`, 'info');
            }
            return;
        }
        
        // Check if this tile already has a match
        const existingMatch = Array.from(this.currentMatches.entries()).find(([word, tileIdx]) => tileIdx === index);
        if (existingMatch) {
            // This tile already has a word - we need to swap
            const [oldWord, oldTileIdx] = existingMatch;
            
            // Check if placing currentTarget on this tile is allowed
            if (!this.canPlaceWord(this.currentTarget, index)) {
                this.showErrorToast(`Already guessed! Try another spot.`);
                return;
            }
            
            this.currentMatches.delete(oldWord);
            this.matchCount--; // Decrease count since we're removing a match
            
            // Place the new word on this tile
            tile.classList.remove('flipped');
            tile.classList.add('matched');
            this.setTileContent(tile, this.currentTarget);
            this.currentMatches.set(this.currentTarget, index);
            this.matchCount++;
            
            // Enter swap mode for the old word
            this.swapMode = true;
            this.swapWord = oldWord;
            this.swapOldTileIndex = index; // The tile where it was (now occupied by new word)
            
            const tileCount = this.getTileCount();
            const remaining = tileCount - this.correctTiles.size;
            // Update next button state if match count dropped below remaining
            if (this.matchCount < remaining) {
                const nextBtn = document.getElementById('next-btn');
                nextBtn.disabled = true;
                nextBtn.textContent = 'Next';
            }
            const oldWordDisplay = this.isImageItem(oldWord) ? oldWord.name : oldWord;
            if (this.isImageItem(oldWord)) {
                const imageHtml = `<img src="${oldWord.url}" alt="${oldWord.name}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 8px; vertical-align: middle; margin: 0 8px;" />`;
                this.showMessage(`"${oldWordDisplay}" was replaced.<br>Click a tile to place "${oldWordDisplay}" ${imageHtml}`, 'info', true);
            } else {
                this.showMessage(`"${oldWordDisplay}" was replaced. Click a tile to place "${oldWordDisplay}" there.`, 'info');
            }
            return;
        }
        
        // Store the match
        this.currentMatches.set(this.currentTarget, index);
        this.matchCount++;
        
        // Show the target word on the tile (but not green/red yet)
        tile.classList.remove('flipped');
        tile.classList.add('matched');
        this.setTileContent(tile, this.currentTarget);
        
        const tileCount = this.getTileCount();
        const remaining = tileCount - this.correctTiles.size;
        
        // Check if all matches are made
        if (this.matchCount >= remaining) {
            // All matches made, enable Next button with "Submit" text
            const nextBtn = document.getElementById('next-btn');
            nextBtn.disabled = false;
            nextBtn.textContent = 'Submit';
            this.roundEvaluated = false;
            this.showMessage(`All tiles matched! Review your choices and click "Submit" when ready.`, 'info');
        } else {
            // Move to next target
            this.currentTargetIndex++;
            if (this.currentTargetIndex < this.targetItems.length) {
            this.currentTarget = this.targetItems[this.currentTargetIndex];
                const targetDisplay = this.isImageItem(this.currentTarget) ? this.currentTarget.name : this.currentTarget;
                if (this.isImageItem(this.currentTarget)) {
                    const imageHtml = `<img src="${this.currentTarget.url}" alt="${this.currentTarget.name}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 8px; vertical-align: middle; margin: 0 8px;" />`;
                    this.showMessage(`Round ${this.currentRound}: Find "${targetDisplay}" ${imageHtml}`, 'info', true);
                } else {
                    this.showMessage(`Round ${this.currentRound}: Find "${targetDisplay}"`, 'info');
                }
            } else {
                // All targets have been presented, but not all matches are made
                this.showMessage(`Round ${this.currentRound}: Continue matching tiles`, 'info');
            }
        }
    }
    
    handleSwap(index) {
        // Validate that we're in swap mode and have a swapWord
        if (!this.swapMode || !this.swapWord) {
            return;
        }
        
        // Don't allow clicking already correct tiles
        if (this.correctTiles.has(index)) {
            return;
        }
        
        const tile = this.tiles[index];
        
        // Check if this tile already has a match
        const existingMatch = Array.from(this.currentMatches.entries()).find(([word, tileIdx]) => tileIdx === index);
        if (existingMatch) {
            // This tile has another word - we need to swap them
            const [otherWord, otherTileIdx] = existingMatch;
            
            // CRITICAL: Check if placing swapWord (the word we're trying to place) on this tile is allowed
            // We ONLY check if swapWord was incorrectly placed here, NOT otherWord or any other word
            const wordToPlace = this.swapWord; // Store in local variable to ensure we're checking the right word
            if (!this.canPlaceWord(wordToPlace, index)) {
                this.showErrorToast(`Already guessed! Try another spot.`);
                return;
            }
            
            this.currentMatches.delete(otherWord);
            // Don't change matchCount - we're swapping, not adding/removing
            
            // Place the swap word on this tile
            tile.classList.remove('flipped');
            tile.classList.add('matched');
            this.setTileContent(tile, this.swapWord);
            this.currentMatches.set(this.swapWord, index);
            
            // Enter swap mode for the other word that was displaced
            this.swapWord = otherWord;
            this.swapOldTileIndex = index; // The tile where it was (now occupied by swap word)
            
            const tileCount = this.getTileCount();
            const remaining = tileCount - this.correctTiles.size;
            // Check if all matches are still made after swap
            const nextBtn = document.getElementById('next-btn');
            if (this.matchCount >= remaining) {
                nextBtn.disabled = false;
                nextBtn.textContent = 'Submit';
                this.roundEvaluated = false;
            } else {
                nextBtn.disabled = true;
                nextBtn.textContent = 'Next';
            }
            const otherWordDisplay = this.isImageItem(otherWord) ? otherWord.name : otherWord;
            if (this.isImageItem(otherWord)) {
                const imageHtml = `<img src="${otherWord.url}" alt="${otherWord.name}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 8px; vertical-align: middle; margin: 0 8px;" />`;
                this.showMessage(`"${otherWordDisplay}" was replaced.<br>Click a tile to place "${otherWordDisplay}" ${imageHtml}`, 'info', true);
            } else {
                this.showMessage(`"${otherWordDisplay}" was replaced. Click a tile to place "${otherWordDisplay}" there.`, 'info');
            }
            return; // Stay in swap mode for the other word
        }
        
        // CRITICAL: Check if placing swapWord (the word we're trying to place) on this tile is allowed
        // We ONLY check if swapWord was incorrectly placed here, NOT any other word
        const wordToPlace = this.swapWord; // Store in local variable to ensure we're checking the right word
        if (!this.canPlaceWord(wordToPlace, index)) {
            this.showErrorToast(`Already guessed! Try another spot.`);
            return;
        }
        
        // Place the swap word on the new tile (tile is empty)
        tile.classList.remove('flipped');
        tile.classList.add('matched');
        this.setTileContent(tile, wordToPlace);
        this.currentMatches.set(wordToPlace, index);
        this.matchCount++;
        
        // Exit swap mode and continue
        this.swapMode = false;
        this.swapWord = null;
        this.swapOldTileIndex = null;
        
        const tileCount = this.getTileCount();
        const remaining = tileCount - this.correctTiles.size;
        
        // Check if all matches are made
        // remaining should equal the number of unmatched tiles (not already correct)
        const nextBtn = document.getElementById('next-btn');
        if (this.matchCount >= remaining) {
            // All matches made, enable Next button with "Submit" text
            nextBtn.disabled = false;
            nextBtn.textContent = 'Submit';
            this.roundEvaluated = false;
            this.showMessage(`All tiles matched! Review your choices and click "Submit" when ready.`, 'info');
        } else {
            // Disable button if not all matches are made
            nextBtn.disabled = true;
            nextBtn.textContent = 'Next';
            // Move to next target
            this.currentTargetIndex++;
            if (this.currentTargetIndex < this.targetItems.length) {
                this.currentTarget = this.targetItems[this.currentTargetIndex];
                const targetDisplay = this.isImageItem(this.currentTarget) ? this.currentTarget.name : this.currentTarget;
                if (this.isImageItem(this.currentTarget)) {
                    const imageHtml = `<img src="${this.currentTarget.url}" alt="${this.currentTarget.name}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 8px; vertical-align: middle; margin: 0 8px;" />`;
                    this.showMessage(`Round ${this.currentRound}: Find "${targetDisplay}" ${imageHtml}`, 'info', true);
                } else {
                    this.showMessage(`Round ${this.currentRound}: Find "${targetDisplay}"`, 'info');
                }
            } else {
                // All targets have been presented, but not all matches are made
                // This shouldn't happen, but handle it gracefully
                this.showMessage(`Round ${this.currentRound}: Continue matching tiles`, 'info');
            }
        }
    }
    
    evaluateRound() {
        // Mark round as evaluated
        this.roundEvaluated = true;
        
        // Evaluate all matches
        let correctCount = 0;
        const newCorrectTiles = new Set();
        
        this.currentMatches.forEach((tileIndex, targetItem) => {
            const actualItem = this.tileItems[tileIndex];
            // Check if the matched target item matches the actual item on the tile
            // Use getItemValue for proper comparison (handles both text and image items)
            const targetValue = this.getItemValue(targetItem);
            const actualValue = this.getItemValue(actualItem);
            if (targetValue === actualValue || targetItem === actualItem) {
                newCorrectTiles.add(tileIndex);
                correctCount++;
            } else {
                // Track incorrect matches for future rounds
                const matchKey = `${targetValue}|${tileIndex}`;
                this.incorrectMatches.add(matchKey);
            }
        });
        
        // Calculate score: 1 point per correct tile (simplified scoring)
        const roundScore = correctCount; // 1 point per correct tile
        this.score += roundScore;
        
        // Track round score (number of correct tiles in this round)
        this.roundScores[this.currentRound - 1] = roundScore;
        
        // Update correct tiles set
        this.correctTiles = new Set([...this.correctTiles, ...newCorrectTiles]);
        
        // Show results on tiles (green for correct, red for incorrect)
        this.showMatchResults();
        
        // Update UI
        this.updateUI();
        
        // Don't hide incorrect tiles yet - keep them visible (red) until continue button is clicked
        // updateTilesAfterRound() will be called when continue button is clicked
        
        // Update Next button text based on game state
        const nextBtn = document.getElementById('next-btn');
        const tileCount = this.getTileCount();
        if (this.correctTiles.size === tileCount || this.currentRound >= this.maxRounds) {
            // Game is complete - hide button and show modal after 0.5 seconds
            nextBtn.style.display = 'none';
            setTimeout(() => {
                this.gameComplete();
            }, 500);
        } else if (this.currentRound < this.maxRounds) {
            // Show continue button for next round
            nextBtn.textContent = 'Continue to Next Round';
            nextBtn.style.display = 'block';
            nextBtn.disabled = false;
        }
        
        // Show round summary (this will display the section)
        this.showRoundResults(correctCount, roundScore);
    }
    
    continueToNextRound() {
        // Disable Next button and reset state
        const nextBtn = document.getElementById('next-btn');
        nextBtn.disabled = true;
        nextBtn.textContent = 'Next';
        this.roundEvaluated = false;
        
        // Hide Show All button (shouldn't be visible between rounds)
        const showAllBtn = document.getElementById('show-all-btn');
        if (showAllBtn) {
            showAllBtn.style.display = 'none';
        }
        
        // Update tiles display (hide incorrect ones, keep correct ones visible)
        this.updateTilesAfterRound();
        
        // Check if game is complete
        const tileCount = this.getTileCount();
        if (this.correctTiles.size === tileCount || this.currentRound >= this.maxRounds) {
            // Game complete - hide button and show modal after 0.5 seconds
            nextBtn.style.display = 'none';
            setTimeout(() => {
                this.gameComplete();
            }, 500);
        } else {
            this.startNextRound();
        }
    }
    
    showMatchResults() {
        // Show green/red for each match
        this.currentMatches.forEach((tileIndex, targetItem) => {
            const tile = this.tiles[tileIndex];
            const actualItem = this.tileItems[tileIndex];
            
            tile.classList.remove('matched');
            
            if (actualItem === targetItem) {
                // Correct match
                tile.classList.add('correct');
            } else {
                // Incorrect match
                tile.classList.add('incorrect');
            }
        });
    }
    
    showRoundResults(correctCount, roundScore) {
        const totalCorrect = this.correctTiles.size;
        
        const tileCount = this.getTileCount();
        if (correctCount === tileCount && this.currentRound === 1) {
            this.showMessage(`Perfect! Round ${this.currentRound} complete: ${correctCount}/${tileCount} correct`, 'success');
        } else {
            this.showMessage(`Round ${this.currentRound} complete: ${correctCount}/${tileCount} correct`, correctCount > 0 ? 'success' : 'error');
        }
        
        // Button state is already set in evaluateRound()
    }
    
    highlightNextButton() {
        const nextBtn = document.getElementById('next-btn');
        if (!nextBtn) {
            return;
        }
        
        // Add highlight and shake classes
        nextBtn.classList.add('highlight-shake');
        
        // Remove the classes after animation completes (0.5s)
        setTimeout(() => {
            nextBtn.classList.remove('highlight-shake');
        }, 500);
    }
    
    updateTilesAfterRound() {
        this.tiles.forEach((tile, index) => {
            if (this.correctTiles.has(index)) {
                // Show correct tiles (keep them visible)
                tile.classList.remove('flipped', 'matched', 'incorrect');
                tile.classList.add('correct', 'revealed');
                this.setTileContent(tile, this.tileItems[index]);
            } else {
                // Hide incorrect tiles for next round
                tile.classList.remove('revealed', 'correct', 'incorrect', 'matched');
                tile.classList.add('flipped');
                tile.innerHTML = '';
                tile.textContent = '';
                tile.classList.remove('tile-has-image');
            }
        });
    }
    
    startNextRound() {
        this.currentRound++;
        this.currentMatches = new Map();
        this.matchCount = 0;
        this.swapMode = false;
        this.swapWord = null;
        this.swapOldTileIndex = null;
        
        // Hide Show All button (only shown during initial reveal phase)
        const showAllBtn = document.getElementById('show-all-btn');
        if (showAllBtn) {
            showAllBtn.style.display = 'none';
        }
        
        // Initialize round score if not already set
        if (!this.roundScores[this.currentRound - 1]) {
            this.roundScores[this.currentRound - 1] = 0;
        }
        
        // Re-enable tile clicks for the new round
        this.tiles.forEach(tile => {
            tile.classList.remove('viewing-phase');
        });
        
        // Hide tiles that aren't correct yet
        this.tiles.forEach((tile, index) => {
            if (!this.correctTiles.has(index)) {
                tile.classList.remove('revealed', 'correct', 'incorrect', 'matched');
                tile.classList.add('flipped');
                tile.innerHTML = '';
                tile.textContent = '';
                tile.classList.remove('tile-has-image');
                this.setQuestionMarkSize(tile);
            }
        });
        
        // Create shuffled list of remaining items to match
        const unmatchedItems = this.tileItems.filter((item, index) => !this.correctTiles.has(index));
        this.targetItems = [...unmatchedItems].sort(() => Math.random() - 0.5);
        this.currentTargetIndex = 0;
        
        // Check if all tiles are already correct
        if (this.targetItems.length === 0) {
            // All tiles are correct, game should be complete
            const tileCount = this.getTileCount();
            if (this.correctTiles.size === tileCount) {
                // Game is complete
                const nextBtn = document.getElementById('next-btn');
                if (nextBtn) {
                    nextBtn.style.display = 'none';
                }
                setTimeout(() => {
                    this.gameComplete();
                }, 500);
                return;
            }
        }
        
        this.currentTarget = this.targetItems[this.currentTargetIndex];
        
        if (this.currentTarget) {
            const targetDisplay = this.isImageItem(this.currentTarget) ? this.currentTarget.name : this.currentTarget;
            if (this.isImageItem(this.currentTarget)) {
                const imageHtml = `<img src="${this.currentTarget.url}" alt="${this.currentTarget.name}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 8px; vertical-align: middle; margin: 0 8px;" />`;
                this.showMessage(`Round ${this.currentRound}: Find "${targetDisplay}" ${imageHtml}`, 'info', true);
            } else {
                this.showMessage(`Round ${this.currentRound}: Find "${targetDisplay}"`, 'info');
            }
        }
    }
    
    gameComplete() {
        const totalCorrect = this.correctTiles.size;
        const tileCount = this.getTileCount();
        const won = totalCorrect === tileCount;
        const isPerfect = won && this.currentRound === 1; // Perfect = all correct in round 1
        
        // Stop overall timer
        this.stopOverallTimer();
        
        // Capture user guesses before recording completion
        this.captureUserGuesses();
        
        // Record completion with dailyManager
        if (this.currentDayNumber) {
            const timeToComplete = this.overallTimer; // Time in seconds
            
            // Convert finalUserGuesses Map to a serializable format
            const userGuessesArray = [];
            for (let i = 0; i < this.tileItems.length; i++) {
                const guess = this.finalUserGuesses.get(i);
                if (guess) {
                    // Store as string for text items, or object for image items
                    if (typeof guess === 'string') {
                        userGuessesArray[i] = guess;
                    } else if (guess && typeof guess === 'object') {
                        userGuessesArray[i] = { name: guess.name, url: guess.url };
                    } else {
                        userGuessesArray[i] = this.tileItems[i]; // Fallback to correct answer
                    }
                } else {
                    userGuessesArray[i] = this.tileItems[i]; // Fallback to correct answer
                }
            }
            
            dailyManager.recordCompletion(
                this.currentDayNumber,
                this.difficultyLevel,
                won,
                this.score,
                this.currentRound,
                timeToComplete,
                userGuessesArray
            );
            
            // Clear in-progress game
            dailyManager.clearInProgressGame();
        }
        
        // Update win streak if they won
        if (won) {
            this.updateWinStreak();
        }
        
        // Show fireworks for perfect games, confetti for regular wins
        if (won) {
            if (isPerfect) {
                this.showFireworks();
            } else {
                this.showConfetti();
            }
        }
        
        // Show completion modal automatically
        this.showCompletionModal(won, isPerfect);
        
        // Update UI to reflect final state
        this.updateUI();
        
        // Hide round complete section
        const nextBtn = document.getElementById('next-btn');
        nextBtn.disabled = true;
        nextBtn.textContent = 'Next';
        nextBtn.style.display = 'none';
        this.roundEvaluated = false;
    }
    
    captureUserGuesses() {
        // Capture what the user guessed for each tile
        this.finalUserGuesses.clear();
        this.tiles.forEach((tile, index) => {
            // Get what's currently displayed on the tile (user's guess)
            let userGuess = null;
            
            if (this.correctTiles.has(index)) {
                // For correct tiles, the user's guess is the same as the correct answer
                userGuess = this.tileItems[index];
            } else {
                // For incorrect tiles, find what the user guessed from currentMatches
                // currentMatches maps targetItem -> tileIndex, so we need to reverse lookup
                for (const [targetItem, tileIdx] of this.currentMatches.entries()) {
                    if (tileIdx === index) {
                        userGuess = targetItem;
                        break;
                    }
                }
                // If not found in currentMatches, try to get from tile content
                if (!userGuess) {
                    // Try to extract from tile's current content
                    const tileText = tile.textContent || tile.innerText || '';
                    if (tileText.trim()) {
                        // Try to find matching item
                        userGuess = this.tileItems.find(item => {
                            const itemValue = this.isImageItem(item) ? item.name : item;
                            return itemValue === tileText.trim();
                        }) || tileText.trim();
                    }
                }
            }
            
            // Store the user's guess (or correct answer if tile is correct)
            this.finalUserGuesses.set(index, userGuess || this.tileItems[index]);
        });
    }
    
    showAllTilesAfterGame() {
        // If we haven't captured guesses yet (e.g., when dismissing modal), capture them now
        // Skip if we're in admire mode (guesses will be loaded from completion record)
        if (!this.isAdmireMode && this.finalUserGuesses.size === 0) {
            this.captureUserGuesses();
        }
        
        // Show all tiles with their actual content (correct in green, incorrect in red)
        // Start by showing user guesses
        this.showingAnswers = false;
        this.updateTilesDisplay();
    }
    
    updateTilesDisplay() {
        // Show tiles based on whether we're showing answers or guesses
        this.tiles.forEach((tile, index) => {
            tile.classList.remove('flipped', 'matched', 'viewing-phase');
            
            if (this.showingAnswers) {
                // Show correct answers
            this.setTileContent(tile, this.tileItems[index]);
                if (this.correctTiles.has(index)) {
                    tile.classList.add('correct');
                    tile.classList.remove('incorrect');
                } else {
                    // Even incorrect tiles show correct answer in green when showing answers
                    tile.classList.add('correct');
                    tile.classList.remove('incorrect');
                }
            } else {
                // Show user guesses
                const userGuess = this.finalUserGuesses.get(index);
                if (userGuess) {
                    this.setTileContent(tile, userGuess);
                } else {
                    this.setTileContent(tile, this.tileItems[index]);
                }
                
            if (this.correctTiles.has(index)) {
                tile.classList.add('correct');
                tile.classList.remove('incorrect');
            } else {
                tile.classList.add('incorrect');
                tile.classList.remove('correct');
                }
            }
        });
    }
    
    toggleAnswersView() {
        this.showingAnswers = !this.showingAnswers;
        this.updateTilesDisplay();
        
        // Update button text
        const seeAnswersBtn = document.getElementById('see-answers-btn');
        if (seeAnswersBtn) {
            seeAnswersBtn.textContent = this.showingAnswers ? 'My Guesses' : 'See Answers';
        }
    }
    
    showCompletionModal(won, isPerfect = false) {
        const winModal = document.getElementById('win-modal');
        const winTitle = document.getElementById('win-title-text');
        const streakCount = document.getElementById('streak-count');
        const roundScoresList = document.getElementById('round-scores-list');
        const totalScoreDisplay = document.getElementById('total-score-display');
        
        // Set title - "Perfect!" for perfect games, "You Win!" for regular wins
        if (winTitle) {
            if (isPerfect) {
                winTitle.textContent = 'Perfect!';
            } else if (won) {
                winTitle.textContent = 'You Win!';
            } else {
                winTitle.textContent = 'Thanks For Playing';
            }
        }
        
        // Get fresh progress after recording completion
        const progress = dailyManager.getUserProgress();
        
        // Update statistics
        const playedEl = document.getElementById('stat-played');
        const winPercentEl = document.getElementById('stat-win-percent');
        const currentStreakEl = document.getElementById('stat-current-streak');
        const maxStreakEl = document.getElementById('stat-max-streak');
        
        if (playedEl) playedEl.textContent = progress.totalGamesPlayed || 0;
        if (winPercentEl) {
            const winPercent = progress.totalGamesPlayed > 0 
                ? Math.round((progress.totalGamesWon / progress.totalGamesPlayed) * 100) 
                : 0;
            winPercentEl.textContent = `${winPercent}%`;
        }
        if (currentStreakEl) currentStreakEl.textContent = progress.winStreak || 0;
        if (maxStreakEl) maxStreakEl.textContent = progress.longestStreak || 0;
        
        // Update time stats
        const completionTimeEl = document.getElementById('stat-completion-time');
        const avgTimeEl = document.getElementById('stat-avg-time');
        const fastestTimeEl = document.getElementById('stat-fastest-time');
        
        const formatTime = (seconds) => {
            const mins = Math.floor(seconds / 60);
            const secs = seconds % 60;
            return `${mins}:${secs.toString().padStart(2, '0')}`;
        };
        
        if (completionTimeEl && won) {
            completionTimeEl.textContent = formatTime(this.overallTimer);
        } else if (completionTimeEl) {
            completionTimeEl.textContent = '—';
        }
        
        if (avgTimeEl) {
            if (progress.averageTimeToComplete > 0) {
                avgTimeEl.textContent = formatTime(Math.round(progress.averageTimeToComplete));
            } else {
                avgTimeEl.textContent = '—';
            }
        }
        
        if (fastestTimeEl) {
            if (progress.fastestTime !== null) {
                fastestTimeEl.textContent = formatTime(progress.fastestTime);
            } else {
                fastestTimeEl.textContent = '—';
            }
        }
        
        // Update solve distribution (pass current round for highlighting)
        const solvedRound = won ? this.currentRound : null;
        this.updateSolveDistribution(progress, solvedRound);
        
        // Show modal
        if (winModal) {
            winModal.style.display = 'flex';
        }
    }
    
    showStatsModal() {
        const progress = dailyManager.getUserProgress();
        
        // Update statistics
        const playedEl = document.getElementById('stats-modal-played');
        const winPercentEl = document.getElementById('stats-modal-win-percent');
        const currentStreakEl = document.getElementById('stats-modal-current-streak');
        const maxStreakEl = document.getElementById('stats-modal-max-streak');
        
        if (playedEl) playedEl.textContent = progress.totalGamesPlayed || 0;
        if (winPercentEl) {
            const winPercent = progress.totalGamesPlayed > 0 
                ? Math.round((progress.totalGamesWon / progress.totalGamesPlayed) * 100) 
                : 0;
            winPercentEl.textContent = `${winPercent}%`;
        }
        if (currentStreakEl) currentStreakEl.textContent = progress.winStreak || 0;
        if (maxStreakEl) maxStreakEl.textContent = progress.longestStreak || 0;
        
        // Update time stats
        const avgTimeEl = document.getElementById('stats-modal-avg-time');
        const fastestTimeEl = document.getElementById('stats-modal-fastest-time');
        
        const formatTime = (seconds) => {
            const mins = Math.floor(seconds / 60);
            const secs = seconds % 60;
            return `${mins}:${secs.toString().padStart(2, '0')}`;
        };
        
        if (avgTimeEl) {
            if (progress.averageTimeToComplete > 0) {
                avgTimeEl.textContent = formatTime(Math.round(progress.averageTimeToComplete));
            } else {
                avgTimeEl.textContent = '—';
            }
        }
        
        if (fastestTimeEl) {
            if (progress.fastestTime !== null) {
                fastestTimeEl.textContent = formatTime(progress.fastestTime);
            } else {
                fastestTimeEl.textContent = '—';
            }
        }
        
        // Update solve distribution (no current round highlighting for stats modal)
        this.updateSolveDistribution(progress, null, 'stats-modal-distribution-chart');
        
        // Show modal
        this.showModal('stats-modal');
    }
    
    updateSolveDistribution(progress, currentRound = null, chartElementId = 'solve-distribution-chart') {
        const chartEl = document.getElementById(chartElementId);
        if (!chartEl) return;
        
        chartEl.innerHTML = '';
        
        // Get distribution - ensure it's properly initialized
        const distribution = progress.solveDistribution || {1: 0, 2: 0, 3: 0, 4: 0};
        
        // Get max count for scaling (only from rounds with wins)
        const counts = [distribution[1] || 0, distribution[2] || 0, distribution[3] || 0, distribution[4] || 0];
        const maxCount = Math.max(...counts, 1);
        
        // Create bars for rounds 1-4
        for (let round = 1; round <= 4; round++) {
            const count = distribution[round] || 0;
            const percentage = maxCount > 0 ? (count / maxCount) * 100 : 0;
            
            const barContainer = document.createElement('div');
            barContainer.className = 'distribution-bar-container';
            
            const roundLabel = document.createElement('div');
            roundLabel.className = 'distribution-round-label';
            roundLabel.textContent = round.toString();
            
            const barWrapper = document.createElement('div');
            barWrapper.className = 'distribution-bar-wrapper';
            
            const bar = document.createElement('div');
            bar.className = 'distribution-bar';
            if (count > 0) {
                bar.style.width = `${percentage}%`;
                // Highlight current round if this is the round they just solved
                if (currentRound !== null && round === currentRound) {
                    bar.classList.add('distribution-bar-current');
                }
            } else {
                bar.style.width = '0%';
            }
            
            // Add count label inside the bar (at the right edge of the bar)
            if (count > 0) {
                const countLabel = document.createElement('div');
                countLabel.className = 'distribution-count-label';
                countLabel.textContent = count.toString();
                bar.appendChild(countLabel);
            }
            
            barWrapper.appendChild(bar);
            
            barContainer.appendChild(roundLabel);
            barContainer.appendChild(barWrapper);
            
            chartEl.appendChild(barContainer);
        }
    }
    
    updateUI() {
        document.getElementById('score').textContent = this.score;
        document.getElementById('round').textContent = this.currentRound;
    }
    
    showMessage(text, type = 'info', isHtml = false) {
        const messageEl = document.getElementById('message');
        if (!messageEl) return;
        
        // Clear any existing content first to prevent duplication
        messageEl.textContent = '';
        messageEl.innerHTML = '';
        // Force a reflow to ensure content is cleared
        messageEl.offsetHeight;
        // Set the new message
        if (isHtml) {
            messageEl.innerHTML = text;
        } else {
        messageEl.textContent = text;
        }
        messageEl.className = `message ${type}`;
    }
    
    showErrorToast(message) {
        const toastModal = document.getElementById('error-toast-modal');
        const toastMessage = document.getElementById('error-toast-message');
        
        if (!toastModal || !toastMessage) {
            // Fallback to regular message if modal elements don't exist
            this.showMessage(message, 'error');
            return;
        }
        
        // Clear any existing classes and timeouts
        toastModal.classList.remove('showing', 'hiding');
        toastModal.style.animation = '';
        
        // Set the message
        toastMessage.textContent = message;
        
        // Show the modal with slideDown animation
        toastModal.style.display = 'block';
        // Force reflow to ensure display change is applied before animation
        toastModal.offsetHeight;
        toastModal.classList.add('showing');
        
        // Auto-dismiss after 3 seconds
        setTimeout(() => {
            toastModal.classList.remove('showing');
            toastModal.classList.add('hiding');
            setTimeout(() => {
                toastModal.style.display = 'none';
                toastModal.classList.remove('hiding');
            }, 300);
        }, 3000);
    }
    
    resetGame() {
        this.gameStarted = false;
        this.viewingPhase = false;
        this.memoryPhase = false;
        this.currentRound = 0;
        this.currentMatches = new Map();
        this.correctTiles.clear();
        this.incorrectMatches.clear();
        this.matchCount = 0;
        this.tileItems = [];
        this.targetItems = [];
        this.currentTargetIndex = 0;
        this.currentTarget = null;
        this.swapMode = false;
        this.swapWord = null;
        this.swapOldTileIndex = null;
        this.score = 0;
        this.currentDayNumber = null;
        this.currentPuzzle = null;
        this.gameStartTime = null;
        this.overallTimer = 0;
        this.stopOverallTimer();
        
        const nextBtn = document.getElementById('next-btn');
        if (nextBtn) {
        nextBtn.disabled = true;
        nextBtn.textContent = 'Next';
        }
        this.roundEvaluated = false;
        this.updateUI();
        this.showMessage('');
        
        const gameBoard = document.getElementById('game-board');
        if (gameBoard) {
        gameBoard.innerHTML = '';
        }
        
        // Hide play again button
        const playAgainContainer = document.getElementById('play-again-container');
        if (playAgainContainer) {
            playAgainContainer.style.display = 'none';
        }
    }
    
    // playAgain removed - use backToHome() instead for Memaday
}

// Initialize game when page loads (handle both normal load and readyState already complete)
function initGame() {
    if (window.__hippoMemoryGame) return;
    window.__hippoMemoryGame = new MemoryGame();
}
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGame);
} else {
    initGame();
}

