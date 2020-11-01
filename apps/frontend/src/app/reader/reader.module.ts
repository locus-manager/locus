import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { TranslocoModule } from '@ngneat/transloco';
import { QrcodeComponent } from './containers/qrcode/qrcode.component';
import { RegisterComponent } from './containers/register/register.component';
import { ReactiveFormsModule } from '@angular/forms';
import { PoButtonModule, PoFieldModule, PoModalModule } from '@po-ui/ng-components';



@NgModule({
  declarations: [RegisterComponent, QrcodeComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslocoModule,
    ZXingScannerModule,
    PoFieldModule,
    PoButtonModule,
    PoModalModule
  ],
  exports: [RegisterComponent, QrcodeComponent]
})
export class ReaderModule { }
