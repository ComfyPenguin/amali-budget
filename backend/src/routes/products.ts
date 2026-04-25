import { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { scrape } from '../scrapers';
import { setupAliexpress, isAliexpressConfigured, resetAliexpressConfig } from '../scrapers/aliexpress';
import { readProducts, writeProducts } from '../db/database';
import { Product } from '../types';

const router = Router();

router.post('/scrape', async (req: Request, res: Response) => {
  const { url } = req.body as { url?: string };
  if (!url || typeof url !== 'string') {
    return res.status(400).json({ error: 'Se requiere una URL válida.' });
  }
  try {
    const product = await scrape(url);
    res.json(product);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Error al scrapear.';
    res.status(422).json({ error: message });
  }
});

router.get('/products', (_req: Request, res: Response) => {
  res.json(readProducts());
});

router.post('/products/refresh', async (_req: Request, res: Response) => {
  const products = readProducts();
  if (products.length === 0) return res.json([]);

  const results = await Promise.allSettled(
    products.map((p) => p.source === 'manual' ? Promise.resolve(null) : scrape(p.url))
  );

  const updated = products.map((p, i) => {
    const r = results[i];
    if (r.status === 'fulfilled' && r.value) {
      return { ...p, price: r.value.price, image: r.value.image };
    }
    return p;
  });

  writeProducts(updated);
  res.json(updated);
});

router.post('/products', (req: Request, res: Response) => {
  const data = req.body as Omit<Product, 'id' | 'addedAt'>;
  const products = readProducts();
  const newProduct: Product = {
    ...data,
    id: uuidv4(),
    quantity: data.quantity ?? 1,
    addedAt: new Date().toISOString(),
  };
  writeProducts([...products, newProduct]);
  res.status(201).json(newProduct);
});

router.patch('/products/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const { quantity } = req.body as { quantity: number };
  const products = readProducts();
  const idx = products.findIndex((p) => p.id === id);
  if (idx === -1) return res.status(404).json({ error: 'Producto no encontrado.' });
  products[idx].quantity = Number(quantity);
  writeProducts(products);
  res.json(products[idx]);
});

router.delete('/products/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const products = readProducts();
  const filtered = products.filter((p) => p.id !== id);
  if (filtered.length === products.length) {
    return res.status(404).json({ error: 'Producto no encontrado.' });
  }
  writeProducts(filtered);
  res.status(204).send();
});

router.get('/setup/aliexpress', (_req: Request, res: Response) => {
  res.json({ configured: isAliexpressConfigured() });
});

router.post('/setup/aliexpress', (_req: Request, res: Response) => {
  setupAliexpress().catch((err) => console.error('[AliExpress setup error]', err));
  res.json({ message: 'Navegador abierto. Inicia sesión en AliExpress y ciérralo cuando termines.' });
});

router.delete('/setup/aliexpress', (_req: Request, res: Response) => {
  resetAliexpressConfig();
  res.json({ configured: false });
});

export default router;
