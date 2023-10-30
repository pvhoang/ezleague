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
        Schema::table('stage_matches', function (Blueprint $table) {
            $table->string('broadcast_id')->nullable();
            $table->enum('broadcast_status', ['not_started', 'in_progress', 'finished'])->default('not_started');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('stage_matches', function (Blueprint $table) {
            $table->dropColumn('broadcast_id');
            $table->dropColumn('broadcast_status');
        });
    }
};
