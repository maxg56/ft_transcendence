# **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    Makefile                                           :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: maxence <maxence@student.42.fr>            +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2025/02/28 20:57:00 by maxence           #+#    #+#              #
#    Updated: 2025/05/06 15:35:19 by maxence          ###   ########.fr        #
#                                                                              #
# **************************************************************************** #

NAME				=	ft_transcendence

DOCKER_COMPOSE_CMD	=	docker-compose
DOCKER_COMPOSE_PATH	=	docker-compose.yml
DOCKER_COMPOSE_PATH_PROD	=	docker-compose.prode.yml

all:
	@if [ -f ".env" ]; then \
		echo "Creating volumes..."; \
		mkdir -p volumes/ volumes/redis volumes/data volumes/caddylog volumes/kibana volumes/certs volumes/es01 volumes/caddystatic volumes/redis ;\
		echo "Launching containers..."; \
		$(DOCKER_COMPOSE_CMD) --env-file .env -p $(NAME) -f $(DOCKER_COMPOSE_PATH) up --build -d; \
	else \
		echo "No .env file found in srcs folder, please create one before running make"; \
	fi

stop:
	$(DOCKER_COMPOSE_CMD) -p $(NAME) -f $(DOCKER_COMPOSE_PATH) stop

down:
	$(DOCKER_COMPOSE_CMD) -p $(NAME) -f $(DOCKER_COMPOSE_PATH) down -v

restart: down all

prod:
	@if [ -f ".env" ]; then \
		echo "Creating volumes..."; \
		mkdir -p volumes/ volumes/redis volumes/data volumes/caddylog volumes/kibana volumes/certs ;\
		echo "Launching containers..."; \
		$(DOCKER_COMPOSE_CMD) --env-file .env -p $(NAME) -f $(DOCKER_COMPOSE_PATH_PROD) up --build -d; \
	else \
		echo "No .env file found in srcs folder, please create one before running make"; \
	fi
prod-stop:
	$(DOCKER_COMPOSE_CMD) -p $(NAME) -f $(DOCKER_COMPOSE_PATH_PROD) stop	

prod-down:
	$(DOCKER_COMPOSE_CMD) -p $(NAME) -f $(DOCKER_COMPOSE_PATH_PROD) down -v

prod-restart: prod-down prod

.PHONY: restart down stop all prod prod-stop prod-down prod-restart
