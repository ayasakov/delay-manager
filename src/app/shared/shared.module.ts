import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  imports: [
    CommonModule,
    MatGridListModule,
    MatButtonModule,
  ],
  exports: [
    MatGridListModule,
    MatButtonModule,
  ],
  declarations: []
})
export class SharedModule {
}
