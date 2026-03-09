# FROM php:8.3-apache

# # Install system dependencies
# RUN apt-get update && apt-get install -y \
#     libpng-dev libonig-dev libxml2-dev zip unzip git curl \
#     && docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd

# # Set Apache Document Root
# ENV APACHE_DOCUMENT_ROOT /var/www/html/public
# RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/sites-available/*.conf
# RUN a2enmod rewrite

# # Set working directory
# WORKDIR /var/www/html

# # Copy application
# COPY . .

# # Install Composer
# COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# # Install PHP dependencies (build time)
# RUN composer install --no-dev --optimize-autoloader

# # Set proper permissions
# RUN chown -R www-data:www-data storage bootstrap/cache

# # Expose port
# EXPOSE 80

# # Start container + run Laravel setup commands
# CMD php artisan storage:link || true && \
#     php artisan config:cache && \
#     php artisan route:cache && \
#     php artisan view:cache && \
#     apache2-foreground

FROM php:8.3-apache

# 1. Install system dependencies (This layer rarely changes, so it stays cached)
RUN apt-get update && apt-get install -y \
    libpng-dev libonig-dev libxml2-dev zip unzip git curl \
    && docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd

# 2. Set Apache Document Root
ENV APACHE_DOCUMENT_ROOT /var/www/html/public
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/sites-available/*.conf
RUN a2enmod rewrite

WORKDIR /var/www/html

# 3. Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# 4. CACHE LAYER: Copy only dependency files first
# As long as you don't add a new package, this step will be INSTANT
COPY composer.json composer.lock ./

# 5. Run install (will be skipped on code-only changes)
RUN composer install --no-dev --no-scripts --no-autoloader --prefer-dist

# 6. Now copy the rest of your application code
# This is where your Controller/Route changes happen
COPY . .

# 7. Finalize composer (Generate optimized autoloaders)
RUN composer dump-autoload --optimize --no-dev

# 8. Set proper permissions
RUN chown -R www-data:www-data storage bootstrap/cache

EXPOSE 80

CMD php artisan storage:link || true && \
    php artisan config:cache && \
    php artisan route:cache && \
    php artisan view:cache && \
    apache2-foreground