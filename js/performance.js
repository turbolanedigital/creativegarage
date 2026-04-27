const API = 'api/tuningspecs.php';
const $ = (s, r = document) => r.querySelector(s);

const fields = {
  brand_id: $('#makeSelect'),
  model_id: $('#modelSelect'),
  generation_id: $('#generationSelect'),
  product_id: $('#engineSelect')
};

function esc(value) {
  return String(value ?? '').replace(/[&<>"']/g, ch => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;'
  }[ch]));
}

function setLoading(isLoading) {
  $('#remapLoader').textContent = isLoading ? 'A carregar dados TuningSpecs...' : '';
}

function params() {
  const search = new URLSearchParams();
  Object.entries(fields).forEach(([key, el]) => {
    if (el.value) search.set(key, el.value);
  });
  return search;
}

function browserCacheKey() {
  return `creative-power:${params().toString() || 'root'}`;
}

function optionsFromProductGroups(groups) {
  if (!groups || Array.isArray(groups)) return groups || [];
  return Object.entries(groups).flatMap(([group, items]) =>
    items.map(item => ({ ...item, group }))
  );
}

function fillSelect(select, options, placeholder) {
  select.innerHTML = `<option value="">${placeholder}</option>`;
  if (!options?.length) {
    select.disabled = true;
    return;
  }

  const grouped = options.some(opt => opt.group);
  if (grouped) {
    const groups = {};
    options.forEach(opt => (groups[opt.group] ??= []).push(opt));
    select.innerHTML += Object.entries(groups).map(([label, items]) =>
      `<optgroup label="${esc(label)}">${items.map(opt => `<option value="${opt.value}" data-urlname="${esc(opt.urlname)}">${esc(opt.label)}</option>`).join('')}</optgroup>`
    ).join('');
  } else {
    select.innerHTML += options.map(opt => `<option value="${opt.value}" data-urlname="${esc(opt.urlname)}">${esc(opt.label)}</option>`).join('');
  }
  select.disabled = false;
}

function resetAfter(name) {
  const order = ['brand_id', 'model_id', 'generation_id', 'product_id'];
  order.slice(order.indexOf(name) + 1).forEach(key => {
    fields[key].innerHTML = '<option value="">Selecionar</option>';
    fields[key].disabled = true;
  });
  clearResult();
}

async function loadOptions(changed = null) {
  if (changed) resetAfter(changed);
  setLoading(true);
  const key = browserCacheKey();
  const cached = sessionStorage.getItem(key);
  const json = cached ? JSON.parse(cached) : await fetch(`${API}?${params().toString()}`, { cache: 'no-store' }).then(res => res.json());
  if (!cached && json.ok) sessionStorage.setItem(key, JSON.stringify(json));
  setLoading(false);

  if (!json.ok) throw new Error(json.message || 'Erro ao carregar dados');
  const data = json.data;
  if (!fields.brand_id.value) fillSelect(fields.brand_id, data.select_options.brand_id, 'Marca');
  if (data.select_options.model_id?.length) fillSelect(fields.model_id, data.select_options.model_id, 'Modelo');
  if (data.select_options.generation_id?.length) fillSelect(fields.generation_id, data.select_options.generation_id, 'Ano / geração');

  const products = optionsFromProductGroups(data.select_options.product_id);
  if (products.length) fillSelect(fields.product_id, products, 'Motor / versão');
  if (data.result) renderResult(data.result);
}

function clearResult() {
  $('#stockHp').textContent = '-- cv';
  $('#stockTorque').textContent = '-- Nm';
  $('#tunedHp').textContent = '-- cv';
  $('#tunedTorque').textContent = '-- Nm';
  $('#gainHp').textContent = '+-- cv';
  $('#gainTorque').textContent = '+-- Nm';
  $('#remapDetails').classList.add('hidden');
}

function renderResult(result) {
  $('#stockHp').textContent = `${result.power.standard || '--'} cv`;
  $('#stockTorque').textContent = `${result.torque.standard || '--'} Nm`;
  $('#tunedHp').textContent = `${result.power.tuned || '--'} cv`;
  $('#tunedTorque').textContent = `${result.torque.tuned || '--'} Nm`;
  $('#gainHp').textContent = `+${result.power.gain || '--'} cv`;
  $('#gainTorque').textContent = `+${result.torque.gain || '--'} Nm`;
  $('#vehicleName').textContent = result.vehicle || 'Resultado TuningSpecs';
  $('#specTable').innerHTML = result.specs.map(row => `<tr><td>${esc(row.label)}</td><td><strong>${esc(row.value)}</strong></td></tr>`).join('');
  $('#dynographImage').src = result.dynograph || '';
  $('#dynographImage').classList.toggle('hidden', !result.dynograph);
  $('#remapDetails').classList.remove('hidden');
}

fields.brand_id.addEventListener('change', () => loadOptions('brand_id'));
fields.model_id.addEventListener('change', () => loadOptions('model_id'));
fields.generation_id.addEventListener('change', () => loadOptions('generation_id'));
fields.product_id.addEventListener('change', () => loadOptions('product_id'));

loadOptions().catch(err => {
  setLoading(false);
  $('#remapLoader').textContent = 'Não foi possível carregar a base TuningSpecs.';
  console.error(err);
});
