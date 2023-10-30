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
        Schema::create('players', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('user_id')->unsigned();
            $table->date('dob')->nullable();
            $table->string('gender', 10)->nullable();
            $table->string('photo')->nullable();
            $table->string('document_type', 50)->nullable();
            $table->string('document_photo')->nullable();
            $table->date('document_expiry_date')->nullable();
            $table->string('validate_status', 20)->nullable();
            $table->string('validated_fields')->nullable()->default('');
            $table->json('custom_fields')->nullable();
            $table->timestamps();

            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('players');
    }
};
