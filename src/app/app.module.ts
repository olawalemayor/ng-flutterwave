import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { FluttterWaveModule } from './flutterwave/flutterwave.module';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, FluttterWaveModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
