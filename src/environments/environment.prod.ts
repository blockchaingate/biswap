// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
import * as Btc from 'bitcoinjs-lib';

export const environment = {
  production: true,


  smartConractAdressRouter:  "",
  smartConractAdressProxy:   "0xfd5ba9e06b3cdc2da3f4094619f838217b88f519",
  smartConractAdressFactory: "0x9dfc45bbed0626c6c2d0a125e50148ba706b681e",
  smartConractStaking: '',
                            //  "0x161d9DD445C3DAcFbF630B05a0F3bf31027261dc",
  
  endpoints: {
    // blockchaingate: 'http://localhost:3002/v2/',
    blockchaingate: 'https://test.blockchaingate.com/v2/',
    coingecko: 'https://api.coingecko.com/',
    kanban: 'https://kanbantest.fabcoinapi.com/',
    explorerapi: 'https://fabexplorer.com/api',
    BTC: {
      exchangily: 'https://btctest.fabcoinapi.com/',
    },
    FAB: {
      exchangily: 'https://fabtest.fabcoinapi.com/',
    },
    ETH: {
      exchangily: 'https://ethtest.fabcoinapi.com/',
      // etherscan: 'https://api-ropsten.etherscan.io/'
    },
    BCH: {
      exchangily: 'https://bchtest.fabcoinapi.com/',
    },
    DOGE: {
      exchangily: 'https://dogetest.fabcoinapi.com/',
    },
    LTC: {
      exchangily: 'https://ltctest.fabcoinapi.com/',
    },

    // pricehistory: 'http://18.223.17.4:3002/klinedata/'
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
        network: Btc.networks.testnet,
        satoshisPerBytes: 60,
        bytesPerInput: 148
    },

    DOGE: {
        network: {
            messagePrefix: '\u0019Dogecoin Signed Message:\n',
            bech32: 'tb',
            bip32: {
                public: 0x043587cf,
                private: 0x04358394,
            },
            pubKeyHash: 0x71,
            scriptHash: 0xc4,
            wif: 0xf1,
        },
        satoshisPerBytes: 400000,
        bytesPerInput: 148
    },
    LTC: {
        network: {
            messagePrefix: '\u0019Litecoin Signed Message:\n',
            bech32: 'tb',
            bip32: {
                public: 0x0436f6e1,
                private: 0x0436ef7d,
            },
            pubKeyHash: 0x6f,
            scriptHash: 0x3a,
            wif: 0xef,
        },
        satoshisPerBytes: 200,
        bytesPerInput: 148
    },
    BCH: {
        network: {
            messagePrefix: '\u0018Bitcoin Signed Message:\n',
            bech32: 'tb',
            bip32: {
                public: 0x043587cf,
                private: 0x04358394,
            },
            pubKeyHash: 0x6f,
            scriptHash: 0xc4,
            wif: 0xef,
        },
        satoshisPerBytes: 50,
        bytesPerInput: 148
    },
    ETH: {
        chain: 'ropsten',
        hardfork: 'byzantium',
        gasPrice: 90,
        gasPriceMax: 200,
        gasLimit: 21000,
        gasLimitToken: 70000
    },
    BNB: {
        chain: {
            name: 'testnet',
            networkId: 97,
            chainId: 97
        },
        rpcEndpoint: 'https://data-seed-prebsc-1-s1.binance.org:8545',
        hardfork: 'byzantium',
        gasPrice: 5,
        gasPriceMax: 100,
        gasLimit: 21000,
        gasLimitToken: 70000
    },
    MATIC: {
        chain: {
            name: 'testnet',
            networkId: 80001,
            chainId: 80001
        },
        rpcEndpoint: 'https://rpc-mumbai.matic.today',
        hardfork: 'byzantium',
        gasPrice: 5,
        gasPriceMax: 100,
        gasLimit: 21000,
        gasLimitToken: 70000
    },
    HT: {
        chain: {
            name: 'testnet',
            networkId: 256,
            chainId: 256
        },
        rpcEndpoint: 'https://http-testnet.hecochain.com',
        hardfork: 'byzantium',
        gasPrice: 5,
        gasPriceMax: 100,
        gasLimit: 21000,
        gasLimitToken: 70000
    },
    FAB: {
        network: Btc.networks.testnet,
        chain: {
            name: 'test',
            networkId: 212,
            chainId: 212 
        },
        satoshisPerBytes: 100,
        bytesPerInput: 148,
        gasPrice: 40,
        gasLimit: 100000
    },
    KANBAN: {
        chain: {
            name: 'test',
            networkId: 212,
            chainId: 212
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

