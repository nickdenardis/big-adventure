<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Score extends Model
{
    protected $fillable = [
        'player_name',
        'characters',
        'coins',
        'time_seconds',
        'hearts_remaining',
        'max_hearts',
        'completed',
    ];
    
    protected $casts = [
        'completed' => 'boolean',
    ];
    
    // Accessor to decode characters JSON
    public function getCharactersArrayAttribute()
    {
        return json_decode($this->characters, true);
    }
}
