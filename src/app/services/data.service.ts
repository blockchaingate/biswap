import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Coin } from '../models/coin';
import { WalletModel } from '../models/wallet.model';
 
@Injectable({
  providedIn: 'root'
})
export class DataService {

  // swap and add liquidity pages token info
  private firstToken: BehaviorSubject<Coin> = new BehaviorSubject<Coin>(new Coin());
  private secondToken: BehaviorSubject<Coin> = new BehaviorSubject<Coin>(new Coin());

  //to show wallet button 
  private isWalletConnect:BehaviorSubject<boolean>  = new BehaviorSubject<boolean>(false);
  private waletLabel: BehaviorSubject<string> = new BehaviorSubject<string>('Connect Wallet');

  private walletClient: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  GetFirstToken: Observable<Coin> = this.firstToken.asObservable();
  GetSecondToken: Observable<Coin> = this.secondToken.asObservable();


  GetWaletLabel: Observable<string> = this.waletLabel.asObservable();
  GetIsWalletConnect: Observable<boolean> = this.isWalletConnect.asObservable();

  GetWalletClient: Observable<any> = this.walletClient.asObservable();
 
  constructor() { }

  sendWalletLabel(data: string) {
    this.waletLabel.next(data);
  }

  sendFirstToken(data: Coin) {
    this.firstToken.next(data);
  }

  sendSecondToken(data: Coin) {
    this.secondToken.next(data);
  }

  setIsWalletConnect(data: boolean){
    this.isWalletConnect.next(data)
  }

  setWalletClient(data: any){
    this.walletClient.next(data)
  }
}