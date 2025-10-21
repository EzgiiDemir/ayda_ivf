<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Welcome extends Model
{
    protected $fillable = [
        'locale',
        'image',
        'gradient',
        'title_top',
        'title',
        'paragraphs',
        'signature_name',
        'signature_title',
    ];

    protected $casts = [
        'image' => 'array',
        'gradient' => 'array',
        'paragraphs' => 'array',
    ];
}
