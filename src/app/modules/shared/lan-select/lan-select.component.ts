import { Component, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { LocalStorage } from '@ngx-pwa/local-storage';
import { Language } from '../../../models/language';

export interface DialogData {
  animal: string;
  name: string;
}

@Component({
  selector: 'lan-select-dialog',
  templateUrl: 'lan-select.component.html',
})
export class LanSelectComponent {
  LANGUAGES = [
    { value: 'en', viewValue: 'English' },
    { value: 'sc', viewValue: '简体中文' },
    { value: 'tc', viewValue: '繁體中文' }
  ];
  selectedLan = { value: 'en', viewValue: 'English' };

  constructor(
    private _localSt: LocalStorage,
    private tranServ: TranslateService,
    public dialogRef: MatDialogRef<LanSelectComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
  ) { }

  onNoClick(): void {
    this.onSelectLan(this.selectedLan);
    this.dialogRef.close();
  }

  onSelectLan(lan: Language) {
    this.selectedLan = lan;
    this.tranServ.use(lan.value);

    localStorage.setItem('_lan', lan.value);
    this._localSt.setItem('_lan', lan.value);
  }
}
