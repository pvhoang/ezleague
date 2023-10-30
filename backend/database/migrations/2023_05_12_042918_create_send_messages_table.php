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
        Schema::create('send_messages', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('season_id')->unsigned();
            $table->integer('user_id')->unsigned()->nullable();
            $table->string('type', 20);
            $table->string('title', 200);
            $table->string('content', 500);
            $table->json('send_to'); // e.g:{"club_ids" : [1,2,3], "group_ids": [1, 2, 3], "player_ids": [3,4,5]  ,  "user_messages": true, "all": true}
            // attachments
            $table->json('attachments')->nullable();
            $table->timestamps();

            $table->foreign('season_id')->references('id')->on('seasons')->onDelete('cascade')->onUpdate('cascade');
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
        Schema::dropIfExists('send_messages');
    }
};
