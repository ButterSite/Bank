import React from 'react';
import { Provider } from 'react-redux';
import store from './store';
import { Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ErrorProvider, useError } from './contexts/ErrorContext';
import { PrivateRoute } from './components/PrivateRoute';
import { Login } from './components/auth/Login';
import { Register } from './components/auth/Register';
import { AdminLogin } from './components/auth/AdminLogin';
import { Dashboard } from './pages/Dashboard';
import { CreateAccount } from './pages/CreateAccount';
import { SendTransaction } from './pages/SendTransaction';
import { TransactionHistory } from './pages/TransactionHistory';
import { AdminPanel } from './pages/AdminPanel';
import {ErrorsHandling} from './components/ErrorsPage';
import Home from './pages/Home';
import './App.css';

    function ErrorOverlay() {
      const { error, clearError } = useError();
      if (!error) return null;
      return (
        <div style={{ position: 'fixed', zIndex: 1000, inset: 0, background: 'rgba(255,255,255,0.96)' }} onClick={clearError}>
          <ErrorsHandling errorCode={error.code} errorMessage={error.message} />
        </div>
      );
    }

function Navigation() {
  
  const { isAuthenticated, isAdmin, logout, user } = useAuth();
  console.log('Navigation render:', { isAuthenticated, isAdmin, user });
  if (!isAuthenticated) return null;

  return (
    <nav className="navbar">
      <div className="nav-brand">
        <Link to={isAdmin ? '/admin' : '/dashboard'}>🏦 God Bank</Link>
      </div>
      <div className="nav-links">
        {!isAdmin && (
          <>
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/transactions/send">Send Money</Link>
            <Link to="/history">History</Link>
            <Link to="/accounts/create">Create Account</Link>
          </>
        )}
        {isAdmin && <Link to="/admin">Admin Panel</Link>}
      </div>
      <div className="nav-user">
        <span className="user-name">{user?.username || 'User'}</span>
        <button onClick={logout} className="btn-logout">
          Logout
        </button>
      </div>
    </nav>
  );
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/admin-login" element={<AdminLogin />} />
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/accounts/create"
        element={
          <PrivateRoute>
            <CreateAccount />
          </PrivateRoute>
        }
      />
      <Route
        path="/transactions/send"
        element={
          <PrivateRoute>
            <SendTransaction />
          </PrivateRoute>
        }
      />
      <Route
        path="/history"
        element={
          <PrivateRoute>
            <TransactionHistory />
          </PrivateRoute>
        }
      />
      <Route
        path="/admin"
        element={
          <PrivateRoute adminOnly>
            <AdminPanel />
          </PrivateRoute>
        }
      />
      <Route path="*" element={<ErrorsHandling errorCode={404} />} />
    </Routes>
  );
}

function App() {
  const location = useLocation();
  const isHome = location.pathname === '/';
  return (
    <Provider store={store}>
      <AuthProvider>
        <div className="App">
          {!isHome && <Navigation />}
          <AppRoutes />
        </div>
      </AuthProvider>
    </Provider>
  );
}

export default App;
