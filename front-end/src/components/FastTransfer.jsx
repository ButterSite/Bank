import React, { useState } from 'react';

export const FastTransfer = ({props}) => {
  const { fromIban, toIban, recipientName, accounts = [], onCancel } = props;
  const [selectedIban, setSelectedIban] = useState(fromIban || (accounts[0]?.accountNumber || ''));
  const [formData, setFormData] = useState({
    amount: '',
    description: '',
  });
  const [sending, setSending] = useState(false);
  // TODO: Integrate API call and error handling

  const handleAccountSelect = (account) => {
    setSelectedIban(account.accountNumber);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSend = (e) => {
    e.preventDefault();
    setSending(true);
    // TODO: Call API to send transfer
    setTimeout(() => {
      setSending(false);
      if (onCancel) onCancel();
    }, 1200);
  };

  return (
    <div className="fast-transfer-form">
      <h3>Quick Transfer to {recipientName}</h3>
      <div className="horizontal-account-slider">
        {accounts.map((acc) => (
          <div
            key={acc._id}
            className={`account-slider-item${selectedIban === acc.accountNumber ? ' selected' : ''}`}
            onClick={() => handleAccountSelect(acc)}
            tabIndex={0}
            role="button"
            aria-pressed={selectedIban === acc.accountNumber}
          >
            <div className="slider-iban">{acc.name}</div>
            <div className="slider-balance">{acc.balance?.toFixed(2)} {acc.currency}</div>
          </div>
        ))}
      </div>
      <form onSubmit={handleSend} className="fast-transfer-fields">
        <div>
          <label>Amount</label>
          <input
            type="number"
            name="amount"
            min="0.01"
            step="0.01"
            value={formData.amount}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Description</label>
          <input
            type="text"
            name="description"
            value={formData.description}
            onChange={handleChange}
            maxLength={100}
          />
        </div>
        <div className="fast-transfer-actions">
          <button type="submit" className="btn-small btn-primary" disabled={sending}>
            {sending ? 'Sending...' : 'Send'}
          </button>
          <button type="button" className="btn-small btn-outline" onClick={onCancel} disabled={sending}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}