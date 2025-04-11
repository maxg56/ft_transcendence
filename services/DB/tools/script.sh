#!/bin/sh

set -e

# Démarrer MariaDB
mariadbd --datadir=/var/lib/mysql &

echo "Waiting for MariaDB to be ready..."
until mariadb-admin ping --silent; do
    sleep 2
done
echo "✅ MariaDB is ready"

# Vérifier si le fichier init.sql existe et l'exécuter
if [ -f "/tools/init.sql" ]; then
    envsubst < /tools/init.sql | mariadb
fi

echo "✅ Initialisation SQL terminée"

# Empêcher le conteneur de se fermer immédiatement
wait
