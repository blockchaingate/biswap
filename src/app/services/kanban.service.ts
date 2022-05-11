import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Coin } from '../models/coin';

@Injectable({
  providedIn: 'root',
})
export class KanbanService {
  endpoint = environment.endpoints.kanban;
  private url: string = environment.url;
  coins: Coin[];

  constructor(private http: HttpClient) {
    this.getTokenList().subscribe((cos) => (this.coins = cos));
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
    return this.http.get<Coin[]>(`${this.url}exchangily/getTokenList`);
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

kanbanCall(to: string, abiData: string) {
    const data = {
        "transactionOptions": {
            to: to,
            data: abiData,
          }
    }; 
    const path = 'kanban/call';
    const res = this.post(path, data);
    return res;
  }
}
