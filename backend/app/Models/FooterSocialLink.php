<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FooterSocialLink extends Model
{
    protected $fillable = [
        'footer_config_id',
        'platform',
        'url',
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
