const $ = (s, r=document) => r.querySelector(s);
const $$ = (s, r=document) => [...r.querySelectorAll(s)];
const euro = v => `${Math.round(v).toLocaleString('pt-PT')}€`;
async function getJSON(path){ const res = await fetch(path, {cache:'no-store'}); if(!res.ok) throw new Error(path); return res.json(); }
function byPath(obj,path){return path.split('.').reduce((a,k)=>a?.[k],obj)}
function nl(text){return String(text||'').replace(/\n/g,'<br>')}
async function init(){
  const [content,services,gallery,partners] = await Promise.all([getJSON('data/content.json'),getJSON('data/services.json'),getJSON('data/gallery.json'),getJSON('data/partners.json')]);
  document.documentElement.style.setProperty('--hero-image', `url('${content.hero.image}')`);
  $('[data-calc-bg]').style.setProperty('--calc-image', `url('${content.calculatorImage}')`);
  $('.photographer-card').style.setProperty('--photo-bg', `url('${content.photographersImage}')`);
  $$('[data-content]').forEach(el=>{ el.innerHTML = nl(byPath(content,el.dataset.content)); });
  $('#servicesGrid').innerHTML = services.map(s=>`<article class="service-card" style="--img:url('${s.image}')"><div class="service-icon">${s.icon||'◌'}</div><h3>${nl(s.title)}</h3><small>A partir de</small><strong>${euro(s.price)}</strong></article>`).join('');
  $('#serviceSelect').innerHTML = services.map(s=>`<option value="${s.price}">${s.title.replace(/\n/g,' ')} — desde ${euro(s.price)}</option>`).join('');
  $('#galleryStrip').innerHTML = gallery.map(g=>`<div class="gallery-item" title="${g.title}" style="--img:url('${g.image}')"></div>`).join('');
  $('#partnersGrid').innerHTML = partners.map(p=>`<div class="partner"><strong>${p.name}</strong><span>${p.location}</span></div>`).join('');
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
