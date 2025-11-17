import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { StorageService } from 'src/app/services/storage.service';
import { GenerateUrlPipe } from '../pipes/generate.url.pipe';

@Component({
  selector: 'app-wallet',
  standalone: true,
  imports: [FormsModule, TranslateModule, GenerateUrlPipe],
  templateUrl: './wallet.component.html',
  styleUrls: ['./wallet.component.scss'],
})
export class WalletComponent implements OnInit {
  chainId!: number;
  account: string = '';
  to: string = '';
  toExample: string = '';
  dataExample: string = '';
  value!: number;
  data: string = '';
  session: any;
  txid: string = '';
  result: any;
  client: any;
  uri: string = '';

  constructor(public storageService: StorageService) { }

  async ngOnInit() {
  }

  async showQrCode() {
  }

  onSessionConnected(session: any) {
  }

  async send() {
  }
}
