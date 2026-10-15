# Marimaras Paz — Estética e Beleza

Luxury multi-page website + staff admin for **Marimaras Paz** (Luanda).

Architecture: see `BLUEPRINT.md` (static site, Cloudinary catalog, Cloudflare Worker publish).

## Pages

| File | Role |
|------|------|
| `index.html` | Homepage (hero, store, works, **services/prices**, contact) |
| `products.html` | Shop (live product catalog) |
| `checkout.html` | Cart checkout → WhatsApp |
| `booking.html` | Service booking → WhatsApp |
| `works.html` | Portfolio |
| `about.html` | About |
| `admin.html` | Staff panel (password-gated) |

## What staff can edit (Admin)

| Area | Details |
|------|---------|
| **Produtos** | Name PT/EN, description, price, photo, category, availability |
| **Serviços & preços** | Full booking menu + homepage price table (add / edit / delete, categories) |
| **Zonas de entrega** | Zone name + fee (Kz) |
| **Textos** | Announce, hero, store, works, about, CTAs — PT + EN; Limpar / Restaurar padrões |
| **Contacto & horário** | Phone display, WhatsApp number, hours, location, email |
| **Imagens do site** | Heroes, logo, store, about photo, posters — Carregar / Média / Original / Limpar |
| **Vídeos** | Hero salon tour + works clips — Carregar (auto-compress if large) / Original / Limpar |
| **Biblioteca de média** | Cloudinary uploads; ✕ removes from browser list only |
| **Guia do staff** | In-panel help (PT) |

Flow: edit → **Guardar rascunho** (same-browser preview) → **Publicar** (everyone).

Login: password field has **show/hide** (eye icon). Default password: `marimaras2026` (change after handoff).

## Stack

- Pure HTML / CSS / JS (no build step)
- Cloudflare Pages (static host)
- Cloudflare Worker — `https://marimaraspaz.beautyaoa.workers.dev/publish`
- Cloudinary — media + live `marimaraspaz/catalog.json`
- localStorage cart + admin drafts
- Orders / bookings via WhatsApp (number from admin contact when published)

## Folders

```
admin.html
css/styles.css       public site
css/admin.css        admin UI (drawer, sticky actions)
js/products.js       defaults: products, services, zones, texts, images, videos, contact
js/app.js            cart, i18n, live catalog, booking + price table render
js/admin.js          staff CRUD + publish
assets/              default images & videos
worker/              publish Worker
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
| Publish URL | set in `js/admin.js` → `…/publish` |
| Default admin password | `marimaras2026` |
| Default WhatsApp | `244938565536` |

## Catalog JSON (published)

```json
{
  "updatedAt": "…",
  "products": [],
  "services": [],
  "zones": [],
  "texts": { "pt": {}, "en": {} },
  "images": {},
  "videos": {},
  "contact": { "phone_display": "", "whatsapp": "", "hours": "", "place": "", "email": "" }
}
```

## Cloudinary

- Unsigned preset **`marimaraspaz_media`**: overwrite off, unique filename, folder `marimaraspaz`.
- Allow **video** uploads on the same preset for admin video slots.

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

Product/service/text/image/video changes need **no** site redeploy — only HTML/CSS/JS code changes do.

## Admin UX

- **Desktop:** sticky sidebar with section groups
- **Mobile:** hamburger drawer; sticky Guardar / Publicar; product/service cards
- **Ver site** opens the public homepage

## Security

- API secret only in Worker secrets — never in browser code
- Catalog overwrite requires Worker + admin password
- Change default admin password after handoff
- Optional: Cloudflare Access on `/admin.html`
- `.gitignore` should ignore `.DS_Store` and `wrangler-account.json`

## Local path

`/Users/inaciom/Documents/GitHub/Marimaraspaz/Marimaraspaz`

## Notes

- Legacy `main.js` and root `styles.css` have been **removed** (use `js/app.js` and `css/styles.css`).
- Admin **video upload** compresses files over ~4 MB in the browser (WebM, max 1280×720) before Cloudinary; falls back to original if compression is not supported or not smaller.
