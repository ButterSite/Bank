# Bank Application - Backend

RESTful API backend for a banking application built with Node.js, Express, and MongoDB.

## Features

- User management - registration, login, JWT-based authentication
- Account management - creating and managing bank accounts
- Transactions - fund transfers, transaction history
- Admin panel - custom admin routes with role-based access control
- Account logs - tracking all account operations
- IBAN generation - automatic account number creation
- XML export - transaction export to XML format
- Rate limiting - protection against abuse
- API documentation - interactive Swagger UI documentation
- Input validation - comprehensive data validation with Joi
- Security - bcrypt password hashing, Helmet.js security headers
- Logging - Winston logger with MongoDB integration

## Requirements

- Node.js (v14 or higher)
- MongoDB (running locally or remotely)
- npm or yarn

## Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the main `backend/` directory based on the template below:

```env
# Server
PORT=3000

# Database
MONGODB_URI=mongodb://localhost:27017/bank
# lub MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/bank

# JWT
JWT_SECRET=your-secret-key-here
JWT_EXPIRES_IN=24h

# Other
NODE_ENV=development
```

## Running the Application

### Development mode (with auto-reload):
```bash
npm run dev
```

### Production mode:
```bash
npm start
```

The server will start on `http://localhost:3000` by default.

## API Documentation

The project includes comprehensive API documentation using Swagger UI. After starting the server, the interactive API documentation is available at:

```
http://localhost:3000/api-docs
```

The Swagger documentation provides:
- Complete list of all available endpoints
- Request/response schemas
- Interactive testing interface
- Authentication requirements for each endpoint
- Example requests and responses

## Project Structure

```
backend/
├── src/
│   ├── controllers/          # Business logic
│   │   ├── userController.js
│   │   ├── accountsController.js
│   │   ├── transactionController.js
│   │   └── historyController.js
│   ├── models/               # Data models
│   │   ├── user.js
│   │   ├── accountModel.js
│   │   ├── transaction.js
│   │   └── accountLogModel.js
│   ├── mongoSchemas/         # MongoDB schemas
│   ├── routes/               # API endpoints
│   │   ├── userRoutes.js
│   │   ├── accountRoutes.js
│   │   ├── transactionRoutes.js
│   │   └── historyRoutes.js
│   ├── middleware/           # Middleware functions
│   │   ├── auth.js
│   │   ├── validate.js
│   │   ├── checkPermissions.js
│   │   └── transactionsAuth.js
│   ├── utils/                # Utility functions
│   │   ├── ibanGenerator.js
│   │   ├── jwtToken.js
│   │   └── transactionXml.js
│   ├── config/               # Configuration files
│   │   ├── db.js
│   │   ├── swagger.js
│   │   └── swagger.yaml
│   └── adminControllers/     # Admin panel controllers
├── bank/                     # Additional banking utilities (TypeScript)
│   └── src/
│       ├── app.ts
│       └── admin/
├── server.js                 # Application entry point
├── package.json
└── .env                      # Environment variables (DO NOT COMMIT!)
```

## API Endpoints

### Users
- `POST /api/users/register` - Register a new user
- `POST /api/users/login` - User login
- `GET /api/users/profile` - Get user profile (requires authentication)

### Accounts
- `GET /api/accounts` - List user accounts
- `POST /api/accounts` - Create a new account
- `GET /api/accounts/:id` - Get account details

### Transactions
- `POST /api/transactions` - Execute a transfer
- `GET /api/transactions` - Get transaction history
- `GET /api/transactions/:id` - Get transaction details

### History
- `GET /api/history` - Get account operation logs

### Admin Panel
- `/admin/login` - Admin login
- `/admin/create` - Create admin user
- `/admin/logs` - Get system logs (requires admin role)

For complete endpoint documentation with request/response schemas, see the Swagger UI at `/api-docs`.

## Security

- Password hashing using bcrypt
- JWT-based authorization
- Rate limiting on endpoints
- Helmet.js for HTTP security headers
- Input validation using Joi
- CORS configuration

## Testing

```bash
npm test
```

## Technologies

- **Express.js** - Web framework
- **MongoDB & Mongoose** - Database and ODM
- **JWT** - Authentication
- **bcrypt** - Password hashing
- **Swagger/OpenAPI** - API documentation
- **Winston** - Logging
- **Joi** - Data validation
- **Helmet** - Security middleware
- **express-rate-limit** - Rate limiting
- **xmlbuilder** - XML generation

## Additional Information

### IBAN Format
The application automatically generates Polish IBAN numbers in the format:
```
PL + 2 check digits + 24 account number digits
```

### Logging
All account operations are logged in the `accountLogs` collection with timestamps and operation details. Winston logger is configured to log to both console and MongoDB.

## Development

1. Create a new branch for your feature
2. Make your changes
3. Test your changes
4. Create a Pull Request

## License

MIT
