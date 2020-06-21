import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { ZXingScannerComponent } from '@zxing/ngx-scanner';

@Component({
  selector: 'app-qrcode',
  templateUrl: './qrcode.component.html',
  styleUrls: ['./qrcode.component.scss'],
})
// tslint:disable-next-line:component-class-suffix
export class QrcodeComponent implements AfterViewInit {
  @ViewChild('scanner') scanner: ZXingScannerComponent;

  hasDevices: boolean;
  hasPermission: boolean;

  availableDevices: MediaDeviceInfo[];
  currentDevice: MediaDeviceInfo = null;
  enableScanner = true;

  ngAfterViewInit(): void {
    if (!this.enableScanner) { return; }

    this.scanner.camerasFound.subscribe((devices: MediaDeviceInfo[]) => {
      this.hasDevices = true;
      this.availableDevices = devices;

      let defaultDevice = null;
      // selects the devices's back camera by default
      for (const device of devices) {
        if (/back|rear|environment/gi.test(device.label)) {
          defaultDevice = device;
          break;
        }
      }

      if (!defaultDevice) { defaultDevice = devices[0]; }

      this.currentDevice = defaultDevice;
    });

    this.scanner.camerasNotFound.subscribe(() => (this.hasDevices = false));
    this.scanner.permissionResponse.subscribe(
      (perm: boolean) => (this.hasPermission = perm)
    );
  }

  onSuccess(data) {
    window.location.replace(data);
  }
}
