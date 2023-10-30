<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    use HasFactory;

    protected $fillable = [
        "user_id",
        "payment_intent",
        "payment_method",
        "invoice_id",
        "payment_url",
        "amount",
        "currency",
        "description",
        "status",
        "notes",
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function paymentDetails()
    {
        return $this->hasMany(PaymentDetail::class);
    }
}
