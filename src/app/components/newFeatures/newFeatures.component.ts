import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { VersionModel } from 'src/app/models/version';
@Component({
  selector: 'app-newFeatures',
  templateUrl: './newFeatures.component.html',
  styleUrls: ['./newFeatures.component.scss']
})
export class NewFeaturesComponent implements OnInit {

  featuresList: string[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }
  
  ngOnInit(): void {
    console.log('geldi');
    console.log(this.data);

    this.featuresList = this.data.features;
  }

  

}