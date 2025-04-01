# Task Management API Documentation

## Overview
The Task Management API provides endpoints for managing tasks within a project management application. It allows users to create, update, and track tasks efficiently, ensuring that project goals are met on time.

## Common Error Responses
- **500 Internal Server Error**: This error occurs when the server encounters an unexpected condition that prevents it from fulfilling the request.
  ```json
  {
    "error": "An unexpected error occurred. Please try again later."
  }
  ```
  
## Endpoints

### 1. Create a Task
- **Endpoint:** `POST /api/tasks/`
- **Description:** Creates a new task.
- **Request Body:**
  ```json
  {
    "title": "Task Title",
    "description": "Detailed description of the task.",
    "due_date": "YYYY-MM-DD",
    "assigned_to": "user_id",
    "status": "pending"
  }
  ```
- **Response:**
  - **201 Created**
  ```json
  {
    "id": "task_id",
    "title": "Task Title",
    "description": "Detailed description of the task.",
    "due_date": "YYYY-MM-DD",
    "assigned_to": "user_id",
    "status": "pending"
  }
  ```

### 2. Update a Task
- **Endpoint:** `PUT /api/tasks/{task_id}/`
- **Description:** Updates an existing task.
- **Request Body:**
  ```json
  {
    "title": "Updated Task Title",
    "description": "Updated description of the task.",
    "due_date": "YYYY-MM-DD",
    "assigned_to": "user_id",
    "status": "completed"
  }
  ```
- **Response:**
  - **200 OK**
  ```json
  {
    "id": "task_id",
    "title": "Updated Task Title",
    "description": "Updated description of the task.",
    "due_date": "YYYY-MM-DD",
    "assigned_to": "user_id",
    "status": "completed"
  }
  ```

### 3. Get Task Details
- **Endpoint:** `GET /api/tasks/{task_id}/`
- **Description:** Retrieves details of a specific task.
- **Response:**
  - **200 OK**
  ```json
  {
    "id": "task_id",
    "title": "Task Title",
    "description": "Detailed description of the task.",
    "due_date": "YYYY-MM-DD",
    "assigned_to": "user_id",
    "status": "pending"
  }
  ```

### 4. Delete a Task
- **Endpoint:** `DELETE /api/tasks/{task_id}/`
- **Description:** Deletes a specific task.
- **Response:**
  - **204 No Content**

### 5. List All Tasks
- **Endpoint:** `GET /api/tasks/`
- **Description:** Retrieves a list of all tasks.
- **Response:**
  - **200 OK**
  ```json
  [
    {
      "id": "task_id",
      "title": "Task Title",
      "description": "Detailed description of the task.",
      "due_date": "YYYY-MM-DD",
      "assigned_to": "user_id",
      "status": "pending"
    },
    ...
  ]
  ```

### 6. Update Task Status
- **Endpoint:** `PATCH /api/tasks/{task_id}/status/`
- **Description:** Updates the status of a specific task.
- **Request Body:**
  ```json
  {
    "status": "completed"
  }
  ```
- **Response:**
  - **200 OK**
  ```json
  {
    "id": "task_id",
    "status": "completed"
  }
  ```

## Error Handling
- **400 Bad Request:** Invalid input data.
- **404 Not Found:** Task not found.
- **500 Internal Server Error:** Unexpected server error.

## Conclusion
This API documentation provides a comprehensive guide to the task management functionalities within the project management web app, enabling developers to integrate and utilize these features effectively.