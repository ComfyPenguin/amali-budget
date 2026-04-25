import axios from 'axios';
import { load } from 'cheerio';
import { ScrapedProduct } from '../types';

const HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
  'Accept-Language': 'es-ES,es;q=0.9,en;q=0.8',
  'Accept-Encoding': 'gzip, deflate, br',
  Connection: 'keep-alive',
  'Cache-Control': 'max-age=0',
};

function parsePrice(text: string): number {
  const clean = text.replace(/\s/g, '').replace(/[€$£]/g, '');
  const match = clean.match(/\d+[,.]\d+|\d+/);
  if (!match) return 0;
  return parseFloat(match[0].replace(',', '.'));
}

export async function scrapeIkea(url: string): Promise<ScrapedProduct> {
  const response = await axios.get(url, { headers: HEADERS, timeout: 15000 });
  const $ = load(response.data);

  let title = '';
  let price = 0;
  let image = '';
  let currency = 'EUR';

  // JSON-LD es lo más fiable en IKEA — lo intenta primero
  $('script[type="application/ld+json"]').each((_, el) => {
    try {
      const data = JSON.parse($(el).text());
      const items = Array.isArray(data) ? data : [data];
      const product = items.find((d) => d['@type'] === 'Product');
      if (!product) return;

      title = title || product.name || '';

      if (product.offers) {
        const offer = Array.isArray(product.offers) ? product.offers[0] : product.offers;
        price = price || parseFloat(offer.price) || 0;
        currency = offer.priceCurrency || 'EUR';
      }

      if (product.image && !image) {
        const raw = Array.isArray(product.image) ? product.image[0] : product.image;
        image = typeof raw === 'string' ? raw : raw?.contentUrl ?? '';
      }
    } catch {}
  });

  // Fallbacks CSS por si el JSON-LD no trae todo
  if (!title) {
    title =
      $('[class*="pip-header-section__title--big"]').first().text().trim() ||
      $('[class*="pip-header-section__title"]').first().text().trim() ||
      $('h1').first().text().trim();
  }

  if (!price) {
    const intPart = $('[class*="pip-price__integer"]').first().text().replace(/\D/g, '');
    const decPart = $('[class*="pip-price__decimals"]').first().text().replace(/\D/g, '') || '00';
    if (intPart) {
      price = parseFloat(`${intPart}.${decPart}`);
    } else {
      price = parsePrice($('[class*="pip-price"]').first().text());
    }
  }

  if (!image) {
    image =
      $('[class*="pip-media-grid"] img').first().attr('src') ||
      $('[class*="pip-image"] img').first().attr('src') ||
      $('img[class*="product"]').first().attr('src') ||
      '';
  }

  if (!title) throw new Error('No se pudo extraer el título del producto de IKEA.');

  return { url, title, image, price, currency, source: 'ikea' };
}
