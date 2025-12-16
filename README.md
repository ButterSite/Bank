# Bank Application

A full-stack banking application with a modern React frontend and a robust Node.js backend. This project simulates core banking operations including user management, account creation, fund transfers, and comprehensive transaction tracking.

## Overview

This application provides a complete banking solution with:
- User authentication and authorization
- Multiple account management
- Secure fund transfers between accounts
- Transaction history and account logs
- Administrative endpoints with role-based access control
- Interactive API documentation with Swagger
- Responsive web interface

## Project Structure

The project is organized into two main parts:

```
Bank/
├── backend/              # Node.js + Express + MongoDB API
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── middleware/
│   │   └── utils/
│   ├── server.js
│   └── README.md
│
└── front-end/            # React application
    ├── src/
    │   ├── components/
    │   ├── pages/
    │   ├── contexts/
    │   ├── services/
    │   └── store/
    └── README.md
```

## Technologies

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** authentication
- **Swagger/OpenAPI** for API documentation
- **Winston** for logging
- **Joi** for validation
- **bcrypt** for password security

### Frontend
- **React 19** (Create React App)
- **Redux Toolkit** for state management
- **React Router v7** for navigation
- **Axios** for API communication
- **Context API** for auth and error handling

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/ButterSite/Bank.git
cd Bank
```

2. Set up the backend:
```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory:
```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/bank
JWT_SECRET=your-secret-key-here
JWT_EXPIRES_IN=24h
NODE_ENV=development
```

3. Set up the frontend:
```bash
cd ../front-end
npm install
```

Create a `.env.local` file in the `front-end` directory (see `.env.local.example`):
```env
REACT_APP_API_URL=http://localhost:3000/api
```

### Running the Application

1. Start the backend server:
```bash
cd backend
npm run dev
```
The API will be available at `http://localhost:3000`

2. Start the frontend development server:
```bash
cd front-end
npm start
```
The application will open at `http://localhost:3001` (or another port if 3000 is taken)

## API Documentation

Interactive API documentation is available via Swagger UI once the backend is running:

```
http://localhost:3000/api-docs
```

The Swagger documentation provides:
- Complete endpoint reference
- Request/response schemas
- Interactive testing interface
- Authentication information

## Features in Detail

### User Features
- Register new user accounts
- Secure login with JWT tokens
- Create multiple bank accounts (checking, savings, etc.)
- Transfer funds between accounts
- View detailed transaction history
- Save frequently used recipients
- Quick transfer functionality
- Account balance tracking

### Admin Features
- Administrative dashboard (frontend)
- Role-based access control
- System-wide transaction monitoring
- Account logs and audit trails
- Admin user management

### Security
- Password hashing with bcrypt
- JWT-based authentication
- Protected API routes
- CORS configuration
- Rate limiting
- Input validation
- Helmet.js security headers

## Development

Each part of the application has its own development workflow:

### Backend Development
```bash
cd backend
npm run dev    # Run with nodemon for auto-reload
npm test       # Run tests
```

### Frontend Development
```bash
cd front-end
npm start      # Development server with hot reload
npm test       # Run tests
npm run build  # Production build
```

## API Endpoints

### Authentication
- `POST /api/users/register` - Register new user
- `POST /api/users/login` - User login

### Accounts
- `GET /api/accounts` - List user accounts
- `POST /api/accounts` - Create new account
- `GET /api/accounts/:id` - Get account details

### Transactions
- `POST /api/transactions` - Execute transfer
- `GET /api/transactions` - Transaction history
- `GET /api/transactions/:id` - Transaction details

### Admin
- `POST /admin/login` - Admin login
- `POST /admin/create` - Create admin user
- `GET /admin/logs` - System logs (requires admin role)
- `GET /api/history` - Account operation logs

For complete documentation, see the Swagger UI.

## Testing

Both frontend and backend include test configurations:

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd front-end
npm test
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

ISC

## Additional Resources

- [Backend Documentation](./backend/README.md)
- [Frontend Documentation](./front-end/README.md)
- [API Documentation](http://localhost:3000/api-docs) (when server is running)

## Support

For issues and questions, please open an issue on GitHub.
