import React, { useState } from 'react';
import { Product } from '../types';
import { updateQuantity, deleteProduct } from '../services/api';

interface Props {
  product: Product;
  onChange: (updated: Product) => void;
  onDelete: (id: string) => void;
}

const SOURCE_BADGE: Record<Product['source'], { label: string; cls: string }> = {
  amazon: { label: 'Amazon', cls: 'bg-orange-100 text-orange-700' },
  aliexpress: { label: 'AliExpress', cls: 'bg-red-100 text-red-700' },
};

function formatCurrency(value: number, currency: string) {
  return value.toLocaleString('es-ES', { style: 'currency', currency });
}

export default function ProductCard({ product, onChange, onDelete }: Props) {
  const [qty, setQty] = useState(product.quantity);
  const [saving, setSaving] = useState(false);

  const subtotal = product.price * qty;
  const badge = SOURCE_BADGE[product.source];

  function handleQtyChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = Math.max(1, parseInt(e.target.value) || 1);
    setQty(val);
    onChange({ ...product, quantity: val });
  }

  async function handleQtyBlur() {
    if (qty === product.quantity) return;
    setSaving(true);
    try {
      const updated = await updateQuantity(product.id, qty);
      onChange(updated);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    await deleteProduct(product.id);
    onDelete(product.id);
  }

  return (
    <div className="flex gap-4 p-4 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
      <a href={product.url} target="_blank" rel="noopener noreferrer" className="shrink-0">
        <img
          src={product.image}
          alt={product.title}
          className="w-24 h-24 object-contain rounded-lg bg-gray-50 border border-gray-100"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              'https://placehold.co/96x96/f3f4f6/9ca3af?text=Sin+imagen';
          }}
        />
      </a>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <span className={`inline-block text-xs font-medium px-2 py-0.5 rounded-full mb-1 ${badge.cls}`}>
              {badge.label}
            </span>
            <a
              href={product.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-sm font-semibold text-gray-900 hover:text-blue-600 line-clamp-2 leading-snug"
            >
              {product.title}
            </a>
          </div>
          <button
            onClick={handleDelete}
            className="shrink-0 w-7 h-7 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors text-xl leading-none"
            title="Eliminar"
          >
            ×
          </button>
        </div>

        <div className="mt-3 flex items-center gap-4 flex-wrap">
          <span className="text-base font-bold text-gray-800">
            {formatCurrency(product.price, product.currency)}
          </span>

          <div className="flex items-center gap-1.5">
            <label className="text-xs text-gray-500">Cant.:</label>
            <input
              type="number"
              min={1}
              value={qty}
              onChange={handleQtyChange}
              onBlur={handleQtyBlur}
              disabled={saving}
              className="w-16 px-2 py-1 text-center border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-50"
            />
          </div>

          <div className="text-sm text-gray-500">
            Subtotal:{' '}
            <span className="font-semibold text-gray-900">
              {formatCurrency(subtotal, product.currency)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
