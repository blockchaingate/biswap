import { Blockchain } from './blockchain';
export class Coin {

    tickerName: string = '';
    type: number = 0;
    decimal: number = 0;
    contract: string = '';
    minWithdraw: string = '';
    feeWithdraw: string = '';

    _id?: string;
    name: string = '';
    symbol: string ='';
    decimals: number = 0;
    coinType: number = 0; // Bip44 cointype
    blockchain!: Blockchain;

    internalOnly?: boolean;  // This coin only for Exchangily use, not exposure to external.
    needsStripping?: boolean;
    chain?: number;
    chainName?: string;
    isERC20?: boolean;
    protocol?: string; // ERC20, TRC20, FRC20 etc.
    contractAddress?: string; // If it is a contract token
    trimPrefix?: boolean;

    issueTime?: string;
    totalsupply?: number;
    circulation?: number;
    getCirculationLink?: string;
    burned?: number;

    summary?: string;
    summaryLan?: [{lan: string, summary: string}];
    introduction?: string;
    descLan?: [{lan: string, desc: string}];
    website?: string;
    whitepaper?: string;
    explorer?: string;
    sourcecode?: string;
    communities?: [{name: string, link: string}];

    active?: boolean;

    dateCreated?:  Date;
    lastUpdated?: Date;

//    constructor(name: string) {
//     this.name = name;
//     this.symbol = name;
//     if (name === 'BTC') {
//         this.coinType = environment.CoinType.BTC;
//         this.decimals = 8;
//     } else
//     if (name === 'ETH') {
//         this.coinType = environment.CoinType.ETH; 
//         this.decimals = 18;
//     } else
//     if (name === 'BNB') {
//         this.coinType = environment.CoinType.BNB; 
//         this.decimals = 18;
//     }  else
//     if (name === 'HT') {
//         this.coinType = environment.CoinType.HT; 
//         this.decimals = 18;
//     }  else
//     if (name === 'MATIC') {
//         this.coinType = environment.CoinType.MATIC; 
//         this.decimals = 18;
//     } else
//     if (name === 'USDT') {
//         this.coinType = environment.CoinType.ETH;
//         this.decimals = 6;
//     } else
//     if (name === 'EXG') {
//         this.coinType = environment.CoinType.FAB;
//         this.decimals = 18;
//     } else
//     if (name === 'FAB' || name === 'EX') {
//         this.coinType = environment.CoinType.FAB;
//         this.decimals = 8;
//     } else 
//     if (name === 'DUSD') {
//         this.coinType = environment.CoinType.FAB;
//         this.decimals = 6;
//     } else 
//     if (name === 'BCH') {
//         this.coinType = environment.CoinType.BCH;
//         this.decimals = 8;
//     } else 
//     if (name === 'LTC') {
//         this.coinType = environment.CoinType.LTC;
//         this.decimals = 8;
//     } else 
//     if (name === 'DOGE') {
//         this.coinType = environment.CoinType.DOGE;
//         this.decimals = 8;
//     } else 
//     if (name === 'TRX') {
//         this.coinType = environment.CoinType.TRX;
//         this.decimals = 6;
//     }
//    } 
}
