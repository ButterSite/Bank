import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { BankAPI } from '../services/apiCalls';
import { fetchAccounts } from '../store/accountsSlice';
import { fetchRecipients } from '../store/recipientsSlice';
import { SelectCardList } from '../components/SelectCardList';
import { formatIbanToRead } from './Dashboard';
import './Transactions.css';

export function SendTransaction() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const dispatch = useDispatch();
  const accounts = useSelector((state) => state.accounts.items);
  const recipients = useSelector((state) => state.recipients.items);

  useEffect(() => {
    dispatch(fetchAccounts());
    dispatch(fetchRecipients());
  }, [dispatch]);

  const [formData, setFormData] = useState({
    fromIban: searchParams.get('from') || '',
    toIban: searchParams.get('to') || ``,
    recipientName: searchParams.get('recipientName') || '',
    amount: '',
    currency: 'EUR',
    description: '',
    saveRecipients: true,
  });





  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  console.log(error)
  const [success, setSuccess] = useState('');

  const handleChange = (field) => (e) => {
    setFormData({ ...formData, [field]: e.target.value });
  };

  const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');
        try {
            formData.toIban = formData.toIban.replace(/\s+/g, '').toUpperCase();

            console.log(formData)
            const data = await BankAPI.sendTransaction({
            ...formData,
            amount: parseFloat(formData.amount),
        });
        setSuccess(`Transaction successful! ID: ${data.transactionId}`);
        setTimeout(() => navigate('/dashboard'), 2000);
        } catch (err) {
        setError(err.message);
        } finally {
        setLoading(false);
        }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Send Transaction</h1>
      </div>

      <div className="form-card">
        <form onSubmit={handleSubmit}>
          {accounts && accounts.length > 0 ? (
            <div className="form-group">
              <label>From Account *</label>
              <SelectCardList
                items={accounts}
                selectedId={formData.fromIban}
                onSelect={account => setFormData({ ...formData, fromIban: account.accountNumber, currency: account.currency })}
                loading={loading}
                renderItem={(account, selected) => (
                  <>
                    <div style={{ fontWeight: 700, fontSize: 17, color: '#333', marginBottom: 4 }}>{account.name}</div>
                    <div style={{ fontWeight: 500, fontSize: 15, color: '#666', marginBottom: 4 }}>IBAN: <b style={{ color: "#333" }}>{formatIbanToRead(account.accountNumber)}</b></div>
        
                    <div style={{ fontSize: 16, color: '#666', marginBottom: 2 }}>
                      Balance: <span style={{ fontWeight: 500, color: '#000' }}>{account.balance?.toFixed(2) || '0.00'} {account.currency}</span>
                    </div>
                  </>
                )}
              />
            </div>
          ) : (
            <div>No accounts available</div>
          )}


          <div className='form-group'>
            <label>Recipient Data *</label>
            <SelectCardList
              items={recipients}
              selectedId={formData.toIban}
              onSelect={recipient => setFormData({ ...formData, toIban: recipient.iban })}
              loading={loading}
              renderItem={(recipient, selected) => (
                <>
                  <div style={{ fontWeight: 600, fontSize: 15, color: '#333', marginBottom: 4 }}>{recipient.recipientName}</div>
                  <div style={{ fontSize: 13, color: '#666', marginBottom: 2 }}>
                    IBAN: <span style={{ fontWeight: 500 }}>{formatIbanToRead(recipient.iban)}</span>
                  </div>
                  <div style={{ fontSize: 13, color: '#888' }}>Currency {recipient.currency}</div>
                </>
              )}
            />
            <input type="text" value={formatIbanToRead(formData.toIban)} onChange={handleChange('toIban')} required disabled={loading} placeholder="EX14114020040000300201311111" />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Amount *</label>
              <input type="number" step="0.01" min="0.01" value={formData.amount} onChange={handleChange('amount')} required disabled={loading} placeholder="100.50" />
            </div>

            <div className="form-group">
              <label>Currency *</label>
              <select value={formData.currency} onChange={handleChange('currency')} disabled={loading}>
                <option value="EUR">EUR</option>
                <option value="USD">USD</option>
                <option value="GBP">GBP</option>
                <option value="PLN">PLN</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Description (optional)</label>
            <textarea value={formData.description} onChange={handleChange('description')} disabled={loading} rows="3" placeholder="Payment for services" />
          </div>

          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}

          <div className="button-group">
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Sending...' : 'Send Transaction'}
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
