<?php
// app/Models/FooterQuickLink.php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FooterQuickLink extends Model
{
    protected $fillable = [
        'footer_config_id',
        'label',
        'href',
        'order',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'order' => 'integer',
    ];

    public function config()
    {
        return $this->belongsTo(FooterConfig::class, 'footer_config_id');
    }
}
