/* Marimaras Paz — shared interactions + cart + live catalog */
/* Depends on js/products.js (MP.* defaults) */

(function () {
  'use strict';

  const CART_KEY = (window.MP && MP.CART_KEY) || 'marimaraspaz_cart';
  const LS = {
    products: 'mp_products_override',
    zones: 'mp_zones_override',
    texts: 'mp_texts_override',
    images: 'mp_images_override',
    media: 'mp_media_library'
  };

  let liveProducts = (window.MP && MP.PRODUCTS) ? MP.PRODUCTS.slice() : [];
  let liveZones = (window.MP && MP.DELIVERY_ZONES) ? MP.DELIVERY_ZONES.slice() : [];
  let liveTexts = (window.MP && MP.DEFAULT_TEXTS) ? JSON.parse(JSON.stringify(MP.DEFAULT_TEXTS)) : { pt: {}, en: {} };
  let liveImages = (window.MP && MP.DEFAULT_SITE_IMAGES) ? Object.assign({}, MP.DEFAULT_SITE_IMAGES) : {};
  let liveContact = (window.MP && MP.DEFAULT_CONTACT) ? Object.assign({}, MP.DEFAULT_CONTACT) : {};
  let liveVideos = (window.MP && MP.DEFAULT_SITE_VIDEOS) ? Object.assign({}, MP.DEFAULT_SITE_VIDEOS) : {};
  let liveServices = (window.MP && MP.SERVICES) ? JSON.parse(JSON.stringify(MP.SERVICES)) : [];

  function loadOverrides() {
    try {
      const p = localStorage.getItem(LS.products);
      if (p) liveProducts = JSON.parse(p);
    } catch (e) {}
    try {
      const z = localStorage.getItem(LS.zones);
      if (z) liveZones = JSON.parse(z);
    } catch (e) {}
    try {
      const t = localStorage.getItem(LS.texts);
      if (t) {
        const o = JSON.parse(t);
        liveTexts = { pt: Object.assign({}, liveTexts.pt, o.pt || {}), en: Object.assign({}, liveTexts.en, o.en || {}) };
      }
    } catch (e) {}
    try {
      const i = localStorage.getItem(LS.images);
      if (i) Object.assign(liveImages, JSON.parse(i));
    } catch (e) {}
    try {
      const c = localStorage.getItem('mp_contact_override');
      if (c) Object.assign(liveContact, JSON.parse(c));
    } catch (e) {}
    try {
      const v = localStorage.getItem('mp_videos_override');
      if (v) Object.assign(liveVideos, JSON.parse(v));
    } catch (e) {}
    try {
      const s = localStorage.getItem('mp_services_override');
      if (s) liveServices = JSON.parse(s);
    } catch (e) {}
  }

  async function fetchRemoteCatalog() {
    const url = (window.MP && MP.CATALOG_JSON_URL) || '';
    if (!url) return;
    try {
      const res = await fetch(url + '?t=' + Date.now(), { cache: 'no-store' });
      if (!res.ok) return;
      const data = await res.json();
      if (Array.isArray(data.products) && data.products.length) liveProducts = data.products;
      if (Array.isArray(data.zones) && data.zones.length) liveZones = data.zones;
      if (data.texts) {
        liveTexts = {
          pt: Object.assign({}, liveTexts.pt, data.texts.pt || {}),
          en: Object.assign({}, liveTexts.en, data.texts.en || {})
        };
      }
      if (data.images) Object.assign(liveImages, data.images);
      if (data.contact) Object.assign(liveContact, data.contact);
      if (data.videos) Object.assign(liveVideos, data.videos);
      if (Array.isArray(data.services) && data.services.length) liveServices = data.services;
    } catch (e) {
      console.warn('Catalog remote unavailable, using defaults', e);
    }
  }

  function applySiteVideos() {
    // Hero source
    document.querySelectorAll('[data-site-video]').forEach(el => {
      const key = el.getAttribute('data-site-video');
      const url = liveVideos[key];
      if (!url) return;
      if (el.tagName === 'SOURCE') {
        el.src = url;
        const vid = el.parentElement;
        if (vid && vid.tagName === 'VIDEO') {
          try { vid.load(); } catch (e) {}
        }
      } else if (el.tagName === 'VIDEO') {
        el.src = url;
        try { el.load(); } catch (e) {}
      } else if (el.hasAttribute('data-video') || el.classList.contains('works-slide-video') || el.classList.contains('works-card-video')) {
        el.setAttribute('data-video', url);
      }
    });
    // Also map known keys onto elements with matching data-site-video-key on parents
    document.querySelectorAll('[data-site-video-key]').forEach(el => {
      const key = el.getAttribute('data-site-video-key');
      if (liveVideos[key]) el.setAttribute('data-video', liveVideos[key]);
    });
  }

  function applyCatalogTexts() {
    if (!liveTexts) return;
    // Merge into I18N when it exists (defined later in this IIFE — called after)
    if (typeof I18N === 'undefined') return;
    ['pt', 'en'].forEach(lang => {
      if (!liveTexts[lang]) return;
      Object.keys(liveTexts[lang]).forEach(k => {
        if (liveTexts[lang][k] != null && liveTexts[lang][k] !== '') {
          I18N[lang][k] = liveTexts[lang][k];
        }
      });
      // Map legacy keys from early admin
      if (liveTexts[lang].heroTitle) I18N[lang].hero_title = liveTexts[lang].heroTitle;
      if (liveTexts[lang].heroSub) I18N[lang].hero_sub = liveTexts[lang].heroSub;
    });
    // Contact → i18n hours/place + announce if phone display set
    if (liveContact.hours) {
      I18N.pt.info_hours = liveContact.hours;
      // keep EN separate if texts has it
    }
    if (liveContact.place) {
      I18N.pt.info_place = liveContact.place;
    }
    if (liveContact.phone_display) {
      document.querySelectorAll('[data-phone-display]').forEach(el => {
        el.textContent = liveContact.phone_display;
      });
    }
  }


  function getServices() { return liveServices.filter(s => s && s.active !== false); }

  function formatKzSvc(n) {
    if (n == null || isNaN(n)) return '—';
    return Number(n).toLocaleString('pt-AO') + ' Kz';
  }

  function renderBookingServices() {
    const acc = document.getElementById('svcAccordion');
    if (!acc) return;
    const cats = (window.MP && MP.SERVICE_CATEGORIES) || [];
    const services = getServices();
    const lang = (typeof currentLang !== 'undefined' ? currentLang : 'pt') || 'pt';
    acc.innerHTML = cats.map((cat, idx) => {
      const items = services.filter(s => s.category === cat.id);
      if (!items.length) return '';
      const title = (lang === 'en' && cat.name_en) ? cat.name_en : cat.name;
      const open = idx === 0 ? ' is-open' : '';
      const expanded = idx === 0 ? 'true' : 'false';
      const options = items.map(s => {
        const name = (lang === 'en' && s.name_en) ? s.name_en : s.name;
        return `<label class="service-option">
            <input type="checkbox" data-name="${String(name).replace(/"/g, '&quot;')}" data-price="${s.price || 0}" data-id="${s.id || ''}">
            <span class="service-option-info"><span class="service-option-name">${name}</span><span class="service-option-price">${formatKzSvc(s.price)}</span></span>
          </label>`;
      }).join('');
      return `<div class="svc-acc${open}" data-acc="${idx}">
          <button type="button" class="svc-acc-header" aria-expanded="${expanded}" aria-controls="svc-panel-${idx}">
            <span class="svc-acc-left">
              <span class="svc-acc-title" data-i18n="${cat.i18n || ''}">${title}</span>
              <span class="svc-acc-count" data-count="0" hidden></span>
            </span>
            <span class="svc-acc-right">
              <span class="svc-acc-hint">${items.length} <span data-i18n="opts">opções</span></span>
              <span class="svc-acc-chevron" aria-hidden="true"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M6 9l6 6 6-6"/></svg></span>
            </span>
          </button>
          <div class="svc-acc-panel" id="svc-panel-${idx}" role="region">
            <div class="svc-acc-panel-inner">${options}</div>
          </div>
        </div>`;
    }).join('');
    // re-bind accordion if needed - click delegation on header
    if (!acc.dataset.bound) {
      acc.dataset.bound = '1';
      acc.addEventListener('click', e => {
        const btn = e.target.closest('.svc-acc-header');
        if (!btn) return;
        const item = btn.closest('.svc-acc');
        if (!item) return;
        const open = item.classList.toggle('is-open');
        btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      });
    }
    if (typeof applyI18n === 'function') applyI18n(typeof currentLang !== 'undefined' ? currentLang : 'pt');
  }

  function renderHomePrices() {
    const root = document.getElementById('servicesPriceRoot');
    if (!root) return;
    const cats = (window.MP && MP.SERVICE_CATEGORIES) || [];
    const services = getServices();
    const lang = (typeof currentLang !== 'undefined' ? currentLang : 'pt') || 'pt';
    root.innerHTML = cats.map(cat => {
      const items = services.filter(s => s.category === cat.id);
      if (!items.length) return '';
      const title = (lang === 'en' && cat.name_en) ? cat.name_en : cat.name;
      const rows = items.map(s => {
        const name = (lang === 'en' && s.name_en) ? s.name_en : s.name;
        return `<div class="price-row"><span>${name}</span><span class="dots"></span><span>${formatKzSvc(s.price)}</span></div>`;
      }).join('');
      return `<div class="price-block">
          <div class="price-block-header">
            <h3 class="price-block-title" data-i18n="${cat.i18n || ''}">${title}</h3>
          </div>
          ${rows}
        </div>`;
    }).join('');
    if (typeof applyI18n === 'function') applyI18n(typeof currentLang !== 'undefined' ? currentLang : 'pt');
  }

  function waNumber() {
    const n = (liveContact && liveContact.whatsapp) || (window.MP && MP.WHATSAPP) || '244938565536';
    return String(n).replace(/\D/g, '');
  }

  function getProducts() { return liveProducts; }
  function getZones() { return liveZones; }
  function getSiteImages() { return liveImages; }

  function applySiteImages() {
    document.querySelectorAll('[data-site-img]').forEach(el => {
      const key = el.getAttribute('data-site-img');
      if (liveImages[key]) {
        if (el.tagName === 'IMG' || el.tagName === 'SOURCE') el.src = liveImages[key];
        else if (el.tagName === 'VIDEO') el.poster = liveImages[key];
      }
    });
    document.querySelectorAll('[data-site-img-bg]').forEach(el => {
      const key = el.getAttribute('data-site-img-bg');
      if (liveImages[key]) el.style.setProperty('--site-img-' + key, 'url("' + liveImages[key] + '")');
    });
    if (liveImages.hero) document.documentElement.style.setProperty('--hero-bg', 'url("' + liveImages.hero + '")');
  }

  function catLabel(cat, lang) {
    const map = {
      skincare: { pt: 'Skincare', en: 'Skincare' },
      body: { pt: 'Corpo', en: 'Body' },
      deo: { pt: 'Desodorantes', en: 'Deodorants' },
      hair: { pt: 'Cabelo', en: 'Hair' }
    };
    return (map[cat] && map[cat][lang]) || cat || '';
  }

  function renderProductsGrid() {
    const grid = document.querySelector('.products-page-grid');
    if (!grid) return;
    const lang = (typeof currentLang !== 'undefined' ? currentLang : 'pt') || 'pt';
    const products = getProducts().filter(p => p && p.id);
    grid.innerHTML = products.map(p => {
      const name = (lang === 'en' && p.name_en) ? p.name_en : p.name;
      const desc = (lang === 'en' && p.desc_en) ? p.desc_en : (p.desc || '');
      const img = p.image
        ? '<img src="' + p.image + '" alt="' + String(name || '').replace(/"/g, '&quot;') + '" loading="lazy">'
        : '';
      const priceHtml = p.consult || !p.price
        ? '<p class="prod-card-price">Consulte</p>'
        : '<p class="prod-card-price">' + formatKz(p.price) + '</p>';
      const avail = (p.available !== false && !p.consult)
        ? '<p class="prod-card-avail" data-i18n="available">Disponível</p>'
        : '<p class="prod-card-avail">Consulte</p>';
      const btn = (p.available !== false && p.price > 0)
        ? '<button class="btn btn-outline btn-sm" data-add-cart data-id="' + p.id + '" data-name="' + String(name || '').replace(/"/g, '&quot;') + '" data-price="' + p.price + '" data-i18n="add_cart">Adicionar ao carrinho</button>'
        : '';
      return (
        '<article class="prod-card" data-category="' + (p.category || '') + '">' +
          '<div class="prod-card-img">' + img + '</div>' +
          '<div class="prod-card-body">' +
            '<span class="prod-card-cat">' + catLabel(p.category, lang) + '</span>' +
            '<h3 class="prod-card-name">' + (name || '') + '</h3>' +
            (desc ? '<p class="prod-card-desc">' + desc + '</p>' : '') +
            avail + priceHtml + btn +
          '</div>' +
        '</article>'
      );
    }).join('');
    if (typeof applyI18n === 'function') applyI18n(currentLang);
  }

  // ---------- Cart store ----------
  function getCart() {
    try {
      return JSON.parse(localStorage.getItem(CART_KEY)) || [];
    } catch {
      return [];
    }
  }

  function saveCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    updateCartUI();
  }

  function addToCart(product) {
    const cart = getCart();
    const existing = cart.find(i => i.id === product.id);
    if (existing) {
      existing.qty += 1;
    } else {
      cart.push({ ...product, qty: 1 });
    }
    saveCart(cart);
  }

  function updateQty(id, delta) {
    let cart = getCart();
    const item = cart.find(i => i.id === id);
    if (!item) return;
    item.qty += delta;
    if (item.qty <= 0) {
      cart = cart.filter(i => i.id !== id);
    }
    saveCart(cart);
  }

  function removeFromCart(id) {
    saveCart(getCart().filter(i => i.id !== id));
  }

  function clearCart() {
    saveCart([]);
  }

  function cartTotal() {
    return getCart().reduce((sum, i) => sum + i.price * i.qty, 0);
  }

  function cartCount() {
    return getCart().reduce((sum, i) => sum + i.qty, 0);
  }

  function formatKz(n) {
    if (n == null || isNaN(n)) return '—';
    return Number(n).toLocaleString('pt-AO') + ' Kz';
  }

  window.MPApp = {
    getProducts, getZones, getSiteImages, getCart, formatKz, renderProductsGrid, applySiteImages,
    getContact: function () { return liveContact; },
    getTexts: function () { return liveTexts; },
    getVideos: function () { return liveVideos; },
    getServices: function () { return liveServices; },
    reloadCatalog: async function () {
      loadOverrides();
      await fetchRemoteCatalog();
      loadOverrides();
      renderProductsGrid();
      applySiteImages();
      applySiteVideos();
      applyCatalogTexts();
      renderBookingServices();
      renderHomePrices();
      if (typeof applyI18n === 'function') applyI18n(typeof currentLang !== 'undefined' ? currentLang : 'pt');
    }
  };

  // ---------- Cart UI ----------
  function updateCartUI() {
    const count = cartCount();
    document.querySelectorAll('.cart-count').forEach(el => {
      el.textContent = count || '';
      el.setAttribute('data-count', count);
    });

    const itemsEl = document.getElementById('cartItems');
    const totalEl = document.getElementById('cartTotal');
    if (!itemsEl) return;

    const cart = getCart();
    if (cart.length === 0) {
      itemsEl.innerHTML = '<p class="cart-empty">' + t('cart_empty') + '</p>';
    } else {
      itemsEl.innerHTML = cart.map(item => `
        <div class="cart-item" data-id="${item.id}">
          <div>
            <div class="cart-item-name">${item.name}</div>
            <div class="cart-item-price">${formatKz(item.price)}</div>
          </div>
          <div class="cart-item-controls">
            <button class="qty-btn" data-action="minus" aria-label="${t('cart_minus')}">−</button>
            <span class="qty-val">${item.qty}</span>
            <button class="qty-btn" data-action="plus" aria-label="${t('cart_plus')}">+</button>
            <button class="cart-item-remove" data-action="remove">${t('cart_remove')}</button>
          </div>
        </div>
      `).join('');
    }

    if (totalEl) totalEl.textContent = formatKz(cartTotal());
  }

  // ---------- Elements ----------
  const header = document.getElementById('siteHeader');
  const announceBar = document.getElementById('announceBar');
  const hamburger = document.getElementById('hamburger');
  const drawer = document.getElementById('drawer');
  const drawerOverlay = document.getElementById('drawerOverlay');
  const drawerClose = document.getElementById('drawerClose');
  const langToggle = document.getElementById('langToggle');
  const cartBtn = document.getElementById('cartBtn');
  const cartPanel = document.getElementById('cartPanel');
  const cartOverlay = document.getElementById('cartOverlay');
  const cartClose = document.getElementById('cartClose');

  // ---------- i18n ----------
  const I18N = {
    pt: {
      announce: 'Agende o seu horário • 938 565 536',
      nav_home: 'Início', nav_works: 'Trabalhos', nav_services: 'Serviços',
      nav_products: 'Produtos', nav_about: 'Sobre', nav_book: 'Agendar', nav_contact: 'Contacto',
      cta_book: 'Agendar horário', cta_services: 'Ver Serviços', cta_now: 'Agendar Agora',
      cta_shop: 'Compre agora', cta_more_works: 'Ver mais trabalhos',
      cart_title: 'Carrinho', cart_empty: 'O seu carrinho está vazio', cart_total: 'Total',
      cart_checkout: 'Finalizar compra', cart_clear: 'Limpar carrinho', cart_continue: 'Continuar a comprar',
      cart_remove: 'Remover', cart_minus: 'Diminuir', cart_plus: 'Aumentar',
      footer_signup: 'Receba novidades e promoções', footer_subscribe: 'Subscrever',
      footer_legal: 'Ao subscrever, aceita receber novidades e actualizações directamente no seu telemóvel.',
      footer_phone_ph: 'O seu número WhatsApp',
      footer_copy: '© 2026 Marimaras Paz · Estética e Beleza',
      about_eyebrow: 'A nossa história', about_heading: 'Beleza com propósito',
      about_p1: 'A Marimaras Paz nasceu da paixão por realçar a beleza natural de cada cliente. No nosso espaço, cada trança, cada tratamento e cada detalhe nas unhas é feito com tempo, técnica e respeito pelo que torna cada pessoa única.',
      about_more: 'Conhecer melhor', about_title: 'Sobre nós', about_sub: 'Cuidado, carinho e dedicação em cada detalhe',
      about_p2: 'Trabalhamos com produtos seleccionados e um atendimento próximo — para que se sinta em casa desde a primeira visita.',
      trust_eyebrow: 'Clientes', trust_title: 'O que dizem de nós',
      trust_q1: '“As minhas tranças ficaram perfeitas e o atendimento foi impecável.”',
      trust_q2: '“Unhas lindas e um espaço acolhedor. Recomendo vivamente.”',
      trust_q3: '“Cuidado em cada detalhe. Saí a sentir-me renovada.”',
      trust_author: '— Cliente satisfeita',
      stat_care: 'Cuidado', stat_hand: 'Feito à mão', stat_book: 'Agendamento fácil',
      info_hours_label: 'Horário', info_hours: 'Seg – Sáb · 09:00 – 18:00',
      info_place_label: 'Localização', info_place: 'Luanda, Angola', info_phone_label: 'Contacto',
      book_selected: 'Serviços seleccionados',
      wa_label: 'WhatsApp',
      hero_eyebrow: 'Salão de Beleza Premium',
      hero_title: 'Realçamos a beleza que há em si',
      hero_sub: 'Tranças, unhas, tratamentos e produtos de qualidade — com cuidado, carinho e dedicação.',
      store_title: 'Marimaras Paz loja',
      works_eyebrow: 'O nosso trabalho', works_title: 'Trabalhos realizados',
      works_desc: 'Resultados reais — tranças, unhas e beleza com cuidado.',
      prices_eyebrow: 'Tabela de preços', prices_title: 'Serviços e preços',
      prices_desc: 'Valores em Kwanzas. Tamanhos S / M / C conforme aplicável.',
      cat_kids: 'Tranças para Crianças', cat_treat: 'Tratamentos', cat_braids: 'Tranças',
      cat_braids_adult: 'Tranças (Adultos)', cat_ext: 'Alongamentos', cat_nails: 'Unhas',
      extras: 'Extras', popular: 'Popular',
      contact_title: 'Fale connosco', contact_heading: 'Contacto',
      brand_secondary: 'ESTÉTICA E BELEZA',
      // booking
      book_title: 'Agendar horário',
      book_sub: 'Seleccione os serviços e envie o pedido via WhatsApp',
      book_name: 'Nome completo', book_name_err: 'Indique o seu nome.',
      book_phone: 'Telefone / WhatsApp', book_phone_err: 'Indique um telefone válido.',
      book_date: 'Data preferida', book_date_err: 'Escolha uma data.',
      book_time: 'Hora preferida', book_time_err: 'Escolha uma hora.',
      book_note: 'Nota adicional', book_optional: '(opcional)',
      book_total: 'Total estimado',
      book_submit: 'Enviar agendamento via WhatsApp',
      opts: 'opções',
      // products
      prod_title: 'Cuide de si com produtos de qualidade',
      filter_all: 'Todos', filter_skin: 'Skincare', filter_body: 'Corpo',
      filter_hair: 'Cabelo', filter_deo: 'Desodorantes',
      add_cart: 'Adicionar ao carrinho', available: 'Disponível', consult: 'Consultar',
      // works page
      works_page_title: 'Trabalhos',
      works_tagline: 'Realçamos a beleza que há em si.',
      works_sub: 'Tranças, unhas, tratamentos e produtos — com cuidado, carinho e dedicação.',
      // checkout
      checkout_title: 'Checkout', checkout_sub: 'Finalize o seu pedido',
      checkout_name: 'Nome completo', checkout_phone: 'Telefone / WhatsApp',
      checkout_loc: 'Localização', checkout_mun: 'Município', checkout_bairro: 'Bairro',
      checkout_email: 'Email', checkout_msg: 'Mensagem',
      checkout_submit: 'Enviar pedido via WhatsApp',
      checkout_empty: 'O carrinho está vazio.',
      checkout_empty_link: 'Ver produtos',
      checkout_summary: 'Resumo do pedido',
      checkout_sent: 'Pedido enviado! Será redirecionado para o WhatsApp.',
      // JS alerts / WA
      sub_invalid: 'Introduza um número de WhatsApp válido.',
      sub_thanks: 'Obrigado! Pedido de subscrição enviado. Receberá novidades neste número.',
      sub_msg: 'Olá! Quero subscrever as novidades e promoções da Marimaras Paz. O meu número é ',
      // price blurbs
      blurb_bobs: 'Ideal para um look volumoso e duradouro.',
      blurb_ext: 'Comprimento e volume com acabamento elegante.',
      blurb_softgel: 'Acabamento natural e resistente · cerca de 1h.',
      // service name translations (common labels)
      svc_pochinho: 'Pochinho de tranças',
      svc_bobs_s: 'Bobs S', svc_bobs_c: 'Bobs C',
      svc_bobs_viradas: 'Bobs + Viradas',
      svc_cordoletes: 'Cordoletes',
      svc_pochinho_trab: 'Pochinho trabalhado',
      svc_bolinhas: 'Bolinhas', svc_punhos: 'Punhos',
      svc_lavagem: 'Lavagem',
      svc_desfiliso: 'Desfiliso',
      svc_breche: 'Breche', svc_dedoliso: 'Dedoliso',
      svc_pintura: 'Pintura', svc_fitagem: 'Fitagem',
      svc_peruca_lisa: 'Tratar peruca lisa',
      svc_peruca_cach: 'Tratar peruca cacheada',
      svc_rolos: 'Meter rolos',
      svc_mao_basica: 'Mão (básica)', svc_pe_basico: 'Pé (básico)',
      svc_pedicure: 'Pedicure', svc_gelinho: 'Gelinho',
      svc_unhas_gel: 'Unhas de gel', svc_softgel: 'Softgel',
      svc_polygel: 'Unhas polygel', svc_porcelana: 'Unhas de porcelana',
      svc_pedraria: 'Pedraria', svc_remocao: 'Remoção',
      svc_manutencao: 'Manutenção', svc_construcao: 'Construção',
      close: 'Fechar'
    },
    en: {
      announce: 'Book your appointment • 938 565 536',
      nav_home: 'Home', nav_works: 'Work', nav_services: 'Services',
      nav_products: 'Products', nav_about: 'About', nav_book: 'Book', nav_contact: 'Contact',
      cta_book: 'Book appointment', cta_services: 'View services', cta_now: 'Book now',
      cta_shop: 'Shop now', cta_more_works: 'See more work',
      cart_title: 'Cart', cart_empty: 'Your cart is empty', cart_total: 'Total',
      cart_checkout: 'Checkout', cart_clear: 'Clear cart', cart_continue: 'Continue shopping',
      cart_remove: 'Remove', cart_minus: 'Decrease', cart_plus: 'Increase',
      footer_signup: 'Get news and offers', footer_subscribe: 'Subscribe',
      footer_legal: 'By subscribing, you agree to receive news and updates on your phone.',
      footer_phone_ph: 'Your WhatsApp number',
      footer_copy: '© 2026 Marimaras Paz · Beauty & Aesthetics',
      about_eyebrow: 'Our story', about_heading: 'Beauty with purpose',
      about_p1: 'Marimaras Paz was born from a passion for enhancing each client’s natural beauty. In our space, every braid, every treatment and every detail on the nails is done with time, skill and respect for what makes each person unique.',
      about_more: 'Learn more', about_title: 'About us', about_sub: 'Care, warmth and dedication in every detail',
      about_p2: 'We work with selected products and close service — so you feel at home from the first visit.',
      trust_eyebrow: 'Clients', trust_title: 'What they say',
      trust_q1: '“My braids turned out perfect and the service was impeccable.”',
      trust_q2: '“Beautiful nails and a welcoming space. Highly recommend.”',
      trust_q3: '“Care in every detail. I left feeling renewed.”',
      trust_author: '— Happy client',
      stat_care: 'Care', stat_hand: 'Handmade', stat_book: 'Easy booking',
      info_hours_label: 'Hours', info_hours: 'Mon – Sat · 09:00 – 18:00',
      info_place_label: 'Location', info_place: 'Luanda, Angola', info_phone_label: 'Contact',
      book_selected: 'Selected services',
      wa_label: 'WhatsApp',
      hero_eyebrow: 'Premium Beauty Salon',
      hero_title: 'We enhance the beauty within you',
      hero_sub: 'Braids, nails, treatments and quality products — with care, warmth and dedication.',
      store_title: 'Marimaras Paz store',
      works_eyebrow: 'Our work', works_title: 'Featured work',
      works_desc: 'Real results — braids, nails and beauty with care.',
      prices_eyebrow: 'Price list', prices_title: 'Services & prices',
      prices_desc: 'Prices in Kwanzas. Sizes S / M / C where applicable.',
      cat_kids: 'Kids’ braids', cat_treat: 'Treatments', cat_braids: 'Braids',
      cat_braids_adult: 'Braids (Adults)', cat_ext: 'Extensions', cat_nails: 'Nails',
      extras: 'Extras', popular: 'Popular',
      contact_title: 'Get in touch', contact_heading: 'Contact',
      brand_secondary: 'BEAUTY & AESTHETICS',
      book_title: 'Book appointment',
      book_sub: 'Select services and send your request via WhatsApp',
      book_name: 'Full name', book_name_err: 'Please enter your name.',
      book_phone: 'Phone / WhatsApp', book_phone_err: 'Please enter a valid phone number.',
      book_date: 'Preferred date', book_date_err: 'Please choose a date.',
      book_time: 'Preferred time', book_time_err: 'Please choose a time.',
      book_note: 'Additional note', book_optional: '(optional)',
      book_total: 'Estimated total',
      book_submit: 'Send booking via WhatsApp',
      opts: 'options',
      prod_title: 'Take care of yourself with quality products',
      filter_all: 'All', filter_skin: 'Skincare', filter_body: 'Body',
      filter_hair: 'Hair', filter_deo: 'Deodorants',
      add_cart: 'Add to cart', available: 'In stock', consult: 'Enquire',
      works_page_title: 'Work',
      works_tagline: 'We enhance the beauty within you.',
      works_sub: 'Braids, nails, treatments and products — with care, warmth and dedication.',
      checkout_title: 'Checkout', checkout_sub: 'Complete your order',
      checkout_name: 'Full name', checkout_phone: 'Phone / WhatsApp',
      checkout_loc: 'Location', checkout_mun: 'Municipality', checkout_bairro: 'Neighbourhood',
      checkout_email: 'Email', checkout_msg: 'Message',
      checkout_submit: 'Send order via WhatsApp',
      checkout_empty: 'Your cart is empty.',
      checkout_empty_link: 'View products',
      checkout_summary: 'Order summary',
      checkout_sent: 'Order sent! You will be redirected to WhatsApp.',
      sub_invalid: 'Please enter a valid WhatsApp number.',
      sub_thanks: 'Thank you! Subscription request sent. You will receive updates on this number.',
      sub_msg: 'Hi! I want to subscribe to Marimaras Paz news and offers. My number is ',
      blurb_bobs: 'Ideal for a voluminous, long-lasting look.',
      blurb_ext: 'Length and volume with an elegant finish.',
      blurb_softgel: 'Natural, durable finish · about 1 hour.',
      svc_pochinho: 'Braided ponytail',
      svc_bobs_s: 'Bob braids S', svc_bobs_c: 'Bob braids C',
      svc_bobs_viradas: 'Bob braids + twists',
      svc_cordoletes: 'Cordoletes',
      svc_pochinho_trab: 'Styled ponytail',
      svc_bolinhas: 'Beads', svc_punhos: 'Cuffs',
      svc_lavagem: 'Wash',
      svc_desfiliso: 'Relaxer',
      svc_breche: 'Highlights', svc_dedoliso: 'Finger-wave straighten',
      svc_pintura: 'Colour', svc_fitagem: 'Tape-in',
      svc_peruca_lisa: 'Straight wig care',
      svc_peruca_cach: 'Curly wig care',
      svc_rolos: 'Rollers',
      svc_mao_basica: 'Basic manicure', svc_pe_basico: 'Basic pedicure',
      svc_pedicure: 'Pedicure', svc_gelinho: 'Gel polish',
      svc_unhas_gel: 'Gel nails', svc_softgel: 'Soft gel',
      svc_polygel: 'Polygel nails', svc_porcelana: 'Acrylic nails',
      svc_pedraria: 'Nail art / gems', svc_remocao: 'Removal',
      svc_manutencao: 'Maintenance', svc_construcao: 'Build-up',
      close: 'Close'
    }
  };

  let currentLang = localStorage.getItem('mp_lang') || 'pt';

  function t(key) {
    const dict = I18N[currentLang] || I18N.pt;
    return dict[key] != null ? dict[key] : (I18N.pt[key] || key);
  }

  function applyI18n(lang) {
    currentLang = lang;
    const dict = I18N[lang] || I18N.pt;
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (dict[key] != null) el.textContent = dict[key];
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      if (dict[key] != null) el.setAttribute('placeholder', dict[key]);
    });
    document.querySelectorAll('[data-i18n-aria]').forEach(el => {
      const key = el.getAttribute('data-i18n-aria');
      if (dict[key] != null) el.setAttribute('aria-label', dict[key]);
    });
    // Brand secondary line
    document.querySelectorAll('.brand-secondary').forEach(el => {
      if (dict.brand_secondary) el.textContent = dict.brand_secondary;
    });
    if (langToggle) langToggle.textContent = lang === 'pt' ? 'EN' : 'PT';
    document.documentElement.lang = lang;
    // Refresh cart UI so empty/remove strings match language
    if (typeof updateCartUI === 'function') updateCartUI();
    // Refresh checkout summary if present
    if (typeof renderCheckoutSummary === 'function') renderCheckoutSummary();
  }

  applyI18n(currentLang);

  if (langToggle) {
    langToggle.addEventListener('click', () => {
      currentLang = currentLang === 'pt' ? 'en' : 'pt';
      localStorage.setItem('mp_lang', currentLang);
      applyI18n(currentLang);
    });
  }


  // ---------- Scroll ----------
  let lastScroll = 0;
  let ticking = false;

  function onScroll() {
    const y = window.scrollY || window.pageYOffset;
    if (header) {
      if (y > 40) header.classList.add('scrolled');
      else header.classList.remove('scrolled');
    }
    if (announceBar) {
      if (y > lastScroll && y > 80) announceBar.classList.add('hidden');
      else if (y < 60) announceBar.classList.remove('hidden');
    }
    lastScroll = y;
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(onScroll);
      ticking = true;
    }
  }, { passive: true });

  // ---------- Drawer ----------
  function openDrawer() {
    if (!drawer) return;
    drawer.classList.add('open');
    drawerOverlay.classList.add('open');
    hamburger.classList.add('open');
    document.body.classList.add('drawer-open');
  }
  function closeDrawer() {
    if (!drawer) return;
    drawer.classList.remove('open');
    drawerOverlay.classList.remove('open');
    hamburger.classList.remove('open');
    document.body.classList.remove('drawer-open');
  }

  if (hamburger) hamburger.addEventListener('click', () => {
    drawer.classList.contains('open') ? closeDrawer() : openDrawer();
  });
  if (drawerClose) drawerClose.addEventListener('click', closeDrawer);
  if (drawerOverlay) drawerOverlay.addEventListener('click', closeDrawer);
  if (drawer) {
    drawer.querySelectorAll('a').forEach(a => a.addEventListener('click', closeDrawer));
  }

  // ---------- Cart panel ----------
  function openCart() {
    if (!cartPanel) return;
    cartPanel.classList.add('open');
    cartOverlay.classList.add('open');
    document.body.classList.add('cart-open');
    updateCartUI();
  }
  function closeCart() {
    if (!cartPanel) return;
    cartPanel.classList.remove('open');
    cartOverlay.classList.remove('open');
    document.body.classList.remove('cart-open');
  }

  if (cartBtn) cartBtn.addEventListener('click', openCart);
  if (cartClose) cartClose.addEventListener('click', closeCart);
  if (cartOverlay) cartOverlay.addEventListener('click', closeCart);

  // Swipe to close cart
  let touchStartX = 0;
  if (cartPanel) {
    cartPanel.addEventListener('touchstart', e => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    cartPanel.addEventListener('touchend', e => {
      const diff = e.changedTouches[0].screenX - touchStartX;
      if (diff > 80) closeCart();
    }, { passive: true });
  }

  // Cart item controls (event delegation)
  document.addEventListener('click', e => {
    const btn = e.target.closest('[data-action]');
    if (btn) {
      const item = btn.closest('.cart-item');
      if (item) {
        const id = item.dataset.id;
        const action = btn.dataset.action;
        if (action === 'plus') updateQty(id, 1);
        else if (action === 'minus') updateQty(id, -1);
        else if (action === 'remove') removeFromCart(id);
      }
    }
    if (e.target.closest('#clearCartBtn')) {
      clearCart();
    }
    if (e.target.closest('[data-close-cart]')) {
      closeCart();
    }
  });

  // Add to cart buttons
  document.addEventListener('click', e => {
    const btn = e.target.closest('[data-add-cart]');
    if (!btn) return;
    e.preventDefault();
    const product = {
      id: btn.dataset.id,
      name: btn.dataset.name,
      price: parseInt(btn.dataset.price, 10)
    };
    addToCart(product);
    openCart();
  });


  // ---------- Works carousel (homepage) ----------
  (function initWorksCarousel() {
    const track = document.getElementById('worksCarousel');
    if (!track) return;
    const prev = document.getElementById('worksPrev');
    const next = document.getElementById('worksNext');

    function slideBy(dir) {
      const slide = track.querySelector('.works-slide');
      if (!slide) return;
      const amount = slide.offsetWidth + 14;
      track.scrollBy({ left: dir * amount * 2, behavior: 'smooth' });
    }
    if (prev) prev.addEventListener('click', () => slideBy(-1));
    if (next) next.addEventListener('click', () => slideBy(1));

    // Play video on tap — with sound; pause others
    track.addEventListener('click', e => {
      const card = e.target.closest('.works-slide-video');
      if (!card) return;
      const video = card.querySelector('video');
      const src = card.dataset.video;
      if (!video) return;

      // Pause all other carousel videos
      track.querySelectorAll('.works-slide-video').forEach(c => {
        if (c === card) return;
        const v = c.querySelector('video');
        if (v) { v.pause(); v.removeAttribute('src'); v.load(); }
        c.classList.remove('playing');
      });

      if (card.classList.contains('playing')) {
        video.pause();
        card.classList.remove('playing');
        return;
      }
      const startPlay = () => {
        video.muted = false;
        video.volume = 1;
        const p = video.play();
        if (p && p.then) {
          p.then(() => {
            card.classList.add('playing');
            video.muted = false;
            video.volume = 1;
          }).catch(err => {
            console.warn('Video play blocked:', err);
            // User gesture should allow sound; retry once unmuted
            video.muted = false;
            video.play().then(() => card.classList.add('playing')).catch(() => {});
          });
        } else {
          card.classList.add('playing');
        }
      };
      if (!video.getAttribute('src') || video.src.indexOf(src) === -1) {
        video.src = src;
        video.load();
        video.addEventListener('canplay', startPlay, { once: true });
      } else {
        startPlay();
      }
      video.onended = () => card.classList.remove('playing');
    });

    // Pause carousel videos (and stop sound) when scrolled out of view
    if ('IntersectionObserver' in window) {
      const pauseOffscreen = (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) return;
          const card = entry.target;
          const video = card.querySelector('video');
          if (!video) return;
          if (!video.paused) {
            video.pause();
            card.classList.remove('playing');
          }
        });
      };
      const io = new IntersectionObserver(pauseOffscreen, {
        root: null,
        threshold: 0.15
      });
      track.querySelectorAll('.works-slide-video').forEach(card => io.observe(card));
    }
  })();

  // ---------- Works lightbox + video cards ----------
  (function initWorksLightbox() {
    const gallery = document.querySelector('.works-gallery');
    if (!gallery) return;

    // Build lightbox DOM once
    let lb = document.getElementById('lightbox');
    if (!lb) {
      lb = document.createElement('div');
      lb.id = 'lightbox';
      lb.className = 'lightbox';
      lb.innerHTML = `
        <div class="lightbox-inner">
          <button type="button" class="lightbox-close" aria-label="Fechar">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </button>
          <button type="button" class="lightbox-nav lightbox-prev" aria-label="Anterior">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M15 18l-6-6 6-6"/></svg>
          </button>
          <button type="button" class="lightbox-nav lightbox-next" aria-label="Seguinte">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M9 18l6-6-6-6"/></svg>
          </button>
          <div class="lightbox-media"></div>
        </div>`;
      document.body.appendChild(lb);
    }
    const mediaBox = lb.querySelector('.lightbox-media');
    const items = Array.from(gallery.querySelectorAll('figure, .works-card-video'));
    let index = 0;

    function openAt(i) {
      index = (i + items.length) % items.length;
      const el = items[index];
      mediaBox.innerHTML = '';
      if (el.classList.contains('works-card-video')) {
        const v = document.createElement('video');
        v.src = el.dataset.video;
        v.controls = true;
        v.autoplay = true;
        v.playsInline = true;
        v.muted = false;
        v.volume = 1;
        mediaBox.appendChild(v);
        v.play().catch(() => {});
      } else {
        const img = el.querySelector('img');
        if (!img) return;
        const full = document.createElement('img');
        full.src = img.src;
        full.alt = img.alt || '';
        mediaBox.appendChild(full);
      }
      lb.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
    function closeLb() {
      lb.classList.remove('open');
      mediaBox.innerHTML = '';
      document.body.style.overflow = '';
    }

    gallery.addEventListener('click', e => {
      const videoCard = e.target.closest('.works-card-video');
      if (videoCard) {
        e.preventDefault();
        openAt(items.indexOf(videoCard));
        return;
      }
      const fig = e.target.closest('figure');
      if (fig) {
        e.preventDefault();
        openAt(items.indexOf(fig));
      }
    });

    lb.querySelector('.lightbox-close').addEventListener('click', closeLb);
    lb.addEventListener('click', e => { if (e.target === lb) closeLb(); });
    lb.querySelector('.lightbox-prev').addEventListener('click', e => { e.stopPropagation(); openAt(index - 1); });
    lb.querySelector('.lightbox-next').addEventListener('click', e => { e.stopPropagation(); openAt(index + 1); });
    document.addEventListener('keydown', e => {
      if (!lb.classList.contains('open')) return;
      if (e.key === 'Escape') closeLb();
      if (e.key === 'ArrowLeft') openAt(index - 1);
      if (e.key === 'ArrowRight') openAt(index + 1);
    });
  })();


  // ---------- Product image lightbox ----------
  (function initProductLightbox() {
    const grid = document.querySelector('.products-page-grid, .products-grid, .product-grid');
    if (!grid) return;
    let lb = document.getElementById('lightbox');
    if (!lb) {
      lb = document.createElement('div');
      lb.id = 'lightbox';
      lb.className = 'lightbox';
      lb.innerHTML = `
        <div class="lightbox-inner">
          <button type="button" class="lightbox-close" aria-label="Fechar">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </button>
          <div class="lightbox-media"></div>
        </div>`;
      document.body.appendChild(lb);
    }
    const mediaBox = lb.querySelector('.lightbox-media');
    function openImg(src, alt) {
      mediaBox.innerHTML = '';
      const img = document.createElement('img');
      img.src = src;
      img.alt = alt || '';
      mediaBox.appendChild(img);
      lb.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
    function closeLb() {
      lb.classList.remove('open');
      mediaBox.innerHTML = '';
      document.body.style.overflow = '';
    }
    grid.addEventListener('click', e => {
      const imgWrap = e.target.closest('.prod-card-img, .product-img, .prod-card img, .product-card img');
      if (!imgWrap) return;
      // don't intercept add-to-cart
      if (e.target.closest('[data-add-cart], .btn, button, a')) return;
      const img = imgWrap.tagName === 'IMG' ? imgWrap : imgWrap.querySelector('img');
      if (!img) return;
      e.preventDefault();
      openImg(img.src, img.alt);
    });
    const closeBtn = lb.querySelector('.lightbox-close');
    if (closeBtn) closeBtn.addEventListener('click', closeLb);
    lb.addEventListener('click', e => { if (e.target === lb) closeLb(); });
  })();

  // ---------- Hero image → video (Safari-safe autoplay) ----------
  const heroImg = document.getElementById('heroImg');
  const heroVideo = document.getElementById('heroVideo');
  if (heroImg && heroVideo) {
    // Safari / iOS require muted + playsinline attributes AND properties for autoplay
    const forceMutedInline = () => {
      heroVideo.muted = true;
      heroVideo.defaultMuted = true;
      heroVideo.volume = 0;
      heroVideo.playsInline = true;
      heroVideo.setAttribute('muted', '');
      heroVideo.setAttribute('playsinline', '');
      heroVideo.setAttribute('webkit-playsinline', '');
      heroVideo.setAttribute('autoplay', '');
    };
    forceMutedInline();

    let heroStarted = false;
    let unlockBound = false;

    const bindUnlock = () => {
      if (unlockBound) return;
      unlockBound = true;
      const unlock = () => {
        forceMutedInline();
        heroVideo.play().catch(() => {});
        document.removeEventListener('touchstart', unlock);
        document.removeEventListener('touchend', unlock);
        document.removeEventListener('click', unlock);
        document.removeEventListener('scroll', unlock);
      };
      document.addEventListener('touchstart', unlock, { once: true, passive: true });
      document.addEventListener('touchend', unlock, { once: true, passive: true });
      document.addEventListener('click', unlock, { once: true });
      document.addEventListener('scroll', unlock, { once: true, passive: true });
    };

    const tryPlay = () => {
      forceMutedInline();
      const p = heroVideo.play();
      if (p && typeof p.then === 'function') {
        return p.then(() => true).catch(() => {
          bindUnlock();
          return false;
        });
      }
      return Promise.resolve(!heroVideo.paused);
    };

    const startHero = () => {
      if (heroStarted) return;
      heroStarted = true;
      heroVideo.classList.add('active');
      heroImg.classList.add('fade-out');
      tryPlay().then(ok => {
        if (!ok) {
          // Safari sometimes needs a second attempt after a short delay
          setTimeout(() => { tryPlay(); }, 200);
          setTimeout(() => { tryPlay(); }, 800);
        }
      });
    };

    const scheduleStart = () => {
      setTimeout(startHero, 3500);
    };

    // Kick off load early (helps Safari)
    try { heroVideo.load(); } catch (_) {}

    if (heroVideo.readyState >= 2) {
      scheduleStart();
    } else {
      heroVideo.addEventListener('loadeddata', scheduleStart, { once: true });
      heroVideo.addEventListener('canplay', scheduleStart, { once: true });
      setTimeout(() => {
        if (!heroStarted) scheduleStart();
      }, 8000);
    }

    // Resume if Safari pauses when tab was backgrounded / Low Power Mode
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible' && heroStarted && heroVideo.paused) {
        forceMutedInline();
        heroVideo.play().catch(() => bindUnlock());
      }
    });

    // If video stalls or ends loop reset fails, keep it going
    heroVideo.addEventListener('pause', () => {
      if (heroStarted && document.visibilityState === 'visible' && !heroVideo.ended) {
        // Only auto-resume if it wasn't a user-initiated pause on another video context
        setTimeout(() => {
          if (heroVideo.paused && heroStarted) {
            forceMutedInline();
            heroVideo.play().catch(() => {});
          }
        }, 300);
      }
    });
  }

  // ---------- Product filters ----------
  const filterBtns = document.querySelectorAll('.filter-btn');
  const prodCards = document.querySelectorAll('.prod-card');
  if (filterBtns.length) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const cat = btn.dataset.filter;
        prodCards.forEach(card => {
          if (cat === 'all' || card.dataset.category === cat) {
            card.style.display = '';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  // ---------- Checkout summary ----------
  function renderCheckoutSummary() {
    const checkoutSummary = document.getElementById('checkoutSummary');
    if (!checkoutSummary) return;
    const cart = getCart();
    if (cart.length === 0) {
      checkoutSummary.innerHTML = '<p class="checkout-empty">' + t('checkout_empty') + ' <a href="products.html">' + t('checkout_empty_link') + '</a></p>';
    } else {
      let html = '<h3>' + t('checkout_summary') + '</h3>';
      cart.forEach(i => {
        html += `<div class="checkout-line"><span>${i.name} × ${i.qty}</span><span>${formatKz(i.price * i.qty)}</span></div>`;
      });
      html += `<div class="checkout-line total"><span>${t('cart_total')}</span><span>${formatKz(cartTotal())}</span></div>`;
      checkoutSummary.innerHTML = html;
    }
  }
  renderCheckoutSummary();

  const checkoutForm = document.getElementById('checkoutForm');
  if (checkoutForm) {
    checkoutForm.addEventListener('submit', e => {
      e.preventDefault();
      if (getCart().length === 0) {
        alert(t('checkout_empty'));
        return;
      }
      const data = new FormData(checkoutForm);
      const name = data.get('name');
      const phone = data.get('phone');
      const location = data.get('location');
      const municipio = data.get('municipio');
      const bairro = data.get('bairro');
      const email = data.get('email') || '';
      const message = data.get('message') || '';

      let text = `*Novo pedido — Marimaras Paz*%0A%0A`;
      text += `*Cliente:* ${name}%0A`;
      text += `*Telefone:* ${phone}%0A`;
      text += `*Localização:* ${location}%0A`;
      text += `*Município:* ${municipio}%0A`;
      text += `*Bairro:* ${bairro}%0A`;
      if (email) text += `*Email:* ${email}%0A`;
      if (message) text += `*Mensagem:* ${message}%0A`;
      text += `%0A*Produtos:*%0A`;
      getCart().forEach(i => {
        text += `• ${i.name} × ${i.qty} — ${formatKz(i.price * i.qty)}%0A`;
      });
      text += `%0A*Total:* ${formatKz(cartTotal())}`;

      localStorage.removeItem(CART_KEY);
      updateCartUI();
      window.open(`https://wa.me/${waNumber()}?text=${text}`, '_blank');
      alert(t('checkout_sent'));
      checkoutForm.reset();
    });
  }

  // ---------- Booking form ----------
  const bookingForm = document.getElementById('bookingForm');
  const bookingTotalEl = document.getElementById('bookingTotal');

  function updateBookingTotal() {
    if (!bookingTotalEl) return;
    let total = 0;
    const selected = [];
    document.querySelectorAll('.service-option input:checked').forEach(input => {
      const price = parseInt(input.dataset.price || '0', 10);
      total += price;
      selected.push({ name: input.dataset.name || '', price });
    });
    bookingTotalEl.textContent = formatKz(total);

    const sumBox = document.getElementById('bookingSummary');
    const sumList = document.getElementById('bookingSummaryList');
    if (sumBox && sumList) {
      sumList.innerHTML = selected.map(s =>
        '<li><span>' + s.name + '</span><span class="sum-price">' + formatKz(s.price) + '</span></li>'
      ).join('');
      sumBox.classList.toggle('has-items', selected.length > 0);
    }

    document.querySelectorAll('.svc-acc').forEach(acc => {
      const n = acc.querySelectorAll('.service-option input:checked').length;
      const badge = acc.querySelector('.svc-acc-count');
      if (!badge) return;
      if (n > 0) {
        badge.hidden = false;
        badge.textContent = n + (n === 1 ? ' seleccionado' : ' seleccionados');
      } else {
        badge.hidden = true;
        badge.textContent = '';
      }
    });
  }

  (function initSvcAccordion() {
    const root = document.getElementById('svcAccordion');
    if (!root) return;
    root.addEventListener('click', e => {
      const btn = e.target.closest('.svc-acc-header');
      if (!btn) return;
      const item = btn.closest('.svc-acc');
      const willOpen = !item.classList.contains('is-open');
      root.querySelectorAll('.svc-acc.is-open').forEach(el => {
        if (el === item) return;
        el.classList.remove('is-open');
        const b = el.querySelector('.svc-acc-header');
        if (b) b.setAttribute('aria-expanded', 'false');
      });
      item.classList.toggle('is-open', willOpen);
      btn.setAttribute('aria-expanded', willOpen ? 'true' : 'false');
    });
  })();

  if (bookingForm) {
    bookingForm.addEventListener('change', updateBookingTotal);
    updateBookingTotal();

    bookingForm.addEventListener('submit', e => {
      e.preventDefault();
      const data = new FormData(bookingForm);
      const name = (data.get('name') || '').toString().trim();
      const phone = (data.get('phone') || '').toString().trim();
      const date = data.get('date');
      const time = data.get('time');
      const note = data.get('note') || '';

      let ok = true;
      function setErr(id, show) {
        const el = document.getElementById(id);
        const input = document.getElementById(id.replace('err-', ''));
        if (el) el.classList.toggle('show', show);
        if (input) input.classList.toggle('invalid', show);
        if (show) ok = false;
      }
      setErr('err-bname', !name);
      setErr('err-bphone', phone.replace(/\D/g, '').length < 9);
      setErr('err-bdate', !date);
      setErr('err-btime', !time);

      const selected = [];
      document.querySelectorAll('.service-option input:checked').forEach(input => {
        selected.push({
          name: input.dataset.name,
          price: parseInt(input.dataset.price, 10)
        });
      });

      if (selected.length === 0) {
        alert(currentLang === 'en' ? 'Please select at least one service.' : 'Por favor seleccione pelo menos um serviço.');
        return;
      }
      if (!ok) {
        const first = bookingForm.querySelector('.invalid');
        if (first) first.focus();
        return;
      }

      let text = `*Agendamento — Marimaras Paz*%0A%0A`;
      text += `*Cliente:* ${name}%0A`;
      text += `*Telefone:* ${phone}%0A`;
      text += `*Data:* ${date}%0A`;
      text += `*Hora:* ${time}%0A`;
      if (note) text += `*Nota:* ${note}%0A`;
      text += `%0A*Serviços:*%0A`;
      let total = 0;
      selected.forEach(s => {
        text += `• ${s.name} — ${formatKz(s.price)}%0A`;
        total += s.price;
      });
      text += `%0A*Total estimado:* ${formatKz(total)}`;

      window.open(`https://wa.me/${waNumber()}?text=${text}`, '_blank');
    });
  }

  // Escape closes panels
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      closeDrawer();
      closeCart();
    }
  });

  // ---------- WhatsApp subscribe (footer) ----------
  (function initWhatsappSubscribe() {
    document.querySelectorAll('#whatsappSubscribe, form.newsletter-form').forEach(form => {
      form.addEventListener('submit', e => {
        e.preventDefault();
        const input = form.querySelector('input[name="whatsapp"], input[type="tel"]');
        if (!input) return;
        let raw = (input.value || '').replace(/\D/g, '');
        if (raw.length < 9) {
          alert(t('sub_invalid'));
          input.focus();
          return;
        }
        // Normalize AO mobile: if 9 digits starting with 9, prefix 244
        if (raw.length === 9 && raw.startsWith('9')) raw = '244' + raw;
        if (raw.length === 10 && raw.startsWith('09')) raw = '244' + raw.slice(1);

        const msg = encodeURIComponent(
          t('sub_msg') + raw + '.'
        );
        // Notify salon; user already consented via the form note
        window.open('https://wa.me/' + waNumber() + '?text=' + msg, '_blank');
        input.value = '';
        alert(t('sub_thanks'));
      });
    });
  })();

  // Init: cart UI + live catalog
  updateCartUI();

  (async function bootCatalog() {
    loadOverrides();
    await fetchRemoteCatalog();
    loadOverrides(); // same-browser admin drafts win
    renderProductsGrid();
    applySiteImages();
    applySiteVideos();
    applyCatalogTexts();
      renderBookingServices();
      renderHomePrices();
    if (typeof applyI18n === 'function') applyI18n(currentLang || 'pt');
  })();
})();
