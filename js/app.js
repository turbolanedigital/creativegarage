const $ = (s, r=document) => r.querySelector(s);
const $$ = (s, r=document) => [...r.querySelectorAll(s)];
const euro = v => `${Math.round(v).toLocaleString('pt-PT')}€`;
async function getJSON(path){ const res = await fetch(path, {cache:'no-store'}); if(!res.ok) throw new Error(path); return res.json(); }
function byPath(obj,path){return path.split('.').reduce((a,k)=>a?.[k],obj)}
function nl(text){return String(text||'').replace(/\n/g,'<br>')}
function image(path){return path || 'assets/logo/creative-logo.webp'}
function imageUrl(path){return new URL(image(path), document.baseURI).href}
function cssUrl(path){return `url('${imageUrl(path).replace(/['\\]/g,'\\$&')}')`}
function esc(text){return String(text??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[ch]))}
function openGallery(gallery,index=null){
  const modal = $('#galleryModal');
  const grid = $('#galleryModalGrid');
  const view = $('#galleryModalView');
  const back = $('[data-gallery-back]');
  modal.classList.add('is-open');
  modal.setAttribute('aria-hidden','false');
  document.body.classList.add('modal-open');
  grid.innerHTML = gallery.map((g,i)=>`<button class="gallery-modal-item" type="button" data-gallery-index="${i}"><img src="${imageUrl(g.image)}" alt="${esc(g.title)}"><span>${esc(g.title)}</span></button>`).join('');
  if(index===null) showGalleryGrid();
  else showGalleryImage(gallery,index);
}
function showGalleryGrid(){
  $('#galleryModalTitle').textContent = 'Galeria completa';
  $('#galleryModalGrid').classList.remove('hidden');
  $('#galleryModalView').classList.add('hidden');
  $('[data-gallery-back]').classList.add('hidden');
}
function showGalleryImage(gallery,index){
  const item = gallery[index];
  if(!item) return;
  $('#galleryModalTitle').textContent = item.title || 'Projeto';
  $('#galleryModalGrid').classList.add('hidden');
  $('#galleryModalView').classList.remove('hidden');
  $('[data-gallery-back]').classList.remove('hidden');
  $('#galleryModalImage').src = imageUrl(item.image);
  $('#galleryModalImage').alt = item.title || 'Imagem da galeria';
  $('#galleryModalCaption').textContent = item.title || '';
}
function closeGallery(){
  const modal = $('#galleryModal');
  modal.classList.remove('is-open');
  modal.setAttribute('aria-hidden','true');
  document.body.classList.remove('modal-open');
}
function openLegal(type){
  const modal = $('#legalModal');
  const title = type === 'privacy' ? 'Política de Privacidade' : 'Termos e Condições';
  const template = type === 'privacy' ? $('#privacyTemplate') : $('#termsTemplate');
  $('#legalModalTitle').textContent = title;
  $('#legalModalBody').innerHTML = template.innerHTML;
  modal.classList.add('is-open');
  modal.setAttribute('aria-hidden','false');
  document.body.classList.add('modal-open');
}
function closeLegal(){
  const modal = $('#legalModal');
  modal.classList.remove('is-open');
  modal.setAttribute('aria-hidden','true');
  $('#legalModalBody').innerHTML = '';
  document.body.classList.remove('modal-open');
}
async function init(){
  const [content,services,gallery,partners] = await Promise.all([getJSON('data/content.json'),getJSON('data/services.json'),getJSON('data/gallery.json'),getJSON('data/partners.json')]);
  $$('[data-image-content]').forEach(el=>{ el.src = imageUrl(byPath(content,el.dataset.imageContent)); });
  document.documentElement.style.setProperty('--hero-image', cssUrl(content.hero.image));
  $('[data-calc-bg]').style.setProperty('--calc-image', cssUrl(content.calculatorImage));
  $('.photographer-card').style.setProperty('--photo-bg', cssUrl(content.photographersImage));
  $$('[data-content]').forEach(el=>{ el.innerHTML = nl(byPath(content,el.dataset.content)); });
  $('#servicesGrid').innerHTML = services.map(s=>`<article class="service-card" style="--img:${cssUrl(s.image)}"><div class="service-icon">${s.icon||'◌'}</div><h3>${nl(s.title)}</h3><small>A partir de</small><strong>${euro(s.price)}</strong></article>`).join('');
  $('#serviceSelect').innerHTML = services.map(s=>`<option value="${s.price}">${s.title.replace(/\n/g,' ')} — desde ${euro(s.price)}</option>`).join('');
  $('#galleryStrip').innerHTML = gallery.map((g,i)=>`<button class="gallery-item" type="button" title="${esc(g.title)}" style="--img:${cssUrl(g.image)}" data-gallery-preview="${i}"></button>`).join('');
  const partnerItems = partners.map(p=>`<div class="partner">${p.image?`<img src="${imageUrl(p.image)}" alt="${p.name}">`:''}<strong>${p.name}</strong><span>${p.location}</span></div>`).join('');
  $('#partnersGrid').innerHTML = `<div class="partners-track">${partnerItems}${partnerItems}</div>`;
  $('#addressText').innerHTML = nl(content.contact.address);
  $('#mapLink').href = content.contact.mapUrl;
  $('#jobsLink').href = content.contact.jobsEmail;
  $('#contactList').innerHTML = [`☎ ${content.contact.phone}`,`✉ ${content.contact.email}`,`◎ ${content.contact.instagram}`].map(x=>`<li>${x}</li>`).join('');
  const calc=()=>{ const total = Number($('#serviceSelect').value)*Number($('#sizeSelect').value)*Number($('#urgencySelect').value)+Number($('#extrasSelect').value); $('#quoteTotal').textContent=euro(total); };
  ['serviceSelect','sizeSelect','urgencySelect','extrasSelect'].forEach(id=>$('#'+id).addEventListener('change',calc)); calc();
  $('[data-gallery-open]').addEventListener('click',()=>openGallery(gallery));
  $('#galleryStrip').addEventListener('click',e=>{ const item=e.target.closest('[data-gallery-preview]'); if(item) openGallery(gallery,Number(item.dataset.galleryPreview)); });
  $('#galleryModalGrid').addEventListener('click',e=>{ const item=e.target.closest('[data-gallery-index]'); if(item) showGalleryImage(gallery,Number(item.dataset.galleryIndex)); });
  $('[data-gallery-back]').addEventListener('click',showGalleryGrid);
  $$('[data-gallery-close]').forEach(el=>el.addEventListener('click',closeGallery));
  $$('[data-legal-open]').forEach(el=>el.addEventListener('click',()=>openLegal(el.dataset.legalOpen)));
  $$('[data-legal-close]').forEach(el=>el.addEventListener('click',closeLegal));
  document.addEventListener('keydown',e=>{ if(e.key==='Escape'){ closeGallery(); closeLegal(); } });
}
$('[data-nav-toggle]').addEventListener('click',()=> $('[data-nav]').classList.toggle('is-open'));
window.addEventListener('scroll',()=>$('#topbar').classList.toggle('is-scrolled',scrollY>20));
init().catch(err=>{console.error(err); document.body.insertAdjacentHTML('afterbegin','<div style="background:#300;color:#fff;padding:12px;text-align:center">Erro ao carregar conteúdos. Confirma se estás a abrir por http://localhost e não por file://</div>')});
