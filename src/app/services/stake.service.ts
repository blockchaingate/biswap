import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root',
  })
  export class StakeService {
    constructor(private http: HttpClient) {}
    getSummary(account: string) {
        const url = environment.endpoints.explorerapi + '/kanban/stake/user/' + account;
        console.log('url===', url);
        return this.http.get(url);
      }
  }