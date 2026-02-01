# BetterMemory

A memory tile game inspired by NYT Connections, but focused on remembering what's on each tile rather than matching groups.

## Game Description

BetterMemory is a memory challenge game where:
- 16 tiles are displayed with various items (words, objects, etc.)
- You have a few seconds to memorize their positions
- Tiles flip over and you must click them to reveal and find specific items
- As you progress through levels, the viewing time decreases, making it more challenging
- Score points by correctly identifying tiles

## Getting Started

### Prerequisites

- Node.js (v24.12.0 or later)
- npm (v11.6.2 or later)

### Installation

No dependencies required! The game uses vanilla JavaScript, HTML, and CSS.

### Running the Game

Start the game server:

```bash
npm start
```

Or directly:

```bash
node index.js
```

Then open your browser and navigate to:

```
http://localhost:3000
```

## Project Structure

```
bettermemory/
├── index.js          # HTTP server to serve the game
├── index.html        # Game HTML structure
├── style.css         # Game styling
├── game.js           # Game logic and mechanics
├── package.json      # Project configuration
├── README.md         # Project documentation
└── .gitignore        # Git ignore rules
```

## How to Play

1. Click "Start Game" to begin
2. Tiles will be revealed for a few seconds - memorize their positions!
3. After tiles flip, you'll be asked to find a specific item
4. Click tiles to reveal them and find the target item
5. Correct answers earn points and advance you through levels
6. Each level gives you less time to memorize the tiles

## License

ISC

