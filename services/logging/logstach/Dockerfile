ARG ELQUI_VERSION

FROM docker.elastic.co/logstash/logstash:${ELASTIC_VERSION:-8.17.4}

# Copie le fichier de configuration principal
COPY ./config/logstash.yml /usr/share/logstash/config/logstash.yml

# Copie le répertoire pipeline
COPY ./pipeline/ /usr/share/logstash/pipeline
