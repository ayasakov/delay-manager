import * as _ from 'lodash';
import { Pipe, PipeTransform } from '@angular/core';
import { Time } from '../../utils/time';

@Pipe({
  name: 'humanHours'
})
export class HumanHoursPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    return _.isNaN(Number(value)) ? '-' : Time.getHumanFormat(value);
  }

}
