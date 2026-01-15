import { Injectable } from '@angular/core';
import { StorageMap } from '@ngx-pwa/local-storage';
import { error } from 'console';

@Injectable({
    providedIn: 'root',
})
export class StorageService {
    private readonly PREFIX = 'exchangily_';

    constructor(private storage: StorageMap) { }

    set<T>(key: string, value: T): void {
        try {
            const serialized = JSON.stringify(value);
            localStorage.setItem(this.PREFIX + key, serialized);
        } catch (error) {
            console.error('Error saving to storage:', error);
        }
    }

    get<T>(key: string, defaultValue?: T): T | null {
        try {
            const item = localStorage.getItem(this.PREFIX + key);
            if (item === null) {
                return defaultValue !== undefined ? defaultValue : null;
            }
            return JSON.parse(item) as T;
        } catch (error) {
            console.error('Error reading from storage:', error);
            return defaultValue !== undefined ? defaultValue : null;
        }
    }

    remove(key: string): void {
        localStorage.removeItem(this.PREFIX + key);
    }

    clear(): void {
        const keys = Object.keys(localStorage);
        keys.forEach(key => {
            if (key.startsWith(this.PREFIX)) {
                localStorage.removeItem(key);
            }
        });
    }

    has(key: string): boolean {
        return localStorage.getItem(this.PREFIX + key) !== null;
    }

    // Wallet Session Management
    getWalletSession() {
        //this.storage.get('client-session').subscribe((data: any) => {
        //    return JSON.parse(data);
        //});

        //use subscribe to call it:
        return this.storage.get(this.PREFIX + 'client-session');
    }

    removeWalletSession() {
        this.storage.delete(this.PREFIX + 'client-session').subscribe(() => { });
    }

    createWalletSession(session: any) {
        this.storage.set(this.PREFIX + 'client-session', JSON.stringify(session)).subscribe(() => { });
    }

    //DeviceID Management
    getDeviceID() {
        //this.storage.get('device-id').subscribe((data: any) => {
        //    return data;
        //});

        //use subscribe to call it:
        return this.storage.get(this.PREFIX + 'device-id');
    }

    setDeviceID(deviceID: string) {
        this.storage.set(this.PREFIX + 'device-id', deviceID).subscribe(() => { });
    }

    removeDeviceID() {
        this.storage.delete(this.PREFIX + 'device-id').subscribe(() => { });
    }

    // Language
    getLanguage() {
        return this.storage.get('_lan');
    }

    setLanguage(language: string) {
        this.storage.set('_lan', language).subscribe(() => { });
    }
}
