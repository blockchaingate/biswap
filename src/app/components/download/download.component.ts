import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { NewFeaturesComponent } from 'src/app/components/newFeatures/newFeatures.component';
import { VersionModel } from 'src/app/models/version';
import { MatGridListModule } from '@angular/material/grid-list';

@Component({
  selector: 'app-download',
  standalone: true,
  imports: [MatCardModule, MatGridListModule, TranslateModule],
  templateUrl: './download.component.html',
  styleUrls: ['./download.component.scss']
})
export class DownloadComponent implements OnInit {
  @ViewChild(NewFeaturesComponent) childComponent!: NewFeaturesComponent;

  breakpoint: any;
  clickCount = 0;

  items: VersionModel[] = [];
  lastestApk!: VersionModel;
  testApk!: VersionModel;

  constructor(
    public dialog: MatDialog,
    private http: HttpClient
  ) {

  }


  getFiles() {
    return this.http.get('https://biswap.com/download/version.json');
    // return this.http.get('/assets/version.json');

  }


  ngOnInit() {
    this.breakpoint = (window.innerWidth <= 400) ? 1 : 3;

    this.getFiles().subscribe((data: any) => {

      this.lastestApk = data.find((obj: { versionName: string; }) => obj.versionName === "Realize");
      this.testApk = data.find((obj: { versionName: string; }) => obj.versionName === "Candidate");
      this.items = data.filter((obj: { versionName: string; }) => obj.versionName != "Realize" && obj.versionName != "Candidate");
    });
  }

  openTest() {
    this.clickCount++;
  }

  // openDialog(data: VersionModel) {
  //   this.dialog.open(NewFeaturesComponent, { data: data });
  // }

}
