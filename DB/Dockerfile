# sqlite/Dockerfile
FROM alpine:latest

# Installer SQLite
RUN apk add --no-cache sqlite

# Définir le répertoire de travail
WORKDIR /data

# Copier le script SQL d'initialisation
COPY init.sql /init.sql

# Copier le script shell d'initialisation
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Déclarer le volume pour persistance des données
VOLUME [ "/data" ]

# Définir la commande de démarrage
CMD ["/entrypoint.sh"]

