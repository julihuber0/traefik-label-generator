import { ChangeDetectionStrategy, Component, EventEmitter, Output, effect, signal } from '@angular/core';

// Simple header with dark mode toggle. Uses localStorage to persist.
// No HostBinding/HostListener; host bindings are configured in the decorator.
@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'header-host'
  }
})
export class HeaderComponent {
  @Output() menuToggle = new EventEmitter<void>();
  private storageKey = 'theme';
  // Holds whether dark mode is enabled
  isDark = signal<boolean>(false);

  constructor() {
    // Initialize from localStorage or prefers-color-scheme
    const stored = localStorage.getItem(this.storageKey);
    if (stored === 'dark' || stored === 'light') {
      this.isDark.set(stored === 'dark');
    } else {
      // defer to system preference
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      this.isDark.set(prefersDark);
    }

    // Apply on start
    this.applyTheme(this.isDark());

    // React to changes
    effect(() => {
      const dark = this.isDark();
      this.applyTheme(dark);
      try {
        localStorage.setItem(this.storageKey, dark ? 'dark' : 'light');
      } catch {
        // ignore storage errors
      }
    });
  }

  toggleTheme(): void {
    this.isDark.update(v => !v);
  }

  private applyTheme(dark: boolean): void {
    const root = document.documentElement; // <html>
    root.setAttribute('data-theme', dark ? 'dark' : 'light');
    // Also update color-scheme for built-in form controls
    document.body.style.colorScheme = dark ? 'dark' : 'light';
  }
}
