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
        Schema::create('stage_teams', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('stage_id')->unsigned();
            $table->integer('team_id')->unsigned();
            $table->string('group')->nullable();
            $table->timestamps();

            $table->foreign('stage_id')->references('id')->on('stages')->onDelete('cascade');
            $table->foreign('team_id')->references('id')->on('teams')->onDelete('cascade');

            $table->unique(['stage_id', 'team_id']);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('stage_teams');
    }
};
