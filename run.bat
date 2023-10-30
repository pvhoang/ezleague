@echo off

if "%1%"=="view" goto view
if "%1%"=="log" goto log
if "%1%"=="prune" goto prune
if "%1%"=="build" goto build
if "%1%"=="upload" goto upload
if "%1%"=="deploy" goto deploy
if "%1%"=="exec" goto exec

echo.
echo Params: %1% - %2%
echo Options: view, prune, all, backend, nginx, frontend, upload, deploy, exec
echo - view: view active containers and images
echo - log: view project's container logs
echo - prune: prune all containers and images
echo - build - all/backend/nginx/frontend: build images
echo - upload - all/backend/nginx/frontend: upload images to DockerHub
echo - deploy - backend/frontend: rebuild image and deploy
echo - exec: exec with available images
echo.
goto exit0

@REM --- exec ---
:exec
echo.
echo Exec container with available images
echo.
docker-compose down
@REM docker-compose -f docker-compose-run.yaml up -d
@REM docker-compose --env-file ./config/.env.ec2 up -d
@REM docker-compose --env-file ./config/.env.local up --no-build -d
docker-compose up --no-build -d
@REM docker-compose config
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
docker logs ezleague-nginx-1 
docker logs ezleague-frontend-1
docker logs ezleague-backend-1
docker logs ezleague-mysql-1
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
echo Build image: ezleague-backend
echo.
docker-compose build backend
goto exit0
:bnginx
echo.
echo Build image: ezleague-nginx
echo.
docker-compose build nginx
goto exit0
:bfrontend
echo.
echo Build image: ezleague-frontend
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
docker tag ezleague-backend hoang12345/ezleague-backend
docker push hoang12345/ezleague-backend
pause
docker tag ezleague-nginx hoang12345/ezleague-nginx
docker push hoang12345/ezleague-nginx
pause
docker tag ezleague-frontend hoang12345/ezleague-frontend
docker push hoang12345/ezleague-frontend
goto exit0
:uBackend
echo.
echo Upload ezleague-backend
echo.
docker login
docker tag ezleague-backend hoang12345/ezleague-backend
docker push hoang12345/ezleague-backend
goto exit0
:uNginx
echo.
echo Upload ezleague-nginx
echo.
docker login
docker tag ezleague-nginx hoang12345/ezleague-nginx
docker push hoang12345/ezleague-nginx
goto exit0
:uFrontend
echo.
echo Upload ezleague-frontend
echo.
docker login
docker tag ezleague-frontend hoang12345/ezleague-frontend
docker push hoang12345/ezleague-frontend
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
echo Redeploy ezleague-backend
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