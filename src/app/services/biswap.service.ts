import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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

    getPair(pairIdentity: string) {
      const url = environment.endpoints.explorerapi + '/kanban/biswap/pair/' + pairIdentity;
      return this.http.get(url);      
    }

    getToken(tokenIdentity: string) {
      const url = environment.endpoints.explorerapi + '/kanban/biswap/token/' + tokenIdentity;
      return this.http.get(url);  
    }

    getPairsByToken(tokenIdentity: string) {
      const url = environment.endpoints.explorerapi + '/kanban/biswap/pair/token/' + tokenIdentity + '/10/0';
      return this.http.get(url);  
    }

    getTransactionsByToken(tokenIdentity: string) {
      const url = environment.endpoints.explorerapi + '/kanban/biswap/transaction/token/' + tokenIdentity + '/10/0';
      return this.http.get(url);  
    }

    getTransactionsByPair(pairIdentity: string) {
      const pageSize = 10;
      const pageNum = 0;
      const url = environment.endpoints.explorerapi + '/kanban/biswap/transaction/pair/' + pairIdentity + '/' + pageSize + '/' + pageNum;
      return this.http.get(url);
    }
  }