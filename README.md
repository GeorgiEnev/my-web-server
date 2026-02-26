# My Web Server

My small, HTTP web server built from scratch using Node.js's low-level `net` module. This project demonstrates fundamental web server architecture, HTTP protocol handling, and routing without relying on external frameworks like Express.

## Overview

This web server implements core HTTP functionality including request parsing, routing, middleware support, and static file serving. It's designed for educational purposes on how HTTP servers work at a fundamental level while providing practical routing and middleware capabilities.

## Features

- **Custom HTTP Protocol Implementation**: Parses HTTP/1.1 requests and generates proper HTTP responses
- **Low-Level Socket Handling**: Built on Node.js `net` module for raw socket communication
- **Dynamic Routing System**:
  - Support for multiple HTTP methods (GET, POST)
  - Parameterized routes (e.g., `/users/:id`)
  - Exact and pattern-based route matching
- **Middleware Architecture**: Extensible middleware pipeline for request processing
- **Static File Serving**: Automatic serving of static assets with proper MIME types
- **JSON Request Handling**: Built-in JSON parsing and validation
- **Error Handling**: Comprehensive error handling including 404 and 500 responses

## Project Structure

```
my-web-server/
├── server.js                 # Main server entry point
├── package.json              # Project metadata and dependencies
├── app/
│   └── app.js               # Application routes configuration
├── core/
│   ├── httpParser.js        # HTTP request parser
│   ├── request.js           # Request object class
│   └── response.js          # Response object class
├── routing/
│   └── router.js            # Router class with middleware support
├── middleware/
│   ├── staticFiles.js       # Static file serving middleware
│   └── validateJson.js      # JSON validation middleware
└── public/
    ├── index.html           # Homepage
    └── style.css            # Stylesheet
```

## Installation

### Prerequisites

- Node.js 14.0.0 or higher
- npm (comes with Node.js)

### Setup

1. Clone the repository:

```bash
git clone <repository-url>
cd my-web-server
```

2. Run the server:

```bash
node server.js
```

## Usage

### Starting the Server

```bash
node server.js
```

The server will start listening on `http://localhost:6969`

```

## API Endpoints

### GET /

Returns the homepage with HTML content.

**Response:**

- Status: `200 OK`
- Body: HTML (index.html)

### GET /about

Returns a simple text response.

**Response:**

- Status: `200 OK`
- Content-Type: `text/plain`
- Body: `I Am Batman`

### POST /api/echo

Echoes back the JSON body sent in the request.

**Request:**

```bash
curl -X POST http://localhost:6969/api/echo \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello Server"}'
```

**Response:**

- Status: `200 OK`
- Content-Type: `application/json`
- Body: `{"received": {"message": "Hello Server"}}`

### GET /users/:id

Returns the user ID from the URL parameter.

**Request:**

```bash
curl http://localhost:6969/users/42
```

**Response:**

- Status: `200 OK`
- Content-Type: `application/json`
- Body: `{"userId": "42"}`

### Static Files

All files in the `public/` directory are automatically served.

- `GET /` → serves `public/index.html`
- `GET /style.css` → serves `public/style.css`

**Supported MIME Types:**

- `.html` → `text/html`
- `.css` → `text/css`
- `.js` → `application/javascript`
- `.json` → `application/json`
- `.png` → `image/png`
- `.jpg`, `.jpeg` → `image/jpeg`

## Architecture

### Request Processing Pipeline

1. **Socket Connection**: Raw TCP socket opens when client connects
2. **Request Buffering**: Incoming data is buffered until a complete HTTP request is received
3. **HTTP Parsing**: `httpParser` extracts method, path, headers, and body
4. **Request Object Creation**: `Request` class created with parsed data, URL parameters, and query string
5. **Response Object Creation**: `Response` class initialized with socket reference
6. **Middleware Execution**: Registered middleware functions execute in order
7. **Route Matching**: Router matches request against registered routes
8. **Handler Execution**: Route handler processes request and sends response
9. **Connection Management**: Socket closes based on HTTP headers

### Core Components

#### HTTP Parser (`core/httpParser.js`)

Parses raw HTTP request strings into structured data:

- Extracts request line (method, path, HTTP version)
- Parses headers
- Handles request body based on Content-Length

#### Request Class (`core/request.js`)

Encapsulates incoming HTTP requests with:

- HTTP method and path
- Headers collection
- Query string parsing
- JSON body parsing
- URL parameter extraction

#### Response Class (`core/response.js`)

Manages outgoing HTTP responses with:

- Status code and message setting
- Header management
- JSON serialization
- Automatic Content-Length calculation
- HTTP/1.1 response formatting

#### Router (`routing/router.js`)

Handles route registration and request dispatching:

- Maps HTTP methods to route handlers
- Supports parameterized routes (`:paramName`)
- Executes middleware pipeline
- Pattern matching for dynamic routes
- Error handling with proper HTTP status codes

## Middleware

The server implements a standard middleware pipeline pattern:

```javascript
router.use(middleware1);
router.use(middleware2);
// Routes defined after middleware are processed through the pipeline
```

### Built-in Middleware

**Static Files Middleware**

- Serves files from the `public` directory
- Prevents directory traversal attacks
- Automatically sets correct MIME types
- Passes control to next middleware if file not found

**JSON Validation Middleware**

- Validates JSON in request body
- Returns 400 Bad Request if JSON is malformed
- Prevents invalid JSON from reaching route handlers

## Configuration

### Server Port

The server listens on port `6969`. To change the port, modify `server.js`:

```javascript
const port = 6969; // Change this value
```

### Static File Directory

To change the static files directory, modify `app/app.js`:

```javascript
router.use(staticFiles("public")); // Change "public" to desired directory
```

## Error Handling

The server implements automatic error handling:

- **400 Bad Request**: Invalid JSON in request body
- **403 Forbidden**: Directory traversal attempts
- **404 Not Found**: No matching route found
- **500 Internal Server Error**: Unhandled exceptions in route handlers

All errors are logged to the console and appropriate HTTP responses are returned to clients.

## Development

### Project Type

ES Modules (ESM) - All files use `import`/`export` syntax

## Testing

You can test the server using `curl`:

```bash
# Test homepage
curl http://localhost:6969/

# Test /about endpoint
curl http://localhost:6969/about

# Test echo endpoint
curl -X POST http://localhost:6969/api/echo \
  -H "Content-Type: application/json" \
  -d '{"test": "data"}'

# Test parameterized route
curl http://localhost:6969/users/123

# Test static file
curl http://localhost:6969/style.css
```




