const $ = (s, r=document) => r.querySelector(s);
const $$ = (s, r=document) => [...r.querySelectorAll(s)];
const euro = v => `${Math.round(v).toLocaleString('pt-PT')}€`;
async function getJSON(path){ const res = await fetch(path, {cache:'no-store'}); if(!res.ok) throw new Error(path); return res.json(); }
function byPath(obj,path){return path.split('.').reduce((a,k)=>a?.[k],obj)}
function nl(text){return String(text||'').replace(/\n/g,'<br>')}
function image(path){return path || 'assets/logo/creative-logo.webp'}
function imageUrl(path){return new URL(image(path), document.baseURI).href}
function cssUrl(path){return `url('${imageUrl(path).replace(/['\\]/g,'\\$&')}')`}
async function init(){
  const [content,services,gallery,partners] = await Promise.all([getJSON('data/content.json'),getJSON('data/services.json'),getJSON('data/gallery.json'),getJSON('data/partners.json')]);
  $$('[data-image-content]').forEach(el=>{ el.src = imageUrl(byPath(content,el.dataset.imageContent)); });
  document.documentElement.style.setProperty('--hero-image', cssUrl(content.hero.image));
  $('[data-calc-bg]').style.setProperty('--calc-image', cssUrl(content.calculatorImage));
  $('.photographer-card').style.setProperty('--photo-bg', cssUrl(content.photographersImage));
  $$('[data-content]').forEach(el=>{ el.innerHTML = nl(byPath(content,el.dataset.content)); });
  $('#servicesGrid').innerHTML = services.map(s=>`<article class="service-card" style="--img:${cssUrl(s.image)}"><div class="service-icon">${s.icon||'◌'}</div><h3>${nl(s.title)}</h3><small>A partir de</small><strong>${euro(s.price)}</strong></article>`).join('');
  $('#serviceSelect').innerHTML = services.map(s=>`<option value="${s.price}">${s.title.replace(/\n/g,' ')} — desde ${euro(s.price)}</option>`).join('');
  $('#galleryStrip').innerHTML = gallery.map(g=>`<div class="gallery-item" title="${g.title}" style="--img:${cssUrl(g.image)}"></div>`).join('');
  const partnerItems = partners.map(p=>`<div class="partner">${p.image?`<img src="${imageUrl(p.image)}" alt="${p.name}">`:''}<strong>${p.name}</strong><span>${p.location}</span></div>`).join('');
  $('#partnersGrid').innerHTML = `<div class="partners-track">${partnerItems}${partnerItems}</div>`;
  $('#addressText').innerHTML = nl(content.contact.address);
  $('#mapLink').href = content.contact.mapUrl;
  $('#jobsLink').href = content.contact.jobsEmail;
  $('#contactList').innerHTML = [`☎ ${content.contact.phone}`,`✉ ${content.contact.email}`,`◎ ${content.contact.instagram}`].map(x=>`<li>${x}</li>`).join('');
  const calc=()=>{ const total = Number($('#serviceSelect').value)*Number($('#sizeSelect').value)*Number($('#urgencySelect').value)+Number($('#extrasSelect').value); $('#quoteTotal').textContent=euro(total); };
  ['serviceSelect','sizeSelect','urgencySelect','extrasSelect'].forEach(id=>$('#'+id).addEventListener('change',calc)); calc();
}
$('[data-nav-toggle]').addEventListener('click',()=> $('[data-nav]').classList.toggle('is-open'));
window.addEventListener('scroll',()=>$('#topbar').classList.toggle('is-scrolled',scrollY>20));
init().catch(err=>{console.error(err); document.body.insertAdjacentHTML('afterbegin','<div style="background:#300;color:#fff;padding:12px;text-align:center">Erro ao carregar conteúdos. Confirma se estás a abrir por http://localhost e não por file://</div>')});
