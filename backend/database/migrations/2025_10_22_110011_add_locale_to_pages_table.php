<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('pages', function (Blueprint $table) {
            $table->string('locale', 2)->default('tr')->after('id');
            $table->unsignedBigInteger('parent_id')->nullable()->after('locale');

            // Index for faster queries
            $table->index('locale');
            $table->index('parent_id');

            // Unique slug per locale
            $table->dropUnique(['slug']);
            $table->unique(['slug', 'locale']);
        });
    }

    public function down()
    {
        Schema::table('pages', function (Blueprint $table) {
            $table->dropIndex(['locale']);
            $table->dropIndex(['parent_id']);
            $table->dropUnique(['slug', 'locale']);
            $table->unique('slug');
            $table->dropColumn(['locale', 'parent_id']);
        });
    }
};
