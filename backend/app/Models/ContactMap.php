<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ContactMap extends Model
{
protected $fillable = [
'locale',
'show_iframe',
'map_url',
'image',
];

protected $casts = [
'show_iframe' => 'boolean',
];
}
