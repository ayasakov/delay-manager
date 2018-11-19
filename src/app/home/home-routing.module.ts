import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DelayManagerComponent } from './delay-manager/delay-manager.component';

const routes: Routes = [
  { path: '', component: DelayManagerComponent, data: { title: 'RightOnTrack' } },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
