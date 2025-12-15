import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './Auth.css';

export function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    firstName: '',
    lastName: '',
    telephoneNumber: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const { confirmPassword, ...registerData } = formData;
      await register(registerData);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field) => (e) => {
    setFormData({ ...formData, [field]: e.target.value });
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>Register</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Username *</label>
            <input type="text" value={formData.username} onChange={handleChange('username')} required disabled={loading} />
          </div>

          <div className="form-group">
            <label>Email *</label>
            <input type="email" value={formData.email} onChange={handleChange('email')} required disabled={loading} />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>First Name *</label>
              <input type="text" value={formData.firstName} onChange={handleChange('firstName')} required disabled={loading} />
            </div>

            <div className="form-group">
              <label>Last Name *</label>
              <input type="text" value={formData.lastName} onChange={handleChange('lastName')} required disabled={loading} />
            </div>
          </div>

          <div className="form-group">
            <label>Phone Number *</label>
            <input type="tel" value={formData.telephoneNumber} onChange={handleChange('telephoneNumber')} required disabled={loading} placeholder="+123456789" />
          </div>

          <div className="form-group">
            <label>Password *</label>
            <input type="password" value={formData.password} onChange={handleChange('password')} required disabled={loading} />
          </div>

          <div className="form-group">
            <label>Confirm Password *</label>
            <input type="password" value={formData.confirmPassword} onChange={handleChange('confirmPassword')} required disabled={loading} />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>

        <div className="auth-links">
          <Link to="/login">Already have an account? Login</Link>
        </div>
      </div>
    </div>
  );
}
