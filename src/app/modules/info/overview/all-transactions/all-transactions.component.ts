import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-all-transactions',
  templateUrl: './all-transactions.component.html',
  styleUrls: ['./all-transactions.component.scss']
})
export class AllTransactionsComponent implements OnInit {
  @Input() items: any;
  constructor() { }

  ngOnInit(): void {
  }

}
