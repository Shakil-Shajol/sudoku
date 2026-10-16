export interface GameMetadata {
  id: string;
  title: string;
  description: string;
  route: string;
  icon: string;
  badge?: string;
  category: 'Number Puzzle' | 'Logic' | 'Word' | 'Strategy';
  players?: string;
  difficultyLevels?: string[];
  isAvailable: boolean;
}
