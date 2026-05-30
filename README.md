# Budget Tracker

Aplicación web personal para construir presupuestos de compra a partir de productos de **Amazon ES** y **AliExpress ES**. Pega una URL, la app extrae automáticamente la foto, el nombre y el precio, y calcula el total a medida que ajustas las cantidades.

![Budget Tracker](assets/banner.png)

---

## Características

- **Scraping automático** de Amazon ES (axios + cheerio) y AliExpress ES (Puppeteer headless)
- **Sesión persistente** en AliExpress — inicia sesión una vez y la app reutiliza tu cuenta para ver tus precios reales
- **Edición de cantidades** con recálculo instantáneo de subtotales y total global
- **Persistencia local** en JSON — sin base de datos externa
- **Tema claro / oscuro / sistema** con transición suave y sin flash al cargar
- Diseño monochromático inspirado en Cal.com

---

## Requisitos

| Herramienta | Versión mínima |
|---|---|
| [Node.js](https://nodejs.org) | 18+ |
| npm | 9+ (incluido con Node) |

> Puppeteer descarga su propio Chromium (~170 MB) durante la instalación. No necesitas Chrome instalado.

---

## Instalación

```bat
install.bat
```

Este script instala las dependencias de los tres paquetes (raíz, backend y frontend) en orden. Solo es necesario ejecutarlo la primera vez.

---

## Uso

### Arrancar la aplicación

```bat
start.bat
```

Esto lanza el backend en `http://localhost:3001` y el frontend en `http://localhost:5173` de forma simultánea. Abre el navegador en esa segunda dirección.

### Comandos alternativos (npm)

```bash
# Instalar todas las dependencias
npm run install:all

# Arrancar backend y frontend en paralelo
npm run dev

# Solo el backend
npm run dev --prefix backend

# Solo el frontend
npm run dev --prefix frontend
```

---

## Configurar AliExpress (primer uso)

AliExpress requiere sesión iniciada para mostrar precios correctos. La app guía el proceso:

1. En la barra superior de la web, haz clic en **"Iniciar sesión"**
2. Se abrirá un navegador Chrome en `es.aliexpress.com`
3. Haz clic en **"Cuenta"** → **"Iniciar sesión"** dentro de esa ventana
4. Completa el login (incluido el CAPTCHA si aparece)
5. Cierra la ventana del navegador
6. El indicador de AliExpress pasará a **"Sesión activa"**

A partir de ese momento todos los scrapes de AliExpress usarán tu cuenta. Si la sesión caduca, usa el botón **"Reconectar"**.

> Amazon no requiere sesión para obtener precios.

---

## Estructura del proyecto

```
amali-scrapper/
├── backend/                  # API REST + scrapers
│   ├── src/
│   │   ├── index.ts          # Servidor Express (puerto 3001)
│   │   ├── types.ts          # Interfaz Product
│   │   ├── routes/
│   │   │   └── products.ts   # Endpoints REST
│   │   ├── scrapers/
│   │   │   ├── index.ts      # Factory: detecta amazon vs aliexpress
│   │   │   ├── amazon.ts     # axios + cheerio
│   │   │   └── aliexpress.ts # Puppeteer headless + sesión persistente
│   │   └── db/
│   │       └── database.ts   # Lectura/escritura JSON
│   └── data/                 # Generado en tiempo de ejecución
│       ├── products.json     # Productos guardados
│       └── aliexpress-profile/ # Perfil de sesión de AliExpress
├── frontend/                 # React + Vite + Tailwind
│   └── src/
│       ├── components/
│       │   ├── Header.tsx         # Navbar con logo y selector de tema
│       │   ├── AddProduct.tsx     # Input de URL + botón scrape
│       │   ├── ProductCard.tsx    # Tarjeta de producto con cantidad editable
│       │   ├── ProductList.tsx    # Lista de productos
│       │   ├── Summary.tsx        # Total global
│       │   └── AliexpressSetup.tsx # Panel de configuración de sesión
│       ├── hooks/
│       │   └── useTheme.ts        # Hook light/dark/system
│       └── services/
│           └── api.ts             # Llamadas al backend
├── install.bat               # Instalación (Windows)
├── start.bat                 # Arranque (Windows)
└── DESIGN.md                 # Sistema de diseño (Cal.com inspired)
```

---

## API del backend

| Método | Ruta | Descripción |
|--------|------|-------------|
| `POST` | `/api/scrape` | Scrape de una URL (no guarda) |
| `GET` | `/api/products` | Lista todos los productos |
| `POST` | `/api/products` | Guarda un producto |
| `PATCH` | `/api/products/:id` | Actualiza la cantidad |
| `DELETE` | `/api/products/:id` | Elimina un producto |
| `GET` | `/api/setup/aliexpress` | Estado de la sesión de AliExpress |
| `POST` | `/api/setup/aliexpress` | Inicia el flujo de login |
| `DELETE` | `/api/setup/aliexpress` | Resetea la sesión guardada |

---

## Dependencias principales

### Backend
| Paquete | Uso |
|---|---|
| `express` | Servidor HTTP |
| `axios` + `cheerio` | Scraping de Amazon (HTML estático) |
| `puppeteer` | Scraping de AliExpress (JS dinámico) |
| `uuid` | IDs únicos para productos |

### Frontend
| Paquete | Uso |
|---|---|
| `react` + `react-dom` | UI |
| `vite` | Bundler y dev server |
| `tailwindcss` | Estilos utility-first |
| `typescript` | Tipado estático |

---

## Limitaciones conocidas

- **Amazon** puede devolver un CAPTCHA si se hacen muchas peticiones en poco tiempo. La app muestra un error claro en ese caso — espera unos minutos y vuelve a intentarlo.
- **AliExpress** cambia su estructura HTML con frecuencia. Si el scraping falla, los selectores están en `backend/src/scrapers/aliexpress.ts`.
- Los precios se muestran siempre en **EUR** independientemente del origen del producto.
