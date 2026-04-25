import { scrapeAmazon } from './amazon';
import { scrapeAliexpress } from './aliexpress';
import { scrapeIkea } from './ikea';
import { ScrapedProduct } from '../types';

export async function scrape(url: string): Promise<ScrapedProduct> {
  const normalized = url.toLowerCase();
  if (normalized.includes('amazon.')) return scrapeAmazon(url);
  if (normalized.includes('aliexpress.')) return scrapeAliexpress(url);
  if (normalized.includes('ikea.')) return scrapeIkea(url);
  throw new Error('URL no reconocida. Solo se admiten links de Amazon, AliExpress o IKEA.');
}
