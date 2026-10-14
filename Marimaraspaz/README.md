# Marimaras Paz — Estética e Beleza

Luxury multi-page website for the beauty salon **Marimaras Paz**.

## Pages
- index.html — Homepage (hero image → video, store card, services, products teaser, contact)
- products.html — E-commerce products with filters & add to cart
- checkout.html — Checkout form (name, location, município, bairro, phone, email, message)
- booking.html — Smart booking form with all services + prices

## Features
- Cart with localStorage, +/- quantity, swipe-to-close, X close
- Hero: still image first, then salon tour video
- Full-bleed store card (loja.jpeg, no crop)
- Brand name corrected to Marimaras Paz
- No WhatsApp button in header (cart icon instead)
- Mobile-first, thin-line luxury design
- Portuguese primary, English via EN/PT toggle (localStorage mp_lang)
- i18n via data-i18n attributes + I18N dictionary in main.js

## Deploy (Cloudflare Pages)
1. Push folder to GitHub
2. Cloudflare Pages → Connect → Framework: None → Output: /
3. Deploy
