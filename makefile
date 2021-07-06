build :
				export DOCKER_CONTENT_TRUST=1 && docker compose -f docker-compose.yml build --force-rm --no-cache

start:
				export DOCKER_CONTENT_TRUST=1 && docker compose -f docker-compose.yml up

stop :
				docker compose -f docker-compose.yml down --remove-orphans

test :
				docker compose -f docker-compose.test.yml up --abort-on-container-exit