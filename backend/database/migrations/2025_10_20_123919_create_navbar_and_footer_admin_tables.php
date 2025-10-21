<?php
// database/migrations/xxxx_create_navbar_and_footer_admin_tables.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        // Navbar Configuration
        Schema::create('navbar_configs', function (Blueprint $table) {
            $table->id();
            $table->string('locale', 2)->default('tr');

            // Logo
            $table->string('logo_url')->nullable();
            $table->string('logo_alt')->nullable();
            $table->integer('logo_width')->default(125);
            $table->integer('logo_height')->default(65);

            // Contact
            $table->string('phone_number')->nullable();
            $table->string('whatsapp_number')->nullable();
            $table->string('email')->nullable();

            $table->timestamps();
            $table->unique('locale');
        });

        // Navbar Dropdowns (About, Treatments)
        Schema::create('navbar_dropdowns', function (Blueprint $table) {
            $table->id();
            $table->foreignId('navbar_config_id')->constrained()->onDelete('cascade');
            $table->string('type'); // 'about' or 'treatments'
            $table->string('label');
            $table->integer('order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        // Navbar Links (both dropdown links and main links)
        Schema::create('navbar_links', function (Blueprint $table) {
            $table->id();
            $table->foreignId('navbar_config_id')->constrained()->onDelete('cascade');
            $table->foreignId('dropdown_id')->nullable()->constrained('navbar_dropdowns')->onDelete('cascade');
            $table->string('label');
            $table->string('href');
            $table->integer('order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->boolean('is_external')->default(false);
            $table->timestamps();
        });

        // Footer Configuration
        Schema::create('footer_configs', function (Blueprint $table) {
            $table->id();
            $table->string('locale', 2)->default('tr');

            // Address
            $table->string('address_icon')->nullable();
            $table->string('address_iso_logo')->nullable();
            $table->text('address_text')->nullable();

            // Contact
            $table->string('contact_icon')->nullable();
            $table->string('contact_phone')->nullable();
            $table->string('contact_phone_link')->nullable();
            $table->string('contact_email')->nullable();
            $table->string('contact_email_link')->nullable();

            // Quick Access
            $table->string('quick_access_icon')->nullable();

            // Copyright
            $table->string('copyright_logo')->nullable();
            $table->text('copyright_text')->nullable();

            $table->timestamps();
            $table->unique('locale');
        });

        // Footer Social Links
        Schema::create('footer_social_links', function (Blueprint $table) {
            $table->id();
            $table->foreignId('footer_config_id')->constrained()->onDelete('cascade');
            $table->string('platform'); // facebook, instagram, youtube
            $table->string('url');
            $table->integer('order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        // Footer Quick Links
        Schema::create('footer_quick_links', function (Blueprint $table) {
            $table->id();
            $table->foreignId('footer_config_id')->constrained()->onDelete('cascade');
            $table->string('label');
            $table->string('href');
            $table->integer('order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('footer_quick_links');
        Schema::dropIfExists('footer_social_links');
        Schema::dropIfExists('footer_configs');
        Schema::dropIfExists('navbar_links');
        Schema::dropIfExists('navbar_dropdowns');
        Schema::dropIfExists('navbar_configs');
    }
};
