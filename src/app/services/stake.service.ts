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

    getAllStakesByUser(account: string, pageSize: number, pageNum: number) {
      const url = environment.endpoints.explorerapi + '/kanban/stake/user/' + account + '/' + pageSize + '/' + pageNum;
      console.log('url===', url);
      return this.http.get(url);
    }

    getStakesTotalCountByUser(account: string) {
      const url = environment.endpoints.explorerapi + '/kanban/stake/user/' + account + '/totalCount';
      console.log('url===', url);
      return this.http.get(url);
    }
  }