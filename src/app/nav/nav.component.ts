import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-nav',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'nav-host' }
})
export class NavComponent { @Output() linkSelected = new EventEmitter<void>(); }
