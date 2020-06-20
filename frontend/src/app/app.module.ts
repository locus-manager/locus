import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PoModule } from '@po-ui/ng-components';
import { RegisterComponent } from './components/register/register.component';
import { GraphQLModule } from './graphql.module';
import { HttpClientModule } from '@angular/common/http';
import {ReactiveFormsModule} from '@angular/forms';
import {TranslateLoader, TranslateModule, TranslateService} from "@ngx-translate/core";
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {HttpClient} from "@angular/common/http";
export function createTranslateLoad(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    PoModule,
    GraphQLModule,
    HttpClientModule,
    ReactiveFormsModule,
    TranslateModule.forRoot( {
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoad,
        deps: [HttpClient]
      }
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(private translateService: TranslateService) {
    translateService.addLangs(['en', 'pt']);
    translateService.setDefaultLang['en'];
    const browserLang = translateService.getBrowserLang();
    translateService.use(browserLang.match(/en|pt/) ? browserLang : 'en');
  }
}
