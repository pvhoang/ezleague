<?php

use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\StageController;
use App\Http\Controllers\TeamsheetController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return view('welcome');
});
Route::get('reset-password/{token}', [AuthController::class, 'resetPasswordUrl'])
    ->name('password.reset');
// teamsheet
Route::get('teamsheet/{id}', [TeamsheetController::class, 'show'])->name('teamsheet.show');
Route::get('knockout', [StageController::class, 'generateKnockOutMatches']);