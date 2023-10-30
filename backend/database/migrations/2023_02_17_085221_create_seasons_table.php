<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
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
        Schema::create('seasons', function (Blueprint $table) {
            $table->increments('id');
            // $table->string('project_id', 30);
            $table->string('name', 100);
            $table->string('type', 20);
            $table->decimal('fee', 12, 2)->unsigned();
            $table->date('start_date')->nullable();
            $table->date('end_date')->nullable();
            $table->date('start_register_date')->nullable();
            $table->string('status', 20)->default('Active');
            $table->timestamps();

            // $table->foreign('project_id')->references('id')->on('projects')->onDelete('cascade')->onUpdate('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('seasons');
    }
};
