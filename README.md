# NgFlutterwave

This is a library for making payments with Flutterwave compatible with the latest version of Angular (14.0.0)

## To install the library

Use `npm i ng-flutterwave` to add the package to your dependencies

Add the FlutterwaveModule to your NgModule imports

## Environmental Variables

in your environment files, set the variable `flutterwaveApiKey` to your API key

## Using the services

Add the inline payment service by using

```javascript
import FlutterwaveInlineService from 'ng-flutterwave/flutterwave/services/inline.service'
```

## Models

There are several models including inline payment requests, payment success response and the normal payment request models

to import the models

```javascript

import {FlutterwaveInlineRequest, FlutterwaveSuccessResponse, FlutterwavePaymentRequest} from 'ng-flutterwave/models'

```

## Using the component

Use the MakeInlinePayment component in your application:

```html
<make-inline-payment
  [data]="paymentData"
  (callback)="makePaymentCallback($event)"
  (close)="cancelledPayment()"
></make-inline-payment>
```

where `data` is of the interface FlutterwaveInlineRequest, `callback` is a function called alongside the payment and `close` is a cleanup function called when the payment modal is closed

## What to expext in future

There will be additions of more functionalities and schematic support to ease installation and initialization of the package in your project

## Contact author

Email: <mailto://olawalemayor90@gmail.com>
Github: <https://github.com/olawalemayor>
LinkedIn: <https://linkedin.com/in/olawale-mayor>
twitter: <https://twitter.com/olawalemayor>
facebook: <https://facebook.com/ItsOlawale/>
