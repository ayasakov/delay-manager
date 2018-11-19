import { Component, OnInit } from '@angular/core';
import { Time } from '../../utils/time';

@Component({
  selector: 'app-delay-manager',
  templateUrl: './delay-manager.component.html',
  styleUrls: ['./delay-manager.component.scss']
})
export class DelayManagerComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    let m = 0;

    // Monday
    m += Time.getDiff(
      Time.getTime('08:43'),
      Time.getTime('20:21'),
    );

    // Tuesday
    m += Time.getDiff(
      Time.getTime('08:54'),
      Time.getTime('20:05'),
    );

    // Wednesday
    m += Time.getDiff(
      Time.getTime('09:34'),
      Time.getTime('20:17'),
    );

    // Thursday
    m += Time.getDiff(
      Time.getTime('08:23'),
      Time.getTime('20:10'),
    );

    // Friday
    m += Time.getDiff(
      Time.getTime('09:03'),
      Time.getTime('19:00'),
    );

    // outoffice
    m -= Time.getDiff(
      Time.getTime('12:22'),
      Time.getTime('14:10'),
    );

    console.log(Time.getDiff(
      Time.getTime('12:22'),
      Time.getTime('14:10'),
    ));

    // cc
    m -= 5 * 60;

    m -= 9 * 60 * 5;

    console.log(Time.getHumanFormat(m));
  }

}
