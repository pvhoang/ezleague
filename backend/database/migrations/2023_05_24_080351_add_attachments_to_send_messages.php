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
        Schema::table('send_messages', function (Blueprint $table) {
            //
            if (!Schema::hasColumn('send_messages', 'attachments')) {
                $table->json('attachments')->nullable();
            }
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('send_messages', function (Blueprint $table) {
            //
        });
    }
};
