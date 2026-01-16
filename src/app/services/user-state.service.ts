import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class UserStateService {
    readonly currentUser = new BehaviorSubject<any>(null);

    constructor() { }

    setUser(user: any) {
        this.currentUser.next(user);
    }

    getUser() {
        return this.currentUser.value;
    }

    clearUser() {
        this.currentUser.next(null);
    }
}
