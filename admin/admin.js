const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

let state = {};
let current = 'content';

const files = {
  content: '../data/content.json',
  services: '../data/services.json',
  gallery: '../data/gallery.json',
  partners: '../data/partners.json'
};

const title = {
  content: 'Conteúdo geral',
  services: 'Serviços',
  gallery: 'Galeria',
  partners: 'Parceiros',
  contact: 'Contacto'
};

async function load() {
  for (const k of Object.keys(files)) {
    state[k] = await fetch(files[k], { cache: 'no-store' }).then(r => r.json());
  }
  render();
}

function esc(value) {
  return String(value ?? '').replace(/[&<>"']/g, ch => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  }[ch]));
}

function previewSrc(path) {
  if (!path) return '';
  if (/^(https?:)?\/\//.test(path) || path.startsWith('data:')) return path;
  return `../${path.replace(/^(\.\.\/|\/)+/, '')}`;
}

function input(name, value, type = 'text') {
  return `<label>${esc(name)}<input data-field="${esc(name)}" type="${type}" value="${esc(value)}"></label>`;
}

function area(name, value) {
  return `<label>${esc(name)}<textarea data-field="${esc(name)}">${esc(value)}</textarea></label>`;
}

function imageInput(name, value) {
  const src = previewSrc(value);
  return `<div class="image-field">
    <label>${esc(name)}<input data-field="${esc(name)}" type="text" value="${esc(value)}" placeholder="URL ou caminho da imagem"></label>
    <label class="upload-control">Substituir por ficheiro<input data-upload="${esc(name)}" type="file" accept="image/*"></label>
    ${src ? `<img class="mini-img" src="${esc(src)}" alt="">` : ''}
  </div>`;
}

function render() {
  $('#panelTitle').textContent = title[current];
  $$('.admin-menu button').forEach(b => b.classList.toggle('active', b.dataset.tab === current));
  const f = $('#adminForm');

  if (current === 'content') {
    f.innerHTML = `<section class="admin-card"><h2>Marca</h2>${imageInput('logo', state.content.logo)}</section>
      <section class="admin-card"><h2>Hero</h2>${area('hero.title', state.content.hero.title)}${input('hero.tags', state.content.hero.tags)}${area('hero.note', state.content.hero.note)}${area('hero.financeSmall', state.content.hero.financeSmall)}${imageInput('hero.image', state.content.hero.image)}</section>
      <section class="admin-card"><h2>Secções</h2>${area('servicesTitle', state.content.servicesTitle)}${area('servicesText', state.content.servicesText)}${imageInput('calculatorImage', state.content.calculatorImage)}${imageInput('photographersImage', state.content.photographersImage)}</section>`;
  }

  if (current === 'contact') {
    f.innerHTML = `<section class="admin-card"><h2>Contacto</h2>${area('contact.address', state.content.contact.address)}<div class="grid-2">${input('contact.phone', state.content.contact.phone)}${input('contact.email', state.content.contact.email)}${input('contact.instagram', state.content.contact.instagram)}${input('contact.mapUrl', state.content.contact.mapUrl)}${input('contact.jobsEmail', state.content.contact.jobsEmail)}</div></section>`;
  }

  if (current === 'services') {
    f.innerHTML = `<div class="item-head"><p>Gere os serviços apresentados no site.</p><button type="button" class="btn btn-outline" data-add="services">Adicionar serviço</button></div>` +
      state.services.map((s, i) => `<section class="admin-card" data-index="${i}"><div class="item-head"><h2>Serviço ${i + 1}</h2><button type="button" class="btn danger" data-remove="services" data-index="${i}">Remover</button></div><div class="grid-3">${input('id', s.id)}${input('icon', s.icon)}${input('price', s.price, 'number')}</div>${area('title', s.title)}${imageInput('image', s.image)}</section>`).join('');
  }

  if (current === 'gallery') {
    f.innerHTML = `<div class="item-head"><p>Imagens ilustrativas ou fotografias reais da galeria.</p><button type="button" class="btn btn-outline" data-add="gallery">Adicionar imagem</button></div>` +
      state.gallery.map((g, i) => `<section class="admin-card" data-index="${i}"><div class="item-head"><h2>Imagem ${i + 1}</h2><button type="button" class="btn danger" data-remove="gallery" data-index="${i}">Remover</button></div>${input('title', g.title)}${imageInput('image', g.image)}</section>`).join('');
  }

  if (current === 'partners') {
    f.innerHTML = `<div class="item-head"><p>Parceiros e recomendações.</p><button type="button" class="btn btn-outline" data-add="partners">Adicionar parceiro</button></div>` +
      state.partners.map((p, i) => `<section class="admin-card" data-index="${i}"><div class="item-head"><h2>Parceiro ${i + 1}</h2><button type="button" class="btn danger" data-remove="partners" data-index="${i}">Remover</button></div><div class="grid-2">${input('name', p.name)}${input('location', p.location)}</div>${imageInput('image', p.image)}</section>`).join('');
  }
}

function setPath(obj, path, value) {
  const keys = path.split('.');
  let cur = obj;
  keys.slice(0, -1).forEach(k => cur = cur[k] ??= {});
  cur[keys.at(-1)] = value;
}

function collect() {
  if (current === 'content' || current === 'contact') {
    $$('[data-field]').forEach(el => setPath(state.content, el.dataset.field, el.value));
    return 'content';
  }

  $$('.admin-card[data-index]').forEach(card => {
    const i = +card.dataset.index;
    $$('[data-field]', card).forEach(el => {
      let v = el.value;
      if (el.type === 'number') v = Number(v);
      state[current][i][el.dataset.field] = v;
    });
  });
  return current;
}

async function uploadImage(inputEl) {
  const file = inputEl.files?.[0];
  if (!file) return;

  const msg = $('#adminMessage');
  const form = new FormData();
  form.append('image', file);
  msg.className = '';
  msg.textContent = 'A enviar imagem...';

  const res = await fetch('api/upload.php', { method: 'POST', body: form })
    .then(r => r.json())
    .catch(() => ({ ok: false, message: 'Erro ao enviar imagem' }));

  msg.className = res.ok ? 'success' : 'fail';
  msg.textContent = res.message;

  if (!res.ok) return;
  const field = inputEl.closest('.image-field').querySelector('[data-field]');
  field.value = res.path;
  collect();
  render();
}

document.addEventListener('click', e => {
  const tab = e.target.closest('[data-tab]');
  if (tab) {
    current = tab.dataset.tab;
    render();
  }

  const add = e.target.closest('[data-add]');
  if (add) {
    const t = add.dataset.add;
    if (t === 'services') state.services.push({ id: 'novo-servico', title: 'Novo serviço', price: 0, icon: '◌', image: '' });
    if (t === 'gallery') state.gallery.push({ title: 'Nova imagem', image: '' });
    if (t === 'partners') state.partners.push({ name: 'Novo parceiro', location: '', image: '' });
    render();
  }

  const rem = e.target.closest('[data-remove]');
  if (rem) {
    state[rem.dataset.remove].splice(+rem.dataset.index, 1);
    render();
  }
});

document.addEventListener('change', e => {
  const upload = e.target.closest('[data-upload]');
  if (upload) uploadImage(upload);
});

$('#saveBtn').addEventListener('click', async () => {
  const type = collect();
  const msg = $('#adminMessage');
  msg.textContent = 'A guardar...';
  msg.className = '';
  const res = await fetch(`api/save.php?type=${type}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(state[type])
  }).then(r => r.json()).catch(() => ({ ok: false, message: 'Erro de ligação' }));
  msg.className = res.ok ? 'success' : 'fail';
  msg.textContent = res.message;
});

load().catch(err => {
  $('#adminForm').innerHTML = '<p class="fail">Erro ao carregar dados. Abre pelo XAMPP/Apache e confirma permissões.</p>';
  console.error(err);
});
