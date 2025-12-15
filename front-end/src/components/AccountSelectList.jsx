import React from 'react';


export function AccountSelectList({ accounts, selectedIban, onSelect, loading }) {
  return (
    <div className="accounts-select-list">
      {accounts.map((account) => {
        const selected = selectedIban === account.iban;
        return (
          <div
            key={account._id}
            className={`account-select-item${selected ? ' selected' : ''}`}
            tabIndex={0}
            role="button"
            aria-pressed={selected}
            onClick={() => !loading && onSelect(account)}
            onKeyDown={e => {
              if ((e.key === 'Enter' || e.key === ' ') && !loading) {
                onSelect(account);
              }
            }}
          >
            <div style={{ fontWeight: 600, fontSize: 15, color: '#333', marginBottom: 4 }}>
              {account.iban}
            </div>
            <div style={{ fontSize: 13, color: '#666', marginBottom: 2 }}>
              Balance: <span style={{ fontWeight: 500 }}>{account.balance?.toFixed(2) || '0.00'} {account.currency}</span>
            </div>
            <div style={{ fontSize: 13, color: '#888' }}>
              {account.currency}
            </div>
          </div>
        );
      })}
    </div>
  );
}
