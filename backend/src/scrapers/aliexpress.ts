import puppeteer from 'puppeteer';
import path from 'path';
import fs from 'fs';
import { ScrapedProduct } from '../types';

const PROFILE_DIR = path.join(__dirname, '../../../data/aliexpress-profile');
const CONFIGURED_MARKER = path.join(PROFILE_DIR, '.configured');

export function isAliexpressConfigured(): boolean {
  return fs.existsSync(CONFIGURED_MARKER);
}

export function resetAliexpressConfig(): void {
  if (fs.existsSync(CONFIGURED_MARKER)) fs.unlinkSync(CONFIGURED_MARKER);
}

export async function setupAliexpress(): Promise<void> {
  fs.mkdirSync(PROFILE_DIR, { recursive: true });

  const browser = await puppeteer.launch({
    headless: false,
    userDataDir: PROFILE_DIR,
    args: [
      '--lang=es-ES',
      '--window-size=1024,768',
      '--disable-blink-features=AutomationControlled',
    ],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1024, height: 768 });

  // Elimina el flag que delata al navegador como automatizado
  await page.evaluateOnNewDocument(() => {
    Object.defineProperty(navigator, 'webdriver', { get: () => undefined });
  });

  // Si la navegación falla el navegador sigue abierto para que el usuario actúe
  page
    .goto('https://es.aliexpress.com', {
      waitUntil: 'domcontentloaded',
      timeout: 0,
    })
    .catch((err) => console.warn('[AliExpress setup] goto warning:', err.message));

  // Esperamos a que el usuario cierre el navegador manualmente
  await new Promise<void>((resolve) => browser.on('disconnected', resolve));

  // Marcamos el perfil como configurado
  fs.writeFileSync(CONFIGURED_MARKER, new Date().toISOString());
}

function parsePrice(text: string): number {
  const clean = text.replace(/\s/g, '').replace(/[€$£]/g, '');
  const match = clean.match(/\d+[,.]\d+|\d+/);
  if (!match) return 0;
  return parseFloat(match[0].replace(',', '.'));
}

export async function scrapeAliexpress(url: string): Promise<ScrapedProduct> {
  fs.mkdirSync(PROFILE_DIR, { recursive: true });

  const browser = await puppeteer.launch({
    headless: true,
    userDataDir: PROFILE_DIR,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--lang=es-ES',
      '--disable-blink-features=AutomationControlled',
    ],
  });

  try {
    const page = await browser.newPage();
    await page.evaluateOnNewDocument(() => {
      Object.defineProperty(navigator, 'webdriver', { get: () => undefined });
    });
    await page.setExtraHTTPHeaders({ 'Accept-Language': 'es-ES,es;q=0.9' });
    await page.setViewport({ width: 1280, height: 800 });

    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });

    await page
      .waitForSelector('.product-price-value, [class*="price--current"]', { timeout: 10000 })
      .catch(() => {});

    const data: { title: string; priceText: string; image: string } = await page.evaluate(() => {
      const priceEl =
        document.querySelector('.product-price-value') ||
        document.querySelector('[class*="price--current"]') ||
        document.querySelector('[class*="uniform-banner-box-price"]') ||
        document.querySelector('[class*="price"]');
      const priceText = priceEl?.textContent?.trim() ?? '0';

      const title =
        (document.querySelector('h1[data-pl]') as HTMLElement)?.innerText?.trim() ||
        (document.querySelector('.product-title-text') as HTMLElement)?.innerText?.trim() ||
        (document.querySelector('h1') as HTMLElement)?.innerText?.trim() ||
        '';

      const imgEl =
        (document.querySelector('.magnifier-image') as HTMLImageElement) ||
        (document.querySelector('[class*="slider--img"] img') as HTMLImageElement) ||
        (document.querySelector('.product-image img') as HTMLImageElement);
      const image = imgEl?.src ?? '';

      return { title, priceText, image };
    });

    if (!data.title) {
      throw new Error(
        'No se pudo extraer el título de AliExpress. La página puede haber cambiado su estructura.'
      );
    }

    return {
      url,
      title: data.title,
      image: data.image,
      price: parsePrice(data.priceText),
      currency: 'EUR',
      source: 'aliexpress',
    };
  } finally {
    await browser.close();
  }
}
