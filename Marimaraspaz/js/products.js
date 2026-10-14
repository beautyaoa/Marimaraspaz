/**
 * Marimaras Paz — default catalog (fallback when remote catalog.json is unavailable)
 * Live data: Cloudinary catalog.json → overridden by localStorage drafts on admin browser
 */
window.MP = window.MP || {};

MP.CLOUD_NAME = 'gyssk0cm';
MP.CLOUDINARY_FOLDER = 'marimaraspaz';
MP.CATALOG_JSON_URL = 'https://res.cloudinary.com/gyssk0cm/raw/upload/marimaraspaz/catalog.json';
MP.UNSIGNED_PRESET = 'marimaraspaz_media'; // create this unsigned preset in Cloudinary (overwrite: off)
MP.WHATSAPP = '244938565536';
MP.CURRENCY = 'Kz';
MP.CART_KEY = 'marimaraspaz_cart';

MP.PRODUCTS = [
  {
    id: 'facial-clean',
    name: 'Facial Clean — Argila Branca',
    name_en: 'Facial Clean — White Clay',
    desc: 'Limpador + exfoliante + máscara. Deliplus.',
    desc_en: 'Cleanser + exfoliant + mask. Deliplus.',
    price: 8000,
    category: 'skincare',
    image: 'assets/facial-clean.jpg',
    available: true
  },
  {
    id: 'cremes-pes',
    name: 'Cremes para Pés',
    name_en: 'Foot Creams',
    desc: 'Hidratante + Pure Urea 10%. Pack.',
    desc_en: 'Moisturizer + Pure Urea 10%. Pack.',
    price: 4999,
    category: 'body',
    image: 'assets/cremes-pes.jpg',
    available: true
  },
  {
    id: 'deo-48h',
    name: 'Desodorante Creme 48h',
    name_en: '48h Cream Deodorant',
    desc: 'Deliplus · 0% álcool · peles delicadas.',
    desc_en: 'Deliplus · 0% alcohol · sensitive skin.',
    price: 8000,
    category: 'deo',
    image: 'assets/deo-48h.jpg',
    available: true
  },
  {
    id: 'deonat',
    name: 'Deonat Mineral',
    name_en: 'Deonat Mineral',
    desc: 'Desodorante de alumbre · protecção natural.',
    desc_en: 'Alum deodorant · natural protection.',
    price: 8000,
    category: 'deo',
    image: 'assets/deonat.jpg',
    available: true
  },
  {
    id: 'exfoliante-coco',
    name: 'Exfoliante Coco',
    name_en: 'Coconut Scrub',
    desc: 'Esfoliante corporal Deliplus.',
    desc_en: 'Body scrub Deliplus.',
    price: 10000,
    category: 'body',
    image: 'assets/exfoliante-coco.jpg',
    available: true
  },
  {
    id: 'ampolas',
    name: 'Ampolas Concentradas',
    name_en: 'Concentrated Ampoules',
    desc: 'Tratamento 3 semanas · Repair / Hydra / Glow.',
    desc_en: '3-week treatment · Repair / Hydra / Glow.',
    price: 12000,
    category: 'hair',
    image: 'assets/ampolas.jpg',
    available: true
  },
  {
    id: 'mixa-kit',
    name: 'Kit Mixa Body Care',
    name_en: 'Mixa Body Care Kit',
    desc: 'Urea Cica, Ceramide, Niacinamide + óleos.',
    desc_en: 'Urea Cica, Ceramide, Niacinamide + oils.',
    price: 14500,
    category: 'body',
    image: 'assets/mixa-kit.jpg',
    available: true
  },
  {
    id: 'sem-barriga',
    name: 'Sem Barriga + Ultra Fina',
    name_en: 'Flat Belly + Ultra Slim',
    desc: 'Infusão natural + creme minceur 3 cm.',
    desc_en: 'Natural infusion + slim cream 3 cm.',
    price: 0,
    category: 'body',
    image: '',
    available: false,
    consult: true
  }
];

MP.DELIVERY_ZONES = [
  { name: 'Luanda (centro)', price: 1500 },
  { name: 'Talatona', price: 2000 },
  { name: 'Viana', price: 2500 },
  { name: 'Belas', price: 2000 },
  { name: 'Cacuaco', price: 3000 }
];

MP.DEFAULT_SITE_IMAGES = {
  hero: 'assets/hero.jpg',
  hero_products: 'assets/hero-products.jpg',
  hero_about: 'assets/hero-about.jpg',
  hero_booking: 'assets/hero-booking.jpg',
  logo: 'assets/logo.jpg',
  store: 'assets/loja.jpeg'
};

MP.SITE_IMAGE_SLOTS = [
  { key: 'hero', label: 'Hero (página inicial)', label_en: 'Hero (homepage)' },
  { key: 'hero_products', label: 'Hero Produtos', label_en: 'Products hero' },
  { key: 'hero_about', label: 'Hero Sobre', label_en: 'About hero' },
  { key: 'hero_booking', label: 'Hero Agendar', label_en: 'Booking hero' },
  { key: 'logo', label: 'Logo', label_en: 'Logo' },
  { key: 'store', label: 'Imagem da loja', label_en: 'Store image' }
];

MP.DEFAULT_TEXTS = {
  pt: {
    heroTitle: 'Realçamos a beleza que há em si',
    heroSub: 'Tranças, unhas, tratamentos e produtos de qualidade — com cuidado, carinho e dedicação.'
  },
  en: {
    heroTitle: 'We enhance the beauty within you',
    heroSub: 'Braids, nails, treatments and quality products — with care, warmth and dedication.'
  }
};
