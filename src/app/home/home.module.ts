import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DelayManagerComponent } from './delay-manager/delay-manager.component';
import { HomeRoutingModule } from './home-routing.module';
import { SharedModule } from '../shared/shared.module';
import { SummaryComponent } from './summary/summary.component';
import { SummaryDayComponent } from './summary-day/summary-day.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    HomeRoutingModule,
  ],
  declarations: [
    DelayManagerComponent,
    SummaryComponent,
    SummaryDayComponent
  ]
})
export class HomeModule {
}
