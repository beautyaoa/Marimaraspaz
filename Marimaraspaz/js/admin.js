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
  let editingId = null;
  let pickSlotKey = null;

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
  }

  function loadDrafts() {
    seedFromDefaults();
    try {
      const p = localStorage.getItem(LS.products);
      if (p) products = JSON.parse(p);
    } catch (e) {}
    try {
      const z = localStorage.getItem(LS.zones);
      if (z) zones = JSON.parse(z);
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
  }

  function saveDrafts() {
    localStorage.setItem(LS.products, JSON.stringify(products));
    localStorage.setItem(LS.zones, JSON.stringify(zones));
    localStorage.setItem(LS.texts, JSON.stringify(texts));
    localStorage.setItem(LS.images, JSON.stringify(images));
    localStorage.setItem(LS.media, JSON.stringify(media));
    toast('Rascunho guardado neste browser');
    updateStats();
  }

  function buildCatalog() {
    return {
      products: products,
      zones: zones,
      texts: texts,
      images: images
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

  function showPanel(id) {
    $$('.panel').forEach(p => p.classList.remove('active'));
    $$('.admin-nav button').forEach(b => b.classList.toggle('active', b.dataset.panel === id));
    const panel = $('#panel-' + id);
    if (panel) panel.classList.add('active');
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
  function renderTexts() {
    $('#text-hero-pt').value = texts.pt.heroTitle || '';
    $('#text-hero-en').value = texts.en.heroTitle || '';
    $('#text-sub-pt').value = texts.pt.heroSub || '';
    $('#text-sub-en').value = texts.en.heroSub || '';
  }

  function syncTextsFromDOM() {
    texts.pt.heroTitle = $('#text-hero-pt').value.trim();
    texts.en.heroTitle = $('#text-hero-en').value.trim();
    texts.pt.heroSub = $('#text-sub-pt').value.trim();
    texts.en.heroSub = $('#text-sub-en').value.trim();
  }

  // ——— Site images ———
  function renderSlots() {
    const slots = (window.MP && MP.SITE_IMAGE_SLOTS) || [];
    const grid = $('#slots-grid');
    if (!grid) return;
    grid.innerHTML = slots.map(s => {
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
            </div>
          </div>
        </div>
      `;
    }).join('');
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

  async function uploadToCloudinary(file) {
    const fd = new FormData();
    fd.append('file', file);
    fd.append('upload_preset', unsignedPreset);
    fd.append('folder', folder);
    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
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
    const catalog = buildCatalog();
    const n = products.length;
    const z = zones.length;
    if (!confirm(`Publicar na loja?\n\n• ${n} produtos\n• ${z} zonas\n• textos + imagens do site\n\nTodos os visitantes verão estas alterações.`)) return;

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
    updateStats();
  }

  // ——— Events ———
  function bind() {
    // Nav
    $$('.admin-nav button').forEach(btn => {
      btn.addEventListener('click', () => showPanel(btn.dataset.panel));
    });

    // Save / Publish
    $$('[data-action="save"]').forEach(b => b.addEventListener('click', () => {
      syncZonesFromDOM();
      syncTextsFromDOM();
      saveDrafts();
    }));
    $$('[data-action="publish"]').forEach(b => b.addEventListener('click', publish));
    $$('[data-action="logout"]').forEach(b => b.addEventListener('click', () => {
      clearAuth();
      location.reload();
    }));

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
      if (!inp) return;
      const key = inp.dataset.slotUpload;
      await handleFileUpload(inp.files && inp.files[0], key);
      inp.value = '';
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
    renderZones();
    renderTexts();
    renderSlots();
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
