import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'hextodecimal'})
export class HextoDecimalPipe implements PipeTransform {

  transform(hex: string): number {
     return  parseInt(hex, 16);

  }
}