FROM docker.elastic.co/logstash/logstash:8.17.4
USER root

COPY ./conf/logstash.yml /usr/share/logstash/config/logstash.yml

COPY ./pipeline /usr/share/logstash/pipeline
