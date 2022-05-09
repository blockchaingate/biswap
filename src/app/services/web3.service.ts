import { Injectable } from '@angular/core';
import BigNumber from 'bignumber.js';
import { environment } from 'src/environments/environment';
import Web3 from 'web3';
import Common from 'ethereumjs-common';
import * as Eth from 'ethereumjs-tx';
import { KanbanService } from './kanban.service';


@Injectable({
  providedIn: 'root',
})
export class Web3Service {
  constructor(
    private kanbanService: KanbanService
  ) { }

  getWeb3Provider() {
      const web3 = new Web3();
      return web3;
  }

   getGeneralFunctionABI(func: any, paramsArray: any) {
    const web3 = this.getWeb3Provider();
    console.log('paramsArray==', paramsArray);

    console.log(web3)

    // const abiHex = web3.eth.abi.encodeFunctionCall(func, paramsArray);
    const abiHex = web3.eth.abi.encodeFunctionCall(func, paramsArray);
    //burdan sonra kanban call methodu ile smart contractin functioni cagiracagiz
    // var resulta = web3.eth.abi.decodeParameter('uint256',result) ;


    return abiHex;
  }

  decodeabiHex(param: any) {
    const web3 = this.getWeb3Provider();
    var result = web3.eth.abi.decodeParameter('uint256',param) ;
    return result;
  }





  getBalanceOf(params: any){

    const func = {
        "constant": true,
        "inputs": [
          {
            "internalType": "address",
            "name": "",
            "type": "address"
          }
        ],
        "name": "balanceOf",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    }

    const abiHex = this.getGeneralFunctionABI(func, params);
    return abiHex;

  }

  getTransferFuncABI(params: any) {
    console.log('--------------------------------------------------');
    const web3 = this.getWeb3Provider();
    var amount: number = 0.1;
    var amount1: number = 1.3;
    var amount2: number = 2.5;
    var address: string = '0xa2370c422e2074ae2fc3d9d24f1e654c7fa3c181';
    var coin: number = 196609

    let value = new BigNumber(amount).multipliedBy(new BigNumber(1e18)).toFixed();
    let value1 = new BigNumber(amount1).multipliedBy(new BigNumber(1e18)).toFixed();
    let value2 = new BigNumber(amount2).multipliedBy(new BigNumber(1e18)).toFixed();
    value = value.split('.')[0];
    console.log('value for decimal=', value);
    // const params = [address, coin, value, web3.utils.asciiToHex('')];
    // const params = [value, value1, value2];

    const func = {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "amountOut",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "reserveIn",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "reserveOut",
            "type": "uint256"
          }
        ],
        "name": "getAmountIn",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "amountIn",
            "type": "uint256"
          }
        ],
        "stateMutability": "pure",
        "type": "function"
      }


    // const func = {
    //   'constant': false,
    //   'inputs': [
    //     {
    //       'name': '_to',
    //       'type': 'address'
    //     },
    //     {
    //       'name': '_coinType',
    //       'type': 'uint32'
    //     },
    //     {
    //       'name': '_value',
    //       'type': 'uint256'
    //     },
    //     {
    //       "name": "_comment",
    //       "type": "bytes32"
    //     }
    //   ],
    //   'name': 'transfer',
    //   'outputs': [
    //     {
    //       'name': 'success',
    //       'type': 'bool'
    //     }
    //   ],
    //   'payable': false,
    //   'stateMutability': 'nonpayable',
    //   'type': 'function'
    // };


    
    // const func: any = {
    //     "inputs": [
    //       {
    //         "internalType": "address",
    //         "name": "tokenA",
    //         "type": "address"
    //       },
    //       {
    //         "internalType": "address",
    //         "name": "tokenB",
    //         "type": "address"
    //       },
    //       {
    //         "internalType": "uint256",
    //         "name": "amountADesired",
    //         "type": "uint256"
    //       },
    //       {
    //         "internalType": "uint256",
    //         "name": "amountBDesired",
    //         "type": "uint256"
    //       },
    //       {
    //         "internalType": "uint256",
    //         "name": "amountAMin",
    //         "type": "uint256"
    //       },
    //       {
    //         "internalType": "uint256",
    //         "name": "amountBMin",
    //         "type": "uint256"
    //       },
    //       {
    //         "internalType": "address",
    //         "name": "to",
    //         "type": "address"
    //       },
    //       {
    //         "internalType": "uint256",
    //         "name": "deadline",
    //         "type": "uint256"
    //       }
    //     ],
    //     "name": "addLiquidity",
    //     "outputs": [
    //       {
    //         "internalType": "uint256",
    //         "name": "amountA",
    //         "type": "uint256"
    //       },
    //       {
    //         "internalType": "uint256",
    //         "name": "amountB",
    //         "type": "uint256"
    //       },
    //       {
    //         "internalType": "uint256",
    //         "name": "liquidity",
    //         "type": "uint256"
    //       }
    //     ],
    //     "stateMutability": "nonpayable",
    //     "type": "function"
    //   };

      const abiHex = this.getGeneralFunctionABI(func, params);
    return abiHex;
  }




  async signAbiHexWithPrivateKey(abiHex: string, keyPair: any, address: string, nonce: number,
    value = 0, options = { gasPrice: 0, gasLimit: 0 }) {
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
      gasPrice: gasPrice  // in wei
      // gasPrice: 40  // in wei
    };

    const privKey = Buffer.from(keyPair.privateKeyHex, 'hex');

    let txhex = '';

    const customCommon = Common.forCustomChain(
      environment.chains.ETH.chain,
      {
        name: environment.chains.KANBAN.chain.name,
        networkId: environment.chains.KANBAN.chain.networkId,
        chainId: environment.chains.KANBAN.chain.chainId
      },
      environment.chains.ETH.hardfork,
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
    console.log("txhex");
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