<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ContactSetting extends Model
{
    protected $fillable = [
        'image_url',
        'map_url',
        'show_iframe',
    ];

    protected $casts = [
        'show_iframe' => 'boolean',
    ];
}
