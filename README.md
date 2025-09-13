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

- **Python:** version 3.10 or higher

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

4.  Update the database table

```
python manage.py migrate
```

#### Running the Backend

To run the backend locally

```
python manage.py runserver
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

