import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Coin } from '../models/coin';
import { StorageService } from './storage.service';
import { WalletModel } from '../models/wallet.model';
import { DataService } from './data.service';
import { BaseResponseModel } from '../models/baseResponseModel';
import { Web3Service } from './web3.service';
import { WalletService } from './wallet.service';

@Injectable({
  providedIn: 'root',
})
export class KanbanService {
  endpoint = environment.endpoints.kanban;
  private url: string = environment.url;
  coins: Coin[];
  walletModel: WalletModel = new WalletModel();

  constructor(
    private web3Service: Web3Service,
    private dataService: DataService,
    private storageService: StorageService,
    private walletService: WalletService,
    private http: HttpClient
  ) {
  }

  async getCoinPoolAddress() {
    const headers = new HttpHeaders().set(
      'Content-Type',
      'text/plain; charset=utf-8'
    );
    let path = 'exchangily/getCoinPoolAddress';
    path = this.endpoint + path;
    let addr = '';
    try {
      addr = (await this.http
        .get(path, { headers, responseType: 'text' })
        .toPromise()) as string;
    } catch (e) {}

    return addr;
  }

  getTokenList() {
    var tempTokenList: Coin[] = [];
    var removeItems = [196629, 524290, 196628, 458753, 589826, 196609, 196613];
    this.http
      .get<BaseResponseModel>(`${this.url}exchangily/getTokenList/coinpool`)
      .subscribe((x) => {
        var tokenList: Coin[] = [];
        tokenList = x.data.tokenList;
        tokenList.forEach((element) => {
          if (removeItems.indexOf(element.type) === -1) {
            tempTokenList.push(element);
          }
        });
      });
    this.dataService.settokenList(tempTokenList);
  }

  getKanbanStatus() {
    return this.get('status');
  }

  post(path: string, data: any) {
    const httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache',
    });
    const options = {
      headers: httpHeaders,
    };
    path = this.endpoint + path;
    console.log(path);
    return this.http.post(path, data, options);
  }

  get(path: string) {
    path = this.endpoint + path;
    return this.http.get(path);
  }

  async kanbanCall(to: string, abiData: string) {
    const data = {
      transactionOptions: {
        to: to,
        data: abiData,
      },
    };
    const path = 'kanban/call';
    const res = this.post(path, data);
    return res;
  }

  async kanbanCall1(to: string, abiData: string) {
    const data = {
      transactionOptions: {
        to: to,
        data: abiData,
      },
    };
    const path = 'kanban/call';
    const res = this.post(path, data);
    return res.toPromise();
  }

  async send(to: string, data: string) {
    const client = this.walletService.client;

    const session = this.walletService.session;

    const tx = {
      to: to,
      data: data,
    };


    const requestBody = {
      topic: session.topic,
      chainId: this.walletService.chainId,
      request: {
        method: 'kanban_sendTransaction',
        params: [tx],
      },
    };

    const result = await client.request(requestBody);
    console.log(result);

    return result;
  }
}
