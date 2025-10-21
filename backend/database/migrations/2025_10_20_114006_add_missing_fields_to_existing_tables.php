<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        // Check and add FAQ tables if not exist
        if (!Schema::hasTable('faq_pages')) {
            Schema::create('faq_pages', function (Blueprint $table) {
                $table->id();
                $table->string('locale', 2)->default('tr');
                $table->string('hero_image')->nullable();
                $table->timestamps();
                $table->unique('locale');
            });
        }

        if (!Schema::hasTable('faqs')) {
            Schema::create('faqs', function (Blueprint $table) {
                $table->id();
                $table->string('locale', 2)->default('tr');
                $table->text('question');
                $table->text('answer');
                $table->integer('order')->default(0);
                $table->boolean('is_active')->default(true);
                $table->timestamps();
                $table->index(['locale', 'order']);
            });
        }

        // Check and add contact_submissions if not exist
        if (!Schema::hasTable('contact_submissions')) {
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
                $table->index(['is_read', 'created_at']);
            });
        }
    }

    public function down()
    {
        Schema::dropIfExists('contact_submissions');
        Schema::dropIfExists('faqs');
        Schema::dropIfExists('faq_pages');
    }
};
