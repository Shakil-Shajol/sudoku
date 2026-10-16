import { Injectable, signal } from '@angular/core';
import { GameMetadata, UpcomingGame } from '../models/game-registry.model';

@Injectable({
  providedIn: 'root'
})
export class GameRegistryService {
  private readonly gamesList = signal<GameMetadata[]>([
    {
      id: 'sudoku',
      title: 'Sudoku',
      subtitle: 'Classic • Most Popular',
      description: 'Engage logical deduction with the quintessential 9x9 number grid. 4 difficulty tiers from Easy to Master.',
      route: '/sudoku',
      badge: 'Classic • Most Popular',
      tierInfo: '4 Tiers',
      activePlayers: '4,820 active',
      avgTime: '12 mins avg',
      categories: ['numbers', 'grid'],
      actionIcon: 'arrow_forward',
      isAvailable: true
    },
    {
      id: 'nonogram',
      title: 'Nonogram (Picross)',
      subtitle: 'Visual Logic',
      description: 'Reveal hidden pixel artwork by deciphering numeric clues along rows and columns.',
      route: '/nonogram',
      badge: 'Visual Logic',
      tierInfo: '15x15 Boards',
      activePlayers: '2,190 active',
      avgTime: '8 mins avg',
      categories: ['grid'],
      actionIcon: 'sports_esports',
      isAvailable: false
    },
    {
      id: 'kakuro',
      title: 'Kakuro (Cross Sums)',
      subtitle: 'Math & Logic',
      description: 'The mathematical crossword puzzle. Fill numeric combinations that satisfy all clue sums.',
      route: '/kakuro',
      badge: 'Math & Logic',
      tierInfo: 'Daily Cross',
      activePlayers: '1,840 active',
      avgTime: '15 mins avg',
      categories: ['numbers'],
      actionIcon: 'calculate',
      isAvailable: false
    },
    {
      id: 'slitherlink',
      title: 'Slitherlink (Loopy)',
      subtitle: 'Spatial Topology',
      description: 'Form a single unbroken continuous loop connecting adjacent dots according to numerical constraints.',
      route: '/slitherlink',
      badge: 'Spatial Topology',
      tierInfo: 'Continuous Loop',
      activePlayers: '960 active',
      avgTime: '11 mins avg',
      categories: ['spatial', 'grid'],
      actionIcon: 'all_inclusive',
      isAvailable: false
    },
    {
      id: 'bridges',
      title: 'Hashiwokakero (Bridges)',
      subtitle: 'Network Logic',
      description: 'Connect numbered islands with parallel bridges into a unified, fully traversable single network.',
      route: '/bridges',
      badge: 'Network Logic',
      tierInfo: 'Orthogonal Paths',
      activePlayers: '1,410 active',
      avgTime: '10 mins avg',
      categories: ['spatial'],
      actionIcon: 'hub',
      isAvailable: false
    },
    {
      id: 'hitori',
      title: 'Hitori',
      subtitle: 'Elimination',
      description: 'Eliminate duplicate digits by shading squares without isolating unshaded numbers.',
      route: '/hitori',
      badge: 'Elimination',
      tierInfo: 'Zen Solver',
      activePlayers: '820 active',
      avgTime: '9 mins avg',
      categories: ['numbers', 'grid'],
      actionIcon: 'grid_view',
      isAvailable: false
    }
  ]);

  private readonly upcomingList = signal<UpcomingGame[]>([
    {
      id: 'kenken',
      title: 'KenKen / Calcudoku',
      description: 'Grid arithmetic with modular operation cages (+, −, ×, ÷) across 4x4 up to 8x8 formats.',
      statusBadge: 'Coming Next Week',
      statusType: 'next',
      releaseDate: 'Release: Oct 28',
      icon: 'schedule'
    },
    {
      id: 'futoshiki',
      title: 'Futoshiki (More or Less)',
      description: 'Latin square deduction driven entirely by relational inequality symbols (>, <) between nodes.',
      statusBadge: 'In Development',
      statusType: 'dev',
      releaseDate: 'Release: Mid-Nov',
      icon: 'construction'
    },
    {
      id: 'nurikabe',
      title: 'Nurikabe (Islands in Stream)',
      description: 'Separate numbered island cells using an interconnected contiguous ocean of shaded walls.',
      statusBadge: 'Beta Testing',
      statusType: 'beta',
      releaseDate: 'Open Beta',
      icon: 'science'
    }
  ]);

  public readonly games = this.gamesList.asReadonly();
  public readonly upcomingGames = this.upcomingList.asReadonly();

  public getAvailableGames(): GameMetadata[] {
    return this.gamesList().filter(g => g.isAvailable);
  }

  public getGameById(id: string): GameMetadata | undefined {
    return this.gamesList().find(g => g.id === id);
  }
}
