import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;

//TODO: Verificar pq não está traduzindo
  public options = [
    { label: this.translateService.instant('Entry'), value: 'checkin' },
    { label: this.translateService.instant('Exit'), value: 'checkout' }
  ];
  constructor(private formBuilder: FormBuilder,
              private translateService: TranslateService) { }

  ngOnInit(): void {
    this.registerForm = this.formBuilder.group( {
      id: [''],
      name: [''],
      email: [''],
      phone: [''],
      checkInDate: [''],
      checkoutDate: [''],
      placeId: ['']
    });
  }

}
