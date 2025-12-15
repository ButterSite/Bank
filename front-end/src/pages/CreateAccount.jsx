import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BankAPI } from '../services/apiCalls';
import { useAuth } from '../contexts/AuthContext';
import './Dashboard.css';

export function CreateAccount() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currency, setCurrency] = useState('EUR');
  const [loading, setLoading] = useState(false);
  const [accountName, setAccountName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await BankAPI.createAccount(user?.userId, currency, accountName);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Create New Account</h1>
      </div>

      <div className="form-card">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Currency</label>
            <select value={currency} onChange={(e) => setCurrency(e.target.value)} disabled={loading}>
              <option value="EUR">EUR - Euro</option>
              <option value="USD">USD - US Dollar</option>
              <option value="GBP">GBP - British Pound</option>
              <option value="PLN">PLN - Polish Zloty</option>
            </select>
          </div>
            <div className='form-group'>
                <input onChange={(e) => setAccountName(e.target.value)} type="text" placeholder="Account Name"/>
            </div>

          {error && <div className="error-message">{error}</div>}
        
          <div className="button-group">
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Creating...' : 'Create Account'}
            </button>
            <button type="button" className="btn-outline" onClick={() => navigate('/dashboard')} disabled={loading}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
