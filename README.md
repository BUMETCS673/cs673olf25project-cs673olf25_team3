# Overview

PlanningJam is a social app designed to make organizing hangouts simple and fun. Users can log in, post plans, and invite friends to join. Friends can respond **Yes** to show their interest, while users can filter plans by type and send friend requests to connect more easily. The app helps people discover activities and coordinate plans efficiently.

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

1. Install dependencies within the `frontend` directory.
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

5.  Update the database table

```
python manage.py migrate
```


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

