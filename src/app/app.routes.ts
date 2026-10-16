import { Routes } from '@angular/router';
import { HomePageComponent } from './features/home/pages/home-page/home-page.component';
import { SudokuPageComponent } from './features/game/pages/sudoku-page/sudoku-page.component';

export const routes: Routes = [
  {
    path: '',
    component: HomePageComponent,
    title: 'Puzzle Hub — Classic Brain Games'
  },
  {
    path: 'sudoku',
    component: SudokuPageComponent,
    title: 'Sudoku — Modern Puzzle Game'
  },
  {
    path: '**',
    redirectTo: ''
  }
];
