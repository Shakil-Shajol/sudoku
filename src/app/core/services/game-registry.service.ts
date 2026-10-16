import { Injectable, signal } from '@angular/core';
import { GameMetadata } from '../models/game-registry.model';

@Injectable({
  providedIn: 'root'
})
export class GameRegistryService {
  private readonly gamesList = signal<GameMetadata[]>([
    {
      id: 'sudoku',
      title: 'Sudoku',
      description: 'Classic 9×9 number placement puzzle. Challenge logic with 4 balanced difficulty levels, smart notes, and instant conflict alerts.',
      route: '/sudoku',
      icon: '9',
      badge: 'Popular',
      category: 'Number Puzzle',
      difficultyLevels: ['Easy', 'Medium', 'Hard', 'Expert'],
      isAvailable: true
    },
    {
      id: 'word-search',
      title: 'Word Search',
      description: 'Find hidden words across dynamic letter grids with thematic word lists and timed challenges.',
      route: '/word-search',
      icon: '🔤',
      badge: 'Coming Soon',
      category: 'Word',
      isAvailable: false
    },
    {
      id: 'minesweeper',
      title: 'Minesweeper',
      description: 'Clear the minefield without detonating any bombs using numerical clues and strategic flag placement.',
      route: '/minesweeper',
      icon: '💣',
      badge: 'Coming Soon',
      category: 'Logic',
      isAvailable: false
    },
    {
      id: 'nonogram',
      title: 'Nonogram',
      description: 'Picture logic puzzles where cells in a grid must be colored or left blank according to numbers at the side.',
      route: '/nonogram',
      icon: '🎨',
      badge: 'Coming Soon',
      category: 'Logic',
      isAvailable: false
    }
  ]);

  public readonly games = this.gamesList.asReadonly();

  public getAvailableGames(): GameMetadata[] {
    return this.gamesList().filter(g => g.isAvailable);
  }

  public getGameById(id: string): GameMetadata | undefined {
    return this.gamesList().find(g => g.id === id);
  }
}
