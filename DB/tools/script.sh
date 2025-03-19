#!/bin/sh

set -e

/usr/bin/mariadbd-safe --datadir=/var/lib/mysql &

echo "Waiting for MariaDB to be ready..."
until mariadb-admin ping --silent; do
	sleep 2
done
echo "MariaDB is ready"
# Run the SQL script
if [ -f "/tools/init.sql" ]; then
	envsubst < /tools/init.sql | mariadb
	
fi
echo "MariaDB is ready"
wait
