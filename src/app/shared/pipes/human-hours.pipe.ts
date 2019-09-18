import * as _ from 'lodash';
import { Pipe, PipeTransform } from '@angular/core';
import { Time } from '../../utils/time';

@Pipe({
  name: 'humanHours'
})
export class HumanHoursPipe implements PipeTransform {

  transform(value: number): string {
    return _.isNaN(Number(value)) ? '-' : Time.getHumanFormat(value);
  }

}
