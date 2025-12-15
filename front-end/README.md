

A modern React-based admin dashboard for banking applications. This project provides a professional, secure, and user-friendly interface for managing accounts, transactions, recipients, and admin operations.

## Features

- **User & Admin Authentication** (JWT, context-based)
- **Account Management**: create, view, and manage multiple accounts
- **Quick Transfer**: send money instantly with a modern, modal-based UX
- **Recipients**: save, view, and use recipients for fast transactions
- **Transaction History**: filter and view all account operations
- **Admin Panel**: audit logs, admin creation, and privileged actions
- **Global Error Handling**: overlays and contextual error messages
- **Responsive Design**: works on desktop and mobile
- **Modern UI/UX**: clean, accessible, and intuitive

## Tech Stack

- **React 19** (CRA)
- **Redux Toolkit** for state management
- **react-router-dom v6** for routing
- **Axios** for HTTP requests (with interceptors)
- **Context API** for authentication and error state
- **Custom CSS** (no frameworks)

## Project Structure

```
bank-admin/
  public/           # Static assets
  src/
    components/     # Reusable UI components
    contexts/       # Auth and error context providers
    pages/          # Main app pages (Dashboard, Home, Admin, etc.)
    services/       # API layer (BankAPI)
    store/          # Redux slices
    App.js          # Main router and layout
    index.js        # App entry point
  package.json
  README.md
```

## Getting Started

1. **Clone the repository:**
   ```bash
   git clone <repo-url>
   cd bank-admin
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Configure environment:**
   - Copy `.env.local.example` to `.env.local` and set `REACT_APP_API_URL` to your backend URL.
4. **Start the development server:**
   ```bash
   npm start
   ```
   The app will run at [http://localhost:3000](http://localhost:3000).

## Authentication Flow

- Users and admins log in via separate routes.
- JWT tokens are stored in `localStorage` and attached to all API requests.
- 401 responses trigger auto-logout and redirect to login.

## API Usage

All API calls are made via the `BankAPI` service in `src/services/apiCalls.js`. **Never use raw axios/fetch in components.**

Example:
```js
import { BankAPI } from '../services/apiCalls';
const accounts = await BankAPI.getAccounts();
```

## Scripts

- `npm start` — Start development server
- `npm run build` — Production build
- `npm test` — Run tests

## Customization

- **Styling:** Edit CSS in `src/pages/*.css` and `src/components/*.css`.
- **Routes:** Update or add routes in `src/App.js`.
- **API:** Update endpoints in `src/services/apiCalls.js` as needed.

## Security Notes

- JWT tokens are stored in `localStorage` (consider httpOnly cookies for production)
- All sensitive actions require authentication
- CORS must be enabled on the backend

## License

MIT

---

