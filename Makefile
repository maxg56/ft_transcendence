# **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    Makefile                                           :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: maxence <maxence@student.42.fr>            +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2025/04/11 11:22:01 by maxence           #+#    #+#              #
#    Updated: 2025/04/11 12:08:00 by maxence          ###   ########.fr        #
#                                                                              #
# **************************************************************************** #

NAME				=	ft_transcendence

DOCKER_COMPOSE_CMD	=	docker-compose
DOCKER_COMPOSE_PATH	=	docker-compose.yml

all:
	@if [ -f ".env" ]; then \
		echo "Creating volumes..."; \
		mkdir -p volumes/logs volumes/redis volumes/data; \
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

.PHONY: restart down stop all
