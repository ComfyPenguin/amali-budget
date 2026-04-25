import React, { useState } from 'react';
import { scrapeUrl, saveProduct } from '../services/api';
import { Product } from '../types';

interface Props {
  products: Product[];
  onAdd: (product: Product) => void;
  onDuplicate: (id: string) => void;
}

const CURRENCIES = ['EUR', 'USD', 'GBP', 'JPY', 'MXN'];

export default function AddProduct({ products, onAdd, onDuplicate }: Props) {
  const [mode, setMode] = useState<'url' | 'manual'>('url');

  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [currency, setCurrency] = useState('EUR');
  const [productUrl, setProductUrl] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  function switchMode(next: 'url' | 'manual') {
    setError('');
    setMode(next);
  }

  async function handleUrlSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    const trimmed = url.trim();
    if (!trimmed) return;

    const existing = products.find((p) => p.url === trimmed);
    if (existing) {
      setError('Este producto ya está en tu lista.');
      setUrl('');
      onDuplicate(existing.id);
      return;
    }

    setLoading(true);
    try {
      const scraped = await scrapeUrl(trimmed);
      const saved = await saveProduct(scraped);
      onAdd(saved);
      setUrl('');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error desconocido.');
    } finally {
      setLoading(false);
    }
  }

  async function handleManualSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    const parsedPrice = parseFloat(price.replace(',', '.'));
    if (!title.trim() || isNaN(parsedPrice)) return;

    setLoading(true);
    try {
      const saved = await saveProduct({
        title: title.trim(),
        price: parsedPrice,
        currency,
        url: productUrl.trim() || '',
        image: imageUrl.trim() || '',
        source: 'manual',
      });
      onAdd(saved);
      setTitle(''); setPrice(''); setProductUrl(''); setImageUrl('');
      setMode('url');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error desconocido.');
    } finally {
      setLoading(false);
    }
  }

  const inputCls = 'w-full px-3 py-2 bg-[#f5f5f5] dark:bg-[#242424] text-[#242424] dark:text-white placeholder-[#898989] rounded-lg text-sm outline-none shadow-inset disabled:opacity-50';

  return (
    <div className="p-4 rounded-xl bg-white dark:bg-[#1a1a1a] shadow-card">
      {mode === 'url' ? (
        <form onSubmit={handleUrlSubmit} className="flex flex-col gap-2">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Pega una URL de Amazon, AliExpress o IKEA..."
            disabled={loading}
            className={inputCls}
          />
          <button
            type="submit"
            disabled={loading || !url.trim()}
            className="w-full py-2.5 bg-[#242424] dark:bg-white text-white dark:text-[#242424] rounded-lg text-sm font-semibold hover:opacity-70 transition-opacity disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                Scrapeando...
              </>
            ) : 'Añadir producto'}
          </button>
          <button
            type="button"
            onClick={() => switchMode('manual')}
            className="text-xs text-[#898989] hover:text-[#242424] dark:hover:text-white transition-colors text-center"
          >
            Añadir manualmente
          </button>
        </form>
      ) : (
        <form onSubmit={handleManualSubmit} className="flex flex-col gap-2">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Nombre del producto *"
            disabled={loading}
            className={inputCls}
          />
          <div className="flex gap-2">
            <input
              type="text"
              inputMode="decimal"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Precio *"
              disabled={loading}
              className={`${inputCls} flex-1`}
            />
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              disabled={loading}
              className="px-2 py-2 bg-[#f5f5f5] dark:bg-[#242424] text-[#242424] dark:text-white rounded-lg text-sm outline-none shadow-inset disabled:opacity-50"
            >
              {CURRENCIES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
          <input
            type="text"
            value={productUrl}
            onChange={(e) => setProductUrl(e.target.value)}
            placeholder="URL (opcional)"
            disabled={loading}
            className={inputCls}
          />
          <input
            type="text"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="URL de imagen (opcional)"
            disabled={loading}
            className={inputCls}
          />
          <button
            type="submit"
            disabled={loading || !title.trim() || !price.trim()}
            className="w-full py-2.5 bg-[#242424] dark:bg-white text-white dark:text-[#242424] rounded-lg text-sm font-semibold hover:opacity-70 transition-opacity disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                Guardando...
              </>
            ) : 'Añadir producto'}
          </button>
          <button
            type="button"
            onClick={() => switchMode('url')}
            className="text-xs text-[#898989] hover:text-[#242424] dark:hover:text-white transition-colors text-center"
          >
            ← Volver a URL
          </button>
        </form>
      )}
      {error && <p className="mt-2 text-xs text-[#898989]">{error}</p>}
    </div>
  );
}
