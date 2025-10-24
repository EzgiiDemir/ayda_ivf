<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class NavbarLink extends Model
{
    protected $fillable = [
        'navbar_config_id',
        'dropdown_id',
        'label',
        'href',
        'order',
        'is_active',
        'is_external',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'is_external' => 'boolean',
        'order' => 'integer',
    ];

    public function config()
    {
        return $this->belongsTo(NavbarConfig::class, 'navbar_config_id');
    }

    public function dropdown()
    {
        return $this->belongsTo(NavbarDropdown::class, 'dropdown_id');
    }
}
