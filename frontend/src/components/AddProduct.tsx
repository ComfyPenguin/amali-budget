import React, { useState } from 'react';
import { scrapeUrl, saveProduct } from '../services/api';
import { Product } from '../types';

interface Props {
  onAdd: (product: Product) => void;
}

export default function AddProduct({ onAdd }: Props) {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    const trimmed = url.trim();
    if (!trimmed) return;
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

  return (
    <div className="p-4 rounded-xl bg-white dark:bg-[#1a1a1a] shadow-card">
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Pega una URL de Amazon o AliExpress..."
          disabled={loading}
          className="w-full px-4 py-2.5 bg-[#f5f5f5] dark:bg-[#242424] text-[#242424] dark:text-white placeholder-[#898989] rounded-lg text-sm outline-none shadow-inset disabled:opacity-50"
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
          ) : (
            'Añadir producto'
          )}
        </button>
      </form>
      {error && (
        <p className="mt-2 text-xs text-[#898989]">{error}</p>
      )}
    </div>
  );
}
