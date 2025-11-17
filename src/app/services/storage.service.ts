import { Injectable } from '@angular/core';
import { StorageMap } from '@ngx-pwa/local-storage';
import { error } from 'console';

@Injectable({
    providedIn: 'root',
})
export class StorageService {

    constructor(private storage: StorageMap) { }

    // Wallet Session Management
    getWalletSession() {
        //this.storage.get('client-session').subscribe((data: any) => {
        //    return JSON.parse(data);
        //});

        //use subscribe to call it:
        return this.storage.get('client-session');
    }

    removeWalletSession() {
        this.storage.delete('client-session').subscribe(() => { });
    }

    createWalletSession(session: any) {
        this.storage.set('client-session', JSON.stringify(session)).subscribe(() => { });
    }

    //DeviceID Management
    getDeviceID() {
        //this.storage.get('device-id').subscribe((data: any) => {
        //    return data;
        //});

        //use subscribe to call it:
        return this.storage.get('device-id');
    }

    setDeviceID(deviceID: string) {
        this.storage.set('device-id', deviceID).subscribe(() => { });
    }

    removeDeviceID() {
        this.storage.delete('device-id').subscribe(() => { });
    }

    // Language
    getLanguage() {
        return this.storage.get('_lan');
    }

    setLanguage(language: string) {
        this.storage.set('_lan', language).subscribe(() => { });
    }
}
