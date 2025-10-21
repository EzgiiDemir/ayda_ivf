<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Treatment extends Model
{
    protected $fillable = [
        'locale',
        'background_logo',
        'treatments',
        'top_title',
        'title',
        'description1',
        'description2',
        'contact_button_text',
        'slug',
        'order',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'treatments' => 'array',
    ];
}
