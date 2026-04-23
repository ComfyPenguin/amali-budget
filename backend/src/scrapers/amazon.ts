import axios from 'axios';
import { load } from 'cheerio';
import { ScrapedProduct } from '../types';

const HEADERS = {
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
  Accept:
    'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
  'Accept-Language': 'es-ES,es;q=0.9,en;q=0.8',
  'Accept-Encoding': 'gzip, deflate, br',
  Connection: 'keep-alive',
  'Upgrade-Insecure-Requests': '1',
  'Cache-Control': 'max-age=0',
};

function parsePrice(text: string): number {
  const clean = text.replace(/\s/g, '').replace(/[€$£]/g, '');
  const match = clean.match(/[\d]+[,.][\d]+|[\d]+/);
  if (!match) return 0;
  return parseFloat(match[0].replace(',', '.'));
}

export async function scrapeAmazon(url: string): Promise<ScrapedProduct> {
  const response = await axios.get(url, {
    headers: HEADERS,
    timeout: 15000,
  });

  const $ = load(response.data);

  if ($('#captchacharacters').length || $('title').text().toLowerCase().includes('robot')) {
    throw new Error(
      'Amazon ha bloqueado la solicitud (CAPTCHA). Inténtalo más tarde o usa otro navegador.'
    );
  }

  const title = $('#productTitle').text().trim();

  if (!title) {
    throw new Error(
      'No se pudo obtener el título del producto. Amazon puede haber bloqueado la solicitud.'
    );
  }

  const priceText =
    $('.a-price .a-offscreen').first().text().trim() ||
    $('#priceblock_ourprice').text().trim() ||
    $('#price_inside_buybox').text().trim() ||
    $('#priceblock_dealprice').text().trim() ||
    $('.a-price-whole').first().text().trim();

  const price = parsePrice(priceText);

  const image =
    $('#landingImage').attr('src') ||
    $('#imgTagWrappingLink img').attr('src') ||
    $('img[data-a-dynamic-image]').first().attr('src') ||
    '';

  return { url, title, image, price, currency: 'EUR', source: 'amazon' };
}
