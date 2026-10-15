import {
  EnvironmentProviders,
  InjectionToken,
  makeEnvironmentProviders,
} from '@angular/core';

export interface FlutterwaveConfig {
  publicKey: string;
}

export const FLUTTERWAVE_CONFIG = new InjectionToken<FlutterwaveConfig>(
  'FLUTTERWAVE_CONFIG'
);

/**
 * Configures ng-flutterwave in a standalone app:
 *
 * bootstrapApplication(AppComponent, {
 *   providers: [provideFlutterwave({ publicKey: 'FLWPUBK-...' })],
 * });
 */
export function provideFlutterwave(
  config: FlutterwaveConfig
): EnvironmentProviders {
  return makeEnvironmentProviders([
    { provide: FLUTTERWAVE_CONFIG, useValue: config },
  ]);
}
