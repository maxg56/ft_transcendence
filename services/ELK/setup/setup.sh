#!/bin/bash

set -euo pipefail

# --- Fonctions utilitaires ---
error_exit() {
    echo "[ERROR] $1" >&2
    exit 1
}

log_info() {
    echo "[INFO] $1"
}

# --- Vérification des variables d'environnement ---
check_environment_variables() {
    if [[ -z "${ELASTIC_PASSWORD:-}" || -z "${KIBANA_PASSWORD:-}" || -z "${ELASTIC_USERNAME:-}" ]]; then
        error_exit "Set the ELASTIC_PASSWORD, KIBANA_PASSWORD, and ELASTIC_USERNAME environment variables in the .env file"
    fi
}

# --- Création des certificats ---
setup_certificates() {
    mkdir -p config/certs

    if [[ ! -f config/certs/ca.zip ]]; then
        log_info "Creating CA"
        bin/elasticsearch-certutil ca --silent --pem -out config/certs/ca.zip
        unzip -o config/certs/ca.zip -d config/certs
    fi

    if [[ ! -f config/certs/certs.zip ]]; then
        log_info "Creating certs"
        cat > config/certs/instances.yml <<EOL
instances:
  - name: elasticsearch
    dns: [elasticsearch, localhost]
    ip: [127.0.0.1]
  - name: kibana
    dns: [kibana, localhost]
    ip: [127.0.0.1]
  - name: logstash
    dns: [logstash, localhost]
    ip: [127.0.0.1]
EOL
        bin/elasticsearch-certutil cert --silent --pem -out config/certs/certs.zip --in config/certs/instances.yml \
          --ca-cert config/certs/ca/ca.crt --ca-key config/certs/ca/ca.key
        unzip -o config/certs/certs.zip -d config/certs
    fi

    log_info "Setting file permissions"
    chown -R root:root config/certs
    find config/certs -type d -exec chmod 750 {} \;
    find config/certs -type f -exec chmod 640 {} \;
}

# --- Attente de disponibilité d'Elasticsearch ---
wait_for_elasticsearch() {
    log_info "Waiting for Elasticsearch availability..."
    timeout=60
    until curl --fail -s -k https://elasticsearch:9200 | grep -q "missing authentication credentials"; do
        ((timeout--))
        if ((timeout <= 0)); then
            error_exit "Elasticsearch not available after timeout"
        fi
        sleep 2
    done
}

# --- Configuration des politiques ILM ---
setup_ilm_policy() {
    log_info "Setting up ILM policy"
    curl --fail -s -X PUT "https://elasticsearch:9200/_ilm/policy/cadd-logs-policy" \
      --cacert config/certs/ca/ca.crt \
      -u "${ELASTIC_USERNAME}:${ELASTIC_PASSWORD}" \
      -H "Content-Type: application/json" \
      -d @- <<EOF | grep -q '"acknowledged":true' || error_exit "Failed to set ILM policy"
{
  "policy": {
    "phases": {
      "hot": {"min_age": "0ms","actions": {}},
      "warm": {"min_age": "2d","actions": {"allocate": {"number_of_replicas": 0}}},
      "cold": {"min_age": "7d","actions": {"readonly": {}}},
      "delete": {"min_age": "30d","actions": {"delete": {}}}
    },
    "_meta": {
      "description": "ILM policy using the hot, warm(2 days) and cold(7 days) phases with a retention of 30 days"
    }
  }
}
EOF
}

# --- Configuration du template d'index ---
setup_index_template() {
    log_info "Setting up index template"
    curl --fail -s -X PUT "https://elasticsearch:9200/_index_template/caddy-logs-template" \
      --cacert config/certs/ca/ca.crt \
      -u "${ELASTIC_USERNAME}:${ELASTIC_PASSWORD}" \
      -H "Content-Type: application/json" \
      -d @- <<EOF | grep -q '"acknowledged":true' || error_exit "Failed to set index template"
{
  "index_patterns": ["caddy-logs-*"],
  "template": {
    "settings": {
      "index.lifecycle.name": "caddy-logs-policy",
      "number_of_shards": 1,
      "number_of_replicas": 1
    }
  }
}
EOF
}

# --- Configuration de Kibana ---
setup_kibana() {
    log_info "Setting up Kibana password"
    curl --fail -s -X POST "https://elasticsearch:9200/_security/user/kibana_system/_password" \
      --cacert config/certs/ca/ca.crt \
      -u "${ELASTIC_USERNAME}:${ELASTIC_PASSWORD}" \
      -H "Content-Type: application/json" \
      -d "{\"password\":\"${KIBANA_PASSWORD}\"}" | grep -q "^{}" || error_exit "Failed to set Kibana password"

    log_info "Waiting for Kibana availability..."
    timeout=60
    until curl -s -k https://kibana:5601/api/status | grep -q '"level":"available"'; do
        ((timeout--))
        if ((timeout <= 0)); then
            error_exit "Kibana not available after timeout"
        fi
        sleep 2
    done

    log_info "Importing Kibana dashboard"
    curl --fail -s -k -X POST "https://kibana:5601/api/saved_objects/_import" \
        -u "${ELASTIC_USERNAME}:${KIBANA_PASSWORD}" \
        -H "kbn-xsrf: true" \
        -H "Content-Type: multipart/form-data" \
        --form file=@/usr/share/elasticsearch/config/dashboard.ndjson \
        | grep -q '"success":true' || error_exit "Failed to import Kibana dashboard"
}

# --- Nettoyage du conteneur ---
cleanup() {
    log_info "Cleaning up setup container"
    if [ -S /var/run/docker.sock ]; then
        CONTAINER_ID=$(hostname)
        curl --fail -s -X DELETE "http://localhost/containers/${CONTAINER_ID}?force=true" \
          --unix-socket /var/run/docker.sock || error_exit "Failed to remove container"
    else
        log_info "Docker socket not found, skipping container removal"
    fi
}

# --- Exécution principale ---
main() {
    check_environment_variables
    setup_certificates
    wait_for_elasticsearch
    setup_ilm_policy
    setup_index_template
    setup_kibana
    cleanup
}

main
