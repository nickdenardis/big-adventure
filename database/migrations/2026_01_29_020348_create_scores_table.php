<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('scores', function (Blueprint $table) {
            $table->id();
            $table->string('player_name');
            $table->string('characters'); // JSON array of selected characters
            $table->integer('coins');
            $table->integer('time_seconds');
            $table->integer('hearts_remaining');
            $table->integer('max_hearts');
            $table->boolean('completed')->default(true); // True if reached grassland
            $table->timestamps();
            
            // Indexes for leaderboard queries
            $table->index(['coins', 'time_seconds']);
            $table->index('completed');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('scores');
    }
};
