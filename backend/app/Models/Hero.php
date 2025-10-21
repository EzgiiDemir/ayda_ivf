<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Hero extends Model
{
    protected $fillable = [
        'locale',
        'slides',
        'dots_pattern',
        'auto_play',
        'auto_play_interval',
        'show_indicators',
        'right_text',
        'bottom_text',
    ];

    protected $casts = [
        'slides' => 'array',
        'auto_play' => 'boolean',
        'auto_play_interval' => 'integer',
        'show_indicators' => 'boolean',
    ];
}
