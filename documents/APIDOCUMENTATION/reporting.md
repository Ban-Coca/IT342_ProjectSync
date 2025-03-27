# Reporting API Documentation

## Overview
The Reporting API provides endpoints for tracking time spent on tasks and viewing project dashboards. This allows users to generate insights into project performance and team productivity.

## Endpoints

### 1. Get Project Dashboard
- **Endpoint:** `GET /api/reporting/dashboard/{project_id}/`
- **Description:** Retrieves the dashboard for a specific project, including key metrics and visualizations.
- **Parameters:**
  - `project_id` (path): The ID of the project for which the dashboard is requested.
- **Response:**
  - `200 OK`: Returns the dashboard data.
  - `404 Not Found`: If the project does not exist.

### 2. Track Time Spent on Task
- **Endpoint:** `POST /api/reporting/time-tracking/`
- **Description:** Records the time spent on a specific task by a user.
- **Request Body:**
  ```json
  {
    "task_id": "string",
    "user_id": "string",
    "time_spent": "integer" // Time in minutes
  }
  ```
- **Response:**
  - `201 Created`: Time entry successfully recorded.
  - `400 Bad Request`: If the request body is invalid.

### 3. Get Time Tracking Reports
- **Endpoint:** `GET /api/reporting/time-tracking/{user_id}/`
- **Description:** Retrieves time tracking reports for a specific user.
- **Parameters:**
  - `user_id` (path): The ID of the user for whom the report is requested.
- **Response:**
  - `200 OK`: Returns the time tracking data for the user.
  - `404 Not Found`: If the user does not exist.

### 4. Generate Project Performance Report
- **Endpoint:** `GET /api/reporting/performance/{project_id}/`
- **Description:** Generates a performance report for a specific project, summarizing key metrics.
- **Parameters:**
  - `project_id` (path): The ID of the project for which the performance report is generated.
- **Response:**
  - `200 OK`: Returns the performance report data.
  - `404 Not Found`: If the project does not exist.

## Usage
These endpoints can be used to gain insights into project progress and team efficiency, helping project managers make informed decisions based on data.