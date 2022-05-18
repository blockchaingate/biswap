import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  constructor() {}

    getWalletSession(){
        var clientSession = localStorage.getItem('client-session');
        if(clientSession != undefined || clientSession != null){
            return JSON.parse(clientSession);
        }else return null;
    }

    removeWalletSession(){
        localStorage.removeItem('client-session');
    }

    createWalletSession(session: any){
        localStorage.setItem('client-session', JSON.stringify(session));
    }


    //cant store clinet into local Storage 

    // getWalletClient(){
    //     var clientWallet = sessionStorage.getItem('client-wallet');
    //     if(clientWallet != undefined || clientWallet != null){
    //         return JSON.parse(clientWallet);
    //     }else return null;
    // }

    // removeWalletClient(){
    //     sessionStorage.removeItem('client-wallet');
    // }

    // createWalletClient(client: any){
    //     sessionStorage.setItem('client-wallet', JSON.stringify(client));
    // }
    
}
