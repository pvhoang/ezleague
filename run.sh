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

    download)
        echo .
        echo Download images from DockerHub
        echo .
            docker pull hoang12345/eztest_backend
            docker tag hoang12345/eztest_backend eztest_backend
            docker pull hoang12345/eztest_frontend
            docker tag hoang12345/eztest_frontend eztest_frontend
            docker pull hoang12345/eztest_nginx
            docker tag hoang12345/eztest_nginx eztest_nginx
        ;;

    *)
        echo don\'t know
    ;;
esac

