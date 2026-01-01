import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
@Component({
  selector: 'app-newFeatures',
  standalone: true,
  imports: [TranslateModule],
  templateUrl: './newFeatures.component.html',
  styleUrls: ['./newFeatures.component.scss']
})
export class NewFeaturesComponent implements OnInit {
  featuresList: string[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  ngOnInit(): void {
    this.featuresList = this.data.features;
  }

}