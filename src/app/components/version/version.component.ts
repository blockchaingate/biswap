import { Component, OnInit } from '@angular/core';
import { version } from '../../../environments/version';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-version',
  templateUrl: './version.component.html',
  styleUrls: ['./version.component.scss']
})
export class VersionComponent implements OnInit {
  version = version;
  production = environment.production;
  constructor() { }

  ngOnInit(): void {
    console.log('this.production==', this.production);
  }

}
