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
        Schema::create('match_details', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('match_id')->unsigned();
            $table->integer('team_player_id')->unsigned()->nullable();
            $table->string('type')->nullable();
            $table->tinyInteger('time')->unsigned()->nullable();
            $table->integer('user_id')->unsigned()->nullable();
            $table->string('note')->nullable();
            $table->timestamps();

            $table->foreign('match_id')->references('id')->on('stage_matches')->onDelete('cascade')->onUpdate('cascade');
            $table->foreign('team_player_id')->references('id')->on('team_players')->onDelete('cascade')->onUpdate('cascade');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('set null')->onUpdate('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('match_details');
    }
};
