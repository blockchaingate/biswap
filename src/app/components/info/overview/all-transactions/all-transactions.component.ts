import { Component, OnInit, Input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { TransactionsComponent } from '../../components/transactions/transactions.component';

@Component({
  selector: 'app-all-transactions',
  standalone: true,
  imports: [TranslateModule, TransactionsComponent],
  templateUrl: './all-transactions.component.html',
  styleUrls: ['./all-transactions.component.scss']
})
export class AllTransactionsComponent implements OnInit {
  @Input() transactions: any;
  constructor() { }

  ngOnInit(): void {
  }

}
