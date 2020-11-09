import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PlaceRoutingModule } from './place-routing.module';
import { PlaceListComponent } from './containers/place-list/place-list.component';
import { PlaceFormComponent } from './containers/place-form/place-form.component';
import { PoPageDynamicTableModule } from '@po-ui/ng-templates';


@NgModule({
  declarations: [PlaceListComponent, PlaceFormComponent],
  imports: [
    CommonModule,
    PlaceRoutingModule,
    PoPageDynamicTableModule
  ]
})
export class PlaceModule { }
