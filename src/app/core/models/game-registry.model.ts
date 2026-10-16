export type GameCategory = 'all' | 'grid' | 'numbers' | 'spatial';

export interface GameMetadata {
  id: string;
  title: string;
  subtitle?: string;
  description: string;
  route: string;
  badge?: string;
  tierInfo?: string;
  activePlayers?: string;
  avgTime?: string;
  categories: GameCategory[];
  actionIcon?: string;
  isAvailable: boolean;
}

export interface UpcomingGame {
  id: string;
  title: string;
  description: string;
  statusBadge: string;
  statusType: 'next' | 'dev' | 'beta';
  releaseDate: string;
  icon: string;
}
