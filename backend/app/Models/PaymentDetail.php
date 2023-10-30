<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PaymentDetail extends Model
{
    use HasFactory;

    protected $fillable = [
        "payment_id",
        "type",
        "in_table",
        "product_id",
        "quantity",
        "price",
        "status",
        "description",
        "notes",
    ];

    public function payment()
    {
        return $this->belongsTo(Payment::class);
    }

    public function registration()
    {
        return $this->belongsTo(Registration::class, 'product_id');
    }
}
