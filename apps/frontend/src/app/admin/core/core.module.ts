import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainContainerComponent } from './containers/main-container/main-container.component';
import { RouterModule } from '@angular/router';
import { PoMenuModule, PoNavbarModule, PoToolbarModule } from '@po-ui/ng-components';



@NgModule({
  declarations: [MainContainerComponent],
  imports: [
    CommonModule,
    RouterModule,
    PoMenuModule,
    PoToolbarModule,
    PoNavbarModule
  ]
})
export class CoreModule { }
