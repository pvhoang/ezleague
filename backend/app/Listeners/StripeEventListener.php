<?php

namespace App\Listeners;

use App\Models\Payment;
use Illuminate\Support\Facades\Log;
use Laravel\Cashier\Events\WebhookReceived;

class StripeEventListener
{
    /**
     * Handle received Stripe webhooks.
     */
    public function handle(WebhookReceived $event): void
    {
        Log::info('StripeEventListener', ['payload' => $event->payload]);
        $object = $event->payload['data']['object'];
        //check type contains 'succeeded'
        switch ($event->payload['type']) {
            case 'invoice.payment_succeeded':
                Log::info('payment succeeded', ['payment_intent' => $object['payment_intent']]);
                // find payment_intent in table payment and update status
                $payment = Payment::where('payment_intent', $object['payment_intent'])->first();
                if ($payment) {
                    $payment->status = $object['status'];
                    $payment->save();
                    // find payment details in table payment_details and update status
                    $paymentDetails = $payment->paymentDetails;
                    foreach ($paymentDetails as $paymentDetail) {
                        $paymentDetail->status = $object['status'];
                        $paymentDetail->save();
                    }
                }
                break;
            case 'invoice.payment_failed':
                Log::info('payment failed', ['payment_intent' => $object['payment_intent']]);
                $payment = Payment::where('payment_intent', $object['payment_intent'])->first();
                if ($payment) {
                    $payment->status = $object['status'];
                    $payment->save();
                    // find payment details in table payment_details and update status
                    $paymentDetails = $payment->paymentDetails;
                    foreach ($paymentDetails as $paymentDetail) {
                        $paymentDetail->status = $object['status'];
                        $paymentDetail->save();
                    }
                }
                break;
        }
    }
}
