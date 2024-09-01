import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { FabTokenBalance } from '../models/fabCoinBalance';
import { UtilsService } from './utils.service';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(
      private http: HttpClient,
      private utilService: UtilsService
  ) {}

  async fabCallContract(contractAddress: string, fxnCallHex: string) {
    const url = environment.endpoints.FAB.exchangily + 'callcontract';

    contractAddress = this.utilService.stripHexPrefix(contractAddress);     
    const data = {address: contractAddress, data: fxnCallHex};

    const formData: FormData = new FormData(); 
    formData.append('address', contractAddress); 
    formData.append('data', fxnCallHex); 

    const response = await this.http.post(url, formData).toPromise() as FabTokenBalance;
    return response;
}

sendUserPair(data: any){
  const url = environment.endpoints.kanban + 'biswap/addUserLiquidityPair';
  return this.http.post(url, data);
}


getUserExistPair(walletAddress: string, page: number = 0 ) {
  const url = environment.endpoints.explorerapi + '/v3/biswap/liquidityposition/user/' + walletAddress + "/10/" + page.toString();
  return this.http.get(url);
}

getTransactionStatus(transactionId : string) {
  const url = 'https://kanbantest.fabcoinapi.com/kanban/gettransactionreceipt/' + transactionId;
  return this.http.get(url);
}

getTokensInfoFromPair(pairId : string) {
  const url = environment.endpoints.explorerapi + '/v3/biswap/pair/' + pairId;
  return this.http.get(url);
}

getTokenInfoFromId(tokenId : string) {
  const url = environment.endpoints.explorerapi + '/v3/biswap/token/' + tokenId;
  return this.http.get(url);
}

}















