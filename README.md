# Restaurant Reservation System - Periodic Tables

This restaurant reservation fullstack application was made as my final project for Thinkful's Software Engineering certification program. It allows users to create, display, and edit reservations as well as tables. Users are able to seat reservations at tables and remove them when finished. 

## Deployments

 - Backend Deployment: https://periodic-tables-backend-cjr.herokuapp.com/

 - Frontend Deployment: https://periodic-tables-frontend-cjr.herokuapp.com/dashboard

## Features

ADD SCREENSHOTS

## API Endpoints

 - `GET` requests return JSON responses.
 - `POST` and `PUT` requests require an application/JSON body and return a JSON response

| Method | Path | Function |
| ----------- | ----------- | ----------- |
| GET | /reservations | list reservations for current date |
| POST | /reservations | create new reservation |
| GET | /reservations/:reservation_id | list reservation by id |
| PUT | /reservations/:reservation_id | update reservation |
| GET | /reservations?mobile_number=xxx-xxx-xxxx | list reservations for specified mobile number |
| GET | /reservations?date=YYYY-MM-DD | list reservation for specified date |
| PUT | /reservations/:reservation_id/status | update reservation status |
| GET | /tables | list all tables |
| POST | /tables | create new table |
| PUT | /tables/:table_id/seat | update table with reservation_id from body, update reservation status |
| DELETE | /tables/:table_id/seat | remove reservation_id from table, update reservation status to finished |

## Technology Used

 - Frontend: JavaScript, HTML, CSS, React, React Router, Bootstrap
 - Backend: JavaScript, Node.js, Express, Knex
 - Database: PostgreSQL
 - Tools: Heroku, Git, GitHub, VSCode, Puppeteer

## Installation

1. Fork and clone this repository.
1. Run `cp ./back-end/.env.sample ./back-end/.env`.
1. Update the `./back-end/.env` file with the connection URL's to your ElephantSQL database instance.
1. Run `cp ./front-end/.env.sample ./front-end/.env`.
1. You should not need to make changes to the `./front-end/.env` file unless you want to connect to a backend at a location other than `http://localhost:5001`.
1. Run `npm install` to install project dependencies.
1. Run `npm run start:dev` to start your server in development mode.
