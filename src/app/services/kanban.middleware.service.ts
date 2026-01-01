import { Injectable } from '@angular/core';
import BigNumber from 'bignumber.js';
import { environment } from 'src/environments/environment';
import { KanbanService } from './kanban.service';
import { StorageService } from './storage.service';
import { UtilsService } from './utils.service';
import { Web3Service } from './web3.service';

@Injectable({
  providedIn: 'root',
})
export class KanbanMiddlewareService {
  constructor(
    private storageService: StorageService,
    private utilService: UtilsService,
    private web3Service: Web3Service,
    private kanbanService: KanbanService
  ) { }

  /*
getQuoteV3(
  reserve1, reserve2, amount1
) {
  return new BigNumber(reserve1).multipliedBy(reserve2).dividedBy(new BigNumber(amount1)).toNumber();
}
*/
  async getTotalSupply(pairAddress: string) {
    var abiHex = this.web3Service.totalSupply();

    var result = await this.kanbanService.kanbanCall1(pairAddress, abiHex);

    let res: any = result;
    var value = this.web3Service.decodeabiHex(res.data, 'uint256');
    var temp = Number(value);
    return Number(new BigNumber(temp).dividedBy(new BigNumber(1e18)));
  }

  async getliquidityBalanceOfuser(pairAddress: string) {
    if (this.storageService.getWalletSession() != null) {
      const walletSesson: any = this.storageService.getWalletSession();
      const addressArray = walletSesson == null ? [] : walletSesson.state.accounts[0].split(':');
      const walletAddress = addressArray[addressArray.length - 1];
      const params = [this.utilService.fabToExgAddress(walletAddress)];
      var abiHex = this.web3Service.getBalanceOf(params);
      var result = await this.kanbanService.kanbanCall1(pairAddress, abiHex);

      let res: any = result;
      var value = this.web3Service.decodeabiHex(res.data, 'uint256');
      var temp = Number(value);
      return Number(new BigNumber(temp).dividedBy(new BigNumber(1e18)));
    } else return null;
  }

  async getQuote(params: any, decimals: number) {
    var abiHex = this.web3Service.quote(params);
    console.log('abiHex => ' + abiHex);
    var result = await this.kanbanService.kanbanCall1(
      environment.smartConractAdressRouter,
      abiHex
    );

    let res: any = result;
    var value = this.web3Service.decodeabiHex(res.data, 'uint256');
    console.log('value for quote=', value);
    var temp = Number(value);
    console.log('temp for quote=', temp);
    return new BigNumber(temp).shiftedBy(-decimals).toNumber();
  }
}
