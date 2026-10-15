import { ModuleWithProviders, NgModule } from '@angular/core';
import { HtmlCheckoutDirective } from './directives/html-checkout.directive';
import { InlineCheckoutDirective } from './directives/inline-checkout.directive';
import { FlutterwaveConfig, FLUTTERWAVE_CONFIG } from './config';

/**
 * For NgModule-based apps. Standalone apps can import the directives directly
 * and use `provideFlutterwave()` instead.
 */
@NgModule({
  imports: [HtmlCheckoutDirective, InlineCheckoutDirective],
  exports: [HtmlCheckoutDirective, InlineCheckoutDirective],
})
export class FlutterwaveModule {
  static forRoot(
    config: FlutterwaveConfig
  ): ModuleWithProviders<FlutterwaveModule> {
    return {
      ngModule: FlutterwaveModule,
      providers: [{ provide: FLUTTERWAVE_CONFIG, useValue: config }],
    };
  }
}

/** @deprecated Use `FlutterwaveModule` instead. */
export { FlutterwaveModule as FluttterWaveModule };
