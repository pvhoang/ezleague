<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use App\Models\PaymentDetail;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Laravel\Cashier\Exceptions\IncompletePayment;

class StripeController extends Controller
{
    //
    function createCustomer(Request $request)
    {
        $paymentMethod = $request->input('payment_method');
        $user =  Auth::user();

        $stripeCustomer = $user->createOrGetStripeCustomer();
        if ($paymentMethod) {
            $res = $user->addPaymentMethod($paymentMethod);
        }
        return response()->json(['success' => true, 'data' => $stripeCustomer]);
    }

    function getInvoices(Request $request)
    {
        $user =  Auth::user();
        $invoices = $user->findInvoice('in_1Nffe3DXDLBGPpQreBMFvMdu');
        return response()->json(['success' => true, 'data' => $invoices]);
    }

    function checkout(Request $request)
    {
        $user =  Auth::user();
        $request->validate([
            'payment_method' => 'required',
            'amount' => 'required',
            'description' => 'required',
        ]);

        $paymentMethod = $request->payment_method;
        $amount = $request->amount;
        $description = $request->description;
        $stripeCustomer = $user->createOrGetStripeCustomer();
        if ($paymentMethod && $stripeCustomer) {
            try {
                $payment = $user->charge(
                    $amount * 100,
                    $paymentMethod,
                    [
                        'description' => $description,
                    ]
                );
                Log::info('payment', [$payment]);

                return response()->json([
                    'message' => __("Payment successfully"),
                    'data' => $payment,
                ], 200);
            } catch (\Exception $e) {
                Log::info('Payment failed', [$e]);
                return response()->json([
                    'message' => $e->getMessage(),
                    "error" => __("Payment failed")
                ], 422);
            }
        }
    }

    function syncPaymentRegistrationStripe(Request $request)
    {
        $request->validate([
            'season_id' => 'required'
        ]);
        //    get all payment has status not in constants.payment_status_paid
        $payments = Payment::whereHas('paymentDetails', function ($query) use ($request) {
            //paymentDetails has registration with season_id
            $query->whereHas('registration', function ($query) use ($request) {
                $query->where('season_id', $request->season_id);
            });
        })->where('payment_method', 'stripe')->whereNotIn('status', config('constants.payment_status_paid'))->get();
        $count = $payments->count();
        if ($count == 0) {
            return response()->json(['success' => true, 'data' => $payments, 'message' => __('No payment need to sync')], 200);
        }
        try {
            foreach ($payments as $payment) {
                $invoice_id = $payment->invoice_id;
                $user = User::find($payment->user_id);
                $invoice = $user->findInvoice($invoice_id);
                if ($invoice->status != $payment->status) {
                    $payment->status = $invoice->status;
                    $payment->save();
                    // update payment details status by payment id
                    PaymentDetail::where('payment_id', $payment->id)->update(['status' => $invoice->status]);
                }
                Log::info('payment status updated', [$invoice]);
            }
            return response()->json(['success' => true, 'data' => $payments, 'message' => __("Synced $count payment(s) successfully")], 200);
        } catch (\Exception $e) {
            Log::info('payment status updated failed', [$e]);
            return response()->json(['success' => false, 'message' => __($e->getMessage())], 422);
        }
    }
}
