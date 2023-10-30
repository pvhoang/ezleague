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
        Schema::create('payment_details', function (Blueprint $table) {
            $table->increments("id");
            $table->integer("payment_id")->unsigned();
            $table->string("type")->default("registration");
            $table->string("in_table")->default("registrations");
            $table->integer("product_id")->unsigned();
            $table->integer("quantity")->unsigned()->default(1);
            $table->decimal("price", 10, 2)->unsigned();
            $table->string("status")->default("open");
            $table->string("description")->nullable();
            $table->string("notes")->nullable();

            $table->foreign("payment_id")->references("id")->on("payments")->onDelete("cascade")->onUpdate("cascade");
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('payment_details');
    }
};
