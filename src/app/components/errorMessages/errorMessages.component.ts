import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-errorMessages',
  standalone: true,
  imports: [TranslateModule],
  templateUrl: './errorMessages.component.html',
  styleUrls: ['./errorMessages.component.scss']
})
export class ErrorMessagesComponent implements OnInit {

  errorMessage: String = "an error occurred please try again later"

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  ngOnInit() {
    this.errorMessage = this.data;
  }

}
