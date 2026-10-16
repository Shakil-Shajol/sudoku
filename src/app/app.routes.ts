import { Routes } from '@angular/router';
import { SudokuPageComponent } from './features/game/pages/sudoku-page/sudoku-page.component';

export const routes: Routes = [
  {
    path: '',
    component: SudokuPageComponent
  },
  {
    path: '**',
    redirectTo: ''
  }
];
