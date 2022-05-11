import { Injectable } from '@angular/core';
import BigNumber from 'bignumber.js';
import { environment } from 'src/environments/environment';
import Web3 from 'web3';
import Common from 'ethereumjs-common';
import * as Eth from 'ethereumjs-tx';
import { KanbanService } from './kanban.service';
import { SmartContractServices } from './smartcontract.service';

@Injectable({
  providedIn: 'root',
})
export class Web3Service {
  constructor(
    private smartContractService: SmartContractServices,
    private kanbanService: KanbanService
  ) {}

  getWeb3Provider() {
    const web3 = new Web3();
    return web3;
  }

  getGeneralFunctionABI(func: any, paramsArray: string[]) {
    const web3 = this.getWeb3Provider();
    console.log('paramsArray==', paramsArray);
    console.log('func', func);
    const abiHex = web3.eth.abi.encodeFunctionCall(func, paramsArray);
    return abiHex;
  }

  decodeabiHex(param: any, valueType: string) {
    const web3 = this.getWeb3Provider();
    var result = web3.eth.abi.decodeParameter(valueType, param);
    return result;
  }

  decodeabiHexs(param: any, valueType: string[]) {
    const web3 = this.getWeb3Provider();
    var result = web3.eth.abi.decodeParameters(valueType, param);
    return result;
  }

  getBalanceOf(params: any) {
    var func = this.smartContractService.balanceOfFunc();

    const abiHex = this.getGeneralFunctionABI(func, params);
    return abiHex;
  }

  getPair(params: any) {
    var func = this.smartContractService.getPairFunc();

    const abiHex = this.getGeneralFunctionABI(func, params);
    return abiHex;
  }

  swap(params: any) {
    var func = this.smartContractService.swapFunc();

    const abiHex = this.getGeneralFunctionABI(func, params);
    return abiHex;
  }

  getReserves() {
    var params: string[] = [];
    var func = this.smartContractService.getReservesFunc();
    const abiHex = this.getGeneralFunctionABI(func, params);
    return abiHex;
  }

  getAmountIn(params: any) {
    var func = this.smartContractService.getAmountInFunc();
    const abiHex = this.getGeneralFunctionABI(func, params);
    return abiHex;
  }

  getAmountOut(params: any) {
    var func = this.smartContractService.getAmountOutFunc();

    const abiHex = this.getGeneralFunctionABI(func, params);
    return abiHex;
  }

  quote(params: any) {
    var func = this.smartContractService.quoteFunc();

    const abiHex = this.getGeneralFunctionABI(func, params);
    return abiHex;
  }

  async signAbiHexWithPrivateKey(
    abiHex: string,
    keyPair: any,
    address: string,
    nonce: number,
    value = 0,
    options = { gasPrice: 0, gasLimit: 0 }
  ) {
    // console.log('abiHex before', abiHex);
    if (abiHex.startsWith('0x')) {
      abiHex = abiHex.slice(2);
    }

    let gasPrice = environment.chains.KANBAN.gasPrice;
    let gasLimit = environment.chains.KANBAN.gasLimit;
    if (options) {
      if (options.gasPrice) {
        gasPrice = options.gasPrice;
      }
      if (options.gasLimit) {
        gasLimit = options.gasLimit;
      }
    }
    // console.log('abiHex after', abiHex);

    console.log('gasPrice=', gasPrice);
    console.log('gasLimit=', gasLimit);
    const txObject = {
      to: address,
      nonce: nonce,
      data: '0x' + abiHex,
      value: value,
      gas: gasLimit,

      // coin: '0x',
      gasPrice: gasPrice, // in wei
      // gasPrice: 40  // in wei
    };

    const privKey = Buffer.from(keyPair.privateKeyHex, 'hex');

    let txhex = '';

    const customCommon = Common.forCustomChain(
      environment.chains.ETH.chain,
      {
        name: environment.chains.KANBAN.chain.name,
        networkId: environment.chains.KANBAN.chain.networkId,
        chainId: environment.chains.KANBAN.chain.chainId,
      },
      environment.chains.ETH.hardfork
    );
    console.log('txObject===', txObject);
    let tx;
    // if(environment.production) {
    //   tx = new KanbanTxService(txObject, { common: customCommon });
    // } else {
    //   tx = new Eth.Transaction(txObject, { common: customCommon });
    // }

    tx = new Eth.Transaction(txObject, { common: customCommon });

    tx.sign(privKey);
    const serializedTx = tx.serialize();
    txhex = '0x' + serializedTx.toString('hex');
    console.log('txhex');
    console.log(txhex);
    return txhex;

    /*
    const web3 = this.getWeb3Provider();

    const signMess = await web3.eth.accounts.signTransaction(txObject, privateKey) as EthTransactionObj;
    console.log('signMess in signMessageWithPrivateKey=');
    console.log(signMess);
    return signMess.rawTransaction;   
    */
  }
}
