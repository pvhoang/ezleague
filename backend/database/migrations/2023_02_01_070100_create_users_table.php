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
        Schema::create('users', function (Blueprint $table) {
            $table->increments('id');
            // $table->string('project_id', 30);
            $table->string('first_name', 50);
            $table->string('last_name', 50);
            $table->string('email');
            $table->string('password', 60);
            $table->string('phone', 20)->nullable();
            $table->integer('role_id')->unsigned()->nullable();
            $table->boolean('two_factor_auth')->default(0);
            $table->string('auth_code')->nullable();
            $table->string('firebase_token')->nullable();
            $table->timestamp('last_login')->nullable();
            $table->string('language')->default('en');
            $table->timestamp('email_verified_at')->nullable();
            $table->rememberToken();
            $table->timestamps();

            $table->unique(['email']);
            // $table->foreign('project_id')->references('id')->on('projects')->onDelete('cascade')->onUpdate('cascade');
            $table->foreign('role_id')->references('id')->on('roles')->onDelete('no action')->onUpdate('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('users');
    }
};
