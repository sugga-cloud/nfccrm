<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;

class GenerateSaaSMigrations extends Command
{
    protected $signature = 'saas:generate-migrations';
    protected $description = 'Generate all SaaS migration files with schema automatically';

    public function handle()
    {
        $migrations = [

            'create_roles_table' => "
Schema::create('roles', function (Blueprint \$table) {
    \$table->id();
    \$table->string('name')->unique();
    \$table->timestamps();
});",

            'create_users_table' => "
Schema::create('users', function (Blueprint \$table) {
    \$table->id();
    \$table->foreignId('role_id')->constrained()->onDelete('cascade');
    \$table->string('full_name')->nullable();
    \$table->string('email')->unique();
    \$table->string('phone')->nullable();
    \$table->string('password');
    \$table->boolean('is_active')->default(true);
    \$table->rememberToken();
    \$table->timestamps();
});",

            'create_profiles_table' => "
Schema::create('profiles', function (Blueprint \$table) {
    \$table->id();
    \$table->foreignId('user_id')->unique()->constrained()->onDelete('cascade');
    \$table->string('username')->unique();
    \$table->string('cover_image')->nullable();
    \$table->string('profile_image')->nullable();
    \$table->string('designation')->nullable();
    \$table->string('company_name')->nullable();
    \$table->text('company_description')->nullable();
    \$table->string('phone')->nullable();
    \$table->string('email')->nullable();
    \$table->string('whatsapp')->nullable();
    \$table->text('google_map_link')->nullable();
    \$table->string('website')->nullable();
    \$table->string('qr_code_path')->nullable();
    \$table->boolean('is_active')->default(true);
    \$table->timestamps();
});",

            'create_services_table' => "
Schema::create('services', function (Blueprint \$table) {
    \$table->id();
    \$table->foreignId('profile_id')->constrained()->onDelete('cascade');
    \$table->string('title');
    \$table->text('description')->nullable();
    \$table->string('image')->nullable();
    \$table->timestamps();
});",

            'create_products_table' => "
Schema::create('products', function (Blueprint \$table) {
    \$table->id();
    \$table->foreignId('profile_id')->constrained()->onDelete('cascade');
    \$table->string('name');
    \$table->text('description')->nullable();
    \$table->decimal('price',10,2);
    \$table->string('image')->nullable();
    \$table->timestamps();
});",

            'create_blogs_table' => "
Schema::create('blogs', function (Blueprint \$table) {
    \$table->id();
    \$table->foreignId('profile_id')->constrained()->onDelete('cascade');
    \$table->string('title');
    \$table->text('description');
    \$table->string('featured_image')->nullable();
    \$table->timestamps();
});",

        ];

        foreach ($migrations as $name => $schema) {

            // Create migration file
            $this->call('make:migration', ['name' => $name]);

            // Wait so timestamp changes
            sleep(1);

            // Get latest migration file
            $files = File::files(database_path('migrations'));
            $latestFile = collect($files)->sortByDesc(fn($file) => $file->getCTime())->first();

            $content = File::get($latestFile->getPathname());

            // Inject Schema into up() method
            $content = preg_replace(
                '/public function up\(\): void\s*{\s*}/',
                "public function up(): void\n    {\n        $schema\n    }",
                $content
            );

            File::put($latestFile->getPathname(), $content);
        }

        $this->info('All migrations created and schema inserted successfully.');
    }
}
