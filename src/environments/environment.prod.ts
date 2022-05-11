// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
import * as Btc from 'bitcoinjs-lib';

export const environment = {
  production: true,
  smartConractAdressRouter: "0xa2370c422e2074ae2fc3d9d24f1e654c7fa3c181",
  smartConractAdressProxy: "0xfd5ba9e06b3cdc2da3f4094619f838217b88f519",
  smartConractAdressFactory: "0x9dfc45bbed0626c6c2d0a125e50148ba706b681e",
  
  endpoints: {
    blockchaingate: 'https://api.blockchaingate.com/v2/',
    coingecko: 'https://api.coingecko.com/',
    kanban: 'https://api.exchangily.com/',
    normal_kanban: 'https://kanbanprod.fabcoinapi.com/',
    BTC: {
        exchangily: 'https://btcprod.fabcoinapi.com/'
    },
    FAB: {
        exchangily: 'https://fabprod.fabcoinapi.com/'
    },
    ETH: {
        exchangily: 'https://ethprod.fabcoinapi.com/',
    },
    BCH: {
        exchangily: 'https://bchprod.fabcoinapi.com/',
    },
    DOGE: {
        exchangily: 'https://dogeprod.fabcoinapi.com/',
    },
    LTC: {
        exchangily: 'https://ltcprod.fabcoinapi.com/',
    }
    // pricehistory: 'https://fabprod.fabcoinapi.com:3002/klinedata/'
},
  url: 'https://kanbantest.fabcoinapi.com/',
  CoinType: {
    BTC: 1,
    ETH: 60,
    BNB: 60,
    HT: 60,
    MATIC: 60,
    FAB: 1150,
    BCH: 1,
    LTC: 1,
    DOGE: 1,
    TRX: 195,
  },

  chains: {
    BTC: {
        network: Btc.networks.bitcoin,
        satoshisPerBytes: 90,
        bytesPerInput: 152
    },
    DOGE: {
        network: {
            messagePrefix: '\u0019Dogecoin Signed Message:\n',
            bech32: 'tb',
            bip32: {
              public: 0x02facafd,
              private: 0x02fac398,
            },
            pubKeyHash: 0x1e,
            scriptHash: 0x16,
            wif: 0x9e,
        },            
        satoshisPerBytes: 1500000,
        bytesPerInput: 148
    },

    LTC: {
        network: {
            messagePrefix: '\u0019Litecoin Signed Message:\n',
            bech32: 'tb',
            bip32: {
              public: 0x019da462,
              private: 0x019d9cfe,
            },
            pubKeyHash: 0x30,
            scriptHash: 0x32,
            wif: 0xb0,
        },            
        satoshisPerBytes: 150,
        bytesPerInput: 148
    },  
    BCH: {
        network: {
            messagePrefix: '\u0018Bitcoin Signed Message:\n',
            bech32: 'tb',
            bip32: {
              public: 0x0488b21e,
              private: 0x0488ade4,
            },
            pubKeyHash: 28,
            scriptHash: 40,
            wif: 0x80,
        },            
        satoshisPerBytes: 9,
        bytesPerInput: 148
    },               
    ETH: {
        chain: 'mainnet',
        hardfork: 'petersburg',
        gasPrice: 90,
        gasPriceMax: 200,
        gasLimit: 21000,
        gasLimitToken: 70000
    },
    BNB: {
        chain: {
            name: 'mainnet',
            networkId: 56,
            chainId: 56
        },
        rpcEndpoint: 'https://bsc-dataseed.binance.org',
        hardfork: 'petersburg',
        gasPrice: 5,
        gasPriceMax: 200,
        gasLimit: 21000,
        gasLimitToken: 70000
    },
    MATIC: {
        chain: {
            name: 'mainnet',
            networkId: 137,
            chainId: 137
        },
        rpcEndpoint: 'https://polygon-rpc.com',
        hardfork: 'petersburg',
        gasPrice: 5,
        gasPriceMax: 200,
        gasLimit: 21000,
        gasLimitToken: 70000
    },
    HT: {
        chain: {
            name: 'mainnet',
            networkId: 128,
            chainId: 128
        },
        rpcEndpoint: 'https://http-mainnet.hecochain.com/',
        hardfork: 'petersburg',
        gasPrice: 5,
        gasPriceMax: 200,
        gasLimit: 21000,
        gasLimitToken: 70000
    },
    FAB: {
        network: Btc.networks.bitcoin,
        chain: {
            name: 'mainnet',
            networkId: 0,
            chainId: 0
        },
        satoshisPerBytes: 100,
        bytesPerInput: 152,
        gasPrice: 40,
        gasLimit: 100000
    },
    KANBAN: {
        chain: {
            name: 'mainnet',
            networkId: 211,
            chainId: 211
        },
        gasPrice: 50000000,
        gasLimit: 20000000
    },
    TRX: {
        network: {
            messagePrefix: '\x15TRON Signed Message:\n'
        },     
        feeLimit: 15000000,
        feeLimitToken: 15000000,                   
        fullNode: 'https://api.trongrid.io',
        solidityNode: 'https://api.trongrid.io',
        eventServer: 'https://api.trongrid.io'          
    }
},
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
