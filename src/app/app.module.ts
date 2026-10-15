import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { FlutterwaveModule } from 'ng-flutterwave';
import { environment } from '../environments/environment';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    FlutterwaveModule.forRoot({ publicKey: environment.flutterwaveApiKey }),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
