build :
				export DOCKER_CONTENT_TRUST=1 && docker compose -f docker-compose.yml build --force-rm --no-cache

start:
				export DOCKER_CONTENT_TRUST=1 && docker compose -f docker-compose.yml up

test :
				docker compose -f docker-compose.test.yml up --abort-on-container-exit

stop :
				docker compose -f docker-compose.yml down --remove-orphans

rm :
				docker container prune -f

rmi :
				docker rmi thunberg_backend