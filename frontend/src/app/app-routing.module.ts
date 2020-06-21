import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {QrcodeComponent} from './components/qrcode/qrcode.component';
import {RegisterComponent} from './components/register/register.component';


const routes: Routes = [
  { path: '', component: QrcodeComponent },
  { path: 'register', component: RegisterComponent  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
