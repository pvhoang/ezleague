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
        Schema::create('stage_matches', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('stage_id')->unsigned();
            $table->integer('home_team_id')->unsigned()->nullable();
            $table->integer('away_team_id')->unsigned()->nullable();
            $table->timestamp('start_time')->nullable();
            $table->timestamp('end_time')->nullable();
            $table->integer('location_id')->unsigned()->nullable();
            $table->string('round_name')->nullable();
            $table->string('round_level', 5)->nullable();
            $table->integer('home_score')->nullable();
            $table->integer('away_score')->nullable();
            $table->integer('home_penalty')->nullable();
            $table->integer('away_penalty')->nullable();
            $table->string('status')->nullable();
            $table->text('description')->nullable();
            $table->integer('created_by')->unsigned()->nullable();
            $table->integer('scores_updated_by')->unsigned()->nullable();
            $table->integer('order')->nullable();
            $table->timestamps();

            $table->foreign('stage_id')->references('id')->on('stages');
            $table->foreign('home_team_id')->references('id')->on('teams');
            $table->foreign('away_team_id')->references('id')->on('teams');
            $table->foreign('location_id')->references('id')->on('locations');
            $table->foreign('created_by')->references('id')->on('users');
            $table->foreign('scores_updated_by')->references('id')->on('users');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('stage_matches');
    }
};
