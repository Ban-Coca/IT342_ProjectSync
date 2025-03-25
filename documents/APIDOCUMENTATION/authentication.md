# Authentication API Documentation

## Overview
This document outlines the API endpoints related to user authentication features in the Project Management web app. It includes functionalities for creating user accounts, logging in, and resetting passwords.

## Endpoints

### 1. Create User Account
- **Endpoint:** `/auth/register`
- **Method:** `POST`
- **Description:** Creates a new user account.
- **Request Body:**
  ```json
  {
    "username": "string",
    "email": "string",
    "first_name": "string",
    "last_name": "string",
    "password": "string"
  }
  ```
- **Response:**
  - **201 Created**
    ```json
    {
      "user_id": "string",
      "username": "string",
      "email": "string",
      "first_name": "string",
      "last_name": "string"
    }
    ```
  - **400 Bad Request**
    ```json
    {
      "error": "string"
    }
    ```

### 2. User Login
- **Endpoint:** `/auth/login`
- **Method:** `POST`
- **Description:** Authenticates a user and returns a token. Supports login through email/password, Facebook, or Google.
- **Request Body (Email/Password Login):**
  ```json
  {
    "email": "string",
    "password": "string"
  }
  ```
- **Request Body (Facebook Login):**
  ```json
  {
    "provider": "facebook",
    "access_token": "string"
  }
  ```
- **Request Body (Google Login):**
  ```json
  {
    "provider": "google",
    "access_token": "string"
  }
  ```
- **Response:**
  - **200 OK**
    ```json
    {
      "token": "string",
      "user": {
        "id": "integer",
        "username": "string",
        "email": "string"
      }
    }
    ```
  - **401 Unauthorized**
    ```json
    {
      "error": "Invalid credentials or access token."
    }
    ```

### 3. Reset Password
- **Endpoint:** `/auth/reset-password`
- **Method:** `POST`
- **Description:** Sends a password reset link to the user's email.
- **Request Body:**
  ```json
  {
    "email": "string"
  }
  ```
- **Response:**
  - **200 OK**
    ```json
    {
      "message": "Password reset link sent."
    }
    ```
  - **404 Not Found**
    ```json
    {
      "error": "User not found."
    }
    ```

### 4. Change Password
- **Endpoint:** `/auth/change-password`
- **Method:** `POST`
- **Description:** Changes the user's password.
- **Request Body:**
  ```json
  {
    "old_password": "string",
    "new_password": "string"
  }
  ```
- **Response:**
  - **200 OK**
    ```json
    {
      "message": "Password changed successfully."
    }
    ```
  - **400 Bad Request**
    ```json
    {
      "error": "string"
    }
    ```

## Authentication
All endpoints require a valid authentication token in the request header:
```
Authorization: Bearer <token>
```

## Error Handling
All error responses will include an error message detailing the issue.