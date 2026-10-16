import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SudokuRulesPageComponent } from './sudoku-rules-page.component';
import { provideRouter } from '@angular/router';

describe('SudokuRulesPageComponent', () => {
  let component: SudokuRulesPageComponent;
  let fixture: ComponentFixture<SudokuRulesPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SudokuRulesPageComponent],
      providers: [provideRouter([])]
    }).compileComponents();

    fixture = TestBed.createComponent(SudokuRulesPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the rules page component', () => {
    expect(component).toBeTruthy();
  });

  it('should render the rules page title', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Sudoku Rules');
  });

  it('should switch tabs when clicked', () => {
    component.activeTab.set('rules');
    fixture.detectChanges();
    expect(component.activeTab()).toBe('rules');
  });
});
