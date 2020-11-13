import { Component, OnInit } from '@angular/core';
import { PoMenuItem } from '@po-ui/ng-components';

@Component({
  selector: 'app-main-container',
  templateUrl: './main-container.component.html',
  styleUrls: ['./main-container.component.scss']
})
export class MainContainerComponent implements OnInit {

  menus: PoMenuItem[] = [
    { label: 'Início', icon: 'po-icon-home', link: '/admin' },
    { label: 'Locais', icon: 'po-icon-map', link: '/admin/places' },
  ];

  constructor() {
  }

  ngOnInit(): void {
  }

}
