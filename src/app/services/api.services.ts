import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { BaseResponseModel } from '../models/baseResponseModel';
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

getUserExistPair(walletAddress: string) {
  const url = environment.endpoints.kanban + 'biswap/getUserLiquidityPairs/' + walletAddress;
  return this.http.get(url);
}



}















