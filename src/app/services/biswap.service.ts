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
    const numerator = reserveIn.multipliedBy(new BigNumber(amountOut).shiftedBy(18)).multipliedBy(new BigNumber(1000));
    const denominator = reserveOut.minus(new BigNumber(amountOut).shiftedBy(18)).multipliedBy(new BigNumber(997));
    const amountIn = (numerator.dividedBy(denominator))   .plus(new BigNumber(1)).shiftedBy(-18).toNumber();
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

    getCountTokens() {
      const url = environment.endpoints.explorerapi + '/kanban/biswap/token/totalCount';
      return this.http.get(url);   
    }

    getPairs(pageSize: number, pageNum: number) {
      const url = environment.endpoints.explorerapi + '/kanban/biswap/pair/' + pageSize + '/' + pageNum;
      return this.http.get(url);
    }

    getCountPairs() {
      const url = environment.endpoints.explorerapi + '/kanban/biswap/pair/totalCount';
      return this.http.get(url);   
    }

    getTransactions(pageSize: number, pageNum: number) {
      const url = environment.endpoints.explorerapi + '/kanban/biswap/transaction/' + pageSize + '/' + pageNum;
      return this.http.get(url);
    }

    getCountTransactions() {
      const url = environment.endpoints.explorerapi + '/kanban/biswap/transaction/totalCount';
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

    getTransactionsByAccount(account: string, pageSize: number, pageNum: number ) {
      const url = environment.endpoints.explorerapi + '/kanban/biswap/transaction/from/' + account + '/' + pageSize + '/' + pageNum;
      return this.http.get(url);  
    }

    getTransactionCountByAccount(account: string) {
      const url = environment.endpoints.explorerapi + '/kanban/biswap/transaction/from/' + account + '/totalCount';
      return this.http.get(url);  
    }

    getTransactionsByToken(tokenIdentity: string, pageSize: number, pageNum: number) {
      const url = environment.endpoints.explorerapi + '/kanban/biswap/transaction/token/' + tokenIdentity + '/' + pageSize + '/' + pageNum;
      return this.http.get(url);  
    }

    getCountTransactionsByToken(tokenIdentity: string) {
      const url = environment.endpoints.explorerapi + '/kanban/biswap/transaction/token/' + tokenIdentity + '/totalCount';
      return this.http.get(url);
    }

    getTransactionsByPair(pairIdentity: string, pageSize: number, pageNum: number) {

      const url = environment.endpoints.explorerapi + '/kanban/biswap/transaction/pair/' + pairIdentity + '/' + pageSize + '/' + pageNum;
      return this.http.get(url);
    }

    getCountTransactionsByPair(pairIdentity: string) {
      const url = environment.endpoints.explorerapi + '/kanban/biswap/transaction/pair/' + pairIdentity + '/totalCount';
      return this.http.get(url);
    }
    
    getPairDayDatas(pairIdentity: string) {
      const pageSize = 100;
      const pageNum = 0;
      const url = environment.endpoints.explorerapi + '/kanban/biswap/pairdaydata/pair/' + pairIdentity + '/' + pageSize + '/' + pageNum;
      return this.http.get(url);      
    }

    getLiquidity(account: string, pairAddress: string) {
      const url = environment.endpoints.explorerapi + '/kanban/biswap/liquidityposition/user/' + account + "/pair/" + pairAddress;
      return this.http.get(url);    
    }

    getRewardPlans() {
      const pageSize = 100;
      const pageNum = 0;
      const url = environment.endpoints.oldexplorerapi + '/kanban/biswap/rewardplan/' + pageSize + '/' + pageNum;
      return this.http.get(url);  
    }

    getRewards(pageSize: number, pageNum: number) {
      const url = environment.endpoints.oldexplorerapi + '/kanban/biswap/reward/' + pageSize + '/' + pageNum;
      return this.http.get(url);  
    }

    getRewardsWithMine(userId: string, pageSize: number, pageNum: number) {
      const url = environment.endpoints.oldexplorerapi + '/kanban/biswap/reward/' + pageSize + '/' + pageNum + '?userId=' + userId;
      return this.http.get(url);  
    }

    getCountRewards() {
      const url = environment.endpoints.oldexplorerapi + '/kanban/biswap/reward/totalCount';
      return this.http.get(url);  
    }

    getRewardRedeems() {
      const pageSize = 100;
      const pageNum = 0;
      const url = environment.endpoints.oldexplorerapi + '/kanban/biswap/reward/redeem/' + pageSize + '/' + pageNum;
      return this.http.get(url);  
    }

    redeem(address: string, tokenName: string) {
      const url = environment.endpoints.oldexplorerapi + '/kanban/biswap/reward/redeem/' + address + '/' + tokenName;
      return this.http.get(url);  
    }

    getTokenDayDatas(pairIdentity: string) {
      const pageSize = 100;
      const pageNum = 0;
      const url = environment.endpoints.explorerapi + '/kanban/biswap/tokendaydata/token/' + pairIdentity + '/' + pageSize + '/' + pageNum;
      return this.http.get(url);      
    }
  }