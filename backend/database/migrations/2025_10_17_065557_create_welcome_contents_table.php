<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('welcome_contents', function (Blueprint $table) {
            $table->id();
            $table->string('locale', 5);
            $table->text('html_content');
            $table->string('signature_name');
            $table->string('signature_title');
            $table->string('image_url');
            $table->timestamps();

            $table->unique('locale');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('welcome_contents');
    }
};
