import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-place-list',
  templateUrl: './place-list.component.html',
  styleUrls: ['./place-list.component.scss'],
})
export class PlaceListComponent implements OnInit {
  fields: any[] = [
    { property: 'location', label: 'Localização' },
    { property: 'locationComplement', label: 'Complemento' },
    { property: 'name', label: 'Nome' },
    { property: 'sector', label: 'Setor' },
    { property: 'floor', label: 'Andar' },
  ];
  constructor() {}

  ngOnInit(): void {}
}
