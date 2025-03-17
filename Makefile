# **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    Makefile                                           :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: mgendrot <mgendrot@student.42.fr>          +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2025/02/28 20:57:00 by maxence           #+#    #+#              #
#    Updated: 2025/03/17 16:39:50 by mgendrot         ###   ########.fr        #
#                                                                              #
# **************************************************************************** #

NAME				=	ft_transcendence

DOCKER_COMPOSE_CMD	=	docker compose
DOCKER_COMPOSE_PATH	=	Docker/docker-compose.yml

all:
	@if [ -f "./Docker/.env" ]; then \
		$(DOCKER_COMPOSE_CMD) -p $(NAME) -f $(DOCKER_COMPOSE_PATH) up --build -d; \
	else \
		echo "No .env file found in srcs folder, please create one before running make"; \
	fi

#
stop:
	$(DOCKER_COMPOSE_CMD) -p $(NAME) -f $(DOCKER_COMPOSE_PATH) stop

down:
	$(DOCKER_COMPOSE_CMD) -p $(NAME) -f $(DOCKER_COMPOSE_PATH) down -v

restart: down all


.PHONY: restart down stop all