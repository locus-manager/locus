import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PlaceListComponent } from './containers/place-list/place-list.component';
import { PlaceFormComponent } from './containers/place-form/place-form.component';

const routes: Routes = [
  { path: '', component: PlaceListComponent },
  { path: 'create', component: PlaceFormComponent },
  { path: 'edit/:id', component: PlaceFormComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PlaceRoutingModule {}
