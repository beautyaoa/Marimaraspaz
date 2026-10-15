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
  store: 'assets/loja.jpeg',
  about_body: 'assets/hero.jpg',
  poster_nails: 'assets/poster-nails.jpg',
  poster_pedi: 'assets/poster-pedi.jpg',
  poster_hospitality: 'assets/poster-hospitality.jpg'
};

MP.SITE_IMAGE_SLOTS = [
  { key: 'hero', label: 'Hero — página inicial', group: 'Páginas' },
  { key: 'hero_products', label: 'Hero — Produtos', group: 'Páginas' },
  { key: 'hero_about', label: 'Hero — Sobre', group: 'Páginas' },
  { key: 'hero_booking', label: 'Hero — Agendar', group: 'Páginas' },
  { key: 'logo', label: 'Logo', group: 'Marca' },
  { key: 'store', label: 'Imagem da loja (home)', group: 'Home' },
  { key: 'about_body', label: 'Foto corpo — Sobre', group: 'Sobre' },
  { key: 'poster_nails', label: 'Poster unhas', group: 'Trabalhos' },
  { key: 'poster_pedi', label: 'Poster pedicure', group: 'Trabalhos' },
  { key: 'poster_hospitality', label: 'Poster hospitalidade', group: 'Trabalhos' }
];

/** Staff-editable copy. Keys match data-i18n / applyCatalogTexts. */
MP.DEFAULT_TEXTS = {
  pt: {
    announce: 'Agende o seu horário • 938 565 536',
    hero_eyebrow: 'Salão de Beleza Premium',
    hero_title: 'Realçamos a beleza que há em si',
    hero_sub: 'Tranças, unhas, tratamentos e produtos de qualidade — com cuidado, carinho e dedicação.',
    store_title: 'Marimaras Paz loja',
    works_eyebrow: 'Os nossos trabalhos',
    works_title: 'Trabalhos em destaque',
    works_desc: 'Resultados reais — tranças, unhas e beleza com cuidado.',
    prod_title: 'Cuide de si com produtos de qualidade',
    about_title: 'Sobre nós',
    about_sub: 'Cuidado, carinho e dedicação em cada detalhe',
    about_eyebrow: 'A nossa história',
    about_heading: 'Beleza com propósito',
    about_p1: 'A Marimaras Paz nasceu da paixão por realçar a beleza natural de cada cliente. No nosso espaço, cada trança, cada tratamento e cada detalhe nas unhas é feito com tempo, técnica e respeito pelo que torna cada pessoa única.',
    about_p2: 'Trabalhamos com produtos seleccionados e um atendimento próximo — para que se sinta em casa desde a primeira visita.',
    info_hours: 'Seg – Sáb · 09:00 – 18:00',
    info_place: 'Luanda, Angola',
    cta_book: 'Agendar horário',
    cta_shop: 'Compre agora'
  },
  en: {
    announce: 'Book your appointment • 938 565 536',
    hero_eyebrow: 'Premium Beauty Salon',
    hero_title: 'We enhance the beauty within you',
    hero_sub: 'Braids, nails, treatments and quality products — with care, warmth and dedication.',
    store_title: 'Marimaras Paz store',
    works_eyebrow: 'Our work',
    works_title: 'Featured work',
    works_desc: 'Real results — braids, nails and beauty with care.',
    prod_title: 'Take care of yourself with quality products',
    about_title: 'About us',
    about_sub: 'Care, warmth and dedication in every detail',
    about_eyebrow: 'Our story',
    about_heading: 'Beauty with purpose',
    about_p1: 'Marimaras Paz was born from a passion for enhancing each client\'s natural beauty. In our space, every braid, every treatment and every detail on the nails is done with time, skill and respect for what makes each person unique.',
    about_p2: 'We work with selected products and close service — so you feel at home from the first visit.',
    info_hours: 'Mon – Sat · 09:00 – 18:00',
    info_place: 'Luanda, Angola',
    cta_book: 'Book appointment',
    cta_shop: 'Shop now'
  }
};

MP.DEFAULT_CONTACT = {
  phone_display: '938 565 536',
  whatsapp: '244938565536',
  hours: 'Seg – Sáb · 09:00 – 18:00',
  place: 'Luanda, Angola',
  email: ''
};

MP.DEFAULT_SITE_VIDEOS = {
  hero: 'assets/salon-tour.mp4',
  work_pedicure: 'assets/work-pedicure.mp4',
  work_hospitality: 'assets/work-hospitality.mp4',
  work_nails: 'assets/work-nails-stiletto.mp4'
};

MP.SITE_VIDEO_SLOTS = [
  { key: 'hero', label: 'Vídeo hero (tour do salão)', group: 'Home', accept: 'video/*' },
  { key: 'work_pedicure', label: 'Vídeo pedicure', group: 'Trabalhos', accept: 'video/*' },
  { key: 'work_hospitality', label: 'Vídeo hospitalidade', group: 'Trabalhos', accept: 'video/*' },
  { key: 'work_nails', label: 'Vídeo unhas / stiletto', group: 'Trabalhos', accept: 'video/*' }
];

/** Field definitions for admin text editor (group + keys). */
MP.TEXT_FIELDS = [
  { group: 'Barra / anúncio', keys: [
    { key: 'announce', label: 'Texto da barra superior', multiline: false }
  ]},
  { group: 'Hero (página inicial)', keys: [
    { key: 'hero_eyebrow', label: 'Eyebrow', multiline: false },
    { key: 'hero_title', label: 'Título principal', multiline: false },
    { key: 'hero_sub', label: 'Subtítulo', multiline: true }
  ]},
  { group: 'Secções home', keys: [
    { key: 'store_title', label: 'Título da loja', multiline: false },
    { key: 'works_eyebrow', label: 'Trabalhos — eyebrow', multiline: false },
    { key: 'works_title', label: 'Trabalhos — título', multiline: false },
    { key: 'works_desc', label: 'Trabalhos — descrição', multiline: true }
  ]},
  { group: 'Produtos', keys: [
    { key: 'prod_title', label: 'Subtítulo da página produtos', multiline: false }
  ]},
  { group: 'Sobre', keys: [
    { key: 'about_title', label: 'Título da página', multiline: false },
    { key: 'about_sub', label: 'Subtítulo da página', multiline: false },
    { key: 'about_eyebrow', label: 'Eyebrow', multiline: false },
    { key: 'about_heading', label: 'Título da secção', multiline: false },
    { key: 'about_p1', label: 'Parágrafo 1', multiline: true },
    { key: 'about_p2', label: 'Parágrafo 2', multiline: true }
  ]},
  { group: 'Botões CTA', keys: [
    { key: 'cta_book', label: 'Botão agendar', multiline: false },
    { key: 'cta_shop', label: 'Botão comprar', multiline: false }
  ]}
];
