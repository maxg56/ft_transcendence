#!/bin/sh

DB_FILE="database.sqlite"
INIT_SQL="init.sql"

# Vérifier si la base de données existe
echo "Vérification de l'existence de la base de données..."
if [ ! -f "$DB_FILE" ]; then
    echo "Création de la base de données SQLite..."
    sqlite3 "$DB_FILE" < "$INIT_SQL"
    if [ $? -eq 0 ]; then
        echo "Base de données initialisée avec succès."
    else
        echo "Erreur lors de l'initialisation de la base de données."
        exit 1
    fi
else
    echo "Base de données déjà existante, démarrage de SQLite."
fi

# Démarrage de SQLite
echo "Démarrage de SQLite..."
sqlite3 "$DB_FILE" ".databases" || { echo "SQLite n'a pas pu démarrer"; exit 1; }


