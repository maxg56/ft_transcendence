FROM alpine:3.21.2

RUN apk update --no-cache \
    && apk add --no-cache mariadb mariadb-client gettext-envsubst \
    && mkdir -p /var/lib/mysql /run/mysqld \
    && chown -R mysql:mysql /var/lib/mysql /run/mysqld \
    && mariadb-install-db --user=mysql --datadir=/var/lib/mysql

COPY conf/mariadb-server.cnf /etc/my.cnf.d/mariadb-server.cnf
COPY tools/init.sql /tools/init.sql
COPY tools/script.sh /tools/script.sh
RUN chmod +x /tools/script.sh

USER mysql

CMD ["/tools/script.sh"]