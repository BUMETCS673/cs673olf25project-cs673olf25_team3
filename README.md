# Overview

PlanningJam is a social app designed to make organizing hangouts simple and fun. Users can log in, post plans, and invite friends to join. Friends can respond **Yes** to show their interest, while users can filter plans by type and send friend requests to connect more easily. The app helps people discover activities and coordinate plans efficiently.

---

## Table of Contents

- [Team Members and Roles](#-team-members-and-roles)
- [Features](#-features)
- [Project Setup and Run Guide](#project-setup-and-run-guide)
  - [System Requirements](#system-requirements)
  - [Frontend Development](#frontend-development)
  - [Backend Development](#backend-development)
  - [Database](#database)
  - [Docker](#docker)
- [Essential Roadmap](#essential-roadmap)
- [Desirable Roadmap](#desirable-roadmap)
- [Optional Roadmap](#optional-roadmap)
- [Tech Stack](#️-tech-stack)

---

## 🧑‍💻 Team Members and Roles
- **David** – Team Leader  
- **Ashley** – Requirement Leader  
- **Haolin** – Design and Implementation Leader  
- **Jason** – QA Leader
- **Donjay** – Configuration Leader

---

## ✨ Features
- User login and authentication  
- Post and share plans  
- Friends RSVP with Yes responses  
- Filter plans by type (e.g., food, sports, study, concerts)  
- Send and accept friend requests  

---

## Project Setup and Run Guide

### System Requirements

This project requires the following to run properly:

- **Node:** version 20.19 or higher
- **Python:** version 3.10 or higher

### Frontend Development 

The frontend is built using the React framework with Vite build tool.

#### Setting Up The Frontend

All frontend development should be done in the `frontend/` directory.

Install dependencies within the `frontend` directory
```
cd frontend
npm install
```

#### Running the Frontend

To run the frontend locally, run the following command:
```
npm run dev
```

### Backend Development 

The backend is built using the Django framework. 

**Backend structure:**
```
├── app/                # the core django framework
│   ├── __init__.py
│   ├── asgi.py
│   ├── settings.py
│   ├── urls.py
│   └── wsgi.py
├── api/                # the api application
│   ├── __init__.py
│   ├── admin.py
│   ├── apps.py
│   ├── migrations/
│   ├── models.py
│   ├── tests.py
│   └── views.py
├── manage.py
└── requriements.txt    # dependency packages
└── .venv/
```

#### Setting Up The Backend 
All backend development should be done in the `backend/` directory. To setup the backend:

1. Create a python virtual environment in the backend directory

    ```
    cd backend
    python -m venv .venv
    ```

2. Activate the `venv`

    ```
    # for macOS or Linux
    source .venv/bin/activate

    # for Windows
    .venv\Scripts\activate
    ```

3. Install the dependencies

    ```
    pip install -r requirements.txt
    ```

    *Note:* 

    When installing new packages, update the `requirements.txt` with the following:

    ```
    pip freeze > requirements.txt
    ```

4. Setup the environment variables

    In the `backend` directory, copy the contents in the `.env.example` file into a new `.env` file. 

    Then generate a new Django `SECRET KEY` with the following commands:
    ```
    python manage.py shell
    from django.core.management.utils import get_random_secret_key
    get_random_secret_key()
    ```

    Copy the generated key into the `.env` file.

    ```
    ...
    SECRET_KEY=your_django_secret_key_here

    ...
    ```

#### Setting Up MongoDB With The Backend

1. Configure the MongoDB Connection

    In the `.env` file, add the MongoDB host connection URL

    i.e. 
    ```
    MONGO_HOST=mongodb://user:password@localhost:27017/database_name
    ```

    If both the backend and the MongoDB are running on docker containers, the host url for the database will not be accessible via `localhost`. An IP Address from the docker network will be needed instead. To obtain the IP address of the MongoDB container, run the following: 

    ```
    docker network inspect planjam-network
    ```

2. Verify the connection is working by running the server. 

    ```
    python manage.py migrate
    ```

##### Database Migration

After creating new model in the application, create a migration for the model.
```
python manage.py makemigrations <app_name>
python manage.py migrate
```
For the api application, set the `app_name` to api

#### Running the Backend

To run the backend locally, run the following command:

```
python manage.py runserver
```

The django application should be accessible through the endpoint `http://localhost:8000`.

### Database

#### Installing a local MongoDB with Docker

The `database/` directory contains a docker-compose file to build a MongoDB docker container. 

Before running the docker file, create a `.env` file in the `database/` directory and copy the contents from the `.env.example`. 

Enter a root user and a root password for the MongoDB application. Modify the port if the port is already in use.
```
MONGO_ROOT_USER=enter_a_root_user
MONGO_ROOT_PASSWORD=enter_a_root_password
MONGO_PORT=27017
```

Run the `docker-compose` command in this directory to build the container:
```script
cd database
docker-compose -p planningjam_database up -d
```
This will create a Docker container called `planningjam_database` and build a mongodb service. 

Run the following to create a Docker network if not already created:
```
docker network create planjam-network
```
This will create the network `planjam-network`, allowing other containers in the same network to communicate with each other. 

#### Creating the Database

Connect to the mongodb with the root credentials and port set in the `.env` file.
```
mongosh "mongodb://<root_username>:<root_password>@localhost:<port>/planningjam?authSource=admin"
```

Within the mongosh shell, setup a new database called `planningjam`
```
use planningjam
```

Create a new user with read and write permission to the database. Set the username and password for the database user credentials. 
```
db.createUser({
  user: "<username>",
  pwd: "<password>",
  roles: [{ role: "readWrite", db: "planningjam" }]
})
```

Exit the mongo shell and test the new user by logging in to the MongoDB with the new user credentials and port.
```
mongosh "mongodb://<db_user>:<db_password>@localhost:<port>/planningjam
```

### Docker

The frontend and backend for this project can be run using dockerized containers. Before beginning, ensure the following are installed:

- **Docker** - [https://www.docker.com/](https://www.docker.com/)
- **Docker Compose**

#### Getting Started

1. Run the following to create a Docker network if not already created:
    ```
    docker network create planjam-network
    ```
    This will create the network `planjam-network`, allowing other containers in the same network to communicate with each other. 

2. From the project's root directory run the following command
    ```
    docker-compose -p planningjam up --build
    ```
    This command creates a new docker project called `planningjam` and creates container images for the frontend (django) and backend (react) application's services.

    To run the container in the background, use the -d (detached) flag:
    ```
    docker-compose -p planningjam up --build -d
    ```

    After the services are up and running, you can access the applications at the following URLs:

    - Backend (Django): http://localhost:8000

    - Frontend (Vite/React): http://localhost:5173

#### Docker Network IP

There may be instances where a container needs to communicate with another container through their network `IP Address` instead of `localhost`, i.e. the backend container needs to communicate with the mongodb container. 

To obtain the a list of IP Addresses in a network, execute the command 
```
docker network inspect <network_name_or_id>
```

*Note:* The Docker network for the project is called `planjam-network`.

#### Running Docker Containers Separately

While `docker-compose` is designed for managing multiple services at once, `docker run` is used to create and start a single container. 

Either the frontend or backend can be run independently using the `docker run` command to build and run the container from the `Dockerfile` configured in their respective directory. 

**Running the Frontend**

To run the frontend, first build the container with the following
```
docker build -t planningjam-frontend ./frontend
```

and then run it with
```
docker run -d --name planningjam-frontend -p 5173:5173 planningjam-frontend
```
The application should then be accessible at http://localhost:5173 .

**Running the Backend**

To run the backend, first build the container with the following
```
docker build -t planningjam-backend ./backend
```

and then run it with
```
docker run -d --name planningjam-backend -p 5173:5173 planningjam-backend
```

The application should then be accessible at http://localhost:8000 .

---

## Essential Roadmap
- Application (front end and backend) up
- User Authentication
- Friend Requests
- Have people be able to create plans
- Filter plans by type
- Invitees can RSVP

## Desirable Roadmap
- User Profile Management
- Plan Editing and Deletion
- Notifications for new plans
- Dismissing Plans
- Notifications for RSVPs

## Optional Roadmap
- Calendar Integration for own plans
- Plan Suggestions Based on Interests
- Calendar Integration for RSVP’d plans



---

## 🛠️ Tech Stack
- **Frontend:** React  
- **Backend:** Django / Python  
- **Database:** Django ORM (or any configured database)  
- **Authentication:** Django Auth / JWT  

---

