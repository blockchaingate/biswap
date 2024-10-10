import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.scss']
})
export class TransactionsComponent implements OnInit {
  @Input() transactions: any;
  constructor() { }

  ngOnInit(): void {
  }

  toIdentityString(id: string) {
    return id.substring(0,3) + '...' + id.substring(id.length - 3);
  }

  showShortAmount(amount: any) {
    return parseFloat(amount+'').toFixed(8).replace(/\.0+$/,'');
  }
}
