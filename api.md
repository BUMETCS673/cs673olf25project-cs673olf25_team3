# API Documentation

## Table of Contents

- [Base URL](#base-url)
- [Authentication](#authentication)
- [User Registration & Profile](#user-registration--profile)
    - [Register user](#1-register-user)
    - [Get user profile](#2-get-user-profile)
    - [Update user profile](#3-update-user-profile)
- [Users](#users)
    - [List users](#1-list-users)
    - [Get user by id](#2-get-user-by-id)
- [Plans](#plans)
    - [Get plans](#1-get-plans)
    - [Create plan](#2-create-a-plan)
    - [Get plan by id](#3-get-plan-by-id)
    - [Edit plan](#4-edit-a-plan)
    - [Delete plan](#5-delete-a-plan)
    - [Dismiss a plan](#6-dismiss-a-plan)
    - [Undismiss a plan](#7-undismiss-a-plan)
    - [List dismissed plans](#8-list-dismissed-plans)
- [Friend Requests](#friend-requests)
    - [Create Friend Request](#1-send-friend-request)
    - [Respond to Friend Request](#2-respond-to-friend-request)
    - [List Friends](#3-list-friends--requests)
    - [Remove Friend](#4-remove-friend--cancel-request)
- [RSVP](#rsvp)
    - [Create RSVP](#1-create-rsvp)
    - [Get RSVP by plan ID](#2-get-rsvp-by-plan-id)
    - [Get RSVP by user ID](#3-get-rsvp-by-user-id)
    - [Delete RSVP by ID](#4-delete-rsvp-by-id)
    - [Delete RSVP by plan ID](#5-delete-rsvp-by-plan-id)
- [Quick Curl Examples](#quick-curl-examples-copypaste)

## Base Url

For local development the `base url` is
```
http://localhost:8000/api
```


## Authentication

All protected API requests require an **Authorization** header with a valid JWT access token.
```
Authorization: Bearer <access-token>
```

### 1. Obtain Token Pair
**Endpoint:**  `POST /token/`

**Description:**  
Authenticate with username and password to receive an **access token** and **refresh token**.

**Request Body:**
```json
{
  "username": "your_username",
  "password": "your_password"
}
```

**Response Example**
```json
{
  "refresh": "eyJ0eXAiOiJKV1QiLCJh...",
  "access": "eyJ0eXAiOiJKV1QiLCJhb..."
}
```

### 2. Refresh Access Token
**Endpoint:**  `POST /token/refresh`

**Description**:
Use a refresh token to get a new access token when the old one expires.

**Header:**
```
Authorization: Bearer <access-token>
```

**Request Body:**
```json
{
  "refresh": "eyJ0eXAiOiJKV1QiLCJh",
}
```

**Response Example**
```json
{
  "access": "eyJ0eXAiOiJKV1QiLCJhb..."
}
```

## User Registration & Profile

These endpoints handle user registration and profile management.

### Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | No | User ID (auto-generated) |
| `username` | string | Yes | Unique username |
| `email` | string | Yes | User's email address |
| `first_name` | string | No | User's first name |
| `last_name` | string | No | User's last name |
| `date_of_birth` | date | No | User's date of birth (YYYY-MM-DD) |
| `bio` | string | No | User's biography (max 500 characters) |
| `date_joined` | datetime | No | Account creation timestamp |

### 1. Register User
**Endpoint:** `POST /register/`

**Description:** Register a new user account and receive JWT tokens.

**Request Body:**
```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "first_name": "John",
  "last_name": "Doe",
  "date_of_birth": "1990-01-01",
  "bio": "Software developer",
  "password": "securepassword123",
  "password_confirm": "securepassword123"
}
```

**Response Example:**
```json
{
  "message": "User registered successfully",
  "refresh": "eyJ0eXAiOiJKV1QiLCJh...",
  "access": "eyJ0eXAiOiJKV1QiLCJhb..."
}
```

### 2. Get User Profile
**Endpoint:** `GET /profile/`

**Description:** Get the current authenticated user's profile information.

**Header:**
```
Authorization: Bearer <access-token>
```

**Response Example:**
```json
{
  "id": "68cd793ca4a36f574952921b",
  "username": "johndoe",
  "email": "john@example.com",
  "first_name": "John",
  "last_name": "Doe",
  "date_of_birth": "1990-01-01",
  "bio": "Software developer",
  "date_joined": "2024-01-15T10:30:00Z"
}
```

### 3. Update User Profile
**Endpoint:** `PUT /profile/update/` or `PATCH /profile/update/`

**Description:** Update the current user's profile information. Use PATCH for partial updates.

**Header:**
```
Authorization: Bearer <access-token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "first_name": "Johnny",
  "last_name": "Smith",
  "date_of_birth": "1990-01-01",
  "bio": "Updated bio information"
}
```

**Response Example:**
```json
{
  "message": "Profile updated successfully",
  "user": {
    "id": "68cd793ca4a36f574952921b",
    "username": "johndoe",
    "email": "john@example.com",
    "first_name": "Johnny",
    "last_name": "Smith",
    "date_of_birth": "1990-01-01",
    "bio": "Updated bio information",
    "date_joined": "2024-01-15T10:30:00Z"
  }
}
```

## Users

The Users endpoints are used by the frontend to search for users and display public profile information.

### Fields (public)
| Field | Type | Description |
|-------|------|-------------|
| `id`  | string | User id (string, matches Django user PK) |
| `username` | string | Public username |
| `first_name` | string | Optional first name |
| `last_name` | string | Optional last name |
| `bio` | string | Optional user biography (max 500 characters) |

### 1. List users
**Endpoint:** `GET /users/`

**Description:** Returns a list of users. Authentication required (JWT).

**Header:**
```
Authorization: Bearer <access-token>
```

**Response Example:**
```json
[
  {"id": "1", "username": "alice", "first_name": "Alice", "last_name": "Z", "bio": "Software engineer"},
  {"id": "2", "username": "bob", "first_name": "Bob", "last_name": "Y", "bio": "Designer"}
]
```

### 2. Get user by id
**Endpoint:** `GET /users/:user_id/`

**Description:** Returns public fields for a single user. Authentication required.

**Response Example:**
```json
{"id": "1", "username": "alice", "first_name": "Alice", "last_name": "Z", "bio": "Software engineer"}
```

**Error Response:**
```json
{ "detail": "Not found." }
```

## Plans

### Fields

| Field      | Type       | Required | Description |
|------------|------------|----------|-------------|
| `_id`      | string     | No       | Unique identifier for the plan (auto-generated). |
| `title`    | string     | Yes      | Title or name of the event |
| `description`| string   | No       | Description of the event |
| `location` | object     | Yes      | Nested location object with address details |
| `start_time`| string    | No       | Date and time of the event in ISO 8601 format (`YYYY-MM-DDTHH:MM:SSZ`). |
| `end_time`  | datetime  | Yes      | Date and time of the event in ISO 8601 format (`YYYY-MM-DDTHH:MM:SSZ`). |
| `created_by` | string   | No       | User id for which the plan was created by |

**Location Object**
| Field      | Type       | Required | Description |
|------------|------------|----------|-------------|
| `name`     | string     | No       | The name of the location or venue |
| `address1` | string     | Yes      | Street address of the location |
| `address2` | string     | No       | Additional street address of the location |
| `city`     | string     | Yes      | The city of the location |
| `state`    | string     | Yes      | The state of the location |
| `zipcode`  | integer    | Yes      | The zipcode of the location |

### 1. Get Plans
**Endpoint:** `GET /plans`

**Description:** Returns a list of plans created by the logged in users and their friends.   

**Header:**
```
Authorization: Bearer <access-token>
```

**Query Parameters:**
| Parameter   | Type   | Required | Default | Description  |
|-------------|--------|----------|---------|------------------|
| `friends`   | string | No       | 1        | Query with friend's plans. Set to 1 or true for true, and 0 or false for false. |
| `start_time` | string | No      | current timestamp | The start date in UTC of the plan to query from  |
| `end_time`   | string | No      | -       | The end date in UTC of the plan to query up to |


**Example Request:**
```
GET /api/plans/?start_time=2025-09-27T15:00:00Z&end_time=2025-10-30T15:00:00Z&friends=true
```

**Response Example:**
```json
[
    {
        "_id": "68d9858ce23a1994b10f1a8f",
        "title": "Game Night Three",
        "description": "Lots of fun and laughters with friends.",
        "location": {
            "address1": "1 main st",
            "city": "Boston",
            "state": "MA",
            "zipcode": 12345
        },
        "start_time": "2025-09-28T12:00:00",
        "end_time": "2025-09-28T15:00:00",
        "created_by": "68cd793ca4a36f574952921b",
        "created_at": "2025-09-20T12:00:00"
    },
    {
        "_id": "68e40ba613b957b16c9a84c4",
        "title": "Game Night",
        "description": "Lots of fun and laughters with friends.",
        "location": {
            "address1": "1 main st",
            "city": "Boston",
            "state": "MA",
            "zipcode": 12345
        },
        "start_time": "2025-10-24T12:00:00",
        "end_time": "2025-10-24T15:00:00",
        "created_by": "68cc5ec541e45271fe9d4896",
        "created_at": "2025-10-06T18:34:14.069781"
    }
  ...
]
```

### 2. Create a Plan

**Endpoint:** `POST /plans/add`

**Description:** Create a new plan/event.  

**Header:**
```
Authorization: Bearer <access-token>
Content-Type: application/json
```

**Request Body**:
```json
{
    "title": "Game Night", 
    "description": "Lots of fun and laughters with friends.", 
    "location": {
        "name": "John's house",
        "address1": "1 main st", 
        "city": "Boston", 
        "state": "MA", 
        "zipcode": "12345"
    },
    "start_time": "2025-09-28 12:00:00",
    "end_time": "2025-09-28 15:00:00"
}
```

**Response Example**:
```json
{
    "status": 201,
    "message": "Plan created",
    "data": {
      "_id": "68dabba350510db53d9af43d",
      "title": "Game Night", 
      "description": "Lots of fun and laughters with friends.", 
      "location": {
          "name": "John's house",
          "address1": "1 main st", 
          "city": "Boston", 
          "state": "MA", 
          "zipcode": "12345"
      },
      "start_time": "2025-09-28T12:00:00Z",
      "end_time": "2025-09-28T15:00:00Z",
      "created_by": "68cd793ca4a36f574952921b",
      "created_at": "2025-09-20T12:00:00"
    }
}
```

### 3. Get Plan By Id
**Endpoint:** `GET /plans/:plan_id`

**Description:** Returns a plan with the given plan id.  

**Path Parameters:**
| Parameter   | Type   | Required | Description                |
|-------------|--------|----------|----------------------------|
| `plan_id`   | string | Yes      | Unique identifier of the plan (MongoDB ObjectId). |

**Header:**
```
Authorization: Bearer <access-token>
```

**Response Example:**
```json
{
    "data": {
        "_id": "68e55af5cc8a4ecf0441c731",
        "title": "Birthday Party!",
        "description": "Lots of fun and laughters with friends.",
        "location": {
            "address1": "1 main st",
            "city": "Boston",
            "state": "MA",
            "zipcode": 12345
        },
        "start_time": "2025-10-10T12:00:00",
        "end_time": "2025-10-28T15:00:00",
        "created_by": "68cd793ca4a36f574952921b",
        "created_at": "2025-10-07T18:24:53.683000"
    }
}
```

### 4. Edit a Plan

**Endpoint:** `PUT /plans/:plan_id/edit`

**Description:** Edits a plan with a given id. Only the user who created the plan is authorized to update the plan. 

**Path Parameters:**
| Parameter   | Type   | Required | Description                |
|-------------|--------|----------|----------------------------|
| `plan_id`   | string | Yes      | Unique identifier of the plan (MongoDB ObjectId). |

**Header:**
```
Authorization: Bearer <access-token>
Content-Type: application/json
```

**Request Body Example**:

Update the plan title

```json
{
    "title": "Alex's Game Night!"
}
```

**Response Example**:
```json
{
    "status": 200,
    "message": "Plan 68dabba350510db53d9af43d updated successfully.",
    "data": {
      "_id": "68dabba350510db53d9af43d",
      "title": "Alex's Game Night!", 
      "description": "Lots of fun and laughters with friends.", 
      "location": {
          "name": "John's house",
          "address1": "1 main st", 
          "city": "Boston", 
          "state": "MA", 
          "zipcode": "12345"
      },
      "start_time": "2025-09-28T12:00:00Z",
      "end_time": "2025-09-28T15:00:00Z",
      "created_by": "68cd793ca4a36f574952921b",
      "created_at": "2025-09-07T18:53:14.173000"
    }
}
```

### 5. Delete a Plan

**Endpoint:** `DELETE /plans/:plan_id/delete`

**Description:** Deletes a plan with a given id. Only an authorized user can delete plan if they are the creator of the plan. 

**Path Parameters:**
| Parameter   | Type   | Required | Description                |
|-------------|--------|----------|----------------------------|
| `plan_id`   | string | Yes      | Unique identifier of the plan (MongoDB ObjectId). |

**Header:**
```
Authorization: Bearer <access-token>
```

**Response Example**:
```json
{
    "status": 200,
    "message": "Plan 68da01e2fa068cbd5713d439 deleted successfully"
}
```


### 6. Dismiss a plan
**Endpoint:** `POST /plans/:plan_id/dismiss`

**Description:** Hides the plan from your feed. This is private (owner is not notified) and idempotent (repeated calls return the same result without side-effects).

**Path Parameters:**
| Parameter | Type   | Required | Description                          |
|-----------|--------|----------|--------------------------------------|
| `plan_id` | string | Yes      | Unique identifier of the plan (ObjectId) |

**Header:**
```
Authorization: Bearer <access-token>
```

**Success Response:**
```
204 No Content
```

**Error Responses:**
| Status | When                | Body (example)                                                        |
|--------|---------------------|-----------------------------------------------------------------------|
| 401    | Missing/invalid JWT | `{ "detail": "Authentication credentials were not provided." }`     |

**Behavior:**
- Idempotent: dismissing the same plan multiple times still returns 204 and has no extra effect.
- If `plan_id` does not exist, the endpoint still returns 204 (no-op); your feed is unaffected.

**Example (curl):**
```bash
curl -s -X POST http://localhost:8000/api/plans/<plan_id>/dismiss \
  -H "Authorization: Bearer <ACCESS_TOKEN>"
```

### 7. Undismiss a plan (just included in case, optional if we need)
**Endpoint:** `DELETE /plans/:plan_id/undismiss`

**Description:** Removes your prior dismissal so the plan can appear in your feed again (based on usual filters and scopes).

**Path Parameters:**
| Parameter | Type   | Required | Description                          |
|-----------|--------|----------|--------------------------------------|
| `plan_id` | string | Yes      | Unique identifier of the plan (ObjectId) |

**Header:**
```
Authorization: Bearer <access-token>
```

**Success Response:**
```
204 No Content
```

**Error Responses:**
| Status | When                | Body (example)                                                        |
|--------|---------------------|-----------------------------------------------------------------------|
| 401    | Missing/invalid JWT | `{ "detail": "Authentication credentials were not provided." }`     |

**Behavior:**
- Idempotent: undismissing an already-visible plan still returns 204 and has no extra effect.
- If `plan_id` does not exist, the endpoint still returns 204 (no-op).

**Example (curl):**
```bash
curl -s -X DELETE http://localhost:8000/api/plans/<plan_id>/undismiss \
  -H "Authorization: Bearer <ACCESS_TOKEN>"
```

Notes for frontend:
- GET /plans automatically excludes any plans the current user has dismissed.
- GET /plans/:plan_id returns `{ "data": { ...plan } }` and never includes dismissal metadata.
- When a plan is deleted by its owner, any private dismissal records for that plan are automatically cleaned up server-side.

### 8. List dismissed plans (just included in case, optional if we need)
**Endpoint:** `GET /plans/dismissed`

**Description:** Returns a plain array of plan objects that the current user has dismissed. Shape matches `GET /plans` and all `_id` values are strings.

**Header:**
```
Authorization: Bearer <access-token>
```

**Success Response:** `200 OK`

**Response Example:**
```json
[
  {
    "_id": "68e55af5cc8a4ecf0441c731",
    "title": "Surprise Birthday Party!",
    "description": "...hide",
    "location": { "address1": "1 main st", "city": "Boston", "state": "MA", "zipcode": 12345 },
    "start_time": "2025-10-10T12:00:00",
    "end_time": "2025-10-28T15:00:00",
    "created_by": "68cd793ca4a36f574952921b",
    "created_at": "2025-10-07T18:24:53.683000"
  }
]
```



## Friend Requests

These endpoints allow creating and responding to friend requests. The frontend uses these to send requests and accept/reject them.

### 1. Send friend request
**Endpoint:** `POST /friends/request/:user_id/`

**Description:** Send a friend request to the user with id `user_id`. Authentication required.
**Response Example:**
```json
{
  "id": "68e2bc8d390fe44b0f398f4e",
  "sender": "68cd793ca4a36f574952921b",
  "receiver": "68d2bb9c8b1d2c3e4f5a6b7",
  "status": "pending"
}
```

### 2. Respond to friend request
**Endpoint:** `POST /friends/respond/:request_id/`

**Description:** Accept or reject a friend request. Request body should include `action` set to `accept` or `reject`.

**Request Body Example:**
```json
{"action": "accept"}
```

**Response Example:**
```json
{
  "id": "68e2bc8d390fe44b0f398f4e",
  "status": "accepted"
}
```

### 3. List friends / requests
**Endpoint:** `GET /friends/` or `GET /friends/list/`

**Description:** Returns friend relationships and pending requests for the authenticated user.

The friends list now returns both the other user’s id (so you can map/display the user) and a separate Friend record id (so you can act on the request). Use the former for UI and the latter for API actions

list_friends returns:
    - id — the other user’s id (string) — this matches the id you get from the users endpoints and should be used to look up/display user info in the UI
    - request_id — the Friend record primary key (Friend.pk) — this is the unique id for that friend-request record and must be used when you call friend-level endpoints (respond / remove)
Tests reflect this contract and assert:
    - outgoing_requests[i]['id'] == str(fr_out.receiver.pk)
    - outgoing_requests[i]['request_id'] == str(fr_out.pk)
    - incoming_requests[i]['id'] == str(fr_in.sender.pk)
    - incoming_requests[i]['request_id'] == str(fr_in.pk) Those tests pass locally, so the API is returning the values the frontend needs

**Response Example:**
```json
{
  "current_user_id": "68e2bc8d390fe44b0f398f4e",
  "friends": [ {"id": "68d5d66921c840dea3433ff2", "username": "bob"} ],
  "incoming_requests": [
    {
      "id": "68d5d66921c840dea3433ff3",      // other user's id (User.id) 
      "request_id": "68e2bc96390fe44b0f398faa", // Friend record id 
      "username": "carol",
      "status": "pending"
    }
  ],
  "outgoing_requests": [
    {
      "id": "68d5d66921c840dea3433ff4",
      "request_id": "68e2bc96390fe44b0f398f4f",
      "username": "dave",
      "status": "pending"
    }
  ]
}
```

Notes:
- `id` in the incoming/outgoing entries is the other user's id (User.id). Use this to map to user records in the UI
- `request_id` is the Friend record primary key (Friend.pk). Use this id when calling friend-level endpoints.

Example: Cancel an outgoing request using `request_id`:
```bash
curl -i -X DELETE "http://localhost:8000/api/friends/remove/<REQUEST_ID>/" \
  -H "Authorization: Bearer <ACCESS_TOKEN>"
```

### 4. Remove friend / Cancel request

**Endpoint:** `DELETE /friends/remove/:request_id/`

**Description:** Remove an existing friend relationship or cancel an outgoing request. Use the Friend record id (`request_id`, the Friend.pk value) when calling this endpoint — this matches the `request_id` returned in the incoming/outgoing entries from the friends list. This endpoint is used both to remove accepted friends and to cancel the pending outgoing requests

**Response Example:**
- HTTP 204 No Content (empty response body)

## RSVP

These endpoints handle RSVP (Response to Invitation) functionality for plans.

### Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `_id` | string | No | RSVP ID (auto-generated) |
| `plan_id` | string | Yes | ID of the plan being RSVP'd to |
| `user_id` | string | Yes | ID of the user RSVP'ing |
| `created_at` | datetime | No | RSVP creation timestamp |

### 1. Create RSVP
**Endpoint:** `POST /rsvp/add`

**Description:** Create an RSVP for a plan. Users can only RSVP once per plan.

**Header:**
```
Authorization: Bearer <access-token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "plan_id": "68dabba350510db53d9af43d"
}
```

**Response Example:**
```json
{
  "message": "RSVP created",
  "id": "68e2bc8d390fe44b0f398f4e",
  "data": {
    "plan_id": "68dabba350510db53d9af43d",
    "user_id": "68cd793ca4a36f574952921b",
    "created_at": "2024-01-15T10:30:00Z"
  }
}
```

### 2. Get RSVP by Plan ID
**Endpoint:** `GET /rsvp/plan/:plan_id`

**Description:** Get all RSVPs for a specific plan.

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `plan_id` | string | Yes | Unique identifier of the plan (MongoDB ObjectId) |

**Header:**
```
Authorization: Bearer <access-token>
```

**Response Example:**
```json
{
  "data": [
    {
      "_id": "68e2bc8d390fe44b0f398f4e",
      "plan_id": "68dabba350510db53d9af43d",
      "user_id": "68cd793ca4a36f574952921b",
      "created_at": "2024-01-15T10:30:00Z"
    },
    {
      "_id": "68e2bc8d390fe44b0f398f4f",
      "plan_id": "68dabba350510db53d9af43d",
      "user_id": "68d2bb9c8b1d2c3e4f5a6b7",
      "created_at": "2024-01-15T11:00:00Z"
    }
  ]
}
```

### 3. Get RSVP by User ID
**Endpoint:** `GET /rsvp/user`

**Description:** Get all RSVPs for the current authenticated user.

**Header:**
```
Authorization: Bearer <access-token>
```

**Response Example:**
```json
{
  "data": [
    {
      "_id": "68e2bc8d390fe44b0f398f4e",
      "plan_id": "68dabba350510db53d9af43d",
      "user_id": "68cd793ca4a36f574952921b",
      "created_at": "2024-01-15T10:30:00Z"
    },
    {
      "_id": "68e2bc8d390fe44b0f398f5a",
      "plan_id": "68d7528319852c1d249d3bbb",
      "user_id": "68cd793ca4a36f574952921b",
      "created_at": "2024-01-15T12:00:00Z"
    }
  ]
}
```

### 4. Delete RSVP by ID
**Endpoint:** `DELETE /rsvp/:rsvp_id/delete`

**Description:** Delete a specific RSVP by its ID.

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `rsvp_id` | string | Yes | Unique identifier of the RSVP (MongoDB ObjectId) |

**Header:**
```
Authorization: Bearer <access-token>
```

**Response Example:**
```json
{
  "message": "RSVP 68e2bc8d390fe44b0f398f4e deleted successfully"
}
```

### 5. Delete RSVP by Plan ID
**Endpoint:** `DELETE /rsvp/plan/:plan_id/delete`

**Description:** Delete RSVP for a specific plan (useful when a plan is cancelled).

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `plan_id` | string | Yes | Unique identifier of the plan (MongoDB ObjectId) |

**Header:**
```
Authorization: Bearer <access-token>
```

**Response Example:**
```json
{
  "message": "RSVP for plan 68dabba350510db53d9af43d deleted successfully"
}
```

## Quick curl examples (copy/paste)
- Obtain token (use seeded user or create one via /api/register/):
```bash
curl -s -X POST http://localhost:8000/api/token/ \
  -H "Content-Type: application/json" \
  -d '{"username":"rachel.green","password":"password123"}' | jq
```
- List users:
```bash
curl -s http://localhost:8000/api/users/ \
  -H "Authorization: Bearer <ACCESS_TOKEN>" | jq
```
- Get user by id:
```bash
curl -s http://localhost:8000/api/users/<user_id>/ \
  -H "Authorization: Bearer <ACCESS_TOKEN>" | jq
```

4) Send a friend request to another user (replace <recipient_id>)
```bash
curl -s -X POST http://localhost:8000/api/friends/request/<recipient_id>/ \
  -H "Authorization: Bearer <ACCESS_TOKEN>" | jq
```

5) Respond to a friend request (accept)
```bash
curl -s -X POST http://localhost:8000/api/friends/respond/<request_id>/ \
  -H "Authorization: Bearer <ACCESS_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"action":"accept"}' | jq
```

6) Register a new user
```bash
curl -s -X POST http://localhost:8000/api/register/ \
  -H "Content-Type: application/json" \
  -d '{"username":"newuser","email":"new@example.com","first_name":"New","last_name":"User","password":"password123","password_confirm":"password123"}' | jq
```

7) Get user profile
```bash
curl -s http://localhost:8000/api/profile/ \
  -H "Authorization: Bearer <ACCESS_TOKEN>" | jq
```

8) Create a plan
```bash
curl -s -X POST http://localhost:8000/api/plans/add \
  -H "Authorization: Bearer <ACCESS_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"title":"My Event","description":"A fun event","location":{"address1":"123 Main St","city":"Boston","state":"MA","zipcode":12345},"start_time":"2025-09-28 12:00:00","end_time":"2025-09-28 15:00:00"}' | jq
```

9) Create an RSVP
```bash
curl -s -X POST http://localhost:8000/api/rsvp/add \
  -H "Authorization: Bearer <ACCESS_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"plan_id":"<PLAN_ID>"}' | jq
```