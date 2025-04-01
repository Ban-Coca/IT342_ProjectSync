# Authentication API Documentation

## Overview
This document outlines the API endpoints related to user authentication features in the Project Management web app. It includes functionalities for creating user accounts, logging in, resetting passwords, and changing passwords.

## Common Error Responses
- **500 Internal Server Error**: This error occurs when the server encounters an unexpected condition that prevents it from fulfilling the request.
  ```json
  {
    "error": "An unexpected error occurred. Please try again later."
  }
  ```
  
## Endpoints

### 1. Create User Account
- **Endpoint:** `/api/user/postuserrecord`
- **Method:** `POST`
- **Description:** Creates a new user account.
- **Request Body:**
  ```json
  {
    "username": "string",
    "email": "string",
    "firstName": "string",
    "lastName": "string",
    "password": "string"
  }
  ```
- **Response:**
  - **200 OK**
    ```json
    {
      "user": {
        "userId": "integer",
        "username": "string",
        "email": "string",
        "firstName": "string",
        "lastName": "string",
        "isActive": "boolean",
        "createdAt": "string",
        "lastLogin": "string"
      },
      "token": "string"
    }
    ```
  - **400 Bad Request**
    ```json
    {
      "error": "Invalid input data."
    }
    ```
  - **500 Internal Server Error**
    ```json
    {
      "error": "An unexpected error occurred. Please try again later."
    }
    ```

### 2. User Login
- **Endpoint:** `/auth/login`
- **Method:** `POST`
- **Description:** Authenticates a user and returns a token.
- **Request Body:**
  ```json
  {
    "email": "string",
    "password": "string"
  }
  ```
- **Response:**
  - **200 OK**
    ```json
    {
      "token": "string",
      "user": {
        "userId": "integer",
        "username": "string",
        "email": "string"
      }
    }
    ```
  - **401 Unauthorized**
    ```json
    {
      "error": "Invalid credentials."
    }
    ```
  - **500 Internal Server Error**
    ```json
    {
      "error": "An unexpected error occurred. Please try again later."
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
    "oldPassword": "string",
    "newPassword": "string"
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
All endpoints that require authentication must include a valid token in the request header:
```
Authorization: Bearer <token>
```

## Error Handling
All error responses will include an error message detailing the issue. Example:
```json
{
  "error": "string"
}
```

## Notes
- Ensure that the `/auth/login`, `/auth/reset-password`, and `/auth/change-password` endpoints are implemented in your backend if they are not already.
- Replace placeholder values like `<token>` and `string` with actual values when testing.