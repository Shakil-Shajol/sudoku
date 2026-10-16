import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { HomePageComponent } from './home-page.component';
import { GameRegistryService } from '../../../../core/services/game-registry.service';

describe('HomePageComponent', () => {
  let component: HomePageComponent;
  let fixture: ComponentFixture<HomePageComponent>;
  let registry: GameRegistryService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomePageComponent],
      providers: [provideRouter([]), GameRegistryService]
    }).compileComponents();

    fixture = TestBed.createComponent(HomePageComponent);
    component = fixture.componentInstance;
    registry = TestBed.inject(GameRegistryService);
    fixture.detectChanges();
  });

  it('creates the home page component', () => {
    expect(component).toBeTruthy();
  });

  it('renders Puzzle Hub heading and hero section', () => {
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('h1')?.textContent).toContain('Sharpen your mind');
    expect(el.textContent).toContain('Puzzle Hub');
  });

  it('renders all game cards from registry including Sudoku', () => {
    const el = fixture.nativeElement as HTMLElement;
    const cards = el.querySelectorAll('app-game-card');
    expect(cards.length).toBe(registry.games().length);

    // Verify Sudoku card is present with active play link
    const sudokuCard = Array.from(cards).find(c => c.textContent?.includes('Sudoku'));
    expect(sudokuCard).toBeTruthy();
    expect(sudokuCard?.textContent).toContain('Play Now');

    const playLink = sudokuCard?.querySelector('a[href="/sudoku"]');
    expect(playLink).toBeTruthy();
  });
});
