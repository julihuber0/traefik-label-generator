import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface Defaults {
  serviceName: string;
  subdomain: string;
  domain: string;
  servicePort: string;
  httpEntrypoint: string;
  httpsEntrypoint: string;
  certResolver: string;
  traefikNetwork: string;
}

const STORAGE_KEY = 'labelGeneratorDefaults';

@Component({
  selector: 'app-settings',
  imports: [FormsModule],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'settings-host' }
})
export class SettingsComponent {
  defaults = signal<Defaults>(this.load());

  message = signal<string>('');
  showMsg = signal(false);

  private load(): Defaults {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<Defaults>;
        return {
          serviceName: parsed.serviceName ?? 'myservice',
          subdomain: parsed.subdomain ?? 'dev',
          domain: parsed.domain ?? 'example.com',
          servicePort: parsed.servicePort ?? '80',
          httpEntrypoint: parsed.httpEntrypoint ?? 'web',
          httpsEntrypoint: parsed.httpsEntrypoint ?? 'websecure',
          certResolver: parsed.certResolver ?? 'certresolver',
          traefikNetwork: parsed.traefikNetwork ?? 'traefik_traefik',
        };
      }
    } catch {}
    return {
      serviceName: 'myservice',
      subdomain: 'dev',
      domain: 'example.com',
      servicePort: '80',
      httpEntrypoint: 'web',
      httpsEntrypoint: 'websecure',
      certResolver: 'certresolver',
      traefikNetwork: 'traefik_traefik',
    };
  }

  save(): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.defaults()));
      this.toast('Defaults saved');
    } catch (e) {
      this.toast('Failed to save');
    }
  }

  private toast(msg: string) {
    this.message.set(msg);
    this.showMsg.set(true);
    setTimeout(() => this.showMsg.set(false), 1500);
  }
}
