import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './containers/home/home.component';
import { PoButtonModule, PoListViewModule, PoPageModule } from '@po-ui/ng-components';


@NgModule({
  declarations: [HomeComponent],
  imports: [
    CommonModule,
    HomeRoutingModule,
    PoPageModule,
    PoButtonModule,
    PoListViewModule
  ]
})
export class HomeModule { }
