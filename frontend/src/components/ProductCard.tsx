import React, { useState } from 'react';
import { Product } from '../types';
import { updateQuantity, deleteProduct } from '../services/api';

interface Props {
  product: Product;
  onChange: (updated: Product) => void;
  onDelete: (id: string) => void;
  highlighted?: boolean;
}

function formatCurrency(value: number, currency: string) {
  return value.toLocaleString('es-ES', { style: 'currency', currency });
}

export default function ProductCard({ product, onChange, onDelete, highlighted }: Props) {
  const [qty, setQty] = useState(product.quantity);
  const [saving, setSaving] = useState(false);
  const committedQty = React.useRef(product.quantity);

  const subtotal = product.price * qty;

  function handleQtyChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = Math.max(0, parseInt(e.target.value) || 0);
    setQty(val);
    onChange({ ...product, quantity: val });
  }

  async function handleQtyBlur() {
    if (qty === committedQty.current) return;
    setSaving(true);
    try {
      const updated = await updateQuantity(product.id, qty);
      committedQty.current = updated.quantity;
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
    <div id={product.id} className={`flex flex-col bg-white dark:bg-[#1a1a1a] rounded-xl shadow-card overflow-hidden${highlighted ? ' card-highlighted' : ''}`}>
      {/* Imagen */}
      <a href={product.url} target="_blank" rel="noopener noreferrer" className="block">
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-36 object-contain bg-[#f5f5f5] dark:bg-[#242424]"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              'https://placehold.co/400x144/f5f5f5/898989?text=–';
          }}
        />
      </a>

      {/* Contenido */}
      <div className="flex flex-col flex-1 p-3.5 gap-3">
        {/* Badge + título + eliminar */}
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <span className={`inline-block text-[11px] font-semibold px-2 py-0.5 rounded-pill mb-1.5 ${
              product.source === 'amazon'
                ? 'bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400'
                : product.source === 'aliexpress'
                ? 'bg-red-50 dark:bg-red-950 text-red-600 dark:text-red-400'
                : product.source === 'ikea'
                ? 'bg-yellow-50 dark:bg-yellow-950 text-yellow-600 dark:text-yellow-400'
                : 'bg-[#f5f5f5] dark:bg-[#242424] text-[#898989]'
            }`}>
              {product.source === 'amazon' ? 'Amazon' : product.source === 'aliexpress' ? 'AliExpress' : product.source === 'ikea' ? 'IKEA' : 'Manual'}
            </span>
            <a
              href={product.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-sm font-semibold text-[#242424] dark:text-white hover:opacity-60 transition-opacity line-clamp-2 leading-snug tracking-tight"
            >
              {product.title}
            </a>
          </div>
          <button
            onClick={handleDelete}
            className="shrink-0 w-7 h-7 flex items-center justify-center text-[#898989] hover:text-[#242424] dark:hover:text-white hover:bg-[#f5f5f5] dark:hover:bg-[#242424] rounded-lg transition-all text-lg leading-none"
            title="Eliminar"
          >
            ×
          </button>
        </div>

        {/* Precio + cantidad + subtotal */}
        <div className="flex items-center justify-between gap-2 pt-2 border-t border-[#f5f5f5] dark:border-[#242424]">
          <div>
            <p className="text-[11px] text-[#898989]">Precio</p>
            <p className="text-sm font-bold text-[#242424] dark:text-white tracking-tight">
              {formatCurrency(product.price, product.currency)}
            </p>
          </div>

          <div className="flex items-center gap-1.5">
            <label className="text-[11px] text-[#898989]">Cant.</label>
            <input
              type="number"
              min={0}
              value={qty}
              onChange={handleQtyChange}
              onBlur={handleQtyBlur}
              disabled={saving}
              className="w-12 px-2 py-1 text-center bg-[#f5f5f5] dark:bg-[#242424] text-[#242424] dark:text-white rounded-md text-sm outline-none shadow-inset disabled:opacity-50"
            />
          </div>

          <div>
            <p className="text-[11px] text-[#898989]">Subtotal</p>
            <p className="text-sm font-bold text-[#242424] dark:text-white tracking-tight">
              {formatCurrency(subtotal, product.currency)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
