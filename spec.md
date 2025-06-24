// SPECIFICATION DOCUMENT: "The Game" Strategy Simulator
// Purpose: Simulate "The Game" with different AI strategies, compare their performance, and keep the codebase ready for future web integration.

---

# "The Game" Strategy Simulator — Specification

## 1. Purpose

- Simulate the card game "The Game" using different AI strategies.
- Allow easy experimentation and comparison of strategies by running many games automatically.
- Collect and display basic statistics (e.g., average cards played, win/loss rate).
- Console-based for now, but code should be modular and ready for a web interface later.

---

## 2. Core Features

### a. Game Logic

- Implements the basic rules of "The Game" (single-player version).
- Manages deck, piles, hand, and turn sequence.
- Enforces all game rules (ascending/descending piles, "10-jump" rule).
- No multiplayer or advanced features in this version.

### b. Strategy Interface

- Each strategy is a function that receives the current game state and returns the move(s) to play.
- Strategies are easy to add or modify.
- Example strategies:
  - "Closest Card": Always play the card closest to a pile.
  - "Random": Play a random valid card.

### c. Simulation & Statistics

- Run a user-defined number of games for each strategy.
- Collect and display:
  - Average number of cards played before the game ends.
  - Number of wins/losses (if applicable).
- Output results in a clear, readable format.

### d. Simple CLI

- Command-line interface to:
  - Select a strategy.
  - Set the number of games to simulate.
  - View results.

### e. Web-Ready Structure

- Game logic and strategies are separated from CLI code.
- No direct input/output in core logic (pure functions/classes).
- All state and actions are serializable (JSON-friendly).

---

## 3. File Structure

```
src/
  game.ts         // Game logic and rules
  strategies.ts   // Strategy functions
  simulate.ts     // Simulation runner and statistics
  cli.ts          // Console interface
  types.ts        // Shared TypeScript types
```

---

## 4. Technical Requirements

- Language: TypeScript (strict typing, no `any`)
- No external dependencies except for CLI prettiness (optional)
- No database or external services

---

# Roadmap

1. **Define TypeScript types** for cards, piles, hand, game state, and moves.
2. **Implement core game logic** (`game.ts`): deck, piles, hand, turn sequence, and rule enforcement.
3. **Create the strategy interface** and implement at least two basic strategies (`strategies.ts`).
4. **Build the simulation runner** (`simulate.ts`): run multiple games, collect statistics.
5. **Develop a simple CLI** (`cli.ts`): select strategy, set simulation count, display results.
6. **Test and validate**: ensure correctness of game logic and strategies.
7. **Document the code** and add comments explaining each file's purpose.
8. **Prepare for web integration**: ensure all logic is decoupled from CLI and ready for a future UI.

--- 