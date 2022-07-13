import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import BigNumber from 'bignumber.js';

@Injectable({
    providedIn: 'root',
  })
  export class BiswapService {
    constructor(private http: HttpClient) {}

    getAmountOut(amountIn: number, reserveIn: BigNumber, reserveOut: BigNumber) {
      if(amountIn <= 0 || reserveIn.lte(0) || reserveOut.lte(0)) {
        return 0;
      }
      //reserveIn = reserveIn.shiftedBy(-18);
      //reserveOut = reserveOut.shiftedBy(-18);
      const amountInWithFee = new BigNumber(amountIn).shiftedBy(18).multipliedBy(new BigNumber(997));
      const numerator = amountInWithFee.multipliedBy(reserveOut);
      const denominator = reserveIn.multipliedBy(new BigNumber(1000)).plus(amountInWithFee);
      const amountOut = numerator.dividedBy(denominator).shiftedBy(-18).toNumber();
      return amountOut;
    }

  getAmountIn(amountOut: number, reserveIn: BigNumber, reserveOut: BigNumber) {
    if(amountOut <= 0 || reserveIn.lte(0) || reserveOut.lte(0)) {
      return 0;
    }
    console.log('amountOut===', new BigNumber(amountOut).shiftedBy(18).toNumber());
    console.log('reserveIn===', reserveIn.toNumber());
    console.log('reserveOut===', reserveOut.toNumber());
    const numerator = reserveIn.multipliedBy(new BigNumber(amountOut).shiftedBy(18)).multipliedBy(new BigNumber(1000));
    const denominator = reserveOut.minus(new BigNumber(amountOut).shiftedBy(18)).multipliedBy(new BigNumber(997));
    const amountIn = (numerator.dividedBy(denominator)).plus(new BigNumber(1)).shiftedBy(-18).toNumber();
    return amountIn;
  }

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