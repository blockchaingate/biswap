import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NewFeaturesComponent } from 'src/app/components/newFeatures/newFeatures.component';
import { VersionModel } from 'src/app/models/version';

@Component({
  selector: 'app-download',
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
    
   }


  ngOnInit() {
    this.breakpoint = (window.innerWidth <= 400) ? 1 : 3;

    this.getFiles().subscribe((data: any) => {

      this.lastestApk = data.find((obj: { version: string; }) => obj.version === "latest");
      this.testApk = data.find((obj: { version: string; }) => obj.version === "test");
      this.items = data.filter((obj: { version: string; }) => obj.version != "test" && obj.version != "latest");
    });
  }

  lastest(){
    window.open("https://biswap.com/download/latest.apk");
  }

  version(name: string){
    window.open("https://biswap.com/download/"+name+".apk");
  }

  test(){
    window.open("https://biswap.com/download/test.apk");
  }

  openTest(){
    this.clickCount ++;
  }

  openDialog(data: VersionModel) {
    this.dialog.open(NewFeaturesComponent, { data: data });
  }

}
