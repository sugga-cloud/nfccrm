#!/usr/bin/env bash
# Exit on error
set -o errexit

# Install dependencies
composer install --no-dev --optimize-autoloader

# Create storage link (important for images/assets)
php artisan storage:link

# Cache config and routes for performance
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Run migrations and seeders
# The --force flag is required to run these in production
php artisan migrate:fresh --force

# Option A: Run all seeders (from DatabaseSeeder.php)
php artisan db:seed --force

# Option B: Run a specific seeder (uncomment below if needed)
# php artisan db:seed --class=AdminUserSeeder --force