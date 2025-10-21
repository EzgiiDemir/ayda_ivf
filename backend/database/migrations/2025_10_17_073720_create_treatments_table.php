<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('treatments', function (Blueprint $table) {
            $table->id();
            $table->string('locale', 2)->default('tr');
            $table->string('background_logo')->nullable();
            $table->json('treatments'); // [{id, href, label, order, isActive}]
            $table->string('top_title')->nullable();
            $table->string('title')->nullable();
            $table->text('description1')->nullable();
            $table->text('description2')->nullable();
            $table->string('contact_button_text')->nullable();
            $table->timestamps();

            $table->unique('locale');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('treatments');
    }
};
