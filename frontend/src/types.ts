export interface Product {
  id: string;
  url: string;
  title: string;
  image: string;
  price: number;
  currency: string;
  quantity: number;
  source: 'amazon' | 'aliexpress' | 'ikea' | 'manual';
  addedAt: string;
}

export interface ScrapedProduct {
  url: string;
  title: string;
  image: string;
  price: number;
  currency: string;
  source: 'amazon' | 'aliexpress' | 'ikea' | 'manual';
}
