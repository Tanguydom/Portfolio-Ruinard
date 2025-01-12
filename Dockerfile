# Utilisation d'une image de serveur Nginx léger pour héberger le site
FROM nginx:alpine

# Copier les fichiers HTML/CSS/JS dans le répertoire par défaut de Nginx
COPY . /usr/share/nginx/html

# Exposer le port 8083 pour le site statique
EXPOSE 8083
