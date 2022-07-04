import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit {
  @Input() items: any;
  constructor() { }

  ngOnInit(): void {
    console.log('item in OverviewComponent===', this.items);
  }

}
