import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fixLength',
})
export class FixLengthPipe implements PipeTransform {
  transform(value: string, ...args: number[]): unknown {
    if (typeof value === 'undefined' || !value || value.length === 0) {
      return;
    }

    if (value.length >= args[0]) return value.substr(0, args[0]) + '...';

    return value;
  }
}
