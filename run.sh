#!/bin/bash

# https://www.freecodecamp.org/news/bash-scripting-tutorial-linux-shell-script-and-command-line-for-beginners
# https://ryanstutorials.net/bash-scripting-tutorial/

case $1 in

    start)
        echo .
        echo Start containers
        echo .
        docker-compose down
        docker-compose up --no-build -d nginx backend frontend mysql phpmyadmin
        ;;
        
    stop)
        echo .
        echo Stop containers
        echo .
        docker-compose down
        ;;

    view)
        echo .
        echo View active containers and images
        echo .
        docker ps
        docker images
        ;;

    download-all)
        echo .
        echo Download images from DockerHub
        echo .
            docker pull hoang12345/ezleague_backend
            docker tag hoang12345/ezleague_backend ezleague_backend
            docker pull hoang12345/ezleague_frontend
            docker tag hoang12345/ezleague_frontend ezleague_frontend
            docker pull hoang12345/ezleague_nginx
            docker tag hoang12345/ezleague_nginx ezleague_nginx
        ;;

    download-backend)
        echo .
        echo Download backend from DockerHub
        echo .
            docker pull hoang12345/ezleague_backend
            docker tag hoang12345/ezleague_backend ezleague_backend
        ;;

    download-frontend)
        echo .
        echo Download frontend from DockerHub
        echo .
            docker pull hoang12345/ezleague_frontend
            docker tag hoang12345/ezleague_frontend ezleague_frontend
        ;;

    download-nginx)
        echo .
        echo Download nginx from DockerHub
        echo .
            docker pull hoang12345/ezleague_nginx
            docker tag hoang12345/ezleague_nginx ezleague_nginx
        ;;
    *)
        echo don\'t know
    ;;
esac

