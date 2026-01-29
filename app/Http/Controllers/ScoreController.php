<?php

namespace App\Http\Controllers;

use App\Models\Score;
use Illuminate\Http\Request;

class ScoreController extends Controller
{
    /**
     * Display top scores (leaderboard)
     */
    public function index()
    {
        $topScores = Score::where('completed', true)
            ->orderBy('coins', 'desc')
            ->orderBy('time_seconds', 'asc')
            ->take(10)
            ->get();
            
        return response()->json($topScores);
    }

    /**
     * Store a new score
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'player_name' => 'required|string|max:50',
            'characters' => 'required|array',
            'coins' => 'required|integer|min:0',
            'time_seconds' => 'required|integer|min:0',
            'hearts_remaining' => 'required|integer|min:0',
            'max_hearts' => 'required|integer|min:0',
            'completed' => 'required|boolean',
        ]);
        
        // Convert characters array to JSON string
        $validated['characters'] = json_encode($validated['characters']);
        
        $score = Score::create($validated);
        
        return response()->json([
            'success' => true,
            'score' => $score,
            'message' => 'Score saved successfully!'
        ], 201);
    }
}
