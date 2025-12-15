import React, { useState } from 'react';

// Uniwersalny komponent do wyboru z listy kart
// props:
// - items: tablica obiektów
// - selectedId: id wybranego elementu
// - onSelect: funkcja (item) => void
// - renderItem: funkcja (item, selected) => JSX
// - loading: bool
// - label: string (opcjonalny nagłówek sekcji)

export function SelectCardList({ items, selectedId, onSelect, renderItem, loading, label }) {
  const [copiedIban, setCopiedIban] = useState(null);
  return (
    <div className="accounts-select-list">
      {label && <div style={{ fontWeight: 600, marginBottom: 8 }}>{label}</div>}
      {items.map((item) => {
        const id = item.iban || item.id || item._id;
        const selected = selectedId === id;
        return (
          <div
            key={id}
            className={`account-select-item${selected ? ' selected' : ''}`}
            tabIndex={0}
            role="button"
            aria-pressed={selected}
            onClick={() => !loading && onSelect(item)}
            onKeyDown={e => {
              if ((e.key === 'Enter' || e.key === ' ') && !loading) {
                onSelect(item);
              }
            }}
          >
            {renderItem ? renderItem(item, selected) : (
              <div>{JSON.stringify(item)}</div>
            )}
          </div>
        );
      })}
    </div>
  );
}
