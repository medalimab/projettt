FROM php:8.2-cli

# Installer les dépendances nécessaires
RUN apt-get update && apt-get install -y \
    libz-dev \
    libssl-dev \
    librdkafka-dev \
    unzip \
    git \
    && docker-php-ext-install sockets pdo_mysql \
    && pecl install rdkafka \
    && docker-php-ext-enable rdkafka

# Installer Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Définir le répertoire de travail
WORKDIR /var/www

# Copier les fichiers du projet
COPY . .

# Installer les dépendances PHP
RUN composer install

# Exposer le port 8000 pour Laravel
EXPOSE 8000

# Commande par défaut pour démarrer Laravel
CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=8000"]