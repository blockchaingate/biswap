import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-errorMessages',
  templateUrl: './dialogMessages.component.html',
  styleUrls: ['./dialogMessages.component.scss']
})
export class ErrorMessagesComponent implements OnInit {

  dilaogMessage: String = "an error occurred please try again later"
  dilaogTitle: String = "Error occured"



  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  ngOnInit() {
    if(this.data.dilaogMessage != "")
    this.dilaogMessage = this.data.dilaogMessage;
    if(this.data.dilaogTitle != "")
    this.dilaogTitle = this.data.dilaogTitle;
  }

}
