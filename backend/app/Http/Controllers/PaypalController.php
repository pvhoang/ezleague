<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Srmklive\PayPal\Services\PayPal;

class PaypalController extends Controller
{
   //
   public function createInvoice(Request $request)
   {
      $request->validate([
         'items' => 'required|array',
         'recipient' => 'sometimes|array',
      ]);
      $currency = $request->currency ?? config('constants.payment_currency');
      // upper case currency
      $currency = strtoupper($currency);
      $description = $request->description ?? '';
      $provider = new PayPal();
      $provider->setApiCredentials(config('paypal'));
      $paypalToken = $provider->getAccessToken();
      $provider->setCurrency($currency);
      $today = date("Y-m-d");
      // if config testing is true, set today previous day
      if (config('app.testing')) {
         $today = date("Y-m-d", strtotime("-1 day"));
      }
      $items = $request->items ?? [];
      $list_items = [];
      $recipient = $request->recipient ?? [];

      if (count($items) > 0) {
         foreach ($items as $item) {
            $new_item = [
               'name' => $item['name'],
               'description' => $item['description'],
               'quantity' => intval($item['quantity']),
               'unit_amount' => [
                  'currency_code' => $currency,
                  'value' =>  intval($item['amount'])
               ],
               'unit_of_measure' => 'QUANTITY'
            ];
            array_push($list_items, $new_item);
         }

         // create array like this
         $data = [
            'detail' => [
               'invoice_number' => uniqid(),
               'invoice_date' => $today,
               'note' => $description,
               'currency_code' => $currency
            ],
            'invoicer' => [
               'email_address' => 'vn@ezactive.com',
            ],
            'primary_recipients' => [
               [
                  'billing_info' => [
                     'name' => [
                        'given_name' => $recipient['first_name'] ?? 'test',
                        'surname' => $recipient['last_name'] ?? 'test'
                     ],
                     'email_address' => $recipient['email'] ?? config('mail.email_test.address'),
                  ]
               ]
            ],
            'items' => $list_items,
            'configuration' => [
               'partial_payment' => [
                  'allow_partial_payment' => false
               ],
               'allow_tip' => false,
               'tax_calculated_after_discount' => true,
               'tax_inclusive' => false
            ]
         ];
         $invoice = $provider->createInvoice($data);
         $invoice_id = null;
         // get invoice id from href
         if (isset($invoice['href'])) {
            $invoice_id = explode('/', $invoice['href']);
            $invoice_id = end($invoice_id);
         }
         $invoice['id'] = $invoice_id;
         $invoice['invoice_no'] = $data['detail']['invoice_number'];
         return $invoice;
      } else {
         return false;
      }
   }

   public function sendInvoice(Request $request)
   {
      $request->validate([
         'invoice_id' => 'required'
      ]);
      $invoice_id = $request->invoice_id;
      $provider = new PayPal();
      $provider->setApiCredentials(config('paypal'));
      $paypalToken = $provider->getAccessToken();
      $subject = "Invoice #" . $invoice_id . " from EZ Active";

      $note = "Thank you for your business.Test invoice";

      $status = $provider->sendInvoice($invoice_id, $subject, $note);
      return $status;
   }

   public function getInvoice(Request $request)
   {
      $request->validate([
         'invoice_id' => 'required'
      ]);
      $invoice_id = $request->invoice_id;
      $provider = new PayPal();
      $provider->setApiCredentials(config('paypal'));
      $paypalToken = $provider->getAccessToken();

      $invoice = $provider->showInvoiceDetails($invoice_id);
      return $invoice;
   }
}
