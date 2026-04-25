import { Product, ScrapedProduct } from '../types';

const BASE = '/api';

export async function scrapeUrl(url: string): Promise<ScrapedProduct> {
  const res = await fetch(`${BASE}/scrape`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Error al scrapear');
  return data as ScrapedProduct;
}

export async function getProducts(): Promise<Product[]> {
  const res = await fetch(`${BASE}/products`);
  return res.json() as Promise<Product[]>;
}

export async function saveProduct(product: ScrapedProduct): Promise<Product> {
  const res = await fetch(`${BASE}/products`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(product),
  });
  return res.json() as Promise<Product>;
}

export async function updateQuantity(id: string, quantity: number): Promise<Product> {
  const res = await fetch(`${BASE}/products/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ quantity }),
  });
  return res.json() as Promise<Product>;
}

export async function deleteProduct(id: string): Promise<void> {
  await fetch(`${BASE}/products/${id}`, { method: 'DELETE' });
}

export async function refreshProducts(): Promise<Product[]> {
  const res = await fetch(`${BASE}/products/refresh`, { method: 'POST' });
  return res.json() as Promise<Product[]>;
}
