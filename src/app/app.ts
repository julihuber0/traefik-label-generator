import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { NavComponent } from './nav/nav.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, NavComponent],
  template: `<app-header />
  <div class="app-shell">
    <app-nav class="side"></app-nav>
    <main class="content"><router-outlet /></main>
  </div>`,
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('traefik-label-generator');
}
