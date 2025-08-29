import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-label-generator',
  imports: [FormsModule],
  templateUrl: './label-generator.component.html',
  styleUrl: './label-generator.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'lg-host'
  }
})
export class LabelGeneratorComponent {
  private readonly defaultsKey = 'labelGeneratorDefaults';
  // Inputs state as signals
  serviceName = signal('myservice');
  subdomain = signal('dev');
  domain = signal('example.com');
  servicePort = signal('80');
  httpEntrypoint = signal('web');
  httpsEntrypoint = signal('websecure');
  certResolver = signal('certresolver');
  traefikNetwork = signal('traefik_traefik');
  enableHttpRedirect = signal(true);
  addIndentation = signal(true);

  constructor() {
    // load defaults from localStorage if present
    try {
      const raw = localStorage.getItem(this.defaultsKey);
      if (raw) {
        const d = JSON.parse(raw) as Partial<Record<string, string>>;
        if (d["serviceName"]) this.serviceName.set(d["serviceName"]);
        if (d["subdomain"]) this.subdomain.set(d["subdomain"]);
        if (d["domain"]) this.domain.set(d["domain"]);
        if (d["servicePort"]) this.servicePort.set(d["servicePort"]);
        if (d["httpEntrypoint"]) this.httpEntrypoint.set(d["httpEntrypoint"]);
        if (d["httpsEntrypoint"]) this.httpsEntrypoint.set(d["httpsEntrypoint"]);
        if (d["certResolver"]) this.certResolver.set(d["certResolver"]);
        if (d["traefikNetwork"]) this.traefikNetwork.set(d["traefikNetwork"]);
      }
    } catch {}
  }

  // Message box
  message = signal<string>('');
  messageVisible = signal(false);
  messageType = signal<'success'|'error'>('success');

  fullHost = computed(() => `${this.subdomain().trim()}.${this.domain().trim()}`);

  labelsArray = computed(() => {
    const arr: string[] = [];
    const serviceName = this.serviceName().trim();
    const httpEntrypoint = this.httpEntrypoint().trim();
    const httpsEntrypoint = this.httpsEntrypoint().trim();
    const certResolver = this.certResolver().trim();
    const servicePort = this.servicePort().trim();
    const traefikNetwork = this.traefikNetwork().trim();

    arr.push('traefik.enable=true');

    if (this.enableHttpRedirect()) {
      arr.push(`traefik.http.routers.${serviceName}.entrypoints=${httpEntrypoint}`);
      arr.push(`traefik.http.routers.${serviceName}.rule=Host(\`${this.fullHost()}\`)`);
      arr.push(`traefik.http.middlewares.${serviceName}-https-redirect.redirectscheme.scheme=https`);
      arr.push(`traefik.http.routers.${serviceName}.middlewares=${serviceName}-https-redirect`);
    }

    arr.push(`traefik.http.routers.${serviceName}-secure.entrypoints=${httpsEntrypoint}`);
    arr.push(`traefik.http.routers.${serviceName}-secure.rule=Host(\`${this.fullHost()}\`)`);
    arr.push('traefik.http.routers.${serviceName}-secure.tls=true'.replace('${serviceName}', serviceName));
    arr.push(`traefik.http.routers.${serviceName}-secure.service=${serviceName}`);
    arr.push(`traefik.http.routers.${serviceName}-secure.tls.certresolver=${certResolver}`);
    arr.push(`traefik.http.services.${serviceName}.loadbalancer.server.port=${servicePort}`);
    arr.push(`traefik.docker.network=${traefikNetwork}`);

    return arr;
  });

  formattedLabels = computed(() => {
    const values = [
      this.serviceName(),
      this.subdomain(),
      this.domain(),
      this.servicePort(),
      this.httpEntrypoint(),
      this.httpsEntrypoint(),
      this.certResolver(),
      this.traefikNetwork(),
    ].map(v => v.trim());

    if (values.some(v => !v)) {
      return 'Please fill in all fields to generate labels.';
    }

    const indentPrefix = this.addIndentation() ? '    ' : '';
    let formatted = `${indentPrefix}labels:`;
    for (const label of this.labelsArray()) {
      formatted += `\n${indentPrefix}  - "${label}"`;
    }
    return formatted;
  });

  async copy(): Promise<void> {
    const text = this.formattedLabels();
    if (!text) {
      this.showMessage('No labels to copy!', 'error');
      return;
    }

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
        this.showMessage('Copied to clipboard!', 'success');
        return;
      }
      // Fallback
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      const ok = document.execCommand('copy');
      document.body.removeChild(ta);
      this.showMessage(ok ? 'Copied to clipboard!' : 'Failed to copy!', ok ? 'success' : 'error');
    } catch (e) {
      this.showMessage(`Error copying: ${e}`, 'error');
    }
  }

  private showMessage(msg: string, type: 'success'|'error') {
    this.message.set(msg);
    this.messageType.set(type);
    this.messageVisible.set(true);
    window.setTimeout(() => this.messageVisible.set(false), 2000);
  }
}
