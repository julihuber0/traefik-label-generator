import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './header/header.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent],
  template: '<app-header /><router-outlet />',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('traefik-label-generator');
}
