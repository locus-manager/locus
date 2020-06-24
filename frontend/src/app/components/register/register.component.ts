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
  @ViewChild('error', { static: true }) modalError: PoModalComponent;

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
    if (!this.place) {
      this.modalError.open();
      return;
    }

    if (!valid) {
      this.markFormAsDirty(this.registerForm);

      return this.poNotificationService.warning({
        message: 'Verifique os campos obrigatórios',
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
    this.sessionService.getPlace(code).subscribe(
      place => { this.place = place[0]; },
      error => {
        this.modalError.open();
        console.error(error);
      }
    );
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

    if (register.email) {
      this.sessionService.verifyActiveCheckin(register.email).subscribe((session: any[]) => {
        if (session.length === 0) {
          this.registerForm.patchValue({ type: 'checkin' });
        } else {
          this.registerForm.patchValue({ type: 'checkout' });
        }
      });
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
          message: 'Desculpe! Ocorreu um erro não esperado, por favor tente novamente!',
          orientation: PoToasterOrientation.Top,
        });
      }
    );
  }

  private verifyActiveCheckIn(value) {
    this.sessionService.verifyActiveCheckin(value.email).subscribe((session: any[]) => {
      if (session.length === 0) {
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
      label: 'Enviar',
      action: () => {
        if (this.registerForm.valid) {
          this.saveRegister(this.registerForm);
          this.modalCheckin.close();
        }
      }
    };
    this.closeModalCheckin = {
      label: 'Cancelar',
      action: () => {
        this.loading = false;
        this.modalCheckin.close();
      }
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
      }
    };

    this.closeModalSuccess = {
      label: 'Sair',
      action: () => {
        window.location.href = 'https://produtos.***REMOVED***.com/produto/***REMOVED***-hospitalidade/pdv/';
      }
    };

    this.options = [
      { label: 'Entrada', value: 'checkin' },
      { label: 'Saída', value: 'checkout' }
    ];
  }
}
