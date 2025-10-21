<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('welcomes', function (Blueprint $table) {
            $table->id();
            $table->string('locale', 2)->default('tr');
            $table->json('image'); // {url, alt, width, height}
            $table->json('gradient'); // {from, via, to}
            $table->string('title_top')->nullable();
            $table->string('title')->nullable();
            $table->json('paragraphs')->nullable(); // [p1, p2, p3, p4, p5]
            $table->string('signature_name')->nullable();
            $table->string('signature_title')->nullable();
            $table->timestamps();

            $table->unique('locale');
        });
    }

    public function down()
    {
        Schema::dropIfExists('welcomes');
    }
};
