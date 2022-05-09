import { Pipe, PipeTransform } from '@angular/core';
import { environment } from 'src/environments/environment';

@Pipe({name: 'generateUrl'})
export class GenerateUrlPipe implements PipeTransform {

  transform(txid: string): string {
    const url = 'https://' + (environment.production ? '' : 'test.') + 'exchangily.com/explorer/tx-detail/' + txid;
    return url;
  }
}