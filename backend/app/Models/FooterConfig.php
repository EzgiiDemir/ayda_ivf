<?php
// app/Models/FooterConfig.php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FooterConfig extends Model
{
    protected $fillable = [
        'locale',
        'address_icon',
        'address_iso_logo',
        'address_text',
        'contact_icon',
        'contact_phone',
        'contact_phone_link',
        'contact_email',
        'contact_email_link',
        'quick_access_icon',
        'copyright_logo',
        'copyright_text',
    ];

    public function socialLinks()
    {
        return $this->hasMany(FooterSocialLink::class)->orderBy('order');
    }

    public function quickLinks()
    {
        return $this->hasMany(FooterQuickLink::class)->orderBy('order');
    }
}
