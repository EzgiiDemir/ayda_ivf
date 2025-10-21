<?php
// app/Models/FAQPage.php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FAQPage extends Model
{
    protected $table = 'faq_pages';

    protected $fillable = [
        'locale',
        'hero_image',
    ];
}
