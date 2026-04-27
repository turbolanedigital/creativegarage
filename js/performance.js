const vehicles = [
  {make:'Audi',model:'A3',engine:'2.0 TDI 150',hp:150,nm:340,tunedHp:190,tunedNm:410},
  {make:'Audi',model:'A4',engine:'2.0 TDI 190',hp:190,nm:400,tunedHp:225,tunedNm:470},
  {make:'BMW',model:'320d',engine:'2.0d 190',hp:190,nm:400,tunedHp:225,tunedNm:470},
  {make:'BMW',model:'118d',engine:'2.0d 150',hp:150,nm:320,tunedHp:190,tunedNm:400},
  {make:'Mercedes-Benz',model:'A 200 d',engine:'2.0d 150',hp:150,nm:320,tunedHp:190,tunedNm:400},
  {make:'Mercedes-Benz',model:'C 220 d',engine:'2.0d 194',hp:194,nm:400,tunedHp:230,tunedNm:500},
  {make:'Volkswagen',model:'Golf',engine:'2.0 TDI 150',hp:150,nm:340,tunedHp:190,tunedNm:410},
  {make:'Volkswagen',model:'Golf GTI',engine:'2.0 TSI 245',hp:245,nm:370,tunedHp:300,tunedNm:460},
  {make:'SEAT',model:'Leon FR',engine:'2.0 TDI 150',hp:150,nm:340,tunedHp:190,tunedNm:410},
  {make:'Skoda',model:'Octavia RS',engine:'2.0 TSI 245',hp:245,nm:370,tunedHp:300,tunedNm:460},
  {make:'Renault',model:'Megane RS',engine:'1.8 TCe 280',hp:280,nm:390,tunedHp:315,tunedNm:470},
  {make:'Ford',model:'Focus ST',engine:'2.3 EcoBoost 280',hp:280,nm:420,tunedHp:330,tunedNm:520}
];

const $ = (s, r=document) => r.querySelector(s);
const unique = arr => [...new Set(arr)];
const fmtHp = v => `${Math.round(v)} cv`;
const fmtNm = v => `${Math.round(v)} Nm`;

function fill(select, values) {
  select.innerHTML = values.map(v => `<option value="${v}">${v}</option>`).join('');
}

function calcManual() {
  const hp = Number($('#manualHp').value) || 0;
  const nm = Number($('#manualTorque').value) || 0;
  const fuel = $('#fuelSelect').value;
  const stage = $('#stageSelect').value;
  const rates = {
    diesel: stage === 'eco' ? [1.12, 1.18] : [1.25, 1.28],
    petrolTurbo: stage === 'eco' ? [1.1, 1.12] : [1.22, 1.24],
    petrolNa: stage === 'eco' ? [1.04, 1.05] : [1.08, 1.1]
  }[fuel];
  return {hp,nm,tunedHp:hp*rates[0],tunedNm:nm*rates[1]};
}

function selectedVehicle() {
  if ($('#makeSelect').value === 'Outro') return calcManual();
  return vehicles.find(v => v.make === $('#makeSelect').value && v.model === $('#modelSelect').value && v.engine === $('#engineSelect').value) || vehicles[0];
}

function renderResult() {
  const v = selectedVehicle();
  $('#stockHp').textContent = fmtHp(v.hp);
  $('#stockTorque').textContent = fmtNm(v.nm);
  $('#tunedHp').textContent = fmtHp(v.tunedHp);
  $('#tunedTorque').textContent = fmtNm(v.tunedNm);
  $('#gainHp').textContent = `+${fmtHp(v.tunedHp - v.hp)}`;
  $('#gainTorque').textContent = `+${fmtNm(v.tunedNm - v.nm)}`;
}

function updateModels() {
  const make = $('#makeSelect').value;
  const manual = make === 'Outro';
  $('#manualFields').classList.toggle('hidden', !manual);
  $('#modelSelect').disabled = manual;
  $('#engineSelect').disabled = manual;
  if (manual) return renderResult();
  fill($('#modelSelect'), unique(vehicles.filter(v => v.make === make).map(v => v.model)));
  updateEngines();
}

function updateEngines() {
  const make = $('#makeSelect').value;
  const model = $('#modelSelect').value;
  fill($('#engineSelect'), vehicles.filter(v => v.make === make && v.model === model).map(v => v.engine));
  renderResult();
}

function init() {
  fill($('#makeSelect'), [...unique(vehicles.map(v => v.make)), 'Outro']);
  updateModels();
  $('#makeSelect').addEventListener('change', updateModels);
  $('#modelSelect').addEventListener('change', updateEngines);
  $('#engineSelect').addEventListener('change', renderResult);
  ['manualHp','manualTorque','fuelSelect','stageSelect'].forEach(id => $('#'+id).addEventListener('input', renderResult));
  ['fuelSelect','stageSelect'].forEach(id => $('#'+id).addEventListener('change', renderResult));
}

init();
