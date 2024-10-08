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
import { Observable, lastValueFrom } from 'rxjs';
import { UtilsService } from './utils.service';
import BigNumber from 'bignumber.js';

@Injectable({
  providedIn: 'root',
})
export class KanbanService {
  endpoint = environment.endpoints.kanban;
  private url: string = environment.urlV3;
  coins: Coin[] = [];
  walletModel: WalletModel = new WalletModel();

  constructor(private web3Service: Web3Service, private dataService: DataService, private storageService: StorageService, private utilServ: UtilsService, private walletService: WalletService, private http: HttpClient) {
  }

  async getCoinPoolAddress() {
    const headers = new HttpHeaders().set('Content-Type', 'text/plain; charset=utf-8' );
    let path = 'exchangily/getCoinPoolAddress';
    path = this.endpoint + path;
    let addr = '';
    try {
      addr = (await lastValueFrom(this.http.get(path, { headers, responseType: 'text' }))) as string;
    } catch (e) { }

    return addr;
  }

  async getTokenList() {
    let tempTokenList: Coin[] = [];
    let removeItems: any = [];

    try {
      const response = await lastValueFrom(this.http.get<BaseResponseModel>(`${this.url}v3/token/erc20/100/0`));

      if (response && response.data) {
        response.data.forEach((element) => {
          if (removeItems.indexOf(element.type) === -1) {
            tempTokenList.push(element);
          }
        });
      }

      this.dataService.settokenList(tempTokenList);
    } catch (error) {
      console.error('Error fetching token list:', error);
    }
  }

  getTokenBalance(address: string, tokenContractAddress: string) {
    const obs = new Observable((observer) => {
      if (address.indexOf('0x') < 0) {
        address = this.utilServ.fabToExgAddress(address);
      }
      const url = `${this.url}kanban/token/balance/${tokenContractAddress}/${address}`;
      this.http
        .get<BaseResponseModel>(url)
        .subscribe((x: any) => {
          if (x.success) {
            const data = x.data;
            let balance = 0;
            if (data) {
              balance = new BigNumber(data.balance).shiftedBy(-data.decimals).toNumber();
            }
            observer.next(balance);
          }

        });
    });
    return obs;
  }

  //https://kanbantest.fabcoinapi.com/exchangily/getBalances/0xdcd0f23125f74ef621dfa3310625f8af0dcd971b

  getKanbanStatus() {
    return this.get('status');
  }

  post(path: string, data: any) {
    const httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json', 'Cache-Control': 'no-cache', 'Access-Control-Allow-Origin': '*' });
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

  kanbanCall(to: string, abiData: string) {
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

  sendParams(params: any) {

    console.log('params====', params);
    const client = this.walletService.client;

    const session = this.walletService.session;

    const requestBody = {
      topic: session.topic,
      chainId: this.walletService.chainId,
      request: {
        method: 'kanban_sendTransaction',
        params: params,
      },
    };

    const result = client.request(requestBody);

    return result;
  }

  send(to: string, data: string) {
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

    const result = client.request(requestBody);

    return result;
  }
}
