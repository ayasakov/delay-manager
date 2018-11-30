import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DelayManagerComponent } from './delay-manager/delay-manager.component';
import { HomeRoutingModule } from './home-routing.module';
import { SharedModule } from '../shared/shared.module';
import { SummaryComponent } from './summary/summary.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    HomeRoutingModule,
  ],
  declarations: [DelayManagerComponent, SummaryComponent]
})
export class HomeModule {
}
