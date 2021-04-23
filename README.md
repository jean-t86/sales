# Sales API

![Release](https://img.shields.io/github/v/release/jean-t86/sales)
![Node.js CI](https://github.com/jean-t86/sales/workflows/Node.js%20CI/badge.svg)


## Table of Contents
* [Description](#description)
* [General information](#general-information)
* [Technologies](#technologies)
* [Development paradigms](#development-paradigms)
* [Installation](#installation)
* [Running the web server locally](#running-the-web-server-locally)

## Description

The Sales API is a simple Express.js application that runs in a cluster. The main process forks additional worker processes to the number of CPU cores available.

It is [hosted on heroku](https://radiant-mountain-36050.herokuapp.com/) along with it's [swagger documentation](https://radiant-mountain-36050.herokuapp.com/api-docs/).

The [ERD](https://tinyurl.com/y57cgs3t) for the API is hosted on lucidcharts.

## General information

The repository is the resulting codebase for a practice lab from the [Back-end Engineer path on Codecademy](https://www.codecademy.com/learn/paths/back-end-engineer-career-path). The course teaches all the major technologies and skills that a back-end engineer needs to know.

This project comes after completing 70% of the course.

## Technologies
* JavaScript
* Node.js
* Express.js
* Sequelize ORM and postgres
* Swagger

## Development paradigms

The architecture of the web server follows the layered architecture with the following layers:
* `Communication` - the http server that runs as a cluster of CPU cores
* `Presentation` - the different routes exposed by the endpoints
* `Persistence` - the sequelize ORM that bridges the gap between the web server and PostgreSQL.

TDD was followed from the beginning and development was done vertically through each layer of the architecture using a bottom-up approach, e.g. GET /products was implemented all the way through first before implementing another http request type.

## Installation

### Node.js

If you want to run the web server locally, you first need to install Node.js on your computer:
* [Download](https://nodejs.org/en/download/) the binaries
* If you use Linux, follow the [installation instructions](https://github.com/nodejs/help/wiki/Installation#how-to-install-nodejs-via-binary-archive-on-linux).

Once installed, install the program's dependencies with 
```
npm install
``` 
in your terminal with the project's folder as working directory.

### PostgreSQL

Follow the [instructions to install PostgreSQL](https://www.postgresql.org/download/linux/#generic) on linux.

### Configure PostgreSQL

In order to be able to log in to the psql CLI, you first need to update your `pg_hba.conf`file to allow authentication using passwords.

Follow [this gist](https://gist.github.com/AtulKsol/4470d377b448e56468baef85af7fd614) to update your `pg_hba.conf` file.

> `pg_hba.conf` can be found at `/ect/postgresql/13/main`. 

### Create the role and database

Enter the psql terminal:

```
sudo -u postgres psql postgres
```

Create a new user role:

```
CREATE ROLE sales WITH LOGIN PASSWORD 'sales';
ALTER ROLE sales CREATEDB;
```
Exit psql:
```
\q
```
Enter psql with the newly created sales role:
```
psql postgres -U sales
```
Create the database:
```
CREATE DATABASE sales_db_dev;
```

### Create the tables

The codebase uses Sequelize as an ORM for CRUD operations. When you ran `npm install`, the Sequelize CLI was automatically installed. 

After creating the database and role, you can now create the tables:
```
sequelize db:migrate
```

## Run the web server locally

You can start the server using
```
npm start
```

The web server will start and be reachable at `http://localhost:3000`
