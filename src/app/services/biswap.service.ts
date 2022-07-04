import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root',
  })
  export class BiswapService {
    constructor(private http: HttpClient) {}

    getDayDatas(pageSize: number, pageNum: number) {
        const url = environment.endpoints.explorerapi + '/kanban/biswap/daydata/' + pageSize + '/' + pageNum;
        console.log('url===', url);
        return this.http.get(url);
    }
  }