import React, { useState, useEffect } from 'react';
import { BankAPI } from '../services/apiCalls';
import './Admin.css';

export function AdminPanel() {
  const [filters, setFilters] = useState({
    userId: '',
    accountId: '',
    iban: '',
    action: '',
    startDate: '',
    endDate: '',
  });
  
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showCreateAdmin, setShowCreateAdmin] = useState(false);
  const [newAdmin, setNewAdmin] = useState({ username: '', password: '' });
  const [createError, setCreateError] = useState('');
  const [createSuccess, setCreateSuccess] = useState('');

  const loadLogs = async () => {
    setLoading(true);
    setError('');
    try {
      const cleanFilters = Object.fromEntries(Object.entries(filters).filter(([_, v]) => v !== ''));
      const data = await BankAPI.getAdminLogs(cleanFilters);
      setLogs(data.data || []);
      console.log('Fetched logs:', data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLogs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFilterChange = (field) => (e) => {
    setFilters({ ...filters, [field]: e.target.value });
  };

  const handleCreateAdmin = async (e) => {
    e.preventDefault();
    setCreateError('');
    setCreateSuccess('');
    try {
      await BankAPI.createAdmin(newAdmin.username, newAdmin.password);
      setCreateSuccess('Admin created successfully');
      setNewAdmin({ username: '', password: '' });
      setTimeout(() => setShowCreateAdmin(false), 2000);
    } catch (err) {
      setCreateError(err.message);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Admin Panel - Audit Logs</h1>
        <button className="btn-secondary" onClick={() => setShowCreateAdmin(!showCreateAdmin)}>
          {showCreateAdmin ? 'Hide' : 'Create Admin'}
        </button>
      </div>

      {showCreateAdmin && (
        <div className="form-card">
          <h3>Create New Admin</h3>
          <form onSubmit={handleCreateAdmin}>
            <div className="form-row">
              <div className="form-group">
                <label>Username</label>
                <input type="text" value={newAdmin.username} onChange={(e) => setNewAdmin({ ...newAdmin, username: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Password</label>
                <input type="password" value={newAdmin.password} onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })} required />
              </div>
              <button type="submit" className="btn-primary">
                Create
              </button>
            </div>
            {createError && <div className="error-message">{createError}</div>}
            {createSuccess && <div className="success-message">{createSuccess}</div>}
          </form>
        </div>
      )}

      <div className="filter-card">
        <h3>Filters</h3>
        <div className="filter-grid">
          <div className="form-group">
            <label>User ID</label>
            <input type="text" value={filters.userId} onChange={handleFilterChange('userId')} placeholder="64a7b2f5..." />
          </div>
          <div className="form-group">
            <label>Account ID</label>
            <input type="text" value={filters.accountId} onChange={handleFilterChange('accountId')} placeholder="64a7b2f5..." />
          </div>
          <div className="form-group">
            <label>IBAN</label>
            <input type="text" value={filters.iban} onChange={handleFilterChange('iban')} placeholder="EX141140..." />
          </div>
          <div className="form-group">
            <label>Action</label>
            <select value={filters.action} onChange={handleFilterChange('action')}>
              <option value="">All</option>
              <option value="deposit">Deposit</option>
              <option value="withdrawal">Withdrawal</option>
              <option value="transfer">Transfer</option>
            </select>
          </div>
          <div className="form-group">
            <label>Start Date</label>
            <input type="datetime-local" value={filters.startDate} onChange={handleFilterChange('startDate')} />
          </div>
          <div className="form-group">
            <label>End Date</label>
            <input type="datetime-local" value={filters.endDate} onChange={handleFilterChange('endDate')} />
          </div>
        </div>
        <button onClick={loadLogs} className="btn-primary" disabled={loading}>
          {loading ? 'Loading...' : 'Apply Filters'}
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {logs.length > 0 ? (
        <div className="table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>Action</th>
                <th>IBAN</th>
                <th>Before</th>
                <th>After</th>
                <th>Difference</th>
                <th>ID</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log._id}>
                  <td>{new Date(log.timestamp).toLocaleString()}</td>
                  <td>
                    <span className={`action-badge action-${log.action}`}>{log.action}</span>
                  </td>
                  <td className="iban-cell">{log.iban}</td>
                  <td className="amount-cell">{log.beforeBalance?.toFixed(2)}</td>
                  <td className="amount-cell">{log.afterBalance?.toFixed(2)}</td>
                  <td className={`amount-cell ${log.afterBalance - log.beforeBalance >= 0 ? 'positive' : 'negative'}`}>
                    {(log.afterBalance - log.beforeBalance).toFixed(2)}
                  </td>
                  <td className="id-cell">
                    {<b>`UserID: ${log.userId}`</b>}
                    <br />
                    {<b>`AccountID: ${log.accountId}`</b>}
                  </td>
                  <td>{log.description || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        !loading && <div className="empty-state">No logs found</div>
      )}
    </div>
  );
}
