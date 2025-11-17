import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatNavList } from '@angular/material/list';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-sidenav-list',
  standalone: true,
  imports: [MatNavList, MatIconModule, RouterLink, TranslateModule],
  templateUrl: './sidenav-list.component.html',
  styleUrls: ['./sidenav-list.component.scss']
})
export class SidenavListComponent implements OnInit {
  @Output() sidenavClose = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

  onSidenavClose() {
    this.sidenavClose.emit();
  }

}
