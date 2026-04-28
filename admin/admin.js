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

const tabMeta = {
  content: ['Conteúdo', 'Cada card edita uma parte específica do site.'],
  services: ['Serviços', 'Cards com imagem, preço e nome dos serviços apresentados.'],
  gallery: ['Galeria', 'Imagens de projetos e trabalhos para a faixa visual do site.'],
  partners: ['Parceiros', 'Logótipos e localizações dos parceiros da Creative Garage.'],
  creativePower: ['Creative Power', 'Conteudos da pagina de remaps e performance.'],
  contact: ['Contacto', 'Cards separados para morada, canais e links.']
};

const labels = {
  logo: 'Logótipo',
  'hero.title': 'Título principal',
  'hero.tags': 'Categorias do hero',
  'hero.note': 'Nota de marcação',
  'hero.financeSmall': 'Texto do financiamento',
  'hero.image': 'Imagem principal',
  servicesTitle: 'Título da secção Serviços',
  servicesText: 'Texto da secção Serviços',
  calculatorImage: 'Imagem da calculadora',
  photographersImage: 'Imagem da secção Fotógrafos',
  'creativePower.logo': 'Logotipo Creative Power',
  'creativePower.heroImage': 'Imagem de fundo',
  'creativePower.heroEyebrow': 'Etiqueta do hero',
  'creativePower.heroTitle': 'Titulo do hero',
  'creativePower.heroText': 'Texto do hero',
  'creativePower.primaryButton': 'Botao principal',
  'creativePower.secondaryButton': 'Botao secundario',
  'creativePower.homeImage': 'Home banner - Imagem de fundo',
  'creativePower.homeEyebrow': 'Home banner - Etiqueta',
  'creativePower.homeTitle': 'Home banner - Titulo',
  'creativePower.homeText': 'Home banner - Texto',
  'creativePower.homeButton': 'Home banner - Botao',
  'creativePower.calculatorEyebrow': 'Etiqueta da calculadora',
  'creativePower.calculatorTitle': 'Titulo da calculadora',
  'creativePower.calculatorText': 'Texto da calculadora',
  'creativePower.process1Title': 'Processo 1 - Titulo',
  'creativePower.process1Text': 'Processo 1 - Texto',
  'creativePower.process2Title': 'Processo 2 - Titulo',
  'creativePower.process2Text': 'Processo 2 - Texto',
  'creativePower.process3Title': 'Processo 3 - Titulo',
  'creativePower.process3Text': 'Processo 3 - Texto',
  'creativePower.servicesEyebrow': 'Etiqueta dos servicos',
  'creativePower.service1Title': 'Servico 1 - Titulo',
  'creativePower.service1Text': 'Servico 1 - Texto',
  'creativePower.service2Title': 'Servico 2 - Titulo',
  'creativePower.service2Text': 'Servico 2 - Texto',
  'creativePower.service3Title': 'Servico 3 - Titulo',
  'creativePower.service3Text': 'Servico 3 - Texto',
  'creativePower.footerTitle': 'Rodape - Titulo Creative Power',
  'creativePower.footerText': 'Rodape - Texto Creative Power',
  'creativePower.swapFooterTitle': 'Rodape - Titulo Swap Tune',
  'creativePower.swapFooterText': 'Rodape - Texto Swap Tune',
  'creativePower.prepFooterTitle': 'Rodape - Titulo preparacao',
  'creativePower.prepFooterText': 'Rodape - Texto preparacao',
  'contact.address': 'Morada',
  'contact.phone': 'Telefone',
  'contact.email': 'Email',
  'contact.instagram': 'Instagram',
  'contact.mapUrl': 'Link do mapa',
  'contact.jobsEmail': 'Email para candidaturas',
  id: 'Identificador',
  icon: 'Ícone',
  price: 'Preço desde',
  title: 'Título',
  image: 'Imagem',
  name: 'Nome',
  location: 'Localização'
};

const contentSections = [
  {
    title: 'Marca',
    text: 'Identidade visual usada no cabeçalho, rodapé e área administrativa.',
    fields: ['logo']
  },
  {
    title: 'Hero',
    text: 'Primeiro impacto da página inicial.',
    fields: ['hero.title', 'hero.tags', 'hero.note', 'hero.financeSmall', 'hero.image']
  },
  {
    title: 'Serviços',
    text: 'Textos e imagem da área de serviços e calculadora.',
    fields: ['servicesTitle', 'servicesText', 'calculatorImage']
  },
  {
    title: 'Fotógrafos',
    text: 'Imagem de apoio da secção dedicada às sessões e produção visual.',
    fields: ['photographersImage']
  }
];

const contactSections = [
  {
    title: 'Morada',
    text: 'Localização pública mostrada no rodapé/contacto.',
    fields: ['contact.address']
  },
  {
    title: 'Canais',
    text: 'Contactos principais que aparecem no site.',
    fields: ['contact.phone', 'contact.email', 'contact.instagram']
  },
  {
    title: 'Links',
    text: 'Ligações externas para mapa e candidaturas.',
    fields: ['contact.mapUrl', 'contact.jobsEmail']
  }
];

const creativePowerSections = [
  {
    title: 'Hero Creative Power',
    text: 'Conteudos principais da pagina Creative Power.',
    fields: ['creativePower.logo', 'creativePower.heroImage', 'creativePower.heroEyebrow', 'creativePower.heroTitle', 'creativePower.heroText', 'creativePower.primaryButton', 'creativePower.secondaryButton']
  },
  {
    title: 'Banner da Home',
    text: 'Conteudos do banner Creative Power na pagina inicial.',
    fields: ['creativePower.homeImage', 'creativePower.homeEyebrow', 'creativePower.homeTitle', 'creativePower.homeText', 'creativePower.homeButton']
  },
  {
    title: 'Calculadora',
    text: 'Textos introdutorios da calculadora de performance.',
    fields: ['creativePower.calculatorEyebrow', 'creativePower.calculatorTitle', 'creativePower.calculatorText']
  },
  {
    title: 'Processo',
    text: 'Tres passos apresentados antes da calculadora.',
    fields: ['creativePower.process1Title', 'creativePower.process1Text', 'creativePower.process2Title', 'creativePower.process2Text', 'creativePower.process3Title', 'creativePower.process3Text']
  },
  {
    title: 'Servicos',
    text: 'Cards de servicos da pagina Creative Power.',
    fields: ['creativePower.servicesEyebrow', 'creativePower.service1Title', 'creativePower.service1Text', 'creativePower.service2Title', 'creativePower.service2Text', 'creativePower.service3Title', 'creativePower.service3Text']
  },
  {
    title: 'Rodape',
    text: 'Blocos de texto do rodape da pagina Creative Power.',
    fields: ['creativePower.footerTitle', 'creativePower.footerText', 'creativePower.swapFooterTitle', 'creativePower.swapFooterText', 'creativePower.prepFooterTitle', 'creativePower.prepFooterText']
  }
];

function esc(value) {
  return String(value ?? '').replace(/[&<>"']/g, ch => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  }[ch]));
}

function oneLine(value = '') {
  return String(value).replace(/\s+/g, ' ').trim();
}

function shortText(value = '', size = 105) {
  const text = oneLine(value);
  return text.length > size ? `${text.slice(0, size - 1)}...` : text;
}

function previewSrc(path) {
  if (!path) return '';
  if (/^(https?:)?\/\//.test(path) || path.startsWith('data:')) return path;
  return `../${path.replace(/^(\.\.\/|\/)+/, '')}`;
}

function byPath(obj, path) {
  return path.split('.').reduce((cur, key) => cur?.[key], obj);
}

function setPath(obj, path, value) {
  const keys = path.split('.');
  let cur = obj;
  keys.slice(0, -1).forEach(k => cur = cur[k] ??= {});
  cur[keys.at(-1)] = value;
}

function isImagePath(path) {
  return /image|logo|Image/i.test(path);
}

async function load() {
  for (const k of Object.keys(files)) {
    state[k] = await fetch(files[k], { cache: 'no-store' }).then(r => r.json());
  }
  render();
}

function panelIntro(action = '') {
  const [heading, text] = tabMeta[current];
  $('#panelTitle').textContent = heading;
  $('#panelDescription').textContent = text;
  $$('.admin-menu button').forEach(b => b.classList.toggle('active', b.dataset.tab === current));
  return action ? `<div class="admin-section-actions">${action}</div>` : '';
}

function button(label, attrs = '', kind = 'btn-outline') {
  return `<button type="button" class="btn ${kind}" ${attrs}>${esc(label)}</button>`;
}

function cardImage(path, alt = '') {
  const src = previewSrc(path);
  return src
    ? `<img class="overview-img" src="${esc(src)}" alt="${esc(alt)}" onerror="this.closest('.overview-media,.field-card-media')?.classList.add('is-empty')">`
    : '<div class="overview-placeholder">Sem imagem</div>';
}

function valueKind(path, value) {
  if (isImagePath(path)) return 'Imagem';
  if (String(value ?? '').includes('\n')) return 'Texto longo';
  if (/url|email|instagram|phone|map/i.test(path)) return 'Contacto';
  return 'Texto';
}

function fieldPreview(path) {
  const value = byPath(state.content, path);
  if (isImagePath(path)) return previewSrc(value) ? 'Imagem configurada' : 'Sem imagem configurada';
  return shortText(value || 'Sem conteúdo definido');
}

function fieldCard(path) {
  const value = byPath(state.content, path);
  const label = labels[path] || path;
  const image = isImagePath(path) ? value : '';
  return `
    <article class="field-card ${image ? 'field-card-image' : ''}">
      ${image ? `<div class="field-card-media">${cardImage(image, label)}</div>` : ''}
      <div class="field-card-body">
        <div class="overview-top">
          <span>${esc(valueKind(path, value))}</span>
          ${button('Editar', `data-edit-field="${esc(path)}"`)}
        </div>
        <h2>${esc(label)}</h2>
        <p>${esc(fieldPreview(path))}</p>
      </div>
    </article>
  `;
}

function sectionBlock(section) {
  return `
    <section class="admin-content-section">
      <div class="content-section-head">
        <div>
          <span class="admin-kicker">${esc(section.title)}</span>
          <h2>${esc(section.title)}</h2>
          <p>${esc(section.text)}</p>
        </div>
      </div>
      <div class="field-grid">
        ${section.fields.map(fieldCard).join('')}
      </div>
    </section>
  `;
}

function overviewCard({ tag, title, preview, image, actions, meta = '' }) {
  return `
    <article class="overview-card">
      <div class="overview-media">${cardImage(image, title)}</div>
      <div class="overview-body">
        <div class="overview-top">
          <span>${esc(tag)}</span>
          <div class="card-actions">${actions}</div>
        </div>
        <h2>${esc(title)}</h2>
        ${meta ? `<strong>${esc(meta)}</strong>` : ''}
        <p>${esc(shortText(preview))}</p>
      </div>
    </article>
  `;
}

function field(path, value, type = 'text') {
  const long = String(value ?? '').includes('\n') || ['title', 'Text', 'note', 'address', 'financeSmall'].some(key => path.endsWith(key));
  const name = labels[path] || labels[path.split('.').at(-1)] || path;
  if (long) {
    return `<label class="wide-field"><span>${esc(name)}</span><textarea data-field="${esc(path)}">${esc(value)}</textarea></label>`;
  }
  return `<label><span>${esc(name)}</span><input data-field="${esc(path)}" type="${type}" value="${esc(value)}"></label>`;
}

function imageField(path, value) {
  const name = labels[path] || labels[path.split('.').at(-1)] || path;
  const src = previewSrc(value);
  return `
    <div class="image-field wide-field">
      <label><span>${esc(name)}</span><input data-field="${esc(path)}" type="text" value="${esc(value)}" placeholder="URL ou caminho da imagem"></label>
      <div class="image-tools">
        <label class="upload-control">Enviar imagem<input data-upload="${esc(path)}" type="file" accept="image/*"></label>
        ${src ? `<img class="mini-img" src="${esc(src)}" alt="">` : '<div class="mini-img mini-img-empty">Sem preview</div>'}
      </div>
    </div>
  `;
}

function smartField(path, value, type = 'text') {
  return isImagePath(path) ? imageField(path, value) : field(path, value, type);
}

function saveTypeForCurrent(type = current) {
  return type === 'contact' || type === 'creativePower' ? 'content' : type;
}

async function saveType(type, savingMessage = 'A guardar...') {
  const msg = $('#adminMessage');
  msg.textContent = savingMessage;
  msg.className = '';

  const res = await fetch(`api/save.php?type=${type}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(state[type])
  }).then(r => r.json()).catch(() => ({ ok: false, message: 'Erro de ligação' }));

  msg.className = res.ok ? 'success' : 'fail';
  msg.textContent = res.ok ? 'Alteração guardada com sucesso.' : res.message;
  return res.ok;
}

function openModal(title, body, onApply) {
  closeModal();
  document.body.insertAdjacentHTML('beforeend', `
    <div class="admin-modal-backdrop" id="adminModal">
      <section class="admin-modal" role="dialog" aria-modal="true">
        <header>
          <div>
            <span class="admin-kicker">Editar</span>
            <h2>${esc(title)}</h2>
          </div>
          <button type="button" class="modal-close" data-close-modal>Fechar</button>
        </header>
        <div class="admin-modal-body">${body}</div>
        <footer>
          <button type="button" class="btn btn-outline" data-close-modal>Cancelar</button>
          <button type="button" class="btn btn-light" id="modalApply">Aplicar</button>
        </footer>
      </section>
    </div>
  `);
  $('#modalApply').onclick = async () => {
    const applyBtn = $('#modalApply');
    applyBtn.disabled = true;
    applyBtn.textContent = 'A guardar...';
    onApply();
    closeModal();
    render();
    await saveType(saveTypeForCurrent());
  };
  $$('[data-close-modal]').forEach(btn => btn.onclick = closeModal);
  $('#adminModal').onclick = event => {
    if (event.target.id === 'adminModal') closeModal();
  };
}

function closeModal() {
  $('#adminModal')?.remove();
}

function applyFields(target) {
  $$('[data-field]', $('#adminModal')).forEach(el => {
    const value = el.type === 'number' ? Number(el.value) : el.value;
    if (el.dataset.field.includes('.')) setPath(target, el.dataset.field, value);
    else target[el.dataset.field] = value;
  });
}

function editField(path) {
  const body = `<div class="modal-grid">${smartField(path, byPath(state.content, path))}</div>`;
  openModal(labels[path] || path, body, () => applyFields(state.content));
}

function renderContent() {
  $('#adminForm').innerHTML = `
    ${panelIntro()}
    ${contentSections.map(sectionBlock).join('')}
  `;
}

function renderContact() {
  $('#adminForm').innerHTML = `
    ${panelIntro()}
    ${contactSections.map(sectionBlock).join('')}
  `;
}

function renderCreativePower() {
  $('#adminForm').innerHTML = `
    ${panelIntro()}
    ${creativePowerSections.map(sectionBlock).join('')}
  `;
}

function renderServices() {
  $('#adminForm').innerHTML = `
    ${panelIntro(button('Adicionar serviço', 'data-add="services"', 'btn-light'))}
    <div class="overview-grid">
      ${state.services.map((s, i) => overviewCard({
        tag: s.id || `Serviço ${i + 1}`,
        title: oneLine(s.title) || `Serviço ${i + 1}`,
        preview: `Preço desde ${s.price || 0}€`,
        meta: s.icon || '',
        image: s.image,
        actions: `${button('Editar', `data-edit-item="services" data-index="${i}"`)}${button('Remover', `data-remove="services" data-index="${i}"`, 'danger')}`
      })).join('')}
    </div>
  `;
}

function renderGallery() {
  $('#adminForm').innerHTML = `
    ${panelIntro(button('Adicionar imagem', 'data-add="gallery"', 'btn-light'))}
    <div class="overview-grid gallery-admin-grid">
      ${state.gallery.map((g, i) => overviewCard({
        tag: `Imagem ${i + 1}`,
        title: g.title || `Imagem ${i + 1}`,
        preview: g.image || 'Sem imagem configurada',
        image: g.image,
        actions: `${button('Editar', `data-edit-item="gallery" data-index="${i}"`)}${button('Remover', `data-remove="gallery" data-index="${i}"`, 'danger')}`
      })).join('')}
    </div>
  `;
}

function renderPartners() {
  $('#adminForm').innerHTML = `
    ${panelIntro(button('Adicionar parceiro', 'data-add="partners"', 'btn-light'))}
    <div class="overview-grid partner-admin-grid">
      ${state.partners.map((p, i) => overviewCard({
        tag: p.location || 'Parceiro',
        title: p.name || `Parceiro ${i + 1}`,
        preview: p.image || 'Sem imagem configurada',
        image: p.image,
        actions: `${button('Editar', `data-edit-item="partners" data-index="${i}"`)}${button('Remover', `data-remove="partners" data-index="${i}"`, 'danger')}`
      })).join('')}
    </div>
  `;
}

function editItem(type, index) {
  const item = state[type][index];
  const fieldMap = {
    services: [['id', 'text'], ['icon', 'text'], ['price', 'number'], ['title', 'text'], ['image', 'text']],
    gallery: [['title', 'text'], ['image', 'text']],
    partners: [['name', 'text'], ['location', 'text'], ['image', 'text']]
  };
  const title = item.title || item.name || `Editar ${type}`;
  const body = `<div class="modal-grid">${fieldMap[type].map(([key, inputType]) => smartField(key, item[key], inputType)).join('')}</div>`;
  openModal(title, body, () => applyFields(item));
}

function addItem(type) {
  const defaults = {
    services: { id: 'novo-servico', title: 'Novo serviço', price: 0, icon: '◌', image: '' },
    gallery: { title: 'Nova imagem', image: '' },
    partners: { name: 'Novo parceiro', location: '', image: '' }
  };
  const item = { ...defaults[type] };
  const fieldMap = {
    services: [['id', 'text'], ['icon', 'text'], ['price', 'number'], ['title', 'text'], ['image', 'text']],
    gallery: [['title', 'text'], ['image', 'text']],
    partners: [['name', 'text'], ['location', 'text'], ['image', 'text']]
  };
  const body = `<div class="modal-grid">${fieldMap[type].map(([key, inputType]) => smartField(key, item[key], inputType)).join('')}</div>`;
  openModal('Adicionar', body, () => {
    applyFields(item);
    state[type].push(item);
  });
}

function render() {
  if (current === 'content') renderContent();
  if (current === 'contact') renderContact();
  if (current === 'creativePower') renderCreativePower();
  if (current === 'services') renderServices();
  if (current === 'gallery') renderGallery();
  if (current === 'partners') renderPartners();
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
  const preview = inputEl.closest('.image-field').querySelector('.mini-img');
  field.value = res.path;
  if (preview) {
    preview.outerHTML = `<img class="mini-img" src="${esc(previewSrc(res.path))}" alt="">`;
  }
}

document.addEventListener('click', e => {
  const tab = e.target.closest('[data-tab]');
  if (tab) {
    current = tab.dataset.tab;
    render();
  }

  const editFieldBtn = e.target.closest('[data-edit-field]');
  if (editFieldBtn) editField(editFieldBtn.dataset.editField);

  const editItemBtn = e.target.closest('[data-edit-item]');
  if (editItemBtn) editItem(editItemBtn.dataset.editItem, Number(editItemBtn.dataset.index));

  const add = e.target.closest('[data-add]');
  if (add) {
    addItem(add.dataset.add);
  }

  const rem = e.target.closest('[data-remove]');
  if (rem) {
    const type = rem.dataset.remove;
    state[type].splice(Number(rem.dataset.index), 1);
    render();
    saveType(type, 'A guardar remoção...');
  }
});

document.addEventListener('change', e => {
  const upload = e.target.closest('[data-upload]');
  if (upload) uploadImage(upload);
});

$('#saveBtn')?.addEventListener('click', async () => {
  const msg = $('#adminMessage');
  msg.textContent = 'A guardar...';
  msg.className = '';

  const saveTypes = current === 'contact' ? ['content'] : current === 'content' ? ['content'] : [current];
  const results = await Promise.all(saveTypes.map(type => fetch(`api/save.php?type=${type}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(state[type])
  }).then(r => r.json()).catch(() => ({ ok: false, message: 'Erro de ligação' }))));

  const failed = results.find(res => !res.ok);
  msg.className = failed ? 'fail' : 'success';
  msg.textContent = failed ? failed.message : 'Alterações guardadas com sucesso.';
});

load().catch(err => {
  $('#adminForm').innerHTML = '<p class="fail">Erro ao carregar dados. Abre pelo XAMPP/Apache e confirma permissões.</p>';
  console.error(err);
});
