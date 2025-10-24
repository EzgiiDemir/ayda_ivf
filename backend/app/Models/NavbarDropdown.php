<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class NavbarDropdown extends Model
{
    protected $fillable = [
        'navbar_config_id',
        'type',
        'label',
        'order',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'order' => 'integer',
    ];

    public function config()
    {
        return $this->belongsTo(NavbarConfig::class, 'navbar_config_id');
    }

    public function links()
    {
        return $this->hasMany(NavbarLink::class, 'dropdown_id')->orderBy('order');
    }
}
