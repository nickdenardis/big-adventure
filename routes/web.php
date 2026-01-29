<?php

use App\Http\Controllers\ScoreController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::get('/game', function () {
    return Inertia::render('game');
})->name('game');

// API routes for scores
Route::prefix('api')->group(function () {
    Route::get('/scores', [ScoreController::class, 'index']);
    Route::post('/scores', [ScoreController::class, 'store']);
});
