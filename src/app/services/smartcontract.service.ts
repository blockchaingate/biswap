import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SmartContractServices {
  constructor() {}

  getReservesFunc() {
    const func = {
      constant: true,
      inputs: [],
      name: 'getReserves',
      outputs: [
        {
          internalType: 'uint112',
          name: '_reserve0',
          type: 'uint112',
        },
        {
          internalType: 'uint112',
          name: '_reserve1',
          type: 'uint112',
        },
        {
          internalType: 'uint32',
          name: '_blockTimestampLast',
          type: 'uint32',
        },
      ],
      payable: false,
      stateMutability: 'view',
      type: 'function',
    };

    return func;
  }

  swapFunc() {
    const func = {
      constant: false,
      inputs: [
        {
          internalType: 'uint256',
          name: 'amount0Out',
          type: 'uint256',
        },
        {
          internalType: 'uint256',
          name: 'amount1Out',
          type: 'uint256',
        },
        {
          internalType: 'address',
          name: 'to',
          type: 'address',
        },
        {
          internalType: 'bytes',
          name: 'data',
          type: 'bytes',
        },
      ],
      name: 'swap',
      outputs: [],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function',
    };

    return func;
  }

  balanceOfFunc() {
    const func = {
      constant: true,
      inputs: [
        {
          internalType: 'address',
          name: '',
          type: 'address',
        },
      ],
      name: 'balanceOf',
      outputs: [
        {
          internalType: 'uint256',
          name: '',
          type: 'uint256',
        },
      ],
      payable: false,
      stateMutability: 'view',
      type: 'function',
    };

    return func;
  }

  getAmountInFunc() {
    const func = {
      inputs: [
        {
          internalType: 'uint256',
          name: 'amountOut',
          type: 'uint256',
        },
        {
          internalType: 'uint256',
          name: 'reserveIn',
          type: 'uint256',
        },
        {
          internalType: 'uint256',
          name: 'reserveOut',
          type: 'uint256',
        },
      ],
      name: 'getAmountIn',
      outputs: [
        {
          internalType: 'uint256',
          name: 'amountIn',
          type: 'uint256',
        },
      ],
      stateMutability: 'pure',
      type: 'function',
    };

    return func;
  }

  getPairFunc() {
    const func = {
      constant: true,
      inputs: [
        {
          internalType: 'uint32',
          name: '',
          type: 'uint32',
        },
        {
          internalType: 'uint32',
          name: '',
          type: 'uint32',
        },
      ],
      name: 'getPair',
      outputs: [
        {
          internalType: 'address',
          name: '',
          type: 'address',
        },
      ],
      payable: false,
      stateMutability: 'view',
      type: 'function',
    };

    return func;
  }

  totalSupplyFunc() {
    const func = {
      "constant": true,
      "inputs": [
      ],
      "name": "totalSupply",
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
    };

    return func;
  }

  getAmountOutFunc() {
    const func = {
      inputs: [
        {
          internalType: 'uint256',
          name: 'amountIn',
          type: 'uint256',
        },
        {
          internalType: 'uint256',
          name: 'reserveIn',
          type: 'uint256',
        },
        {
          internalType: 'uint256',
          name: 'reserveOut',
          type: 'uint256',
        },
      ],
      name: 'getAmountOut',
      outputs: [
        {
          internalType: 'uint256',
          name: 'amountOut',
          type: 'uint256',
        },
      ],
      stateMutability: 'pure',
      type: 'function',
    };

    return func;
  }
  balanceOfProxyFunc() {
    const func = {
      "constant": true,
      "inputs": [
        {
          "internalType": "address",
          "name": "_owner",
          "type": "address"
        },
        {
          "internalType": "uint32",
          "name": "_coinType",
          "type": "uint32"
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
    };

    return func;
  }

  quoteFunc() {
    const func =  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "amountA",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "reserveA",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "reserveB",
        "type": "uint256"
      }
    ],
    "name": "quote",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "amountB",
        "type": "uint256"
      }
    ],
    "stateMutability": "pure",
    "type": "function"
  };

    return func;
  }

  swapTokensForExactTokensFunc() {
    const func =  {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "amountOut",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "amountInMax",
          "type": "uint256"
        },
        {
          "internalType": "uint32[]",
          "name": "path",
          "type": "uint32[]"
        },
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "deadline",
          "type": "uint256"
        }
      ],
      "name": "swapTokensForExactTokensFunc",
      "outputs": [
        {
          "internalType": "uint256[]",
          "name": "amounts",
          "type": "uint256[]"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    };
  
      return func;    
  }
  
  swapExactTokensForTokensFunc() {
    const func =  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "amountIn",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "amountOutMin",
        "type": "uint256"
      },
      {
        "internalType": "uint32[]",
        "name": "path",
        "type": "uint32[]"
      },
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "deadline",
        "type": "uint256"
      }
    ],
    "name": "swapExactTokensForTokens",
    "outputs": [
      {
        "internalType": "uint256[]",
        "name": "amounts",
        "type": "uint256[]"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  };

    return func;
  }

  addLiquidityFunc() {
    const func =   {
      "inputs": [
        {
          "internalType": "uint32",
          "name": "tokenA",
          "type": "uint32"
        },
        {
          "internalType": "uint32",
          "name": "tokenB",
          "type": "uint32"
        },
        {
          "internalType": "uint256",
          "name": "amountADesired",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "amountBDesired",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "amountAMin",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "amountBMin",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "deadline",
          "type": "uint256"
        }
      ],
      "name": "addLiquidity",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "amountA",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "amountB",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "liquidity",
          "type": "uint256"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    };

    return func;
  }

  removeLiquidityFunc() {
    const func =   {
    "inputs": [
      {
        "internalType": "uint32",
        "name": "tokenA",
        "type": "uint32"
      },
      {
        "internalType": "uint32",
        "name": "tokenB",
        "type": "uint32"
      },
      {
        "internalType": "uint256",
        "name": "liquidity",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "amountAMin",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "amountBMin",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "deadline",
        "type": "uint256"
      }
    ],
    "name": "removeLiquidity",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "amountA",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "amountB",
        "type": "uint256"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  };

    return func;
  }

  depositFunc() {
    const func = {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_amount",
          "type": "uint256"
        }
      ],
      "name": "deposit",
      "outputs": [
        
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    };
    return func;
  }

  withdrawFunc() {
    const func = {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_amount",
          "type": "uint256"
        }
      ],
      "name": "withdraw",
      "outputs": [
        
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    };
    return func;
  }
}
