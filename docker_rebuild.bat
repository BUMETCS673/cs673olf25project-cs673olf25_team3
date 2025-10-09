@echo off
docker stop planningjam_backend
docker stop planningjam_frontend
docker rm -v planningjam_backend
docker rm -v planningjam_frontend
docker-compose -p planningjam up --build -d
echo "Docker Rebuild Complete"