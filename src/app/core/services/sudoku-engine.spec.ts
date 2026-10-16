import { SudokuEngine } from './sudoku-engine';

describe('SudokuEngine', () => {
  const sampleSolution = [
    [5, 3, 4, 6, 7, 8, 9, 1, 2],
    [6, 7, 2, 1, 9, 5, 3, 4, 8],
    [1, 9, 8, 3, 4, 2, 5, 6, 7],
    [8, 5, 9, 7, 6, 1, 4, 2, 3],
    [4, 2, 6, 8, 5, 3, 7, 9, 1],
    [7, 1, 3, 9, 2, 4, 8, 5, 6],
    [9, 6, 1, 5, 3, 7, 2, 8, 4],
    [2, 8, 7, 4, 1, 9, 6, 3, 5],
    [3, 4, 5, 2, 8, 6, 1, 7, 9]
  ];

  it('validates a correct completed board', () => {
    expect(SudokuEngine.isCompleteAndValid(sampleSolution)).toBe(true);
  });

  it('detects row conflicts', () => {
    const invalidGrid = SudokuEngine.cloneGrid(sampleSolution);
    invalidGrid[0][1] = 5; // Duplicate 5 in row 0
    const conflicts = SudokuEngine.detectConflicts(invalidGrid);
    expect(conflicts[0][0]).toBe(true);
    expect(conflicts[0][1]).toBe(true);
  });

  it('detects column conflicts', () => {
    const invalidGrid = SudokuEngine.cloneGrid(sampleSolution);
    invalidGrid[1][0] = 5; // Duplicate 5 in col 0
    const conflicts = SudokuEngine.detectConflicts(invalidGrid);
    expect(conflicts[0][0]).toBe(true);
    expect(conflicts[1][0]).toBe(true);
  });

  it('detects 3x3 box conflicts', () => {
    const invalidGrid = SudokuEngine.cloneGrid(sampleSolution);
    invalidGrid[1][1] = 5; // Duplicate 5 in top-left box
    const conflicts = SudokuEngine.detectConflicts(invalidGrid);
    expect(conflicts[0][0]).toBe(true);
    expect(conflicts[1][1]).toBe(true);
  });

  it('solves a solvable puzzle with backtracking', () => {
    const puzzle = SudokuEngine.cloneGrid(sampleSolution);
    puzzle[0][0] = 0;
    puzzle[0][1] = 0;
    puzzle[1][2] = 0;

    const solved = SudokuEngine.solve(puzzle);
    expect(solved).toBe(true);
    expect(puzzle[0][0]).toBe(5);
    expect(puzzle[0][1]).toBe(3);
    expect(puzzle[1][2]).toBe(2);
  });

  it('identifies unsolvable puzzles correctly', () => {
    const unsolvable = SudokuEngine.cloneGrid(sampleSolution);
    // Introduce conflict in given
    unsolvable[0][0] = 9;
    unsolvable[0][6] = 9;
    unsolvable[1][0] = 0; // Empty to force solve call

    const solved = SudokuEngine.solve(unsolvable);
    expect(solved).toBe(false);

    // Let's create an impossible state
    const impossible = [
      [5, 5, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0]
    ];
    expect(SudokuEngine.countSolutions(impossible, 1)).toBe(0);
  });

  it('counts solutions and detects multiple solutions', () => {
    // Highly sparse board with multiple solutions
    const sparse = SudokuEngine.createEmptyGrid();
    sparse[0][0] = 1;
    sparse[0][1] = 2;
    const solutions = SudokuEngine.countSolutions(sparse, 2);
    expect(solutions).toBe(2); // Capped at max 2
    expect(SudokuEngine.hasUniqueSolution(sparse)).toBe(false);
  });

  it('generates a puzzle with a unique solution for each difficulty', () => {
    const generated = SudokuEngine.generatePuzzle('easy');
    expect(generated.puzzle.length).toBe(9);
    expect(generated.solution.length).toBe(9);
    expect(SudokuEngine.isCompleteAndValid(generated.solution)).toBe(true);
    expect(SudokuEngine.hasUniqueSolution(generated.puzzle)).toBe(true);

    // Verify clues count is within expected range
    let cluesCount = 0;
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (generated.puzzle[r][c] !== 0) cluesCount++;
      }
    }
    expect(cluesCount).toBeGreaterThanOrEqual(20);
    expect(cluesCount).toBeLessThanOrEqual(50);
  });
});
