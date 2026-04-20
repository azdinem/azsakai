import { useState, useEffect, Fragment } from 'react';
import { Plus, X } from './Icons';

function parseRows(str, columnCount) {
  if (!str?.trim()) return [Array(columnCount).fill('')];
  return str
    .split('\n')
    .filter(line => line.trim() && !line.startsWith('---'))
    .map(line => {
      const cells = line.split('|').map(s => s.trim());
      while (cells.length < columnCount) cells.push('');
      return cells.slice(0, columnCount);
    });
}

function serialize(rows) {
  return rows.map(row => row.join(' | ')).join('\n');
}

export default function TableEditor({ value, columns, onChange, onBlur, placeholder }) {
  const [rows, setRows] = useState(() => parseRows(value, columns.length));

  useEffect(() => {
    setRows(parseRows(value, columns.length));
  }, [value, columns.length]);

  const updateCell = (rowIndex, colIndex, cellValue) => {
    const next = rows.map((row, ri) =>
      ri === rowIndex ? row.map((c, ci) => (ci === colIndex ? cellValue : c)) : row
    );
    setRows(next);
    onChange(serialize(next));
  };

  const addRow = () => {
    const next = [...rows, Array(columns.length).fill('')];
    setRows(next);
    onChange(serialize(next));
  };

  const removeRow = (rowIndex) => {
    if (rows.length <= 1) return;
    const next = rows.filter((_, i) => i !== rowIndex);
    setRows(next);
    onChange(serialize(next));
  };

  return (
    <div style={{ border: '1px solid var(--color-text)' }}>
      <div
        className="grid gap-0"
        style={{
          gridTemplateColumns: `repeat(${columns.length}, 1fr) 2rem`,
        }}
      >
        {columns.map((col, i) => (
          <div
            key={i}
            className="font-mono uppercase px-3 py-2"
            style={{
              fontSize: 'var(--text-xs)',
              letterSpacing: '0.06em',
              color: 'var(--color-text-secondary)',
              borderBottom: '1px solid var(--color-text)',
              borderRight: i < columns.length - 1 ? '1px solid var(--color-border-light)' : 'none',
            }}
          >
            {col}
          </div>
        ))}
        <div style={{ borderBottom: '1px solid var(--color-text)' }} />

        {rows.map((row, ri) => (
          <Fragment key={ri}>
            {row.map((cell, ci) => (
              <div
                key={`${ri}-${ci}`}
                style={{
                  borderBottom: ri < rows.length - 1 ? '1px solid var(--color-border-light)' : 'none',
                  borderRight: ci < columns.length - 1 ? '1px solid var(--color-border-light)' : 'none',
                }}
              >
                <input
                  type="text"
                  value={cell}
                  onChange={(e) => updateCell(ri, ci, e.target.value)}
                  onBlur={onBlur}
                  placeholder={columns[ci]}
                  className="w-full px-3 py-2"
                  style={{
                    fontSize: 'var(--text-sm)',
                    border: 'none',
                    outline: 'none',
                    background: 'transparent',
                  }}
                />
              </div>
            ))}
            <div
              className="flex items-center justify-center"
              style={{
                borderBottom: ri < rows.length - 1 ? '1px solid var(--color-border-light)' : 'none',
              }}
            >
              {rows.length > 1 && (
                <button
                  onClick={() => removeRow(ri)}
                  className="p-1 transition-colors opacity-0 hover:opacity-100"
                  style={{ color: 'var(--color-text-tertiary)' }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-accent)')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-text-tertiary)')}
                  onFocus={(e) => (e.currentTarget.style.opacity = '1')}
                  type="button"
                >
                  <X size={12} />
                </button>
              )}
            </div>
          </Fragment>
        ))}
      </div>

      <button
        onClick={addRow}
        type="button"
        className="w-full flex items-center justify-center gap-2 py-2 font-mono uppercase transition-colors"
        style={{
          fontSize: 'var(--text-xs)',
          letterSpacing: '0.08em',
          color: 'var(--color-text-tertiary)',
          borderTop: '1px solid var(--color-text)',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-accent)')}
        onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-text-tertiary)')}
      >
        <Plus size={12} />
        <span>Ajouter une ligne</span>
      </button>
    </div>
  );
}
