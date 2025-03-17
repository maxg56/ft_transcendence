FROM caddy:latest

#COPY Caddyfile /etc/caddy/Caddyfile

RUN mkdir -p /data /config

EXPOSE 80 443

CMD ["caddy", "run", "--config", "/etc/caddy/Caddyfile", "--adapter", "caddyfile"]
