# Marimaras Paz — Publish Worker

Holds Cloudinary API secret and admin password. Admin panel POSTs catalog here.

## Deploy

```bash
cd worker
npx wrangler deploy

npx wrangler secret put ADMIN_PASSWORD
# enter a strong password (same as used in admin login)

npx wrangler secret put CLOUDINARY_CLOUD_NAME
# gyssk0cm

npx wrangler secret put CLOUDINARY_API_KEY
# 276685239418642

npx wrangler secret put CLOUDINARY_API_SECRET
# (the secret you were given)
```

After deploy, copy the workers.dev URL and set it as `PUBLISH_URL` in `js/admin.js`
(e.g. `https://marimaraspaz-publish.<account>.workers.dev/publish`).

## Cloudinary setup (one-time)

1. Cloud name: `gyssk0cm`
2. Create an **unsigned** upload preset named `marimaraspaz_media`
   - Signing mode: Unsigned
   - Folder: `marimaraspaz` (optional)
   - Overwrite: **Off**
   - Unique filename: On
3. Catalog is written as raw file `marimaraspaz/catalog` (signed, via this Worker only)

## Test

```bash
curl -X POST https://marimaraspaz-publish.<account>.workers.dev/publish \
  -H 'Content-Type: application/json' \
  -d '{"password":"YOUR_PASSWORD","catalog":{"products":[],"zones":[],"texts":{},"images":{}}}'
```
