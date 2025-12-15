import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchAccounts } from '../store/accountsSlice';
import { fetchRecipients } from '../store/recipientsSlice';
import './Dashboard.css';
import { FastTransfer } from '../components/FastTransfer';
export const formatIban = (iban) => iban.replace(/\s+/g, '').toUpperCase();
export const formatIbanToRead = (iban) => {
    if (!iban) return '';
    const cleanIban = formatIban(iban) || '' ;
    return cleanIban.match(/.{1,4}/g).join(' ') || '';
  }

export function Dashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const { items: accounts, loading, error } = useSelector((state) => state.accounts);
  const { items: recipients, loading: recipientsLoading, error: recipientsError } = useSelector((state) => state.recipients);
  const [quickTransferIdx, setQuickTransferIdx] = useState(null);

  useEffect(() => {
    dispatch(fetchAccounts());
    dispatch(fetchRecipients());
  }, [dispatch]);

  const handleSendTransaction = (recipient) => {
    console.log(recipient)
    navigate(`/transactions/send?to=${recipient.iban}&recipientName=${recipient.name || recipient.recipientName || ''}`);
  };

  if (loading) return <div className="page-container"><p>Loading accounts...</p></div>;
  if (error) return <div className="page-container"><p className="error-text">Error: {error}</p></div>;

  const totalBalance = accounts?.reduce((sum, acc) => sum + (acc.balance || 0), 0) || 0;

  const handleFastTransfer = (idx) => {
    setQuickTransferIdx(idx);
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Welcome back!</h1>
        <Link to="/accounts/create" className="btn-secondary">
          + Create Account
        </Link>
      </div>

      <div className="summary-card">
        <h3>Total Balance</h3>
        <div className="balance-display">
          {totalBalance.toFixed(2)} <span className="currency">EUR</span>
        </div>
        <p className="account-count">{accounts?.length || 0} account(s)</p>
      </div>
  <h2 className="dashboard-accounts-title">Accounts</h2>
      <div className="accounts-grid">
        {accounts?.map((account) => {
          const handleCopy = async () => {
            try {
              await navigator.clipboard.writeText(account.accountNumber);
              setCopied(true);
              setTimeout(() => setCopied(false), 1200);
            } catch (err) {}
          };
          return (
            <div key={account._id} className="account-card">
              <div className="account-header">
                <span className="account-label">Name: {account.name}</span>
              </div>
              <div className="account-iban-row">
                <span>IBAN: <span onClick={handleCopy} className='iban-copy'>{formatIbanToRead(account.accountNumber)}</span></span>
                <button
                  type="button"
                  className={copied ? 'iban-copy-btn copied' : 'iban-copy-btn'}
                  onClick={handleCopy}
                  onMouseLeave={() => setCopied(false)}
                  tabIndex={0}
                  aria-label={copied ? 'IBAN copied' : 'Copy IBAN'}
                >
                  <svg className="iban-copy-icon" width="25" height="25" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="5" y="5" width="10" height="12" rx="2" stroke="currentColor" strokeWidth="1.3" fill="none"/>
                    <rect x="8" y="3" width="7" height="3" rx="1" stroke="currentColor" strokeWidth="1.1" fill="none"/>
                  </svg>
                  <span className={copied ? 'iban-copy-label copied' : 'iban-copy-label'}>
                    {copied ? 'Copied!' : 'Copy'}
                  </span>
                </button>
              </div>
              <div className='account-iban'>
                Currency: <b>{account.currency}</b>
              </div>
              <div className="account-balance">
                Ballance: {account.balance?.toFixed(2) || '0.00'} {account.currency}
              </div>
           
              <div className="account-actions">
                <Link to={`/send?from=${account.accountNumber}`} className="btn-small">
                  Send
                </Link>
                <Link to={`/history?iban=${account.accountNumber}`} className="btn-small btn-outline">
                  History
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {(!accounts || accounts.length === 0) && (
        <div className="empty-state">
          <p>No accounts found</p>
          <Link to="/accounts/create" className="btn-primary">
            Create Your First Account
          </Link>
        </div>
      )}

      <div className="recipients-section">
        <h2>Saved Recipients</h2>
        {recipientsLoading ? (
          <p>Loading recipients...</p>
        ) : recipientsError ? (
          <p className="error-text">Error: {recipientsError}</p>
        ) : recipients && recipients.length > 0 ? (
          <div className="recipients-grid">
            {recipients.map((r, idx) => (
              <div className="recipient-card" key={r.iban || idx}>
                <div className="recipient-header">
                  <span className="recipient-label">Recipient</span>
                </div>
                <div className="recipient-name">{r.name || r.recipientName || '-'}</div>
                <div className="recipient-iban">{formatIbanToRead(r.iban)}</div>
                <button className="btn-small" onClick={() => handleSendTransaction(r)}>Send</button>
                <button className="btn-small" onClick={() => handleFastTransfer(idx)}>Fast Send</button>
              </div>
            ))}

            {/* Modal for FastTransfer */}
            {quickTransferIdx !== null && recipients[quickTransferIdx] && (
              <div className="fast-transfer-modal-overlay" onClick={() => setQuickTransferIdx(null)}>
                <div className="fast-transfer-modal" onClick={e => e.stopPropagation()}>
                  <FastTransfer
                    props={{
                      fromIban: '',
                      toIban: recipients[quickTransferIdx].iban,
                      recipientName: recipients[quickTransferIdx].name || recipients[quickTransferIdx].recipientName || '',
                      accounts: accounts || [],
                      onCancel: () => setQuickTransferIdx(null)
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        ) : (
          <p>No saved recipients.</p>
        )}
      </div>
    </div>
  );
}
