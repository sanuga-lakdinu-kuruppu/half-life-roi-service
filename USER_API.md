# User API Documentation

## Overview

This API provides endpoints for managing users in the Half-Life ROI application.

## Base URL

```
http://localhost:6005/api/users
```

## Endpoints

### 1. Create a New User

**POST** `/api/users`

Creates a new user with a unique userId and the provided name.

#### Request Body

```json
{
  "name": "John Doe"
}
```

#### Response (Success - 201)

```json
{
  "success": true,
  "message": "User created successfully",
  "data": {
    "userId": "550e8400-e29b-41d4-a716-446655440000",
    "name": "John Doe",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

#### Response (Error - 400)

```json
{
  "success": false,
  "message": "Name is required and must be a non-empty string"
}
```

### 2. Get All Users

**GET** `/api/users`

Retrieves all users from the database.

#### Response (Success - 200)

```json
{
  "success": true,
  "message": "Users retrieved successfully",
  "data": [
    {
      "userId": "550e8400-e29b-41d4-a716-446655440000",
      "name": "John Doe",
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

### 3. Get User by ID

**GET** `/api/users/:userId`

Retrieves a specific user by their userId.

#### Response (Success - 200)

```json
{
  "success": true,
  "message": "User retrieved successfully",
  "data": {
    "userId": "550e8400-e29b-41d4-a716-446655440000",
    "name": "John Doe",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

#### Response (Error - 404)

```json
{
  "success": false,
  "message": "User not found",
  "error": "USER_NOT_FOUND"
}
```

## Environment Variables

Make sure to set the following environment variable in your `.env` file:

```
MONGODB_URI=mongodb://localhost:27017/half-life-roi
```

## Running the Application

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start the development server:

   ```bash
   npm run start:dev
   ```

3. The server will start on port 6005 (or the port specified in your environment variables).

## Example Usage

### Creating a new user using curl:

```bash
curl -X POST http://localhost:6005/api/users \
  -H "Content-Type: application/json" \
  -d '{"name": "John Doe"}'
```

### Creating a new user using JavaScript fetch:

```javascript
const response = await fetch("http://localhost:6005/api/users", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    name: "John Doe",
  }),
});

const data = await response.json();
console.log(data);
```
