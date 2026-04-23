import React, { useState } from 'react';
import { Product } from '../types';
import { updateQuantity, deleteProduct } from '../services/api';

interface Props {
  product: Product;
  onChange: (updated: Product) => void;
  onDelete: (id: string) => void;
}

function formatCurrency(value: number, currency: string) {
  return value.toLocaleString('es-ES', { style: 'currency', currency });
}

export default function ProductCard({ product, onChange, onDelete }: Props) {
  const [qty, setQty] = useState(product.quantity);
  const [saving, setSaving] = useState(false);

  const subtotal = product.price * qty;

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
    <div className="flex gap-4 p-4 bg-white dark:bg-[#1a1a1a] rounded-xl shadow-card">
      {/* Imagen */}
      <a href={product.url} target="_blank" rel="noopener noreferrer" className="shrink-0">
        <img
          src={product.image}
          alt={product.title}
          className="w-[72px] h-[72px] object-contain rounded-lg bg-[#f5f5f5] dark:bg-[#242424]"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              'https://placehold.co/72x72/f5f5f5/898989?text=–';
          }}
        />
      </a>

      {/* Contenido */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            {/* Badge fuente */}
            <span className={`inline-block text-[11px] font-semibold px-2 py-0.5 rounded-pill mb-1.5 ${
              product.source === 'amazon'
                ? 'bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400'
                : 'bg-red-50 dark:bg-red-950 text-red-600 dark:text-red-400'
            }`}>
              {product.source === 'amazon' ? 'Amazon' : 'AliExpress'}
            </span>
            {/* Título */}
            <a
              href={product.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-sm font-semibold text-[#242424] dark:text-white hover:opacity-60 transition-opacity line-clamp-2 leading-snug tracking-tight"
            >
              {product.title}
            </a>
          </div>

          {/* Botón eliminar */}
          <button
            onClick={handleDelete}
            className="shrink-0 w-7 h-7 flex items-center justify-center text-[#898989] hover:text-[#242424] dark:hover:text-white hover:bg-[#f5f5f5] dark:hover:bg-[#242424] rounded-lg transition-all text-lg leading-none"
            title="Eliminar"
          >
            ×
          </button>
        </div>

        {/* Precio + cantidad + subtotal */}
        <div className="mt-3 flex items-center gap-4 flex-wrap">
          <span className="text-base font-bold text-[#242424] dark:text-white tracking-tight">
            {formatCurrency(product.price, product.currency)}
          </span>

          <div className="flex items-center gap-1.5">
            <label className="text-xs text-[#898989]">Cant.</label>
            <input
              type="number"
              min={1}
              value={qty}
              onChange={handleQtyChange}
              onBlur={handleQtyBlur}
              disabled={saving}
              className="w-14 px-2 py-1 text-center bg-[#f5f5f5] dark:bg-[#242424] text-[#242424] dark:text-white rounded-md text-sm outline-none shadow-inset disabled:opacity-50"
            />
          </div>

          <div className="text-sm text-[#898989]">
            <span className="font-semibold text-[#242424] dark:text-white">
              {formatCurrency(subtotal, product.currency)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
