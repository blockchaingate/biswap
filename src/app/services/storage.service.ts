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
    
}
