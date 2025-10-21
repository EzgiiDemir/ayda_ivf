<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('hero_slides', function (Blueprint $table) {
            $table->id();
            $table->string('image_url');
            $table->string('image_alt')->nullable();
            $table->integer('order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->decimal('overlay_opacity', 3, 2)->default(0);
            $table->timestamps();
        });

        Schema::create('hero_texts', function (Blueprint $table) {
            $table->id();
            $table->string('locale', 5);
            $table->text('center_small');
            $table->text('center_large');
            $table->string('right_text');
            $table->string('bottom_text');
            $table->timestamps();

            $table->unique('locale');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('hero_slides');
        Schema::dropIfExists('hero_texts');
    }
};
