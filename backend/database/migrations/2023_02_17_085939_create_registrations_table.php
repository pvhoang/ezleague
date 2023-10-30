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
        Schema::create('registrations', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('season_id')->unsigned();
            $table->integer('club_id')->unsigned()->nullable();
            $table->integer('player_id')->unsigned();
            $table->timestamp('registered_date')->nullable();
            $table->timestamp('approved_date')->nullable();
            $table->string('approval_status', 20)->nullable();
            $table->decimal('amount', 12, 2)->unsigned()->default(0.00);
            $table->timestamps();

            $table->unique(['season_id', 'club_id', 'player_id']);
            $table->foreign('season_id')->references('id')->on('seasons')->onDelete('cascade');
            $table->foreign('player_id')->references('id')->on('players')->onDelete('cascade');
            $table->foreign('club_id')->references('id')->on('clubs')->onDelete('restrict');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('registrations');
    }
};
