import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-errorMessages',
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
