# Document Management API Documentation

## Overview
The Document Management API provides endpoints for managing project-related documents and files. This includes functionalities for uploading, retrieving, searching, sharing, and deleting documents associated with projects.

## Endpoints

### 1. Upload Document
- **Endpoint:** `POST /api/v1/documents/upload`
- **Description:** Uploads a new document to the server and associates it with a project.
- **Request Body:**
  - `file`: The document file to be uploaded (multipart/form-data).
  - `project_id`: The ID of the project the document is associated with (required).
- **Response:**
  - **201 Created**
    ```json
    {
      "id": "document_id",
      "name": "Document Name",
      "message": "Document uploaded successfully."
    }
    ```
  - **400 Bad Request**
    ```json
    {
      "error": "Invalid file or missing required parameters."
    }
    ```

### 2. Get Document
- **Endpoint:** `GET /api/v1/documents/{id}`
- **Description:** Retrieves a specific document by its ID.
- **Path Parameters:**
  - `id`: The ID of the document to retrieve.
- **Response:**
  - **200 OK**
    ```json
    {
      "id": "document_id",
      "name": "Document Name",
      "url": "https://example.com/documents/document_id",
      "uploaded_at": "YYYY-MM-DDTHH:mm:ss",
      "uploaded_by": "user_id",
      "project_id": "project_id"
    }
    ```
  - **404 Not Found**
    ```json
    {
      "error": "Document not found."
    }
    ```

### 3. Search Documents
- **Endpoint:** `GET /api/v1/documents/search`
- **Description:** Searches for documents based on query parameters.
- **Query Parameters:**
  - `project_id`: The ID of the project to filter documents (optional).
  - `query`: The search term to look for in document names or descriptions (optional).
- **Response:**
  - **200 OK**
    ```json
    {
      "documents": [
        {
          "id": "document_id",
          "name": "Document Name",
          "uploaded_at": "YYYY-MM-DDTHH:mm:ss",
          "project_id": "project_id"
        },
        ...
      ]
    }
    ```

### 4. Share Document
- **Endpoint:** `POST /api/v1/documents/{id}/share`
- **Description:** Shares a document with specified team members.
- **Path Parameters:**
  - `id`: The ID of the document to share.
- **Request Body:**
  - `user_ids`: Array of user IDs to share the document with (required).
- **Response:**
  - **200 OK**
    ```json
    {
      "message": "Document shared successfully."
    }
    ```
  - **404 Not Found**
    ```json
    {
      "error": "Document not found."
    }
    ```

### 5. Delete Document
- **Endpoint:** `DELETE /api/v1/documents/{id}`
- **Description:** Deletes a specific document by its ID.
- **Path Parameters:**
  - `id`: The ID of the document to delete.
- **Response:**
  - **204 No Content**
    - Indicates successful deletion.
  - **404 Not Found**
    ```json
    {
      "error": "Document not found."
    }
    ```

## Error Handling
All error responses will include an `error` field with a descriptive message to help diagnose issues.

## Example Request
To upload a document:
```
POST /api/v1/documents/upload
Content-Type: multipart/form-data

{
  "file": <file>,
  "project_id": "123"
}
```

## Example Response
Successful upload response:
```json
{
  "id": "789",
  "name": "Project Plan.pdf",
  "message": "Document uploaded successfully."
}
```

## Notes
- Documents must be associated with a project using the `project_id` field.
- Ensure that the `file` field is included in the request as `multipart/form-data`.
- Use the `GET /api/v1/documents/search` endpoint to filter documents by project.

This updated documentation reflects the simplified association of documents with projects only.