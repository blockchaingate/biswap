import { Injectable } from '@angular/core';
import * as bs58 from 'bs58';

@Injectable({
  providedIn: 'root',
})
export class UtilsService {
  constructor() {}

  fabToExgAddress(address: string) {
    try {
      const bytes = bs58.decode(address);
      const addressInWallet = bytes.toString('hex');
      if (!addressInWallet || addressInWallet.length !== 50) {
        return '';
      }
      return '0x' + addressInWallet.substring(2, 42);
    } catch (e) {}
    return '';
  }


  stripHexPrefix(str:any) {
    if(!str) {
        return '';
    }
    if (str && (str.length > 2) && (str[0] === '0') && (str[1] === 'x')) {
        return str.slice(2);
    }
    return str;
}
}
