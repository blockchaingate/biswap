import { Injectable } from '@angular/core';
import BigNumber from 'bignumber.js';
import * as bs58 from 'bs58';
import { TimestampModel } from '../models/temistampModel';
import { environment } from 'src/environments/environment';
import * as createHash from 'create-hash';

@Injectable({
  providedIn: 'root',
})
export class UtilsService {
  constructor() { }

  fabToExgAddress(address: string) {
    try {
      const bytes = bs58.decode(address);
      const addressInWallet = bytes.toString('hex');
      if (!addressInWallet || addressInWallet.length !== 50) {
        return '';
      }
      return '0x' + addressInWallet.substring(2, 42);
    } catch (e) { }
    return '';
  }

  exgToFabAddress(address: string) {
    try {
      let prefix = '6f';
      if (environment.production) {
          prefix = '00';
      }
      address = prefix + this.stripHexPrefix(address);

      let buf = Buffer.from(address, 'hex');

      const hash1 = createHash('sha256').update(buf).digest().toString('hex');
      const hash2 = createHash('sha256').update(Buffer.from(hash1, 'hex')).digest().toString('hex');

      buf = Buffer.from(address + hash2.substring(0, 8), 'hex');
      address = bs58.encode(buf);
      return address;
    } catch (e) { }
    return '';
  }
  
  stripHexPrefix(str: any) {
    if (!str) {
      return '';
    }
    if (str && (str.length > 2) && (str[0] === '0') && (str[1] === 'x')) {
      return str.slice(2);
    }
    return str;
  }

  toBigNumber(amount: any, decimal: number) {
    if (amount === 0 || amount === '0') {
      return '0';
    }

    if (amount.toString().indexOf('e-') > 0) {
      const amountArrr = amount.toString().split('e');
      return new BigNumber(amountArrr[0] + 'e' + (Number(amountArrr[1]) + decimal)).toFixed();
    }
    const amountStr = amount.toString();
    const amountArr = amountStr.split('.');
    const amountPart1 = amountArr[0];
    const numPart1 = Number(amountPart1);
    let amountPart2 = '';
    if (amountArr[1]) {
      amountPart2 = amountArr[1].substring(0, decimal);
    }

    const amountPart2Length = amountPart2.length;
    if (decimal > amountPart2Length) {
      for (let i = 0; i < decimal - amountPart2Length; i++) {
        amountPart2 += '0';
      }
    }

    let amountStrFull = (numPart1 ? amountPart1 : '') + amountPart2;
    amountStrFull = amountStrFull.replace(/^0+/, '');
    return amountStrFull;
  }

  getTimestamp(value: TimestampModel) {
    var d = new Date();
    d.setFullYear(d.getUTCFullYear() + value.year);
    d.setDate(d.getUTCDate() + value.day!);
    d.setHours(d.getUTCHours() + value.hour!)
    d.setMinutes(d.getUTCMinutes() + value.minute!);
    return d.getTime();
  }

  toFixedNumber(param: number) {
    return Number(param.toFixed(4));
  }

}
