import {Component, OnInit, ViewChild} from '@angular/core';
import {AbstractControl, FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import { TranslocoService } from '@ngneat/transloco';
import { SessionService } from '../../services/session.service';
import { LocalStorageService } from '../../services/local-storage.service';
import {
  PoModalAction,
  PoModalComponent,
  PoNotificationService,
  PoRadioGroupOption,
  PoToasterOrientation
} from '@po-ui/ng-components';
import { ActivatedRoute, Router } from '@angular/router';
import { Place } from '../../models/app.model';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  @ViewChild('checkin', { static: true }) modalCheckin: PoModalComponent;
  @ViewChild('success', { static: true }) modalSuccess: PoModalComponent;

  public saveCheckin: PoModalAction = null;
  public closeModalCheckin: PoModalAction = null;
  public redirect: PoModalAction = null;
  public closeModalSuccess: PoModalAction = null;
  public options: PoRadioGroupOption[] = [];
  public registerForm: FormGroup;
  public loading = false;
  public place: Place;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private sessionService: SessionService,
    private translateService: TranslocoService,
    private storageService: LocalStorageService,
    private poNotificationService: PoNotificationService,
  ) { }

  ngOnInit() {
    this.registerForm = this.formBuilder.group( {
      name: ['', Validators.required],
      email: ['', Validators.required],
      phone: ['', Validators.required],
      type: ['', Validators.required],
      code: [''],
      checkin: [''],
    });

    this.getPlace();
    this.fetchForm();
    this.initVariables();
  }

  public setName(event) {
    const at = event.indexOf('@');
    const domain = event.substring(at);

    if (domain === '@***REMOVED***.com.br' && !this.registerForm.value.name) {
      const emailName = event.substring(0, at);
      const capitalize = emailName.split('.').map(w => w.substring(0, 1).toUpperCase() + w.substring(1)).join(' ');
      this.registerForm.patchValue({
        name: capitalize
      });
    }

  }

  public submit({value, valid}: {value: any, valid: boolean}) {
    if (!valid) {
      this.markFormAsDirty(this.registerForm);

      return this.poNotificationService.warning({
        message: this.translateService.translate('Verify the required fields'),
        orientation: PoToasterOrientation.Top,
      });
    }

    this.loading = true;

    if (value.type === 'checkout') {
      this.verifyActiveCheckIn(value);
      return;
    }

    this.saveRegister(this.registerForm);
  }

  private getPlace() {
    const { code } = this.route.snapshot.queryParams;
    this.sessionService.getPlace(code).subscribe(place => {
      this.place = place[0];
    });
  }

  private fetchForm() {
    const { code } = this.route.snapshot.queryParams;
    const register = this.storageService.getInStorage();
    if (register !== null) {
      this.registerForm.patchValue(register);
    }

    if (code) {
      this.registerForm.patchValue({ code });
    }
  }

  private saveRegister({value}: {value: any}) {
    this.storageService.setInStorage(
      { name: value.name, email: value.email, phone: value.phone }
    );

    this.sessionService.createSession(value).subscribe(
      () => {
        this.registerForm.markAsPristine();
        this.modalSuccess.open();
        this.loading = false;
      },
      (error) => {
        console.error(error);
        this.loading = false;
        return this.poNotificationService.error({
          message: this.translateService.translate('Sorry! An unexpected error occurred, please try again!'),
          orientation: PoToasterOrientation.Top,
        });
      }
    );
  }

  private verifyActiveCheckIn(value) {
    this.sessionService.verifyActiveCheckin(value.email).subscribe((data: any[]) => {
      if (data.length === 0) {
        this.modalCheckin.open();
      } else {
        this.saveRegister(this.registerForm);
      }
    });
  }

  private markFormAsDirty(form: FormGroup) {
    Object.keys(form.controls).forEach(key => {
      this.markControlAsDirty(form.controls[key]);
    });
  }

  private markControlAsDirty(control: AbstractControl) {
    control.markAsDirty();

    if (control instanceof FormGroup) {
      this.markFormAsDirty(control);
    } else if (control instanceof FormArray) {
      control.controls.forEach(element => this.markControlAsDirty(element));
    }
  }

  // TODO: Verificar tradução
  private initVariables() {
    this.saveCheckin = {
      label: this.translateService.translate('Enviar'),
      action: () => {
        if (this.registerForm.valid) {
          this.saveRegister(this.registerForm);
          this.modalCheckin.close();
        }
      }
    };
    this.closeModalCheckin = {
      label: this.translateService.translate('Cancelar'),
      action: () => this.modalCheckin.close()
    };

    this.redirect = {
      label: this.translateService.translate('Ler QR code'),
      action: () => this.router.navigate(['/'])
    };

    this.closeModalSuccess = {
      label: this.translateService.translate('Cancelar'),
      action: () => this.modalSuccess.close()
    };

    this.options = [
      { label: this.translateService.translate('Entrada'), value: 'checkin' },
      { label: this.translateService.translate('Saída'), value: 'checkout' }
    ];
  }
}
