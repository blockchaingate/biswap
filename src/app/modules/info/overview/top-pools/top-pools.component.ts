import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-top-pools',
  templateUrl: './top-pools.component.html',
  styleUrls: ['./top-pools.component.scss']
})
export class TopPoolsComponent implements OnInit {
  @Input() pairs: any;
  constructor() { }

  ngOnInit(): void {
  }

}
