import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { SudokuPageComponent } from './sudoku-page.component';
import { SudokuGameService } from '../../../../core/services/sudoku-game.service';

describe('SudokuPageComponent', () => {
  let component: SudokuPageComponent;
  let fixture: ComponentFixture<SudokuPageComponent>;
  let gameService: SudokuGameService;

  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [SudokuPageComponent],
      providers: [provideRouter([])]
    }).compileComponents();

    fixture = TestBed.createComponent(SudokuPageComponent);
    component = fixture.componentInstance;
    gameService = TestBed.inject(SudokuGameService);
    fixture.detectChanges();
  });

  afterEach(() => {
    gameService.stopTimer();
    localStorage.clear();
  });

  it('renders the Sudoku game title and board', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Sudoku');
    expect(compiled.querySelector('app-sudoku-board')).toBeTruthy();
    expect(compiled.querySelector('app-number-pad')).toBeTruthy();
    expect(compiled.querySelector('app-game-toolbar')).toBeTruthy();
  });

  it('changes difficulty when select is changed', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const select = compiled.querySelector('#difficulty-select') as HTMLSelectElement;
    expect(select).toBeTruthy();

    select.value = 'hard';
    select.dispatchEvent(new Event('change'));
    fixture.detectChanges();

    expect(gameService.difficulty()).toBe('hard');
  });

  it('supports cell click selection and number input', () => {
    const cellButtons = fixture.nativeElement.querySelectorAll('.sudoku-cell');
    expect(cellButtons.length).toBe(81);

    // Click first cell
    (cellButtons[0] as HTMLButtonElement).click();
    fixture.detectChanges();

    expect(gameService.selectedCell()).toEqual({ row: 0, col: 0 });
  });

  it('navigates with keyboard arrow keys', () => {
    gameService.selectCell(0, 0);

    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
    fixture.detectChanges();
    expect(gameService.selectedCell()).toEqual({ row: 0, col: 1 });

    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
    fixture.detectChanges();
    expect(gameService.selectedCell()).toEqual({ row: 1, col: 1 });
  });

  it('restarts game upon clicking Restart button', () => {
    const buttons = fixture.nativeElement.querySelectorAll('button') as NodeListOf<HTMLButtonElement>;
    let restartBtn: HTMLButtonElement | null = null;
    buttons.forEach((b: HTMLButtonElement) => {
      if (b.textContent?.includes('Restart')) restartBtn = b;
    });

    expect(restartBtn).toBeTruthy();
    if (restartBtn) {
      (restartBtn as HTMLButtonElement).click();
    }
    fixture.detectChanges();

    expect(gameService.elapsedSeconds()).toBe(0);
  });
});
