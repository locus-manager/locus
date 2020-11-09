import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  readonly menus = [
    {
      label: 'Escanear um código',
      icon: 'po-icon-qr-code',
      action: () => this.router.navigateByUrl('/'),
    },
    { label: 'Criar um novo QR Code', icon: 'po-icon-plus', action: () => {} },
    {
      label: 'Exibir locais cadastrados',
      icon: 'po-icon-list',
      action: () => this.router.navigateByUrl('/admin/places'),
    },
  ];

  constructor(private router: Router) {}
}
