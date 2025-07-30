# Half-Life ROI Service

A Node.js backend service for the Half-Life ROI application with user management and JWT authentication.

## Project Structure

```
half-life-roi-service/
├── src/
│   ├── common/
│   │   ├── util.mjs          # JWT token generation utilities
│   │   └── auth.mjs          # Authentication middleware
│   ├── database/
│   │   └── db.mjs            # MongoDB connection setup
│   ├── user/
│   │   ├── controller/
│   │   │   └── userController.mjs    # User HTTP request handlers
│   │   ├── model/
│   │   │   └── userModel.mjs         # User MongoDB schema
│   │   ├── service/
│   │   │   └── userService.mjs       # User business logic
│   │   └── routes/
│   │       └── userRoutes.mjs        # User API routes
│   └── quiz/                 # Quiz module (future implementation)
├── index.mjs                 # Main application entry point
├── package.json
├── USER_API.md              # Detailed API documentation
├── test-user-api.mjs        # API testing script
└── README.md
```

## Features

- **User Management**: Create, retrieve users with unique IDs
- **JWT Authentication**: Secure token-based authentication
- **MongoDB Integration**: Persistent data storage
- **RESTful API**: Clean, consistent API design
- **Error Handling**: Comprehensive error handling and validation
- **Environment Configuration**: Flexible configuration via environment variables

## Quick Start

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd half-life-roi-service
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory:

   ```env
   MONGO_URI=mongodb://localhost:27017/half-life-roi
   ACCESS_TOKEN_SECRET=your_super_secret_jwt_key_here
   PORT=6005
   ```

4. Start the development server:
   ```bash
   npm run start:dev
   ```

The server will start on `http://localhost:6005`

## API Endpoints

### User Management

| Method | Endpoint         | Description       | Authentication |
| ------ | ---------------- | ----------------- | -------------- |
| POST   | `/users`         | Create a new user | No             |
| GET    | `/users`         | Get all users     | Yes            |
| GET    | `/users/:userId` | Get user by ID    | Yes            |

### Authentication

- **Public Endpoints**: User creation (POST `/users`)
- **Protected Endpoints**: User retrieval (GET `/users`, GET `/users/:userId`)

Protected endpoints require a valid JWT token in the Authorization header:

```
Authorization: Bearer <your_access_token>
```

## Usage Examples

### Creating a User

```bash
curl -X POST http://localhost:6005/users \
  -H "Content-Type: application/json" \
  -d '{"name": "John Doe"}'
```

Response:

```json
{
  "success": true,
  "message": "User created successfully",
  "data": {
    "userId": "550e8400-e29b-41d4-a716-446655440000",
    "name": "John Doe",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Using the Access Token

```bash
curl -X GET http://localhost:6005/users \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

## Testing

Run the test script to verify the API functionality:

```bash
node test-user-api.mjs
```

This will test:

- User creation
- Authentication with valid tokens
- Error handling for invalid tokens
- Input validation

## Development

### Available Scripts

- `npm start`: Start the production server
- `npm run start:dev`: Start the development server with hot reload
- `npm test`: Run tests (placeholder)

### Environment Variables

| Variable              | Description               | Default                                   |
| --------------------- | ------------------------- | ----------------------------------------- |
| `MONGO_URI`           | MongoDB connection string | `mongodb://localhost:27017/half-life-roi` |
| `ACCESS_TOKEN_SECRET` | JWT secret key            | Required                                  |
| `PORT`                | Server port               | `6005`                                    |

## Architecture

### MVC Pattern

- **Models**: MongoDB schemas (`src/user/model/`)
- **Views**: JSON API responses
- **Controllers**: HTTP request handlers (`src/user/controller/`)

### Service Layer

Business logic is separated into service files (`src/user/service/`) for better maintainability and testability.

### Middleware

- **Authentication**: JWT token verification (`src/common/auth.mjs`)
- **CORS**: Cross-origin resource sharing enabled
- **JSON Parsing**: Automatic JSON request/response handling

## Security Features

- JWT token-based authentication
- Input validation and sanitization
- Secure MongoDB connection
- Environment variable configuration
- Error handling without sensitive data exposure

## Future Enhancements

- User password authentication
- Refresh token mechanism
- Rate limiting
- API documentation with Swagger
- Unit and integration tests
- Quiz module implementation
- User roles and permissions

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

ISC License
