<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class NavbarConfig extends Model
{
    protected $fillable = [
        'locale',
        'logo_url',
        'logo_alt',
        'logo_width',
        'logo_height',
        'phone_number',
        'whatsapp_number',
        'email',
    ];

    public function dropdowns()
    {
        return $this->hasMany(NavbarDropdown::class);
    }

    public function links()
    {
        return $this->hasMany(NavbarLink::class)->whereNull('dropdown_id');
    }
}
