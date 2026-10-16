# Sudoku — Modern Angular Sudoku Game

A high-performance, responsive, and accessible modern Sudoku web application built with **Angular 21**, **TypeScript**, and **Tailwind CSS**.

---

## 🌟 Key Features

### 🧩 Core Gameplay & Board
- **Standard 9×9 Sudoku Grid**: Distinct 3×3 subgrid borders with clear visual contrast.
- **Smart Highlighting**:
  - Highlights currently selected cell.
  - Highlights peer cells (same row, column, and 3×3 block).
  - Highlights matching digits throughout the entire board.
  - Highlights conflicting entries with instant visual alerts.
- **Clue Protection**: Original puzzle clues cannot be overwritten or erased.
- **Responsive Layout**: Designed for seamless gameplay on both mobile screens and desktop viewports.

### 🎯 Difficulty Levels
Each difficulty level generates a unique, solvable Sudoku puzzle:
- **Easy**: ~40 clues, perfect for beginners and casual players.
- **Medium**: ~34 clues, balanced challenge.
- **Hard**: ~29 clues, requires advanced scanning and pencil marking.
- **Expert**: ~26 clues, challenging deduction puzzle.

### 🛠️ Game Controls & Assistance
- **New Game**: Instantly generates a fresh, verified unique-solution puzzle.
- **Restart Game**: Resets the current board back to original clues and resets the timer.
- **Pause & Resume**: Pauses the game clock and conceals the board with a clean pause screen.
- **Undo**: Full history stack to undo number entries and note toggles.
- **Erase**: Erases values or notes from the selected cell.
- **Notes Mode (Pencil Marks)**: Supports 1–9 candidate annotations rendered in a 3×3 miniature subgrid.
- **Auto-Clear Notes**: Automatically strips candidate numbers from peer cells upon placing a digit.
- **Hint**: Reveals the correct solution digit for an empty or incorrect cell.
- **Check Errors**: Validates current user entries against Sudoku rules and solution.
- **Solve Puzzle**: Displays a confirmation modal before revealing the complete board solution.

### ⏱️ Timer & Local Persistence
- Live formatted elapsed timer (`MM:SS` or `HH:MM:SS`).
- Mistake and hint counters.
- Local persistence using browser `localStorage` for:
  - Last selected difficulty.
  - Best completion times per difficulty level.
  - Safe session statistics (games started & completed).
  - Active unfinished game state.

### ⌨️ Full Keyboard & Accessibility Support
- **Keyboard Navigation**:
  - `Arrow Keys` or `W`, `A`, `S`, `D` to navigate the grid.
  - `1`–`9` to enter digits or toggle notes.
  - `Backspace` or `Delete` to clear a cell.
  - `N` to toggle pencil notes mode on/off.
  - `Ctrl + Z` / `Ctrl + U` to undo.
- **Accessibility**:
  - Semantic HTML with `role="grid"` and accessible cell labels (`aria-label`, `aria-selected`).
  - Screen reader status live region (`aria-live="polite"`).
  - Accessible modal dialogs with focus trapping.

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: v18.19+ or v20+ / v22+ / v24+
- **npm**: v9+

### Installation
Clone the repository and install dependencies:
```bash
git clone <repo-url>
cd sudoku
npm install
```

### Development Server
Run the local dev server:
```bash
npm start
# or: ng serve
```
Open your browser and navigate to `http://localhost:4200/`.

---

## 🧪 Testing

Run automated unit and integration tests using Vitest and Angular test harness:
```bash
npm test -- --watch=false
```

Tests verify:
- **Sudoku Engine**: Validity checking, row/col/box conflict detection, backtracking solver, MRV heuristic, uniqueness verification, and puzzle generation.
- **Game State**: Number placement, clue protection, mistake tracking, undo stack, pencil marks mode, pause/resume timer, and victory detection.
- **UI Components**: Keyboard navigation, cell selection, toolbar buttons, difficulty selector, and completion modal.

---

## 📦 Production Build & Deployment

### Production Build
To create an optimized production build:
```bash
npm run build
```
Build output is generated in `dist/sudoku/browser`.

### Static Hosting & GitHub Pages
Deploy the contents of `dist/sudoku/browser` to any static hosting provider (GitHub Pages, Vercel, Netlify, Cloudflare Pages):
```bash
# Example deployment with angular-cli-ghpages or git subtree:
npx angular-cli-ghpages --dir=dist/sudoku/browser
```

---

## 🏛️ Architecture

```text
src/app/
├── core/
│   ├── models/
│   │   └── sudoku.model.ts          # Core interfaces & types
│   └── services/
│       ├── sudoku-engine.ts         # Pure TypeScript solver, generator, & validator
│       ├── sudoku-engine.spec.ts    # Engine test suite
│       ├── sudoku-game.service.ts   # Angular signal-based reactive game state
│       ├── sudoku-game.service.spec.ts
│       └── sudoku-storage.service.ts # LocalStorage persistence
└── features/
    └── game/
        ├── components/
        │   ├── sudoku-board/        # 9x9 Grid & keyboard listeners
        │   ├── sudoku-cell/         # OnPush cell renderer & notes grid
        │   ├── number-pad/          # 1-9 buttons with remaining counts
        │   ├── game-toolbar/        # Undo, Erase, Notes, Hint, Check, Solve
        │   ├── game-stats/          # Difficulty selector, Mistakes, Timer
        │   └── game-complete-dialog/ # Victory dialog & stats
        └── pages/
            └── sudoku-page/         # Responsive game view container
```
