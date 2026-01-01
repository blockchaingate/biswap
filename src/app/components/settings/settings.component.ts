import { Component, OnInit, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule } from '@ngx-translate/core';

export interface DialogData {
  slippage: number;
  deadline: number;
}

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [FormsModule, TranslateModule, MatDialogModule, MatIconModule, MatButtonModule],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  slippageErr = false;

  constructor(
    public dialogRef: MatDialogRef<SettingsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
  ) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit(): void {
  }

  keyUp() {
    if (this.data.slippage < 0 || this.data.slippage > 100) {
      this.slippageErr = true;
    } else {
      this.slippageErr = false;
    }
  }
}
