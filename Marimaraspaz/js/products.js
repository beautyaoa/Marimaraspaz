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

MP.SERVICE_CATEGORIES = [
  { id: 'kids', name: 'Tranças para Crianças', name_en: "Kids' braids", i18n: 'cat_kids' },
  { id: 'treat', name: 'Tratamentos', name_en: 'Treatments', i18n: 'cat_treat' },
  { id: 'braids', name: 'Tranças (Adultos)', name_en: 'Braids (Adults)', i18n: 'cat_braids_adult' },
  { id: 'ext', name: 'Alongamentos', name_en: 'Extensions', i18n: 'cat_ext' },
  { id: 'nails', name: 'Unhas', name_en: 'Nails', i18n: 'cat_nails' }
];

MP.SERVICES = [
  {
    "id": "pochinho-de-trancas",
    "name": "Pochinho de tranças",
    "price": 6000,
    "category": "kids",
    "active": true
  },
  {
    "id": "bobs-s",
    "name": "Bobs S",
    "price": 4000,
    "category": "kids",
    "active": true
  },
  {
    "id": "bobs-c",
    "name": "Bobs C",
    "price": 8000,
    "category": "kids",
    "active": true
  },
  {
    "id": "bobs-viradas",
    "name": "Bobs + Viradas",
    "price": 6000,
    "category": "kids",
    "active": true
  },
  {
    "id": "cordoletes-s",
    "name": "Cordoletes S",
    "price": 6000,
    "category": "kids",
    "active": true
  },
  {
    "id": "cordoletes-c",
    "name": "Cordoletes C",
    "price": 12000,
    "category": "kids",
    "active": true
  },
  {
    "id": "pochinho-trabalhado-criancas",
    "name": "Pochinho Trabalhado (crianças)",
    "price": 5000,
    "category": "kids",
    "active": true
  },
  {
    "id": "extras-bolinhas",
    "name": "Extras Bolinhas",
    "price": 2000,
    "category": "kids",
    "active": true
  },
  {
    "id": "extras-punhos",
    "name": "Extras Punhos",
    "price": 1000,
    "category": "kids",
    "active": true
  },
  {
    "id": "lavagem",
    "name": "Lavagem",
    "price": 3000,
    "category": "treat",
    "active": true
  },
  {
    "id": "desfiliso-c",
    "name": "Desfiliso C",
    "price": 8000,
    "category": "treat",
    "active": true
  },
  {
    "id": "desfiliso-s",
    "name": "Desfiliso S",
    "price": 5000,
    "category": "treat",
    "active": true
  },
  {
    "id": "breche",
    "name": "Breche",
    "price": 6000,
    "category": "treat",
    "active": true
  },
  {
    "id": "dedoliso",
    "name": "Dedoliso",
    "price": 8000,
    "category": "treat",
    "active": true
  },
  {
    "id": "pintura-s",
    "name": "Pintura S",
    "price": 5000,
    "category": "treat",
    "active": true
  },
  {
    "id": "pintura-c",
    "name": "Pintura C",
    "price": 7000,
    "category": "treat",
    "active": true
  },
  {
    "id": "fitagem-c",
    "name": "Fitagem C",
    "price": 5000,
    "category": "treat",
    "active": true
  },
  {
    "id": "fitagem-s",
    "name": "Fitagem S",
    "price": 3000,
    "category": "treat",
    "active": true
  },
  {
    "id": "tratar-peruca-lisa",
    "name": "Tratar peruca lisa",
    "price": 8000,
    "category": "treat",
    "active": true
  },
  {
    "id": "tratar-peruca-cacheada",
    "name": "Tratar peruca cacheada",
    "price": 7000,
    "category": "treat",
    "active": true
  },
  {
    "id": "meter-rolos",
    "name": "Meter rolos",
    "price": 8000,
    "category": "treat",
    "active": true
  },
  {
    "id": "bobs-americano-normal-m",
    "name": "Bobs americano normal M",
    "price": 16000,
    "category": "braids",
    "active": true
  },
  {
    "id": "bobs-americano-normal-c",
    "name": "Bobs americano normal C",
    "price": 18000,
    "category": "braids",
    "active": true
  },
  {
    "id": "bobs-americano-com-sanguita-m",
    "name": "Bobs americano com sanguita M",
    "price": 18000,
    "category": "braids",
    "active": true
  },
  {
    "id": "bobs-americano-com-sanguita-c",
    "name": "Bobs americano com sanguita C",
    "price": 20000,
    "category": "braids",
    "active": true
  },
  {
    "id": "bobs-americano-com-cachos-s",
    "name": "Bobs americano com cachos S",
    "price": 15000,
    "category": "braids",
    "active": true
  },
  {
    "id": "bobs-americano-com-cachos-m",
    "name": "Bobs americano com cachos M",
    "price": 18000,
    "category": "braids",
    "active": true
  },
  {
    "id": "bobs-americano-com-cachos-c",
    "name": "Bobs americano com cachos C",
    "price": 20000,
    "category": "braids",
    "active": true
  },
  {
    "id": "cordoletes-m",
    "name": "Cordoletes M",
    "price": 17000,
    "category": "braids",
    "active": true
  },
  {
    "id": "cordoletes-c-adultos",
    "name": "Cordoletes C (adultos)",
    "price": 20000,
    "category": "braids",
    "active": true
  },
  {
    "id": "cordoletes-c-cachos",
    "name": "Cordoletes c/ Cachos",
    "price": 20000,
    "category": "braids",
    "active": true
  },
  {
    "id": "d-mao",
    "name": "D mão",
    "price": 13000,
    "category": "braids",
    "active": true
  },
  {
    "id": "twists-m",
    "name": "Twists M",
    "price": 17000,
    "category": "braids",
    "active": true
  },
  {
    "id": "twists-c",
    "name": "Twists C",
    "price": 20000,
    "category": "braids",
    "active": true
  },
  {
    "id": "rasta-m",
    "name": "Rasta M",
    "price": 20000,
    "category": "braids",
    "active": true
  },
  {
    "id": "rasta-c",
    "name": "Rasta C",
    "price": 22000,
    "category": "braids",
    "active": true
  },
  {
    "id": "dreds-m",
    "name": "Dreds M",
    "price": 20000,
    "category": "braids",
    "active": true
  },
  {
    "id": "dreds-c",
    "name": "Dreds C",
    "price": 23000,
    "category": "braids",
    "active": true
  },
  {
    "id": "viradas-3mil",
    "name": "Viradas 3mil",
    "price": 3000,
    "category": "braids",
    "active": true
  },
  {
    "id": "viradas-8mil",
    "name": "Viradas 8mil",
    "price": 8000,
    "category": "braids",
    "active": true
  },
  {
    "id": "alongamento-capilar-c-12-5",
    "name": "Alongamento capilar C 12.5",
    "price": 12500,
    "category": "ext",
    "active": true
  },
  {
    "id": "alongamento-capilar-m",
    "name": "Alongamento capilar M",
    "price": 15000,
    "category": "ext",
    "active": true
  },
  {
    "id": "alongamento-capilar-c-20",
    "name": "Alongamento capilar C 20",
    "price": 20000,
    "category": "ext",
    "active": true
  },
  {
    "id": "xoxo-d-corte",
    "name": "Xoxo d corte",
    "price": 10000,
    "category": "ext",
    "active": true
  },
  {
    "id": "xoxo-aplicacao-c",
    "name": "Xoxo aplicação C",
    "price": 12000,
    "category": "ext",
    "active": true
  },
  {
    "id": "xoxo-aplicacao-m",
    "name": "Xoxo aplicação M",
    "price": 16000,
    "category": "ext",
    "active": true
  },
  {
    "id": "xoxo-aplicacao-c-20",
    "name": "Xoxo aplicação C 20",
    "price": 20000,
    "category": "ext",
    "active": true
  },
  {
    "id": "aplicacao-de-costura",
    "name": "Aplicação de costura",
    "price": 8000,
    "category": "ext",
    "active": true
  },
  {
    "id": "aplicacao-chocolate-m",
    "name": "Aplicação chocolate M",
    "price": 12000,
    "category": "ext",
    "active": true
  },
  {
    "id": "aplicacao-chocolate-c",
    "name": "Aplicação chocolate C",
    "price": 15000,
    "category": "ext",
    "active": true
  },
  {
    "id": "intercalando-c",
    "name": "Intercalando C",
    "price": 10000,
    "category": "ext",
    "active": true
  },
  {
    "id": "intercalando-s",
    "name": "Intercalando S",
    "price": 5000,
    "category": "ext",
    "active": true
  },
  {
    "id": "pochinho-c-fronte",
    "name": "Pochinho c/ fronte",
    "price": 15000,
    "category": "ext",
    "active": true
  },
  {
    "id": "pochinho-trabalhado",
    "name": "Pochinho trabalhado",
    "price": 10000,
    "category": "ext",
    "active": true
  },
  {
    "id": "mao-basica",
    "name": "Mão (básica)",
    "price": 1500,
    "category": "nails",
    "active": true
  },
  {
    "id": "pe-basico",
    "name": "Pé (básico)",
    "price": 1500,
    "category": "nails",
    "active": true
  },
  {
    "id": "pedicure",
    "name": "Pedicure",
    "price": 5000,
    "category": "nails",
    "active": true
  },
  {
    "id": "gelinho",
    "name": "Gelinho",
    "price": 2000,
    "category": "nails",
    "active": true
  },
  {
    "id": "unhas-de-gel",
    "name": "Unhas de gel",
    "price": 3500,
    "category": "nails",
    "active": true
  },
  {
    "id": "softgel",
    "name": "Softgel",
    "price": 5000,
    "category": "nails",
    "active": true
  },
  {
    "id": "unhas-polygel",
    "name": "Unhas polygel",
    "price": 6000,
    "category": "nails",
    "active": true
  },
  {
    "id": "unhas-de-porcelana",
    "name": "Unhas de porcelana",
    "price": 7000,
    "category": "nails",
    "active": true
  },
  {
    "id": "moldfi",
    "name": "MoldFI",
    "price": 6500,
    "category": "nails",
    "active": true
  },
  {
    "id": "pedraria",
    "name": "Pedraria",
    "price": 1000,
    "category": "nails",
    "active": true
  },
  {
    "id": "remocao",
    "name": "Remoção",
    "price": 1500,
    "category": "nails",
    "active": true
  },
  {
    "id": "manutencao",
    "name": "Manutenção",
    "price": 3000,
    "category": "nails",
    "active": true
  },
  {
    "id": "construcao",
    "name": "Construção",
    "price": 1500,
    "category": "nails",
    "active": true
  }
];
