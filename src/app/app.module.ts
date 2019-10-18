import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { CoreModule } from './core/core.module';
import { AuthGuard } from './shared/guards/auth.guard';
import { HttpClientModule } from '@angular/common/http';
import { UnAuthGuard } from './shared/guards/un-auth.guard';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    CoreModule,
    HttpClientModule,
  ],
  providers: [
    AuthGuard,
    UnAuthGuard,
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
