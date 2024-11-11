# Feedback API Documentation
## Overview
This API provides endpoints for sending and retrieving feedback data. It uses PocketBase as the backend database and Fastify as the web server.
## Dependencies
* `pocketbase`: PocketBase library for Node.js
* `fastify`: Fastify web framework for Node.js
* `dotenv`: Library for loading environment variables from a `.env` file
* `fastify-rate-limit`: Rate limiting plugin for Fastify
* `fastify-cors`: CORS plugin for Fastify
## Endpoints
### Send Feedback
#### Method: `POST`
#### Endpoint: `/send-feedback`
#### Request Body:
  * `project`: string (min length 3)
  * `feedback`: string (min length 10)
  * `rating`: number (min 1, max 5)
  * `timestamp`: string (date-time format)
#### Response:
  * `{ message: 'Data received at [timestamp]' }`

### Get Feedbacks
#### Method: `GET`
#### Endpoint: `/get-feedbacks`
#### Request Body: none
#### Response:
  * list of feedback records

### Get Feedbacks by Project
#### Method: `GET`
#### Endpoint: `/get-feedbacks/:project`
#### Request Parameters:
  * `project`: string (filter feedback records for this project)
#### Response:
  * list of feedback records filtered by project

### Delete Feedback
#### Method: `DELETE`
#### Endpoint: `/delete-feedback/:id`
#### Request Parameters:
  * `id`: string (ID of the feedback record to delete)
#### Response:
  * `{ message: 'Feedback [id] deleted successfully!' }`

## Rate Limiting
This API has a rate limit of 100 requests per minute.

## Environment Variables
The following environment variables are required:

* `PB_HOST`: PocketBase host URL
* `PB_EMAIL`: PocketBase admin email
* `PB_PASSWORD`: PocketBase admin password

## Running the Server
To run the server, execute the following command:
```bash
node index.js