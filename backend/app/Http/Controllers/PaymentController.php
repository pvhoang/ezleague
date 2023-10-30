<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use App\Http\Requests\StorePaymentRequest;
use App\Http\Requests\UpdatePaymentRequest;
use App\Models\PaymentDetail;
use App\Models\Registration;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class PaymentController extends Controller
{
    //    create payment and payment details for registration
    public function storePaymentRegistration(Registration $registration, $payment_data)
    {
        $invoice_id = $payment_data['invoice_id'];
        $payment_intent = $payment_data['payment_intent'];
        $payment_url = $payment_data['payment_url'];
        $payment_status = $payment_data['payment_status'];
        $fee = $payment_data['fee'];
        $player = $registration->player->user;
        $player_name = $player->first_name . ' ' . $player->last_name;
        $season = $registration->season;
        $season_name = $season->name;
        $guardian = $registration->player->primaryGuardian->user;

        $payment = Payment::create([
            "user_id" => $guardian->id,
            "invoice_id" => $invoice_id,
            "payment_intent" => $payment_intent,
            "payment_method" => 'stripe',
            "payment_url" => $payment_url,
            "amount" => $fee / 100,
            "currency" => 'HKD',
            "description" => "$player_name pay for Season $season_name",
            "status" => $payment_status,
        ]);

        if ($payment) {
            // create payment detail
            $payment_detail = PaymentDetail::create([
                "payment_id" => $payment->id,
                "type" => 'registration',
                "in_table" => 'registrations',
                "product_id" => $registration->id,
                "quantity" => 1,
                "price" => $fee / 100,
                "status" => $payment_status,
                "description" => "$player_name pay for Season $season_name",
            ]);
            Log::info('payment detail created', [$payment_detail]);
            Log::info('payment created', [$payment, $player]);
        }
        return $payment;
    }
}
