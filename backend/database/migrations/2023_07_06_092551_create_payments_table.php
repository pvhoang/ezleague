<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('payments', function (Blueprint $table) {
            $table->increments("id");
            $table->integer("user_id")->unsigned()->nullable();
            $table->string("payment_intent");
            $table->string("invoice_id")->nullable();
            $table->string("payment_method");
            $table->string("payment_url")->nullable();
            $table->decimal("amount", 10, 2)->unsigned();
            $table->string("currency")->default("hkd");
            $table->string("description")->nullable();
            $table->string("status")->default("open");
            $table->string("notes")->nullable();
            $table->timestamps();

            $table->foreign("user_id")->references("id")->on("users")->onDelete("set null")->onUpdate("cascade");
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('payments');
    }
};
