#!/usr/bin/env bash
# Exit on error
set -o errexit

composer install --no-dev --optimize-autoloader

# Cache config and routes for speed
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Run migrations (Optional: see note below)
# php artisan migrate --force