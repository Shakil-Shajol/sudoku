import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { HomePageComponent } from './home-page.component';
import { GameRegistryService } from '../../../../core/services/game-registry.service';
import { ThemeService } from '../../../../core/services/theme.service';

describe('HomePageComponent', () => {
  let component: HomePageComponent;
  let fixture: ComponentFixture<HomePageComponent>;
  let registry: GameRegistryService;
  let themeService: ThemeService;

  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [HomePageComponent],
      providers: [provideRouter([]), GameRegistryService, ThemeService]
    }).compileComponents();

    fixture = TestBed.createComponent(HomePageComponent);
    component = fixture.componentInstance;
    registry = TestBed.inject(GameRegistryService);
    themeService = TestBed.inject(ThemeService);
    fixture.detectChanges();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('creates the home page component', () => {
    expect(component).toBeTruthy();
  });

  it('renders Mindrix heading and hero section', () => {
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('h1')?.textContent).toContain('Cultivate Focus Through Logic');
    expect(el.textContent).toContain('Mindrix');
    expect(el.textContent).toContain('Cognitive Sanctuary');
  });

  it('renders game cards from registry including Sudoku with play link', () => {
    const el = fixture.nativeElement as HTMLElement;
    const cards = el.querySelectorAll('app-game-card');
    expect(cards.length).toBe(registry.games().length);

    // Verify Sudoku card is present with active play link
    const sudokuCard = Array.from(cards).find(c => c.textContent?.includes('Sudoku'));
    expect(sudokuCard).toBeTruthy();
    expect(sudokuCard?.textContent).toContain('Play Sudoku');

    const playLink = sudokuCard?.querySelector('a[href="/sudoku"]');
    expect(playLink).toBeTruthy();
  });

  it('filters game cards when category filter tabs are clicked', () => {
    // Switch to 'spatial' category
    component.selectedCategory.set('spatial');
    fixture.detectChanges();

    const filtered = component.filteredGames();
    expect(filtered.every(g => g.categories.includes('spatial'))).toBe(true);

    const el = fixture.nativeElement as HTMLElement;
    const cards = el.querySelectorAll('app-game-card');
    expect(cards.length).toBe(filtered.length);
  });

  it('toggles dark and light mode', () => {
    themeService.setTheme('dark');
    expect(themeService.isDark()).toBe(true);
    expect(document.documentElement.classList.contains('dark')).toBe(true);

    themeService.toggleTheme();
    expect(themeService.isDark()).toBe(false);
    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });
});
