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
        Schema::create('stages', function (Blueprint $table) {
            $table->increments('id');
            $table->string('name');
            $table->string('type');
            $table->integer('tournament_id')->unsigned();
            $table->integer('points_win')->unsigned()->default(3);
            $table->integer('points_draw')->unsigned()->default(1);
            $table->integer('points_loss')->unsigned()->default(0);
            $table->integer('no_encounters')->unsigned()->default(1);
            $table->string('ranking_criteria')->default('Total');
            $table->boolean('third_place')->default(0);
            $table->boolean('is_released')->default(false);
            $table->boolean('is_display_tbd')->default(false);
            $table->timestamps();

            $table->foreign('tournament_id')->references('id')->on('tournaments')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('stages');
    }
};
