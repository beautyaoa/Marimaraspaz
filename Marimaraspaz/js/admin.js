/**
 * Marimaras Paz — Admin panel
 * Drafts → localStorage | Publish → Worker → Cloudinary catalog.json
 */
(function () {
  'use strict';

  // ——— Config (edit after Worker deploy) ———
  const PUBLISH_URL = 'https://marimaraspaz.beautyaoa.workers.dev/publish';
  const DEFAULT_ADMIN_PASSWORD = 'marimaras2026'; // change after handoff
  const LS = {
    auth: 'mp_admin_auth',
    products: 'mp_products_override',
    zones: 'mp_zones_override',
    texts: 'mp_texts_override',
    images: 'mp_images_override',
    media: 'mp_media_library'
  };

  const cloudName = (window.MP && MP.CLOUD_NAME) || 'gyssk0cm';
  const unsignedPreset = (window.MP && MP.UNSIGNED_PRESET) || 'marimaraspaz_media';
  const folder = (window.MP && MP.CLOUDINARY_FOLDER) || 'marimaraspaz';

  let products = [];
  let zones = [];
  let texts = { pt: {}, en: {} };
  let images = {};
  let media = [];
  let contact = {};
  let videos = {};
  let services = [];
  let editingId = null;
  let editingServiceId = null;
  let serviceFilterCat = '';
  let pickSlotKey = null;
  let textLang = 'pt';

  // ——— Auth ———
  function isAuthed() {
    return sessionStorage.getItem(LS.auth) === '1' || localStorage.getItem(LS.auth) === '1';
  }
  function setAuth(remember) {
    sessionStorage.setItem(LS.auth, '1');
    if (remember) localStorage.setItem(LS.auth, '1');
  }
  function clearAuth() {
    sessionStorage.removeItem(LS.auth);
    localStorage.removeItem(LS.auth);
  }

  // ——— Data load/save ———
  function seedFromDefaults() {
    products = (window.MP && MP.PRODUCTS) ? JSON.parse(JSON.stringify(MP.PRODUCTS)) : [];
    zones = (window.MP && MP.DELIVERY_ZONES) ? JSON.parse(JSON.stringify(MP.DELIVERY_ZONES)) : [];
    texts = (window.MP && MP.DEFAULT_TEXTS) ? JSON.parse(JSON.stringify(MP.DEFAULT_TEXTS)) : { pt: {}, en: {} };
    images = (window.MP && MP.DEFAULT_SITE_IMAGES) ? Object.assign({}, MP.DEFAULT_SITE_IMAGES) : {};
    contact = (window.MP && MP.DEFAULT_CONTACT) ? Object.assign({}, MP.DEFAULT_CONTACT) : {};
    videos = (window.MP && MP.DEFAULT_SITE_VIDEOS) ? Object.assign({}, MP.DEFAULT_SITE_VIDEOS) : {};
    services = (window.MP && MP.SERVICES) ? JSON.parse(JSON.stringify(MP.SERVICES)) : [];
  }

  function loadDrafts() {
    seedFromDefaults();
    try {
      const p = localStorage.getItem(LS.products);
      if (p) {
        const parsed = JSON.parse(p);
        if (Array.isArray(parsed) && parsed.length) products = parsed;
      }
    } catch (e) {}
    try {
      const z = localStorage.getItem(LS.zones);
      if (z) {
        const parsed = JSON.parse(z);
        if (Array.isArray(parsed) && parsed.length) zones = parsed;
      }
    } catch (e) {}
    try {
      const t = localStorage.getItem(LS.texts);
      if (t) {
        const o = JSON.parse(t);
        texts = { pt: Object.assign({}, texts.pt, o.pt || {}), en: Object.assign({}, texts.en, o.en || {}) };
      }
    } catch (e) {}
    try {
      const i = localStorage.getItem(LS.images);
      if (i) Object.assign(images, JSON.parse(i));
    } catch (e) {}
    try {
      const m = localStorage.getItem(LS.media);
      if (m) media = JSON.parse(m);
    } catch (e) {}
    try {
      const c = localStorage.getItem('mp_contact_override');
      if (c) Object.assign(contact, JSON.parse(c));
    } catch (e) {}
    try {
      const v = localStorage.getItem('mp_videos_override');
      if (v) Object.assign(videos, JSON.parse(v));
    } catch (e) {}
    try {
      const s = localStorage.getItem('mp_services_override');
      if (s) {
        const parsed = JSON.parse(s);
        // Ignore empty arrays — they wipe the default list (common after early saves)
        if (Array.isArray(parsed) && parsed.length) services = parsed;
        else if (Array.isArray(parsed) && !parsed.length) {
          localStorage.removeItem('mp_services_override');
        }
      }
    } catch (e) {}
  }

  function saveDrafts() {
    localStorage.setItem(LS.products, JSON.stringify(products));
    localStorage.setItem(LS.zones, JSON.stringify(zones));
    localStorage.setItem(LS.texts, JSON.stringify(texts));
    localStorage.setItem(LS.images, JSON.stringify(images));
    localStorage.setItem(LS.media, JSON.stringify(media));
    localStorage.setItem('mp_contact_override', JSON.stringify(contact));
    localStorage.setItem('mp_videos_override', JSON.stringify(videos));
    localStorage.setItem('mp_services_override', JSON.stringify(services));
    toast('Rascunho guardado neste browser');
    updateStats();
  }

  function buildCatalog() {
    return {
      products: products,
      zones: zones,
      texts: texts,
      images: images,
      contact: contact,
      videos: videos,
      services: services
    };
  }

  // ——— UI helpers ———
  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) { return Array.from((root || document).querySelectorAll(sel)); }

  function toast(msg) {
    let el = $('#toast');
    if (!el) {
      el = document.createElement('div');
      el.id = 'toast';
      el.className = 'toast';
      document.body.appendChild(el);
    }
    el.textContent = msg;
    el.classList.add('show');
    clearTimeout(el._t);
    el._t = setTimeout(() => el.classList.remove('show'), 2800);
  }

  function closeAdminDrawer() {
    const nav = $('#adminNav');
    const overlay = $('#adminDrawerOverlay');
    if (nav) nav.classList.remove('open');
    if (overlay) overlay.classList.remove('open');
    document.body.classList.remove('admin-drawer-open');
  }

  function openAdminDrawer() {
    const nav = $('#adminNav');
    const overlay = $('#adminDrawerOverlay');
    if (nav) nav.classList.add('open');
    if (overlay) overlay.classList.add('open');
    document.body.classList.add('admin-drawer-open');
  }

  function showPanel(id) {
    $$('.panel').forEach(p => p.classList.remove('active'));
    $$('.admin-nav button[data-panel]').forEach(b => b.classList.toggle('active', b.dataset.panel === id));
    const panel = $('#panel-' + id);
    if (panel) panel.classList.add('active');
    const labels = {
      dashboard: 'Painel', products: 'Produtos', services: 'Serviços', zones: 'Zonas',
      texts: 'Textos', contact: 'Contacto', images: 'Imagens',
      media: 'Média', guide: 'Guia'
    };
    const lab = $('#adminPanelLabel');
    if (lab) lab.textContent = labels[id] || 'Admin';
    closeAdminDrawer();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function formatKz(n) {
    if (n == null || isNaN(n) || n === 0) return '—';
    return Number(n).toLocaleString('pt-AO') + ' Kz';
  }

  function updateStats() {
    const elP = $('#stat-products');
    const elZ = $('#stat-zones');
    const elM = $('#stat-media');
    if (elP) elP.textContent = products.length;
    if (elZ) elZ.textContent = zones.length;
    if (elM) elM.textContent = media.length;
    const elS = $('#stat-slots');
    if (elS) {
      const slots = (window.MP && MP.SITE_IMAGE_SLOTS) || [];
      elS.textContent = slots.length;
    }
  }


  function catName(id) {
    const c = ((window.MP && MP.SERVICE_CATEGORIES) || []).find(x => x.id === id);
    return c ? c.name : id;
  }

  function fillServiceCategorySelects() {
    const cats = (window.MP && MP.SERVICE_CATEGORIES) || [];
    ['svc-category', 'service-filter-cat'].forEach(id => {
      const el = $('#' + id);
      if (!el) return;
      const isFilter = id === 'service-filter-cat';
      const cur = el.value;
      el.innerHTML = isFilter
        ? '<option value="">Todas as categorias</option>' + cats.map(c => `<option value="${c.id}">${esc(c.name)}</option>`).join('')
        : cats.map(c => `<option value="${c.id}">${esc(c.name)}</option>`).join('');
      if (cur) el.value = cur;
    });
  }

  function renderServices() {
    fillServiceCategorySelects();
    const cards = $('#service-cards');
    if (!cards) return;
    let list = services.slice();
    if (serviceFilterCat) list = list.filter(s => s.category === serviceFilterCat);
    list.sort((a, b) => (a.category || '').localeCompare(b.category || '') || (a.name || '').localeCompare(b.name || ''));
    if (!list.length) {
      cards.innerHTML = '<p style="color:var(--muted)">Nenhum serviço nesta categoria.</p>' +
        (!serviceFilterCat ? '<p style="margin-top:12px"><button type="button" class="btn btn-ghost btn-sm" id="btn-restore-services">Restaurar lista padrão</button></p>' : '');
      return;
    }
    cards.innerHTML = list.map(s => `
      <div class="prod-admin-card" data-sid="${esc(s.id)}">
        <div style="width:64px;height:64px;border-radius:8px;background:var(--bg);display:grid;place-items:center;font-size:.7rem;color:var(--muted);text-align:center;padding:4px">${esc(catName(s.category))}</div>
        <div>
          <h3>${esc(s.name)}</h3>
          <div class="meta">${formatKz(s.price)} · ${s.active === false ? 'Inactivo' : 'Activo'}</div>
          <div class="row-actions">
            <button type="button" class="btn btn-ghost btn-sm" data-svc-edit="${esc(s.id)}">Editar</button>
            <button type="button" class="btn btn-ghost btn-sm btn-danger-outline" data-svc-del="${esc(s.id)}">Apagar</button>
          </div>
        </div>
      </div>
    `).join('');
  }

  function openServiceModal(id) {
    editingServiceId = id || null;
    const s = id ? services.find(x => x.id === id) : null;
    fillServiceCategorySelects();
    $('#svc-modal-title').textContent = s ? 'Editar serviço' : 'Novo serviço';
    $('#svc-id').value = s ? s.id : '';
    $('#svc-id').disabled = !!s;
    $('#svc-name').value = s ? s.name : '';
    $('#svc-name-en').value = s ? (s.name_en || '') : '';
    $('#svc-price').value = s ? (s.price || '') : '';
    $('#svc-category').value = s ? (s.category || 'nails') : 'nails';
    $('#svc-active').checked = s ? s.active !== false : true;
    $('#service-modal').classList.add('open');
  }

  function closeServiceModal() {
    $('#service-modal').classList.remove('open');
    editingServiceId = null;
  }

  function saveServiceFromForm() {
    const id = ($('#svc-id').value || '').trim() || slug($('#svc-name').value);
    if (!id || !$('#svc-name').value.trim()) {
      toast('Nome obrigatório');
      return;
    }
    const item = {
      id,
      name: $('#svc-name').value.trim(),
      name_en: $('#svc-name-en').value.trim(),
      price: parseInt($('#svc-price').value, 10) || 0,
      category: $('#svc-category').value || 'nails',
      active: $('#svc-active').checked
    };
    const idx = services.findIndex(x => x.id === id);
    if (idx >= 0) services[idx] = item;
    else services.push(item);
    renderServices();
    closeServiceModal();
    toast('Serviço actualizado (ainda rascunho)');
  }

  // ——— Products UI ———
  function renderProducts() {
    const tbody = $('#product-tbody');
    const cards = $('#product-cards');
    if (!tbody || !cards) return;

    tbody.innerHTML = products.map(p => `
      <tr data-id="${p.id}">
        <td>${p.image ? `<img src="${p.image}" alt="">` : '—'}</td>
        <td>${esc(p.name)}</td>
        <td>${esc(p.category || '')}</td>
        <td>${p.consult ? 'Consulte' : formatKz(p.price)}</td>
        <td>${p.available === false ? 'Não' : 'Sim'}</td>
        <td>
          <button type="button" class="btn btn-ghost btn-sm" data-edit="${p.id}">Editar</button>
          <button type="button" class="btn btn-ghost btn-sm" data-del="${p.id}">Apagar</button>
        </td>
      </tr>
    `).join('');

    cards.innerHTML = products.map(p => `
      <div class="prod-admin-card" data-id="${p.id}">
        ${p.image ? `<img src="${p.image}" alt="">` : '<div style="width:64px;height:64px;background:#eee;border-radius:8px"></div>'}
        <div>
          <h3>${esc(p.name)}</h3>
          <div class="meta">${esc(p.category || '')} · ${p.consult ? 'Consulte' : formatKz(p.price)}</div>
          <div class="row-actions">
            <button type="button" class="btn btn-ghost btn-sm" data-edit="${p.id}">Editar</button>
            <button type="button" class="btn btn-ghost btn-sm" data-del="${p.id}">Apagar</button>
          </div>
        </div>
      </div>
    `).join('');
    updateStats();
  }

  function esc(s) {
    return String(s || '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }

  function openProductModal(id) {
    editingId = id || null;
    const p = id ? products.find(x => x.id === id) : null;
    $('#prod-modal-title').textContent = p ? 'Editar produto' : 'Novo produto';
    $('#prod-id').value = p ? p.id : '';
    $('#prod-id').disabled = !!p;
    $('#prod-name').value = p ? p.name : '';
    $('#prod-name-en').value = p ? (p.name_en || '') : '';
    $('#prod-desc').value = p ? (p.desc || '') : '';
    $('#prod-desc-en').value = p ? (p.desc_en || '') : '';
    $('#prod-price').value = p ? (p.price || '') : '';
    $('#prod-category').value = p ? (p.category || 'body') : 'body';
    $('#prod-image').value = p ? (p.image || '') : '';
    $('#prod-available').checked = p ? p.available !== false : true;
    $('#prod-consult').checked = p ? !!p.consult : false;
    $('#prod-preview').src = p && p.image ? p.image : '';
    $('#prod-preview').style.display = p && p.image ? 'block' : 'none';
    $('#product-modal').classList.add('open');
  }

  function closeProductModal() {
    $('#product-modal').classList.remove('open');
    editingId = null;
  }

  function saveProductFromForm() {
    const id = ($('#prod-id').value || '').trim() || slug($('#prod-name').value);
    if (!id || !$('#prod-name').value.trim()) {
      toast('Nome obrigatório');
      return;
    }
    const item = {
      id,
      name: $('#prod-name').value.trim(),
      name_en: $('#prod-name-en').value.trim(),
      desc: $('#prod-desc').value.trim(),
      desc_en: $('#prod-desc-en').value.trim(),
      price: parseInt($('#prod-price').value, 10) || 0,
      category: $('#prod-category').value,
      image: $('#prod-image').value.trim(),
      available: $('#prod-available').checked,
      consult: $('#prod-consult').checked
    };
    const idx = products.findIndex(x => x.id === id);
    if (idx >= 0) products[idx] = item;
    else products.push(item);
    renderProducts();
    closeProductModal();
    toast('Produto actualizado (ainda rascunho)');
  }

  function slug(s) {
    return String(s || '')
      .toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
      .slice(0, 40) || ('p-' + Date.now());
  }

  // ——— Zones ———
  function renderZones() {
    const list = $('#zone-list');
    if (!list) return;
    list.innerHTML = zones.map((z, i) => `
      <div class="zone-row" data-i="${i}">
        <input type="text" data-zname value="${esc(z.name)}" placeholder="Zona">
        <input type="number" data-zprice inputmode="decimal" value="${z.price || 0}" placeholder="Preço">
        <button type="button" class="btn btn-ghost btn-sm" data-zdel="${i}" aria-label="Apagar">✕</button>
      </div>
    `).join('');
    updateStats();
  }

  function syncZonesFromDOM() {
    zones = $$('#zone-list .zone-row').map(row => ({
      name: row.querySelector('[data-zname]').value.trim(),
      price: parseInt(row.querySelector('[data-zprice]').value, 10) || 0
    })).filter(z => z.name);
  }

  // ——— Texts ———
  function rootField(key) {
    return document.querySelector('#text-fields-root [data-text-key="' + key + '"]');
  }

  function renderTexts() {
    const root = $('#text-fields-root');
    if (!root) return;
    const fields = (window.MP && MP.TEXT_FIELDS) || [];
    const lang = textLang;
    if (!texts[lang]) texts[lang] = {};
    root.innerHTML = fields.map(group => {
      const body = group.keys.map(f => {
        const val = texts[lang][f.key] || '';
        const input = f.multiline
          ? `<textarea data-text-key="${f.key}" rows="3">${esc(val)}</textarea>`
          : `<input type="text" data-text-key="${f.key}" value="${esc(val)}">`;
        return `<div class="field"><label>${esc(f.label)}</label>${input}</div>`;
      }).join('');
      return `<div class="text-group"><h3>${esc(group.group)}</h3>${body}</div>`;
    }).join('');
  }

  function syncTextsFromDOM() {
    if (!texts[textLang]) texts[textLang] = {};
    $$('#text-fields-root [data-text-key]').forEach(el => {
      texts[textLang][el.getAttribute('data-text-key')] = el.value.trim();
    });
  }

  // ——— Contact ———
  function renderContact() {
    const map = {
      'contact-phone-display': 'phone_display',
      'contact-whatsapp': 'whatsapp',
      'contact-hours': 'hours',
      'contact-place': 'place',
      'contact-email': 'email'
    };
    Object.keys(map).forEach(id => {
      const el = $('#' + id);
      if (el) el.value = contact[map[id]] || '';
    });
  }

  function syncContactFromDOM() {
    contact.phone_display = ($('#contact-phone-display')?.value || '').trim();
    contact.whatsapp = ($('#contact-whatsapp')?.value || '').trim();
    contact.hours = ($('#contact-hours')?.value || '').trim();
    contact.place = ($('#contact-place')?.value || '').trim();
    contact.email = ($('#contact-email')?.value || '').trim();
    // Mirror into texts for site i18n
    if (contact.hours) {
      texts.pt = texts.pt || {};
      texts.pt.info_hours = contact.hours;
    }
    if (contact.place) {
      texts.pt = texts.pt || {};
      texts.pt.info_place = contact.place;
    }
    if (contact.phone_display) {
      texts.pt = texts.pt || {};
      texts.en = texts.en || {};
      if (!texts.pt.announce || texts.pt.announce.indexOf('•') !== -1) {
        // leave announce alone if staff customized; optional soft update skipped
      }
    }
  }

  // ——— Site images ———
  function renderSlots() {
    const slots = (window.MP && MP.SITE_IMAGE_SLOTS) || [];
    const root = $('#slots-by-group');
    if (!root) return;
    const groups = {};
    slots.forEach(s => {
      const g = s.group || 'Geral';
      if (!groups[g]) groups[g] = [];
      groups[g].push(s);
    });
    root.innerHTML = Object.keys(groups).map(g => {
      const cards = groups[g].map(s => {
        const url = images[s.key] || '';
        return `
        <div class="slot-card" data-slot="${s.key}">
          <div class="slot-preview ${url ? '' : 'empty'}" style="${url ? 'background-image:url(' + url + ')' : ''}">${url ? '' : 'Sem imagem'}</div>
          <div class="slot-body">
            <h4>${esc(s.label)}</h4>
            <div class="slot-actions">
              <label class="btn btn-ghost btn-sm">
                Carregar
                <input type="file" accept="image/*" data-slot-upload="${s.key}" class="hidden">
              </label>
              <button type="button" class="btn btn-ghost btn-sm" data-slot-pick="${s.key}">Média</button>
              <button type="button" class="btn btn-ghost btn-sm" data-slot-reset="${s.key}">Original</button>
              <button type="button" class="btn btn-ghost btn-sm btn-danger-outline" data-slot-clear="${s.key}">Limpar</button>
            </div>
          </div>
        </div>`;
      }).join('');
      return `<div class="slots-group"><h3>${esc(g)}</h3><div class="slots-grid">${cards}</div></div>`;
    }).join('');
  }

  // ——— Videos ———
  function posterForVideoKey(key) {
    const map = {
      hero: 'hero',
      work_pedicure: 'poster_pedi',
      work_hospitality: 'poster_hospitality',
      work_nails: 'poster_nails'
    };
    const imgKey = map[key];
    if (!imgKey) return '';
    return (images && images[imgKey]) ||
      (window.MP && MP.DEFAULT_SITE_IMAGES && MP.DEFAULT_SITE_IMAGES[imgKey]) || '';
  }

  function paintVideoThumbnails(root) {
    (root || document).querySelectorAll('.slot-card-video video').forEach(vid => {
      const paint = () => {
        try {
          // Seek slightly past 0 so browsers paint a real frame (0 is often black)
          const t = Math.min(0.25, (vid.duration && isFinite(vid.duration) ? vid.duration * 0.05 : 0.25));
          if (vid.currentTime < 0.05) {
            vid.currentTime = t || 0.1;
          }
        } catch (e) {}
      };
      if (vid.readyState >= 1) paint();
      else vid.addEventListener('loadedmetadata', paint, { once: true });
      vid.addEventListener('seeked', () => {
        vid.classList.add('has-frame');
      }, { once: true });
      // Fallback: if metadata never fires (bad URL), keep poster background
      setTimeout(() => {
        if (!vid.classList.contains('has-frame')) vid.classList.add('no-frame');
      }, 4000);
    });
  }

  function renderVideoSlots() {
    const slots = (window.MP && MP.SITE_VIDEO_SLOTS) || [];
    const root = $('#video-slots-root');
    if (!root) return;
    const groups = {};
    slots.forEach(s => {
      const g = s.group || 'Geral';
      if (!groups[g]) groups[g] = [];
      groups[g].push(s);
    });
    root.innerHTML = Object.keys(groups).map(g => {
      const cards = groups[g].map(s => {
        const url = videos[s.key] || '';
        const name = url ? url.split('/').pop().split('?')[0] : '';
        const poster = posterForVideoKey(s.key);
        const posterStyle = poster ? ` style="background-image:url('${poster.replace(/'/g, '%27')}')"` : '';
        return `
        <div class="slot-card slot-card-video" data-vslot="${s.key}">
          <div class="slot-preview video-preview ${url ? '' : 'empty'}"${posterStyle}>
            ${url ? `<video src="${esc(url)}" muted playsinline preload="auto" playsInline></video>` : 'Sem vídeo'}
          </div>
          <div class="slot-body">
            <h4>${esc(s.label)}</h4>
            <p class="meta" style="font-size:.75rem;color:var(--muted);word-break:break-all">${esc(name)}</p>
            <div class="slot-actions">
              <label class="btn btn-ghost btn-sm">
                Carregar
                <input type="file" accept="video/mp4,video/webm,video/quicktime,video/*" data-video-upload="${s.key}" class="hidden">
              </label>
              <button type="button" class="btn btn-ghost btn-sm" data-video-reset="${s.key}">Original</button>
              <button type="button" class="btn btn-ghost btn-sm btn-danger-outline" data-video-clear="${s.key}">Limpar</button>
            </div>
          </div>
        </div>`;
      }).join('');
      return `<div class="slots-group"><h3>${esc(g)}</h3><div class="slots-grid">${cards}</div></div>`;
    }).join('');
    paintVideoThumbnails(root);
  }

  // ——— Media library ———
  function renderMedia() {
    const grid = $('#media-grid');
    if (!grid) return;
    if (!media.length) {
      grid.innerHTML = '<p style="color:var(--muted);grid-column:1/-1">Nenhuma imagem na biblioteca deste browser.</p>';
      return;
    }
    grid.innerHTML = media.map((m, i) => `
      <div class="media-item" data-mi="${i}" data-url="${esc(m.url)}">
        <img src="${m.url}" alt="" loading="lazy">
        <div class="media-tools">
          <button type="button" data-copy="${i}">URL</button>
          <button type="button" data-mdel="${i}">✕</button>
        </div>
      </div>
    `).join('');
    updateStats();
  }


  /**
   * Compress video in-browser before Cloudinary upload.
   * Skips if already small. Uses Canvas + MediaRecorder (WebM).
   * Falls back to original file if compression fails or unsupported.
   */
  function compressVideoFile(file, opts) {
    opts = opts || {};
    const maxWidth = opts.maxWidth || 1280;
    const maxHeight = opts.maxHeight || 720;
    const videoBitsPerSecond = opts.videoBitsPerSecond || 1800000;
    const skipUnderBytes = opts.skipUnderBytes != null ? opts.skipUnderBytes : 4 * 1024 * 1024;

    if (!file || !file.type || !file.type.startsWith('video/')) {
      return Promise.resolve(file);
    }
    if (file.size <= skipUnderBytes) {
      return Promise.resolve(file);
    }
    if (typeof MediaRecorder === 'undefined') {
      return Promise.resolve(file);
    }

    return new Promise((resolve) => {
      const url = URL.createObjectURL(file);
      const video = document.createElement('video');
      video.muted = true;
      video.playsInline = true;
      video.preload = 'auto';
      video.src = url;

      const cleanup = () => {
        try { URL.revokeObjectURL(url); } catch (e) {}
      };

      const fail = () => {
        cleanup();
        resolve(file);
      };

      video.onerror = fail;
      video.onloadeddata = async () => {
        try {
          const vw = video.videoWidth || 1280;
          const vh = video.videoHeight || 720;
          let w = vw;
          let h = vh;
          const scale = Math.min(1, maxWidth / w, maxHeight / h);
          w = Math.max(2, Math.round((w * scale) / 2) * 2);
          h = Math.max(2, Math.round((h * scale) / 2) * 2);

          const canvas = document.createElement('canvas');
          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext('2d');
          if (!ctx) return fail();

          const stream = canvas.captureStream(30);
          // Try to include audio if available
          try {
            const vStream = video.captureStream ? video.captureStream() : (video.mozCaptureStream && video.mozCaptureStream());
            if (vStream) {
              vStream.getAudioTracks().forEach(tr => stream.addTrack(tr));
            }
          } catch (e) {}

          const mimeCandidates = [
            'video/webm;codecs=vp9,opus',
            'video/webm;codecs=vp8,opus',
            'video/webm;codecs=vp9',
            'video/webm;codecs=vp8',
            'video/webm'
          ];
          let mime = '';
          for (let i = 0; i < mimeCandidates.length; i++) {
            if (MediaRecorder.isTypeSupported(mimeCandidates[i])) {
              mime = mimeCandidates[i];
              break;
            }
          }
          if (!mime) return fail();

          const chunks = [];
          const recorder = new MediaRecorder(stream, {
            mimeType: mime,
            videoBitsPerSecond: videoBitsPerSecond
          });
          recorder.ondataavailable = (ev) => {
            if (ev.data && ev.data.size) chunks.push(ev.data);
          };
          recorder.onerror = fail;
          recorder.onstop = () => {
            cleanup();
            stream.getTracks().forEach(tr => tr.stop());
            const blob = new Blob(chunks, { type: mime.split(';')[0] });
            if (!blob.size || blob.size >= file.size * 0.95) {
              // No real savings — keep original
              resolve(file);
              return;
            }
            const base = (file.name || 'video').replace(/\.[^.]+$/, '');
            const out = new File([blob], base + '-compressed.webm', { type: blob.type });
            resolve(out);
          };

          recorder.start(250);
          await video.play().catch(() => {});

          const draw = () => {
            if (video.ended || video.paused) {
              try { recorder.stop(); } catch (e) { fail(); }
              return;
            }
            ctx.drawImage(video, 0, 0, w, h);
            requestAnimationFrame(draw);
          };
          draw();

          // Safety timeout (10 min max)
          setTimeout(() => {
            if (recorder.state === 'recording') {
              try { recorder.stop(); } catch (e) { fail(); }
            }
          }, 10 * 60 * 1000);
        } catch (e) {
          fail();
        }
      };
    });
  }

  function formatBytes(n) {
    if (n < 1024) return n + ' B';
    if (n < 1024 * 1024) return (n / 1024).toFixed(0) + ' KB';
    return (n / (1024 * 1024)).toFixed(1) + ' MB';
  }

  async function uploadToCloudinary(file, resourceType) {
    const type = resourceType || (file.type && file.type.startsWith('video/') ? 'video' : 'image');
    const fd = new FormData();
    fd.append('file', file);
    fd.append('upload_preset', unsignedPreset);
    fd.append('folder', folder);
    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/${type}/upload`, {
      method: 'POST',
      body: fd
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error?.message || 'Upload failed');
    return data.secure_url;
  }

  async function handleFileUpload(file, assignSlot) {
    if (!file) return;
    toast('A enviar…');
    try {
      const url = await uploadToCloudinary(file);
      media.unshift({ url, at: Date.now(), name: file.name });
      localStorage.setItem(LS.media, JSON.stringify(media));
      if (assignSlot) {
        images[assignSlot] = url;
        renderSlots();
      }
      renderMedia();
      toast('Imagem enviada');
      return url;
    } catch (e) {
      console.error(e);
      toast('Falha no upload. Verifique o preset unsigned «' + unsignedPreset + '» no Cloudinary.');
      return null;
    }
  }

  // ——— Publish ———
  async function publish() {
    syncZonesFromDOM();
    syncTextsFromDOM();
    syncContactFromDOM();
    const catalog = buildCatalog();
    const n = products.length;
    const z = zones.length;
    if (!confirm(
      `Publicar na loja?\n\n` +
      `Isto actualiza o site para todos os visitantes:\n\n` +
      `• ${n} produtos\n` +
      `• ${services.length} serviços\n` +
      `• ${z} zonas de entrega\n` +
      `• Textos (PT / EN)\n` +
      `• Contacto e horário\n` +
      `• Imagens do site\n` +
      `• Vídeos\n\n` +
      `Continuar?`
    )) return;

    const password = prompt('Password de admin para publicar:') || '';
    if (!password) return;

    toast('A publicar…');

    // Prefer Worker
    if (PUBLISH_URL) {
      try {
        const res = await fetch(PUBLISH_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ password, catalog })
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          toast(data.error || 'Erro ao publicar (' + res.status + ')');
          return;
        }
        // Keep drafts in sync
        saveDraftsQuiet();
        toast('Publicado com sucesso');
        return;
      } catch (e) {
        console.error(e);
        toast('Rede/Worker indisponível');
        return;
      }
    }

    // Fallback: browser-side signed upload (only if staff stored secrets — discouraged)
    toast('PUBLISH_URL não configurado. Defina o Worker em js/admin.js');
  }

  function saveDraftsQuiet() {
    localStorage.setItem(LS.products, JSON.stringify(products));
    localStorage.setItem(LS.zones, JSON.stringify(zones));
    localStorage.setItem(LS.texts, JSON.stringify(texts));
    localStorage.setItem(LS.images, JSON.stringify(images));
    localStorage.setItem(LS.media, JSON.stringify(media));
    localStorage.setItem('mp_contact_override', JSON.stringify(contact));
    localStorage.setItem('mp_videos_override', JSON.stringify(videos));
    localStorage.setItem('mp_services_override', JSON.stringify(services));
    updateStats();
  }

  // ——— Events ———
  function bind() {
    // Mobile drawer
    $('#adminMenuBtn')?.addEventListener('click', openAdminDrawer);
    $('#adminNavClose')?.addEventListener('click', closeAdminDrawer);
    $('#adminDrawerOverlay')?.addEventListener('click', closeAdminDrawer);
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') closeAdminDrawer();
    });

    // Nav
    $$('.admin-nav button[data-panel]').forEach(btn => {
      btn.addEventListener('click', () => showPanel(btn.dataset.panel));
    });
    $$('[data-goto]').forEach(btn => {
      btn.addEventListener('click', () => showPanel(btn.dataset.goto));
    });

    // Text language tabs
    $$('[data-text-lang]').forEach(tab => {
      tab.addEventListener('click', () => {
        syncTextsFromDOM();
        textLang = tab.dataset.textLang;
        $$('[data-text-lang]').forEach(x => x.classList.toggle('active', x.dataset.textLang === textLang));
        renderTexts();
      });
    });

    // Save / Publish
    $$('[data-action="save"]').forEach(b => b.addEventListener('click', () => {
      syncZonesFromDOM();
      syncTextsFromDOM();
      syncContactFromDOM();
      saveDrafts();
    }));
    $$('[data-action="publish"]').forEach(b => b.addEventListener('click', publish));
    $$('[data-action="logout"]').forEach(b => b.addEventListener('click', () => {
      clearAuth();
      location.reload();
    }));


    // Services
    $('#btn-add-service')?.addEventListener('click', () => openServiceModal(null));
    $('#svc-save')?.addEventListener('click', saveServiceFromForm);
    $('#svc-cancel')?.addEventListener('click', closeServiceModal);
    $('#service-modal')?.addEventListener('click', e => {
      if (e.target.id === 'service-modal') closeServiceModal();
    });
    $('#service-filter-cat')?.addEventListener('change', e => {
      serviceFilterCat = e.target.value;
      renderServices();
    });
    document.addEventListener('click', e => {
      const ed = e.target.closest('[data-svc-edit]');
      if (ed) openServiceModal(ed.dataset.svcEdit);
      const del = e.target.closest('[data-svc-del]');
      if (del && confirm('Apagar este serviço do rascunho?')) {
        services = services.filter(s => s.id !== del.dataset.svcDel);
        renderServices();
      }
    });

    // Products
    $('#btn-add-product')?.addEventListener('click', () => openProductModal(null));
    document.addEventListener('click', e => {
      const ed = e.target.closest('[data-edit]');
      if (ed) openProductModal(ed.dataset.edit);
      const del = e.target.closest('[data-del]');
      if (del && confirm('Apagar este produto do rascunho?')) {
        products = products.filter(p => p.id !== del.dataset.del);
        renderProducts();
      }
    });
    $('#prod-save')?.addEventListener('click', saveProductFromForm);
    $('#prod-cancel')?.addEventListener('click', closeProductModal);
    $('#product-modal')?.addEventListener('click', e => {
      if (e.target.id === 'product-modal') closeProductModal();
    });
    $('#prod-upload')?.addEventListener('change', async e => {
      const file = e.target.files && e.target.files[0];
      const url = await handleFileUpload(file);
      if (url) {
        $('#prod-image').value = url;
        $('#prod-preview').src = url;
        $('#prod-preview').style.display = 'block';
      }
      e.target.value = '';
    });

    // Zones
    $('#btn-add-zone')?.addEventListener('click', () => {
      syncZonesFromDOM();
      zones.push({ name: '', price: 0 });
      renderZones();
    });
    document.addEventListener('click', e => {
      const d = e.target.closest('[data-zdel]');
      if (!d) return;
      syncZonesFromDOM();
      zones.splice(parseInt(d.dataset.zdel, 10), 1);
      renderZones();
    });

    // Site image slots
    document.addEventListener('change', async e => {
      const inp = e.target.closest('[data-slot-upload]');
      if (inp) {
        const key = inp.dataset.slotUpload;
        await handleFileUpload(inp.files && inp.files[0], key);
        inp.value = '';
        return;
      }
      const vinp = e.target.closest('[data-video-upload]');
      if (vinp) {
        const key = vinp.dataset.videoUpload;
        const file = vinp.files && vinp.files[0];
        if (!file) return;
        try {
          let toUpload = file;
          if (file.size > 4 * 1024 * 1024) {
            toast('A comprimir vídeo… (' + formatBytes(file.size) + ')');
            toUpload = await compressVideoFile(file);
            if (toUpload !== file) {
              toast('Comprimido: ' + formatBytes(file.size) + ' → ' + formatBytes(toUpload.size) + '. A enviar…');
            } else {
              toast('A enviar vídeo original… (pode demorar)');
            }
          } else {
            toast('A enviar vídeo…');
          }
          const url = await uploadToCloudinary(toUpload, 'video');
          videos[key] = url;
          media.unshift({ url, at: Date.now(), name: toUpload.name || file.name, type: 'video' });
          localStorage.setItem(LS.media, JSON.stringify(media));
          renderVideoSlots();
          renderMedia();
          toast('Vídeo enviado');
        } catch (err) {
          console.error(err);
          toast('Falha no upload de vídeo. Verifique o preset e o tamanho do ficheiro.');
        }
        vinp.value = '';
      }
    });
    document.addEventListener('click', e => {
      const pick = e.target.closest('[data-slot-pick]');
      if (pick) {
        pickSlotKey = pick.dataset.slotPick;
        showPanel('media');
        $('#media-grid')?.classList.add('pick-mode');
        toast('Toque numa imagem para atribuir ao slot');
      }
      const reset = e.target.closest('[data-slot-reset]');
      if (reset) {
        const key = reset.dataset.slotReset;
        const def = (window.MP && MP.DEFAULT_SITE_IMAGES && MP.DEFAULT_SITE_IMAGES[key]) || '';
        if (def) images[key] = def;
        else delete images[key];
        renderSlots();
        toast('Imagem restaurada ao original');
      }
      const vreset = e.target.closest('[data-video-reset]');
      if (vreset) {
        const key = vreset.dataset.videoReset;
        const def = (window.MP && MP.DEFAULT_SITE_VIDEOS && MP.DEFAULT_SITE_VIDEOS[key]) || '';
        if (def) videos[key] = def;
        else delete videos[key];
        renderVideoSlots();
        toast('Vídeo restaurado ao original');
      }
      const vclear = e.target.closest('[data-video-clear]');
      if (vclear) {
        const key = vclear.dataset.videoClear;
        if (!confirm('Remover este vídeo do site? (pode voltar a carregar ou usar Original)')) return;
        delete videos[key];
        renderVideoSlots();
        toast('Vídeo removido do rascunho');
      }
      const sclear = e.target.closest('[data-slot-clear]');
      if (sclear) {
        const key = sclear.dataset.slotClear;
        if (!confirm('Remover esta imagem do site? (pode voltar a carregar ou usar Original)')) return;
        delete images[key];
        renderSlots();
        toast('Imagem removida do rascunho');
      }
      if (e.target.closest('[data-texts-restore]')) {
        syncTextsFromDOM();
        const defs = (window.MP && MP.DEFAULT_TEXTS && MP.DEFAULT_TEXTS[textLang]) || {};
        texts[textLang] = Object.assign({}, defs);
        renderTexts();
        toast('Textos ' + textLang.toUpperCase() + ' restaurados aos padrões');
      }
      if (e.target.closest('[data-texts-clear]')) {
        if (!confirm('Limpar todos os textos em ' + textLang.toUpperCase() + '?')) return;
        syncTextsFromDOM();
        const fields = (window.MP && MP.TEXT_FIELDS) || [];
        texts[textLang] = texts[textLang] || {};
        fields.forEach(g => g.keys.forEach(f => { texts[textLang][f.key] = ''; }));
        renderTexts();
        toast('Textos ' + textLang.toUpperCase() + ' limpos');
      }
      const tclear = e.target.closest('[data-text-clear-key]');
      if (tclear) {
        const key = tclear.dataset.textClearKey;
        const el = rootField(key);
        if (el) el.value = '';
        if (texts[textLang]) texts[textLang][key] = '';
        toast('Campo limpo');
      }
    });

    // Media
    $('#media-upload')?.addEventListener('change', async e => {
      const files = e.target.files;
      if (!files) return;
      for (const f of files) await handleFileUpload(f);
      e.target.value = '';
    });
    document.addEventListener('click', e => {
      const copy = e.target.closest('[data-copy]');
      if (copy) {
        const m = media[parseInt(copy.dataset.copy, 10)];
        if (m) {
          navigator.clipboard.writeText(m.url).then(() => toast('URL copiada')).catch(() => prompt('URL:', m.url));
        }
      }
      const md = e.target.closest('[data-mdel]');
      if (md) {
        media.splice(parseInt(md.dataset.mdel, 10), 1);
        localStorage.setItem(LS.media, JSON.stringify(media));
        renderMedia();
      }
      // Pick mode
      if (pickSlotKey && e.target.closest('.media-item')) {
        const item = e.target.closest('.media-item');
        const url = item.dataset.url;
        if (url) {
          images[pickSlotKey] = url;
          pickSlotKey = null;
          $('#media-grid')?.classList.remove('pick-mode');
          renderSlots();
          showPanel('images');
          toast('Imagem atribuída ao slot');
        }
      }
    });
  }

  // ——— Boot ———
  function showApp() {
    $('#login-screen').classList.add('hidden');
    $('#admin-shell').classList.add('visible');
    loadDrafts();
    renderProducts();
    renderServices();
    renderZones();
    renderTexts();
    renderContact();
    renderSlots();
    renderVideoSlots();
    renderMedia();
    updateStats();
    showPanel('dashboard');
    bind();
  }

  function initLogin() {
    if (isAuthed()) {
      showApp();
      return;
    }
    const toggle = $('#passwordToggle');
    const pwInput = $('#login-password');
    if (toggle && pwInput) {
      toggle.addEventListener('click', () => {
        const show = pwInput.type === 'password';
        pwInput.type = show ? 'text' : 'password';
        toggle.setAttribute('aria-pressed', show ? 'true' : 'false');
        toggle.setAttribute('aria-label', show ? 'Ocultar password' : 'Mostrar password');
        toggle.setAttribute('title', show ? 'Ocultar password' : 'Mostrar password');
        const eye = toggle.querySelector('.icon-eye');
        const eyeOff = toggle.querySelector('.icon-eye-off');
        if (eye) eye.classList.toggle('hidden', show);
        if (eyeOff) eyeOff.classList.toggle('hidden', !show);
      });
    }
    $('#login-form')?.addEventListener('submit', e => {
      e.preventDefault();
      const pw = $('#login-password').value;
      const remember = $('#login-remember')?.checked;
      // Accept default password or whatever was last used successfully stored is not needed —
      // simple gate: match DEFAULT_ADMIN_PASSWORD (Worker uses its own secret for publish)
      if (pw === DEFAULT_ADMIN_PASSWORD) {
        setAuth(remember);
        showApp();
      } else {
        const err = $('#login-error');
        if (err) { err.style.display = 'block'; err.textContent = 'Password incorrecta'; }
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLogin);
  } else {
    initLogin();
  }
})();
