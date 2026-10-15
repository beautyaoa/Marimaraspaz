# Site + Admin Blueprint

Reusable architecture for small e‑commerce / brochure sites with a staff admin panel.

Derived from Naravazz Diversos (Luanda). Copy this pattern to a new brand by renaming folders, WhatsApp number, Cloudinary folder, and Worker name.

## Stack

* Pure HTML / CSS / JS (no framework, no build step)
* Cloudflare Pages — static site
* Cloudflare Worker — publish API (holds Cloudinary secrets; phones only need admin password)
* Cloudinary — media uploads (unsigned preset) + live catalog.json (signed upload via Worker)
* localStorage — admin drafts / same-browser preview
* Orders via WhatsApp (no payment backend)

Optional later: Cloudflare KV for the catalog instead of Cloudinary raw JSON.

## Folders

```
project/
├── index.html, products.html, checkout.html, booking.html …
├── admin.html                 # Staff panel (password-gated)
├── css/
│   ├── styles.css             # Public site (mobile-first, safe-area)
│   └── admin.css              # Admin UI
├── js/
│   ├── products.js            # Default PRODUCTS + DELIVERY_ZONES (fallback)
│   ├── app.js                 # Cart, i18n, shop + loads live catalog/images
│   └── admin.js               # CRUD, media, site images, publish via Worker
├── assets/                    # Default static assets (hero, products, gallery…)
├── worker/
│   ├── src/index.js
│   ├── wrangler.toml
│   └── README.md
├── BLUEPRINT.md
└── README.md
```

## Data model (live catalog)

Published file: `catalog.json` on Cloudinary (fixed public_id, e.g. `{folder}/catalog`).

```json
{
  "updatedAt": "2026-10-15T00:00:00.000Z",
  "products":  [ { "id": "…", "name": "…", "price": 3500, "image": "…", … } ],
  "services":  [ { "id": "…", "name": "…", "price": 5000, "category": "nails", "active": true } ],
  "zones":     [ { "name": "Talatona", "price": 2000 } ],
  "texts":     { "pt": { "hero_title": "…" }, "en": { "hero_title": "…" } },
  "images":    { "hero": "https://…", "store": "https://…" },
  "videos":    { "hero": "https://…", "work_nails": "https://…" },
  "contact":   { "phone_display": "…", "whatsapp": "244…", "hours": "…", "place": "…" }
}
```

Remote URL pattern:

`https://res.cloudinary.com/{CLOUD_NAME}/raw/upload/{FOLDER}/catalog.json`

## Public site (how data is read)

1. Load `products.js` → default PRODUCTS and DELIVERY_ZONES.
2. `app.js` fetches remote `catalog.json` (cache-bust `?t=`).
3. Apply in order:
   * localStorage drafts (admin preview on the same browser)
   * Remote catalog (everyone after publish)
4. If remote fails → keep defaults from `products.js` / static HTML images.
5. Cart: localStorage key `marimaraspaz_cart`.
6. Checkout builds a WhatsApp deep link (`wa.me`).

### Site images

* Mark slots with `data-site-img="key"` on `<img>` / `<video poster>` and `data-site-img-bg="key"` on sections.
* `applySiteImages()` merges remote images + overrides and sets `src` / CSS variables.

## Admin panel

| Area | localStorage draft | Publish (everyone) |
|------|--------------------|--------------------|
| Products | `mp_products_override` | catalog.json → products |
| Delivery zones | `mp_zones_override` | zones |
| Site texts (i18n) | `mp_texts_override` | texts |
| Site images | `mp_images_override` | images |
| Media library list | `mp_media_library` | not published as a list |

* **Guardar rascunho** — this browser only.
* **Publicar na loja** — POST `{ password, catalog }` to the Worker → signed Cloudinary upload of catalog.json.

## Publish architecture (Worker)

Admin sends only:

```json
{ "password": "…", "catalog": { "products": [], "zones": [], "texts": {}, "images": {} } }
```

to `https://{name}.{account}.workers.dev/publish`.

Worker checks `ADMIN_PASSWORD`, signs the raw upload, writes `{folder}/catalog`.

```bash
cd worker
npx wrangler deploy
npx wrangler secret put ADMIN_PASSWORD
npx wrangler secret put CLOUDINARY_CLOUD_NAME
npx wrangler secret put CLOUDINARY_API_KEY
npx wrangler secret put CLOUDINARY_API_SECRET
```

## Cloudinary

| Item | Role |
|------|------|
| Cloud name | In public URLs |
| Unsigned upload preset | Browser media + product photos |
| API key + secret | Only on the Worker |
| Folder | e.g. `marimaraspaz` |
| Catalog public_id | e.g. `marimaraspaz/catalog` |

## Copy-paste checklist for a new website

- [ ] Clone structure: static pages + admin.html + css/ + js/ + worker/
- [ ] Rename brand, WhatsApp, Instagram, address, currency label
- [ ] New Cloudinary cloud/folder + unsigned preset (media only)
- [ ] New Worker name + four secrets; set `PUBLISH_URL` in admin.js
- [ ] Point `CATALOG_JSON_URL` in products.js at the new catalog URL
- [ ] Set `DEFAULT_SITE_IMAGES` + `SITE_IMAGE_SLOTS` to match `data-site-img*` hooks
- [ ] Seed products.js + default images under assets/
- [ ] Change default admin password
- [ ] Deploy Pages + deploy Worker
- [ ] Smoke-test: upload image → assign site slot → publish → hard-refresh public site
- [ ] Optional: Cloudflare Access in front of /admin.html

## What this stack is good for

* Small shops, beauty, local delivery, WhatsApp orders
* Staff updating prices, photos, and homepage imagery from a phone
* Low cost (Cloudinary free credits + Cloudflare free tier)
* Secrets stay on the server

## What it is not

* Multi-warehouse inventory / strong multi-user auth
* PCI card payments
* Automatic deletion of Cloudinary binaries from the admin UI
