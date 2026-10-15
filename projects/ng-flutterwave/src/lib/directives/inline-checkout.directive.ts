import {
  Directive,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output,
} from '@angular/core';

import { FlutterwaveInlineRequest } from '../models/inline-request';
import { FlutterwaveSuccessResponse } from '../models/payment-success';
import { FlutterwaveInlineService } from '../services/inline.service';

/**
 * Opens the Flutterwave Inline payment modal when the host element is clicked.
 *
 * <button [flwInlineCheckout]="data" (flwCallback)="paid($event)">Pay</button>
 */
@Directive({
  selector: '[flwInlineCheckout]',
  standalone: true,
})
export class InlineCheckoutDirective implements OnInit {
  constructor(private inlineService: FlutterwaveInlineService) {}

  ngOnInit() {
    this.inlineService.loadScript();
  }

  @Input('flwInlineCheckout') data!: FlutterwaveInlineRequest;

  /** Close the payment modal as soon as `flwCallback` has been emitted. */
  @Input() flwCloseOnCallback = false;

  @Output() flwCallback: EventEmitter<FlutterwaveSuccessResponse> =
    new EventEmitter<FlutterwaveSuccessResponse>();

  /** Emits `true` when the modal closed before payment completed. */
  @Output() flwClose: EventEmitter<boolean> = new EventEmitter<boolean>();

  @HostListener('click')
  handlePayment() {
    const modal = this.inlineService.makePayment(
      this.data,
      (res) => {
        this.flwCallback.emit(res);
        if (this.flwCloseOnCallback) modal.close();
      },
      (incomplete) => this.flwClose.emit(incomplete)
    );
  }
}
