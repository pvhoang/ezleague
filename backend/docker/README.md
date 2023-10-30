
## To run this project by docker follow these steps:
1. Open the terminal in your project directory
2. Run `docker-compose up -d --build` to build the docker image
3. Run `docker-compose exec app composer install` to install composer dependencies
4. Run `docker-compose exec app cp .env.example .env` to create .env file
5. Open `.env` file and change the database credentials to your database credentials.
