import { PLATFORM_ID } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { TestBed } from '@angular/core/testing';

import {
  FLUTTERWAVE_INLINE_SCRIPT_URL,
  FlutterwaveInlineService,
} from './inline.service';
import { provideFlutterwave } from '../config';

describe('FlutterwaveInlineService', () => {
  // A detached document, so the real Flutterwave script is never fetched.
  let doc: Document;

  const setup = (platformId: string, publicKey?: string) => {
    doc = document.implementation.createHTMLDocument('test');
    TestBed.configureTestingModule({
      providers: [
        { provide: DOCUMENT, useValue: doc },
        { provide: PLATFORM_ID, useValue: platformId },
        ...(publicKey ? [provideFlutterwave({ publicKey })] : []),
      ],
    });
    return TestBed.inject(FlutterwaveInlineService);
  };

  const scripts = () =>
    doc.querySelectorAll(`script[src="${FLUTTERWAVE_INLINE_SCRIPT_URL}"]`);

  it('adds the Inline script once in the browser', () => {
    const service = setup('browser');

    service.loadScript();
    service.loadScript();

    expect(scripts().length).toBe(1);
  });

  it('does not add the script on the server', () => {
    setup('server').loadScript();

    expect(scripts().length).toBe(0);
  });

  it('resolves the public key from the data, then from provideFlutterwave', () => {
    const service = setup('browser', 'FLWPUBK_TEST-config-X');

    expect(service.resolvePublicKey({ public_key: 'FLWPUBK_TEST-data-X' })).toBe(
      'FLWPUBK_TEST-data-X'
    );
    expect(service.resolvePublicKey({})).toBe('FLWPUBK_TEST-config-X');
  });

  it('throws when no public key is configured', () => {
    expect(() => setup('browser').resolvePublicKey({})).toThrowError(
      /no public key/
    );
  });
});
