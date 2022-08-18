export class WalletModel {
    chainId!: number;
    account: string = '';
    to: string = '';
    toExample: string = '';
    dataExample: string = '';
    value!: number;
    data: string = '';
    session: any;
    txid: string = '';
    result: any;
    client: any;
    uri: string = '';
}