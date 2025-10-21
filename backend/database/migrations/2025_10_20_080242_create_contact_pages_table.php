<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('contact_pages', function (Blueprint $table) {
            $table->id();
            $table->string('locale', 2)->default('tr');
            $table->string('banner_image')->nullable();
            $table->string('form_top_title')->nullable();
            $table->string('form_title')->nullable();
            $table->json('form_subjects')->nullable();
            $table->string('submit_button_text')->nullable();
            $table->timestamps();

            $table->unique('locale');
        });

        Schema::create('contact_submissions', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email');
            $table->string('subject');
            $table->text('message');
            $table->string('locale', 2)->default('tr');
            $table->string('ip_address')->nullable();
            $table->boolean('is_read')->default(false);
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('contact_submissions');
        Schema::dropIfExists('contact_pages');
    }
};
