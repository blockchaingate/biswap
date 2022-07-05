import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-pools',
  templateUrl: './pools.component.html',
  styleUrls: ['./pools.component.scss']
})
export class PoolsComponent implements OnInit {
  @Input() pairs: any;
  constructor() { }

  ngOnInit(): void {
  }

}
