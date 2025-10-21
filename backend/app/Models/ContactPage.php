<?php
// app/Models/ContactPage.php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ContactPage extends Model
{
    protected $fillable = [
        'locale',
        'banner_image',
        'form_top_title',
        'form_title',
        'form_subjects',
        'submit_button_text',
    ];

    protected $casts = [
        'form_subjects' => 'array',
    ];
}
