# API Documentation

## Table of Contents

- [Base URL](#base-url)
- [Authentication](#authentication)
- [Plans](#plans)
    - [Get plans](#1-get-plans)
    - [Create plan](#2-create-a-plan)
    - [Get plan by id](#3-get-plan-by-id)
    - [Edit plan](#4-edit-a-plan)
    - [Delete plan](#5-delete-a-plan)
 - [Users](#users)

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

**Description:** Returns a list of plans.  

**Header:**
```
Authorization: Bearer <access-token>
```

**Response Example:**
```json
[
  {
    "_id": "68dabba350510db53d9af43d",
    "title": "Game Night", 
    "description": "Lots of fun and laughters with friends.", 
    "location": {
        "address1": "1 main st", 
        "city": "Boston", 
        "state": "MA", 
        "zipcode": "12345"
    },
    "start_time": "2025-09-28T12:00:00Z",
    "end_time": "2025-09-28T15:00:00Z",
    "created_by": "68cd793ca4a36f574952921b"
  },
  {
    "_id": "68d7528319852c1d249d3bbb",
    "title": "Its Adam's Birthday!!!", 
    "description": "Adam's 25th Birthday Party", 
    "location": {
        "name": "The Bar",
        "address1": "1 main st", 
        "city": "Boston", 
        "state": "MA", 
        "zipcode": "12345"
    },
    "start_time": "2025-09-28T12:00:00Z",
    "end_time": "2025-09-28T15:00:00Z",
    "created_by": "68cd793ca4a36f574952921b"
  },
  ...
]
```

### 2. Create a Plan

**Endpoint:** `GET /plans/add`

**Description:** Returns a list of plans.  

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
    "created_by": "68cd793ca4a36f574952921b"
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
    "_id": "68dabba350510db53d9af43d",
    "title": "Game Night", 
    "description": "Lots of fun and laughters with friends.", 
    "location": {
        "address1": "1 main st", 
        "city": "Boston", 
        "state": "MA", 
        "zipcode": "12345"
    },
    "start_time": "2025-09-28T12:00:00Z",
    "end_time": "2025-09-28T15:00:00Z",
    "created_by": "68cd793ca4a36f574952921b"
}
```

### 4. Edit a Plan

**Endpoint:** `PUT /plans/:plan_id/edit`

**Description:** Edits a plan with a given id.  

**Path Parameters:**
| Parameter   | Type   | Required | Description                |
|-------------|--------|----------|----------------------------|
| `plan_id`   | string | Yes      | Unique identifier of the plan (MongoDB ObjectId). |

**Header:**
```
Authorization: Bearer <access-token>
Content-Type: application/json
```

**Request Body**:

Update the plan title

```json
{
    "title": "Alex's Game Night!"
}
```

**Response Example**:
```json
{
    "_id": "68dabba350510db53d9af43d",
    "title": "Alex's Game Night Party!", 
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
    "created_by": "68cd793ca4a36f574952921b"
}
```

### 5. Delete a Plan

**Endpoint:** `DELETE /plans/:plan_id/delete`

**Description:** Deletes a plan with a given id.  

**Path Parameters:**
| Parameter   | Type   | Required | Description                |
|-------------|--------|----------|----------------------------|
| `plan_id`   | string | Yes      | Unique identifier of the plan (MongoDB ObjectId). |

**Header:**
```
Authorization: Bearer <access-token>
```

**Response Example**:
```
{
    "message": "Event 68da01e2fa068cbd5713d439 deleted successfully"
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
  {"id": "1", "username": "alice", "first_name": "Alice", "last_name": "Z"},
  {"id": "2", "username": "bob", "first_name": "Bob", "last_name": "Y"}
]
```

### 2. Get user by id
**Endpoint:** `GET /users/:user_id/`

**Description:** Returns public fields for a single user. Authentication required.

**Response Example:**
```json
{"id": "1", "username": "alice", "first_name": "Alice", "last_name": "Z"}
```

{ "detail": "Not found." }
```

### Quick curl examples (copy/paste)
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
