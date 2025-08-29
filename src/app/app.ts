import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { NavComponent } from './nav/nav.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, NavComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('traefik-label-generator');
  showNav = signal(false);
  toggleNav() { this.showNav.update(v => !v); }
  closeNav() { this.showNav.set(false); }
  onNavSelected() { this.closeNav(); }
}
