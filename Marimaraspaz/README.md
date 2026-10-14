# Marimaras Paz — Estética e Beleza

Luxury multi-page website + staff admin for **Marimaras Paz** (Luanda).

Architecture: `BLUEPRINT.md` — static site, Cloudinary catalog, Cloudflare Worker publish.

## Pages

| File | Role |
|------|------|
| `index.html` | Homepage |
| `products.html` | Shop (live catalog) |
| `checkout.html` | Checkout → WhatsApp |
| `booking.html` | Service booking → WhatsApp |
| `works.html` | Portfolio |
| `about.html` | About |
| `admin.html` | Staff panel (password-gated) |

## What staff can edit (Admin)

| Area | Details |
|------|---------|
| **Produtos** | Name (PT/EN), description, price, category, photo, availability |
| **Zonas de entrega** | Name + delivery fee (Kz) |
| **Textos** | Announce bar, hero, store, works, products subtitle, about, CTAs — **PT + EN** |
| **Contacto & horário** | Phone display, WhatsApp number, hours, location, email |
| **Imagens do site** | Heroes (home/products/about/booking), logo, store, about photo, work posters |
| **Biblioteca de média** | Upload to Cloudinary; assign to products or site slots |

Flow: edit → **Guardar rascunho** (same browser preview) → **Publicar** (everyone).

## Stack

- Pure HTML / CSS / JS (no build step)
- Cloudflare Pages (static host)
- Cloudflare Worker — `https://marimaraspaz.beautyaoa.workers.dev/publish`
- Cloudinary — media + live `marimaraspaz/catalog.json`
- localStorage cart + admin drafts
- Orders via WhatsApp

## Folders

```
admin.html
css/styles.css      public site
css/admin.css       admin UI (mobile drawer + desktop sidebar)
js/products.js      defaults, slots, text field defs, Cloudinary config
js/app.js           cart, i18n, live catalog + texts/images/contact
js/admin.js         staff CRUD + publish
assets/             default images & videos
worker/             publish Worker
BLUEPRINT.md
```

## Config

| Key | Value |
|-----|--------|
| Cloud name | `gyssk0cm` |
| Cloudinary email | beautyaoa@gmail.com |
| Folder | `marimaraspaz` |
| Catalog | `https://res.cloudinary.com/gyssk0cm/raw/upload/marimaraspaz/catalog.json` |
| Unsigned preset | `marimaraspaz_media` |
| Worker | `https://marimaraspaz.beautyaoa.workers.dev/` |
| Publish URL | `…/publish` (set in `js/admin.js`) |
| Default admin password | `marimaras2026` (**change after handoff**) |
| WhatsApp | `244938565536` |

## Cloudinary (done)

- Unsigned preset **`marimaraspaz_media`**: overwrite off, unique filename, folder `marimaraspaz`.

## Worker secrets

```bash
cd worker
npx wrangler deploy
npx wrangler secret put ADMIN_PASSWORD
npx wrangler secret put CLOUDINARY_CLOUD_NAME   # gyssk0cm
npx wrangler secret put CLOUDINARY_API_KEY
npx wrangler secret put CLOUDINARY_API_SECRET
```

## Deploy site

Cloudflare Pages → Framework **None** → output `/`.

Catalog/text/image changes need **no** redeploy — only HTML/CSS/JS code changes do.

## Admin UX

- **Desktop:** sticky sidebar with section groups; wide forms; table for products
- **Mobile:** hamburger drawer; product cards; sticky Guardar / Publicar; 44px targets; `font-size: 16px` on inputs
- **Ver site** opens the public homepage in a new tab

## Security

- API secret only in Worker secrets — never in browser code
- Catalog overwrite requires Worker + admin password
- Change default admin password after handoff
- Optional: Cloudflare Access on `/admin.html`
- Ignore `.DS_Store` and `wrangler-account.json` in `.gitignore`

## Local path

`/Users/inaciom/Documents/GitHub/Marimaraspaz/Marimaraspaz`

## Legacy

`main.js` and root `styles.css` are unused (replaced by `js/app.js` and `css/styles.css`). Safe to delete after verify.
