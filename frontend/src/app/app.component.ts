import { Component } from '@angular/core';
import { RegisterService } from './services/register.service';
import {LocalStorageService} from "./services/local-storage.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(
    private registerService: RegisterService,
    private storageService: LocalStorageService
  ) {
    this.submit();
  }

  // TODO: decidir se vai ficar aqui mesmo
  public submit() {
    const register = {
      name: 'Raiane Braganca',
      email: 'raiane.braganca@***REMOVED***.com.br',
      phone: '123456789',
      type: 'checkin',
      code: 'ABC123'
    };

    this.storageService.setInStorage(
      {
        name: register.name,
        email: register.email,
        phone: register.phone
      }
    );
    this.registerService.register(register).subscribe(data => {
      console.log('data', data);
    });
  }
}
