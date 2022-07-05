import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root',
  })
  export class BiswapService {
    constructor(private http: HttpClient) {}

    getDayDatas(pageSize: number, pageNum: number) {
        const url = environment.endpoints.explorerapi + '/kanban/biswap/daydata/' + pageSize + '/' + pageNum;
        return this.http.get(url);
    }

    getTokens(pageSize: number, pageNum: number) {
      const url = environment.endpoints.explorerapi + '/kanban/biswap/token/' + pageSize + '/' + pageNum;
      return this.http.get(url);
    }

    getPairs(pageSize: number, pageNum: number) {
      const url = environment.endpoints.explorerapi + '/kanban/biswap/pair/' + pageSize + '/' + pageNum;
      return this.http.get(url);
    }

    getTransactions(pageSize: number, pageNum: number) {
      const url = environment.endpoints.explorerapi + '/kanban/biswap/transaction/' + pageSize + '/' + pageNum;
      return this.http.get(url);
    }
  }