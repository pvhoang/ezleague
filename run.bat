@echo off

if "%1%"=="view" goto view
if "%1%"=="log" goto log
if "%1%"=="prune" goto prune
if "%1%"=="build" goto build
if "%1%"=="upload" goto upload
if "%1%"=="deploy" goto deploy
if "%1%"=="start" goto start
if "%1%"=="stop" goto stop

echo.
echo Params: %1% - %2%
echo Options: view, prune, all, backend, nginx, frontend, upload, deploy, exec
echo - view: view active containers and images
echo - log: view project's container logs
echo - prune: prune all containers and images
echo - build - all/backend/nginx/frontend: build images
echo - upload - all/backend/nginx/frontend: upload images to DockerHub
echo - deploy - backend/frontend: rebuild image and deploy
echo - start: start containers
echo - stop: stop containers
echo.
goto exit0

@REM --- start ---
:start
echo.
echo Start containers
echo.
docker-compose down
docker-compose up --no-build -d nginx backend frontend mysql phpmyadmin
goto exit0

@REM --- stop ---
:stop
echo.
echo Stop containers
echo.
docker-compose down
goto exit0

@REM --- view ---
:view
echo.
echo View active containers and images
echo.
docker ps
docker images
goto exit0

@REM --- prune ---
:prune
echo.
echo Prune all containers and images
echo.
docker-compose down
docker container prune
docker image prune -a
docker ps
docker images
goto exit0

@REM --- log ---
:log
echo.
echo Log containers
echo.
docker logs ezleague_nginx_1 
docker logs ezleague_frontend_1
docker logs ezleague_backend_1
docker logs ezleague_mysql_1
goto exit0

@REM --- build ---
:build
echo.
echo Build images
echo.
if "%2%"=="all" goto ball
if "%2%"=="backend" goto bbackend
if "%2%"=="nginx" goto bnginx
if "%2%"=="frontend" goto bfrontend
echo.
echo Options: upload - all/backend/nginx/frontend
echo.
goto exit0
:ball
echo.
echo Build all images
echo.
docker-compose build backend nginx frontend
goto exit0
:bbackend
echo.
echo Build image: ezleague_backend
echo.
docker-compose build backend
pause
goto exit0
:bnginx
echo.
echo Build image: ezleague_nginx
echo.
docker-compose build nginx
goto exit0
:bfrontend
echo.
echo Build image: ezleague_frontend
echo.
docker-compose build frontend
goto exit0

@REM --- upload ---
:upload
echo.
echo Upload images to Docker Hub
echo.
if "%2%"=="all" goto uAll
if "%2%"=="backend" goto uBackend
if "%2%"=="nginx" goto uNginx
if "%2%"=="frontend" goto uFrontend
echo.
echo Options: upload - all/backend/nginx/frontend
echo.
goto exit0
:uAll
echo.
echo Upload all images
echo.
docker login
docker tag ezleague_backend hoang12345/ezleague_backend
docker push hoang12345/ezleague_backend
pause
docker tag ezleague_nginx hoang12345/ezleague_nginx
docker push hoang12345/ezleague_nginx
pause
docker tag ezleague_frontend hoang12345/ezleague_frontend
docker push hoang12345/ezleague_frontend
goto exit0
:uBackend
echo.
echo Upload ezleague_backend
echo.
docker login
docker tag ezleague_backend hoang12345/ezleague_backend
docker push hoang12345/ezleague_backend
goto exit0
:uNginx
echo.
echo Upload ezleague_nginx
echo.
docker login
docker tag ezleague_nginx hoang12345/ezleague_nginx
docker push hoang12345/ezleague_nginx
goto exit0
:uFrontend
echo.
echo Upload ezleague_frontend
echo.
docker login
docker tag ezleague_frontend hoang12345/ezleague_frontend
docker push hoang12345/ezleague_frontend
goto exit0

@REM --- deploy ---

:deploy
echo.
echo Rebuild and deploy: backend/frontend
echo.
if "%2%"=="backend" goto rdBackend
if "%2%"=="frontend" goto rdFrontend
echo.
echo Options: backend, frontend
echo.
goto exit0

:rdBackend
echo.
echo Redeploy ezleague_backend
echo.
@REM docker-compose down backend
@REM docker-compose up -d --build backend
docker-compose down
docker-compose build backend
docker-compose -f docker-compose-run.yaml up -d
goto exit0
:rdFrontend
echo.
echo Redeploy frontend
echo.
docker-compose down frontend
docker-compose build frontend
docker-compose -f docker-compose-run.yaml up -d
goto exit0

:exit0
rem Done!
exit /b 0
pause
