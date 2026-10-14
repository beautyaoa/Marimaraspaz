# Marimaras Paz — Estética e Beleza

Luxury multi-page website + staff admin for the beauty salon **Marimaras Paz** (Luanda).

Architecture follows `BLUEPRINT.md` (static site + Cloudinary catalog + Cloudflare Worker publish).

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

## Stack

- Pure HTML / CSS / JS
- Cloudflare Pages (static)
- Cloudflare Worker (`worker/`) — publish API
- Cloudinary — media + `marimaraspaz/catalog.json`
- localStorage cart + admin drafts
- Orders via WhatsApp `+244 938 565 536`

## Folders

```
css/styles.css      public styles
css/admin.css       admin UI
js/products.js      defaults + Cloudinary config
js/app.js           cart, i18n, catalog load, product grid
js/admin.js         admin CRUD + publish
assets/             static images & videos
worker/             publish Worker
```

## Config (already set for this brand)

| Key | Value |
|-----|--------|
| Cloud name | `gyssk0cm` |
| Folder | `marimaraspaz` |
| Catalog URL | `https://res.cloudinary.com/gyssk0cm/raw/upload/marimaraspaz/catalog.json` |
| Unsigned preset | `marimaraspaz_media` (**create in Cloudinary dashboard**) |
| Default admin password | `marimaras2026` (**change after handoff**) |
| WhatsApp | `244938565536` |

## One-time Cloudinary setup

1. Log into Cloudinary cloud `gyssk0cm`.
2. **Settings → Upload → Upload presets → Add upload preset**
   - Preset name: `marimaraspaz_media`
   - Signing mode: **Unsigned**
   - Folder: `marimaraspaz` (optional)
   - Unique filename: On
   - Overwrite: **Off**
3. Save.

## Deploy Worker

```bash
cd worker
npx wrangler deploy

npx wrangler secret put ADMIN_PASSWORD          # use a strong password
npx wrangler secret put CLOUDINARY_CLOUD_NAME   # gyssk0cm
npx wrangler secret put CLOUDINARY_API_KEY      # 276685239418642
npx wrangler secret put CLOUDINARY_API_SECRET   # (secret — never commit)
```

Then set `PUBLISH_URL` in `js/admin.js` to:

`https://marimaraspaz-publish.<your-subdomain>.workers.dev/publish`

## Deploy site (Cloudflare Pages)

1. Push this folder to GitHub
2. Cloudflare Pages → Connect → Framework: None → Output: `/`
3. Deploy

No rebuild needed for product/price/image changes after publish — only for HTML/CSS/JS code changes.

## Staff workflow

1. Open `/admin.html` → password `marimaras2026` (change it)
2. Edit products / zones / texts / site images / upload media
3. Optional **Guardar rascunho** → preview shop in the same browser
4. **Publicar na loja** → all visitors get the new catalog

## Security notes

- API secret lives **only** in Worker secrets — never in browser code.
- Unsigned preset allows anyone who knows cloud name + preset name to upload images; they cannot read secrets or overwrite catalog.
- Catalog overwrite requires Worker + correct admin password.
- Change default admin password after handoff.
- Optional: put Cloudflare Access in front of `/admin.html`.

## Legacy

- `main.js` and root `styles.css` are superseded by `js/app.js` and `css/styles.css`. Safe to delete after verifying Pages deploy.
