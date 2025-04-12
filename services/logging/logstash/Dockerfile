FROM docker.elastic.co/logstash/logstash:8.10.1

ENV VERSION=8.10.1
ENV PIPELINE_WORKERS=2
ENV MONITORING_ENABLED=false
ENV HTTP_HOST=127.0.0.1
ENV MONITORING_ELASTICSEARCH_HOSTS=https://<es_host>:9200
ENV NODE_NAME=<node_name>
ENV PATH_DATA=/usr/share/logstash/data
ENV PATH_LOGS=/usr/share/logstash/logs
ENV PIPELINE_ID=<pipeline_name>

# Suppression du fichier de configuration Logstash par défaut
RUN rm -f /usr/share/logstash/pipeline/logstash.conf

# Création du dossier des certificats et copie du certificat
RUN mkdir -p /usr/share/logstash/certs
COPY --chmod=755 elasticsearch-ca.pem /usr/share/logstash/certs

# Installation de Metricbeat et Filebeat
RUN apt-get update && apt-get install -y curl \
    && curl -L -O https://artifacts.elastic.co/downloads/beats/metricbeat/metricbeat-${VERSION}-amd64.deb \
    && dpkg -i metricbeat-${VERSION}-amd64.deb \
    && curl -L -O https://artifacts.elastic.co/downloads/beats/filebeat/filebeat-${VERSION}-amd64.deb \
    && dpkg -i filebeat-${VERSION}-amd64.deb \
    && rm metricbeat-${VERSION}-amd64.deb filebeat-${VERSION}-amd64.deb \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Copie des certificats pour les Beats
COPY --chmod=755 elasticsearch-ca.pem /etc/metricbeat/
COPY --chmod=755 elasticsearch-ca.pem /etc/filebeat/

# Configuration de Metricbeat
RUN metricbeat modules enable logstash-xpack \
    && metricbeat modules disable system
COPY --chmod=755 metricbeat/metricbeat.yml /etc/metricbeat/
COPY --chmod=755 metricbeat/logstash-xpack.yml /etc/metricbeat/modules.d/

# Configuration de Filebeat
RUN filebeat modules enable logstash \
    && filebeat modules disable system
COPY --chmod=755 filebeat.yml /etc/filebeat/
COPY --chmod=755 logstash.yml /etc/filebeat/modules.d/

# Configuration du logging
COPY --chmod=644 log4j2.properties /usr/share/logstash/config
RUN chown logstash:logstash /usr/share/logstash/config/log4j2.properties

WORKDIR /usr/share/logstash

# Copie du script de démarrage
COPY --chmod=750 start-services.sh /usr/share/logstash/

# Utilisation de l'utilisateur logstash pour éviter d'exécuter le conteneur en root
USER logstash

# Démarrage des services
CMD ["/usr/share/logstash/start-services.sh"]
