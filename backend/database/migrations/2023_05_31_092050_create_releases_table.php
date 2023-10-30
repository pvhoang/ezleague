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
        Schema::create('releases', function (Blueprint $table) {
            $table->increments('id');
            $table->string('name');
            $table->string('version');
            $table->enum('type', ['stable', 'beta', 'alpha'])->default('stable');
            $table->enum('status', ['available', 'archived'])->default('available');
            $table->string('description')->nullable();
            $table->string('changelog')->nullable();
            $table->longText('download_link')->nullable();
            $table->integer('download_count')->default(0);
            // towards version_code, 0 means towards all version
            $table->string('towards_version');
            $table->timestamps();

            $table->unique(['version', 'type']);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('releases');
    }
};
