<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
return new class extends Migration
{
    public function up()
    {
        Schema::create('contact_maps', function (Blueprint $table) {
            $table->id();
            $table->string('locale', 2)->default('tr');
            $table->boolean('show_iframe')->default(true);
            $table->text('map_url')->nullable();
            $table->string('image')->nullable();
            $table->timestamps();

            $table->unique('locale');
        });
    }

    public function down()
    {
        Schema::dropIfExists('contact_maps');
    }
};
