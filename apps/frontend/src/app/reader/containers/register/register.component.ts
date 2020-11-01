import { Component, OnInit, ViewChild } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { TranslocoService } from '@ngneat/transloco';
import { SessionService } from '../../services/session.service';
import { LocalStorageService } from '../../services/local-storage.service';
import {
  PoModalAction,
  PoModalComponent,
  PoNotificationService,
  PoRadioGroupOption,
  PoToasterOrientation,
} from '@po-ui/ng-components';
import { ActivatedRoute, Router } from '@angular/router';
import { Place, Session } from '../../models/app.model';
import * as moment from 'moment';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  @ViewChild('checkin', { static: true }) modalCheckin: PoModalComponent;
  @ViewChild('success', { static: true }) modalSuccess: PoModalComponent;
  @ViewChild('error', { static: true }) modalError: PoModalComponent;

  public saveCheckin: PoModalAction = null;
  public closeModalCheckin: PoModalAction = null;
  public redirect: PoModalAction = null;
  public closeModalSuccess: PoModalAction = null;
  public options: PoRadioGroupOption[] = [];
  public registerForm: FormGroup;
  public loading = false;
  public invalidTime = false;
  public isRequired = false;
  public place: Place;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private sessionService: SessionService,
    private translateService: TranslocoService,
    private storageService: LocalStorageService,
    private poNotificationService: PoNotificationService
  ) {}

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', Validators.required],
      phone: ['', Validators.required],
      type: ['', Validators.required],
      code: ['', Validators.required],
      checkin: [''],
    });

    this.initVariables();
    this.getPlace();
  }

  public setNameAndType(event) {
    this.setType(event);
    const at = event.indexOf('@');
    const domain = event.substring(at);

    if (domain === '@***REMOVED***.com.br') {
      this.registerForm.patchValue({ name: '' });
      const emailName = event.substring(0, at);
      const capitalize = emailName
        .split('.')
        .map((w) => w.substring(0, 1).toUpperCase() + w.substring(1))
        .join(' ');
      this.registerForm.patchValue({ name: capitalize });
    }
  }

  public validateHour(event) {
    const informedHourIsValid = moment(event, 'HH:mm', true).isValid();
    const currentHour = moment().format('HH:mm');
    if (!informedHourIsValid || event >= currentHour) {
      this.registerForm.controls.checkin.setErrors({ incorrect: true });
      this.invalidTime = true;
      return false;
    }
    this.invalidTime = false;
    return true;
  }

  public clearCheckinField(type) {
    if (type === 'checkin') {
      this.isRequired = false;
      this.registerForm.markAsPristine();
      this.registerForm.patchValue({ checkin: '' });
      this.registerForm.controls.checkin.setErrors(null);
    }
  }

  public submit({ value, valid }: { value: any; valid: boolean }) {
    if (!this.place.id) {
      this.modalError.open();
      return;
    }

    if (!valid) {
      if (!this.registerForm.controls.checkin.valid) {
        this.invalidTime = false;
        this.modalCheckin.open();
      }

      this.markFormAsDirty(this.registerForm);

      return this.poNotificationService.warning({
        message: 'Verifique os campos obrigatórios',
        orientation: PoToasterOrientation.Top,
      });
    }

    if (value.type === 'checkout') {
      this.verifyActiveCheckIn(value);
      return;
    }

    this.saveRegister(this.registerForm);
  }

  private getPlace() {
    const { code } = this.route.snapshot.queryParams;
    this.sessionService.getPlace(code).subscribe((place) => {
      if (place) {
        this.place = place;
        this.fetchForm();
      } else {
        this.modalError.open();
      }
    });
  }

  private fetchForm() {
    const register = this.storageService.getInStorage();
    if (register !== null) {
      this.registerForm.patchValue(register);
      if (register.email) {
        this.setType(register.email);
      }
    }

    this.registerForm.patchValue({ code: this.place.id });
  }

  private setType(email: string) {
    if (!this.registerForm.value.type) {
      this.sessionService
        .verifyActiveCheckin(email, this.place.id)
        .subscribe((session: Session[]) => {
          if (session.length === 0) {
            this.registerForm.patchValue({ type: 'checkin' });
          } else {
            this.registerForm.patchValue({ type: 'checkout' });
          }
        });
    }
  }

  private saveRegister({ value }: { value: any }) {
    this.loading = true;
    this.storageService.setInStorage({
      name: value.name,
      email: value.email,
      phone: value.phone,
    });

    this.sessionService.createSession(value).subscribe(
      () => {
        this.registerForm.markAsPristine();
        this.modalSuccess.open();
        this.loading = false;
        this.invalidTime = false;
        this.isRequired = false;
      },
      (error) => {
        console.error(error);
        this.loading = false;
        return this.poNotificationService.error({
          message:
            'Desculpe! Ocorreu um erro não esperado, por favor tente novamente!',
          orientation: PoToasterOrientation.Top,
        });
      }
    );
  }

  private verifyActiveCheckIn(value) {
    this.sessionService
      .verifyActiveCheckin(value.email, value.code)
      .subscribe((session: Session[]) => {
        if (session.length === 0) {
          this.invalidTime = false;
          this.isRequired = true;
          this.modalCheckin.open();
        } else {
          this.saveRegister(this.registerForm);
        }
      });
  }

  private markFormAsDirty(form: FormGroup) {
    Object.keys(form.controls).forEach((key) => {
      this.markControlAsDirty(form.controls[key]);
    });
  }

  private markControlAsDirty(control: AbstractControl) {
    control.markAsDirty();

    if (control instanceof FormGroup) {
      this.markFormAsDirty(control);
    } else if (control instanceof FormArray) {
      control.controls.forEach((element) => this.markControlAsDirty(element));
    }
  }

  private initVariables() {
    this.saveCheckin = {
      label: 'Enviar',
      action: () => {
        if (
          this.registerForm.valid &&
          this.validateHour(this.registerForm.value.checkin)
        ) {
          this.saveRegister(this.registerForm);
          this.modalCheckin.close();
        }
      },
    };
    this.closeModalCheckin = {
      label: 'Cancelar',
      action: () => {
        this.loading = false;
        this.modalCheckin.close();
      },
    };

    this.redirect = {
      label: 'Nova Leitura',
      action: () => {
        if (!this.modalSuccess.isHidden) {
          this.modalSuccess.close();
        } else if (!this.modalError.isHidden) {
          this.modalError.close();
        }
        this.router.navigate(['/']);
      },
    };

    this.closeModalSuccess = {
      label: 'Sair',
      action: () => {
        window.location.href = 'https://locus.github.io';
      },
    };

    this.options = [
      { label: 'Entrada', value: 'checkin' },
      { label: 'Saída', value: 'checkout' },
    ];
  }
}
