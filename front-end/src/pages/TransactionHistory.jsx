import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { BankAPI } from '../services/apiCalls';
import { SelectCardList } from '../components/SelectCardList';
import { useSelector, useDispatch } from 'react-redux';
import { fetchAccounts } from '../store/accountsSlice';
import { formatIbanToRead } from './Dashboard';
import './Transactions.css';

export function TransactionHistory() {
    const [searchParams] = useSearchParams();
    const startMonth = new Date(); startMonth.setMonth(startMonth.getMonth());
    const endMonth = new Date(); endMonth.setMonth(endMonth.getMonth() + 1);
    const [filters, setFilters] = useState({
        iban: searchParams.get('iban') || '',
        startDate: searchParams.get('startDate') || startMonth.toISOString().split('T')[0],
        endDate: searchParams.get('endDate') || endMonth.toISOString().split('T')[0],
    });
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const dispatch = useDispatch();
    const accounts = useSelector((state) => state.accounts.items);  

  const loadHistory = async () => {
    if (!filters.iban || !filters.startDate || !filters.endDate) {
      setError('Please provide IBAN and date range');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const data = await BankAPI.getHistory(filters.iban, filters.startDate, filters.endDate);
      setTransactions(data.transactions || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (filters.iban && filters.startDate && filters.endDate) {
      loadHistory();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (field) => (e) => {
    setFilters({ ...filters, [field]: e.target.value });
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Transaction History</h1>
      </div>
      <SelectCardList
        label="Select Account IBAN"
        items={accounts}
        selectedIban={filters.iban}
        onSelect={(account) => setFilters({ ...filters, iban: account.accountNumber })}
        renderItem={(account) => (
          <>
            <div style={{ fontWeight: 500, marginBottom: 4 }}>{account.name || 'Account'}</div>
            <div style={{ fontSize: 13, color: '#666', marginBottom: 2 }}>IBAN: {formatIbanToRead(account.accountNumber)}</div>
            <div style={{ fontSize: 13, color: '#666' }}>
              Balance: <span style={{ fontWeight: 500 }}><b style={{color: '#000'}}>{account.balance?.toFixed(2) || '0.00'} {account.currency}</b></span>
            </div>
          </>
        )}
      />

      <div className="filter-card">
        <div className="form-row">

          <div className="form-group">
            <label>Start Date</label>
            <input type="date" value={filters.startDate} onChange={handleChange('startDate')} />
          </div>

          <div className="form-group">
            <label>End Date</label>
            <input type="date" value={filters.endDate} onChange={handleChange('endDate')} />
          </div>

          <button onClick={loadHistory} className="btn-primary" disabled={loading}>
            {loading ? 'Loading...' : 'Search'}
          </button>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      {transactions.length > 0 ? (
        <div className="table-container">
          <table className="transactions-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>From</th>
                <th>To</th>
                <th>Amount</th>
                <th>Description</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx) => (
                <tr key={tx.transactionId}>
                  <td>{new Date(tx.createdAt).toLocaleDateString()}</td>
                  <td className="iban-cell">{tx.fromIban}</td>
                  <td className="iban-cell">{tx.toIban}</td>
                  <td className="amount-cell">
                    {tx.amount} {tx.currency}
                  </td>
                  <td>{tx.description || '-'}</td>
                  <td>
                    <span className={`status-badge status-${tx.status}`}>{tx.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        !loading && <div className="empty-state">No transactions found for this period</div>
      )}
    </div>
  );
}
