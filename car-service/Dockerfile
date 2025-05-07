FROM node:18

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers package.json et package-lock.json
COPY package*.json ./

# Installer les dépendances Node.js
RUN npm install

# Copier le reste des fichiers du projet
COPY . .

# Ajouter une commande pour lister les fichiers après la copie
RUN ls -la /app

# Exposer le port 3000 pour le service Node.js
EXPOSE 3000

# Commande par défaut pour démarrer le serveur Node.js
CMD ["npm", "start"]