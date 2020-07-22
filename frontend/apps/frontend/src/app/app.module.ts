import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PoModule } from '@po-ui/ng-components';
import { RegisterComponent } from './components/register/register.component';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslocoModule } from '@ngneat/transloco';
import { QrcodeComponent } from './components/qrcode/qrcode.component';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { TranslocoRootModule } from './transloco-root.module';

@NgModule({
  declarations: [AppComponent, RegisterComponent, QrcodeComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    PoModule,
    HttpClientModule,
    ReactiveFormsModule,
    ZXingScannerModule,
    TranslocoModule,
    TranslocoRootModule,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
