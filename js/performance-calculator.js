const swapTuneFallbackData = [
  {
    brand: 'BMW',
    models: [
      {
        name: 'Serie 1',
        engines: [
          { name: '116d 2.0d', fuel: 'Diesel', stockPower: 116, stockTorque: 260, stage1Power: 185, stage1Torque: 390, ecoPower: 145, ecoTorque: 330 },
          { name: '120d 2.0d', fuel: 'Diesel', stockPower: 190, stockTorque: 400, stage1Power: 225, stage1Torque: 470, ecoPower: 205, ecoTorque: 440 }
        ]
      },
      {
        name: 'Serie 3',
        engines: [
          { name: '320d 2.0d', fuel: 'Diesel', stockPower: 190, stockTorque: 400, stage1Power: 225, stage1Torque: 470, ecoPower: 205, ecoTorque: 440 },
          { name: '330d 3.0d', fuel: 'Diesel', stockPower: 258, stockTorque: 560, stage1Power: 315, stage1Torque: 680, ecoPower: 285, ecoTorque: 620 }
        ]
      }
    ]
  },
  {
    brand: 'Mercedes-Benz',
    models: [
      {
        name: 'Classe A',
        engines: [
          { name: 'A180d 1.5d', fuel: 'Diesel', stockPower: 116, stockTorque: 260, stage1Power: 145, stage1Torque: 320, ecoPower: 130, ecoTorque: 295 },
          { name: 'A200 1.3T', fuel: 'Gasolina', stockPower: 163, stockTorque: 250, stage1Power: 185, stage1Torque: 300, ecoPower: 175, ecoTorque: 275 }
        ]
      },
      {
        name: 'Classe C',
        engines: [
          { name: 'C220d 2.0d', fuel: 'Diesel', stockPower: 194, stockTorque: 400, stage1Power: 225, stage1Torque: 480, ecoPower: 210, ecoTorque: 440 },
          { name: 'C300 2.0T', fuel: 'Gasolina', stockPower: 258, stockTorque: 370, stage1Power: 310, stage1Torque: 460, ecoPower: 280, ecoTorque: 410 }
        ]
      }
    ]
  },
  {
    brand: 'Volkswagen',
    models: [
      {
        name: 'Golf',
        engines: [
          { name: '1.6 TDI', fuel: 'Diesel', stockPower: 115, stockTorque: 250, stage1Power: 145, stage1Torque: 320, ecoPower: 130, ecoTorque: 295 },
          { name: '2.0 TDI', fuel: 'Diesel', stockPower: 150, stockTorque: 340, stage1Power: 190, stage1Torque: 420, ecoPower: 170, ecoTorque: 385 },
          { name: 'GTI 2.0 TSI', fuel: 'Gasolina', stockPower: 245, stockTorque: 370, stage1Power: 300, stage1Torque: 450, ecoPower: 265, ecoTorque: 400 }
        ]
      },
      {
        name: 'Passat',
        engines: [
          { name: '2.0 TDI', fuel: 'Diesel', stockPower: 150, stockTorque: 340, stage1Power: 190, stage1Torque: 420, ecoPower: 170, ecoTorque: 385 },
          { name: '2.0 BiTDI', fuel: 'Diesel', stockPower: 240, stockTorque: 500, stage1Power: 285, stage1Torque: 580, ecoPower: 260, ecoTorque: 540 }
        ]
      }
    ]
  },
  {
    brand: 'Audi',
    models: [
      {
        name: 'A3',
        engines: [
          { name: '1.6 TDI', fuel: 'Diesel', stockPower: 116, stockTorque: 250, stage1Power: 145, stage1Torque: 320, ecoPower: 130, ecoTorque: 295 },
          { name: '2.0 TDI', fuel: 'Diesel', stockPower: 150, stockTorque: 340, stage1Power: 190, stage1Torque: 420, ecoPower: 170, ecoTorque: 385 }
        ]
      },
      {
        name: 'A4',
        engines: [
          { name: '2.0 TDI', fuel: 'Diesel', stockPower: 190, stockTorque: 400, stage1Power: 225, stage1Torque: 470, ecoPower: 205, ecoTorque: 440 },
          { name: '3.0 TDI', fuel: 'Diesel', stockPower: 272, stockTorque: 600, stage1Power: 330, stage1Torque: 710, ecoPower: 300, ecoTorque: 650 }
        ]
      }
    ]
  }
];

function assetUrl(path) {
  if (!path) return '';
  if (/^(https?:)?\/\//.test(path) || path.startsWith('data:')) return path;
  return path.replace(/^(\.\/|\/)+/, '');
}

async function hydrateCreativePowerContent() {
  try {
    const response = await fetch('data/content.json', { cache: 'no-store' });
    if (!response.ok) return;
    const content = await response.json();
    const power = content.creativePower || {};

    document.querySelectorAll('[data-power-content]').forEach(element => {
      const value = power[element.dataset.powerContent];
      if (value === undefined) return;
      element.textContent = value;
    });

    document.querySelectorAll('[data-power-image]').forEach(element => {
      const value = power[element.dataset.powerImage];
      if (value) element.src = assetUrl(value);
    });

    document.querySelectorAll('[data-power-bg]').forEach(element => {
      const value = power[element.dataset.powerBg];
      if (value) element.style.setProperty('--performance-hero-image', `url("${assetUrl(value)}")`);
    });
  } catch (error) {
    console.warn(error);
  }
}

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, char => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  }[char]));
}

function option(label, value = label) {
  return `<option value="${escapeHtml(value)}">${escapeHtml(label)}</option>`;
}

function placeholderOption(label) {
  return `<option value="" selected disabled>${escapeHtml(label)}</option>`;
}

function barScale(stockValue, tunedValue) {
  const max = Math.max(tunedValue * 1.08, stockValue + 1);
  const stockPercent = Math.min(96, Math.max(0, (stockValue / max) * 100));
  const tunedPercent = Math.min(100, Math.max(stockPercent, (tunedValue / max) * 100));
  return {
    stockPercent,
    gainPercent: Math.max(0, tunedPercent - stockPercent)
  };
}

function normalizeRemapData(items) {
  if (!Array.isArray(items) || !items.length) return [];
  if (items[0]?.models) return items;

  const brands = new Map();
  const toNumber = value => {
    const number = Number(value);
    return Number.isFinite(number) ? number : null;
  };

  items.forEach(item => {
    const stockPower = toNumber(item.stock_hp);
    const stockTorque = toNumber(item.stock_nm);
    const stage1Power = toNumber(item.mod_hp);
    const stage1Torque = toNumber(item.mod_nm);
    if (!item.brand || !item.model || !item.motorization) return;
    if ([stockPower, stockTorque, stage1Power, stage1Torque].some(value => value === null)) return;

    if (!brands.has(item.brand)) brands.set(item.brand, { brand: item.brand, models: new Map() });
    const brand = brands.get(item.brand);
    if (!brand.models.has(item.model)) brand.models.set(item.model, { name: item.model, engines: [] });

    const labelParts = [item.motorization, item.version].filter(Boolean);
    brand.models.get(item.model).engines.push({
      id: item.id,
      name: labelParts.join(' - '),
      fuel: item.fuel || 'Combustivel nao indicado',
      stockPower,
      stockTorque,
      stage1Power,
      stage1Torque,
      price: toNumber(item.price),
      ecu: item.ecu || ''
    });
  });

  return [...brands.values()]
    .map(brand => ({
      brand: brand.brand,
      models: [...brand.models.values()].map(model => ({
        name: model.name,
        engines: model.engines.sort((a, b) => a.name.localeCompare(b.name))
      })).filter(model => model.engines.length).sort((a, b) => a.name.localeCompare(b.name))
    }))
    .filter(brand => brand.models.length)
    .sort((a, b) => a.brand.localeCompare(b.brand));
}

function initPerformanceCalculator(data) {
  data = normalizeRemapData(data);
  const root = document.querySelector('[data-remap-calculator]');
  if (!root || !data.length) return;

  const brandSelect = root.querySelector('[data-remap-brand]');
  const modelSelect = root.querySelector('[data-remap-model]');
  const engineSelect = root.querySelector('[data-remap-engine]');
  const modeButtons = [...root.querySelectorAll('[data-remap-mode]')];
  const hasEcoMode = data.some(brand => brand.models.some(model => model.engines.some(engine => Number.isFinite(engine.ecoPower) && Number.isFinite(engine.ecoTorque))));
  let mode = 'stage1';

  modeButtons.forEach(button => {
    if (button.dataset.remapMode === 'eco') button.hidden = !hasEcoMode;
  });
  root.querySelector('.remap-mode-row').style.gridTemplateColumns = hasEcoMode ? '' : '1fr';

  const getBrand = () => data[brandSelect.selectedIndex] || data[0];
  const getModel = () => getBrand().models[modelSelect.selectedIndex] || getBrand().models[0];
  const getEngine = () => getModel().engines[engineSelect.selectedIndex] || getModel().engines[0];

  function fillBrands() {
    brandSelect.innerHTML = data.map(item => option(item.brand)).join('');
    fillModels();
  }

  function fillModels() {
    const brand = getBrand();
    modelSelect.innerHTML = brand.models.map(item => option(item.name)).join('');
    fillEngines();
  }

  function fillEngines() {
    const model = getModel();
    engineSelect.innerHTML = model.engines.map(item => option(item.name)).join('');
    updateResult();
  }

  function setText(selector, value) {
    root.querySelector(selector).textContent = value;
  }

  function updateResult() {
    const brand = getBrand();
    const model = getModel();
    const engine = getEngine();
    const tunedPower = mode === 'eco' && hasEcoMode ? engine.ecoPower : engine.stage1Power;
    const tunedTorque = mode === 'eco' && hasEcoMode ? engine.ecoTorque : engine.stage1Torque;
    const powerGain = tunedPower - engine.stockPower;
    const torqueGain = tunedTorque - engine.stockTorque;
    const powerScale = barScale(engine.stockPower, tunedPower);
    const torqueScale = barScale(engine.stockTorque, tunedTorque);

    setText('[data-stock-power]', engine.stockPower);
    setText('[data-tuned-power]', tunedPower);
    setText('[data-power-gain]', `+${powerGain}`);
    setText('[data-stock-torque]', engine.stockTorque);
    setText('[data-tuned-torque]', tunedTorque);
    setText('[data-torque-gain]', `+${torqueGain}`);
    setText('[data-remap-title]', `${brand.brand} ${model.name}`);
    setText('[data-remap-copy]', `${engine.name} - ${engine.fuel} - ${mode === 'eco' && hasEcoMode ? 'Eco map' : 'Stage 1'} com ganhos estimados de +${powerGain} cv e +${torqueGain} Nm.`);
    root.querySelector('[data-remap-summary]').textContent = `${brand.brand} ${model.name} ${engine.name}`;
    root.querySelector('[data-power-stock-bar]').style.width = `${powerScale.stockPercent}%`;
    root.querySelector('[data-power-bar]').style.left = `${powerScale.stockPercent}%`;
    root.querySelector('[data-power-bar]').style.width = `${powerScale.gainPercent}%`;
    root.querySelector('[data-power-marker]').style.left = `${powerScale.stockPercent}%`;
    root.querySelector('[data-power-bar-label]').textContent = `+${powerGain} cv`;
    root.querySelector('[data-power-stock-label]').textContent = `Original ${engine.stockPower} cv`;
    root.querySelector('[data-power-tuned-label]').textContent = `Remap ${tunedPower} cv`;
    root.querySelector('[data-torque-stock-bar]').style.width = `${torqueScale.stockPercent}%`;
    root.querySelector('[data-torque-bar]').style.left = `${torqueScale.stockPercent}%`;
    root.querySelector('[data-torque-bar]').style.width = `${torqueScale.gainPercent}%`;
    root.querySelector('[data-torque-marker]').style.left = `${torqueScale.stockPercent}%`;
    root.querySelector('[data-torque-bar-label]').textContent = `+${torqueGain} Nm`;
    root.querySelector('[data-torque-stock-label]').textContent = `Original ${engine.stockTorque} Nm`;
    root.querySelector('[data-torque-tuned-label]').textContent = `Remap ${tunedTorque} Nm`;
  }

  brandSelect.addEventListener('change', fillModels);
  modelSelect.addEventListener('change', fillEngines);
  engineSelect.addEventListener('change', updateResult);
  modeButtons.forEach(button => {
    button.addEventListener('click', () => {
      mode = button.dataset.remapMode;
      modeButtons.forEach(item => item.classList.toggle('active', item === button));
      updateResult();
    });
  });

  fillBrands();
}

async function fetchRemapApi(action, params = {}) {
  const url = new URL(window.REMAP_API_URL || 'api/remap.php', window.location.href);
  url.searchParams.set('action', action);
  Object.entries(params).forEach(([key, value]) => url.searchParams.set(key, value));

  const response = await fetch(url, { headers: { Accept: 'application/json' } });
  if (!response.ok) throw new Error(`Remap API error: ${action}`);
  return response.json();
}

function initPerformanceCalculatorApi() {
  const root = document.querySelector('[data-remap-calculator]');
  if (!root) return;

  const brandSelect = root.querySelector('[data-remap-brand]');
  const modelSelect = root.querySelector('[data-remap-model]');
  const engineSelect = root.querySelector('[data-remap-engine]');
  const modeButtons = [...root.querySelectorAll('[data-remap-mode]')];
  const modeRow = root.querySelector('.remap-mode-row');
  let mode = 'stage1';
  let brands = [];
  let models = [];
  let engines = [];

  modeButtons.forEach(button => {
    if (button.dataset.remapMode === 'eco') button.hidden = true;
  });
  if (modeRow) modeRow.style.gridTemplateColumns = '1fr';

  function setText(selector, value) {
    root.querySelector(selector).textContent = value;
  }

  function resetResult(message = 'Seleciona marca, modelo e motor') {
    setText('[data-stock-power]', '--');
    setText('[data-tuned-power]', '--');
    setText('[data-power-gain]', '--');
    setText('[data-stock-torque]', '--');
    setText('[data-tuned-torque]', '--');
    setText('[data-torque-gain]', '--');
    setText('[data-remap-title]', 'Seleciona uma viatura');
    setText('[data-remap-copy]', 'Escolhe a marca, modelo e motor para veres os ganhos estimados.');
    setText('[data-remap-summary]', message);
    setText('[data-power-bar-label]', '+-- cv');
    setText('[data-torque-bar-label]', '+-- Nm');
    setText('[data-power-stock-label]', 'Original -- cv');
    setText('[data-power-tuned-label]', 'Remap -- cv');
    setText('[data-torque-stock-label]', 'Original -- Nm');
    setText('[data-torque-tuned-label]', 'Remap -- Nm');
    root.querySelector('[data-power-stock-bar]').style.width = '0';
    root.querySelector('[data-power-bar]').style.left = '0';
    root.querySelector('[data-power-bar]').style.width = '0';
    root.querySelector('[data-power-marker]').style.left = '0';
    root.querySelector('[data-torque-stock-bar]').style.width = '0';
    root.querySelector('[data-torque-bar]').style.left = '0';
    root.querySelector('[data-torque-bar]').style.width = '0';
    root.querySelector('[data-torque-marker]').style.left = '0';
  }

  function setLoading(message) {
    root.querySelector('[data-remap-summary]').textContent = message;
  }

  function updateResult() {
    const brand = brandSelect.value;
    const model = modelSelect.value;
    const engine = engines.find(item => String(item.id || item.name) === engineSelect.value);
    if (!engine) return;

    const hasEco = Number.isFinite(engine.ecoPower) && Number.isFinite(engine.ecoTorque);
    const tunedPower = mode === 'eco' && hasEco ? engine.ecoPower : engine.stage1Power;
    const tunedTorque = mode === 'eco' && hasEco ? engine.ecoTorque : engine.stage1Torque;
    const powerGain = tunedPower - engine.stockPower;
    const torqueGain = tunedTorque - engine.stockTorque;
    const powerScale = barScale(engine.stockPower, tunedPower);
    const torqueScale = barScale(engine.stockTorque, tunedTorque);

    setText('[data-stock-power]', engine.stockPower);
    setText('[data-tuned-power]', tunedPower);
    setText('[data-power-gain]', `+${powerGain}`);
    setText('[data-stock-torque]', engine.stockTorque);
    setText('[data-tuned-torque]', tunedTorque);
    setText('[data-torque-gain]', `+${torqueGain}`);
    setText('[data-remap-title]', `${brand} ${model}`);
    setText('[data-remap-copy]', `${engine.name} - ${engine.fuel} - Stage 1 com ganhos estimados de +${powerGain} cv e +${torqueGain} Nm.`);
    root.querySelector('[data-remap-summary]').textContent = `${brand} ${model} ${engine.name}`;
    root.querySelector('[data-power-stock-bar]').style.width = `${powerScale.stockPercent}%`;
    root.querySelector('[data-power-bar]').style.left = `${powerScale.stockPercent}%`;
    root.querySelector('[data-power-bar]').style.width = `${powerScale.gainPercent}%`;
    root.querySelector('[data-power-marker]').style.left = `${powerScale.stockPercent}%`;
    root.querySelector('[data-power-bar-label]').textContent = `+${powerGain} cv`;
    root.querySelector('[data-power-stock-label]').textContent = `Original ${engine.stockPower} cv`;
    root.querySelector('[data-power-tuned-label]').textContent = `Remap ${tunedPower} cv`;
    root.querySelector('[data-torque-stock-bar]').style.width = `${torqueScale.stockPercent}%`;
    root.querySelector('[data-torque-bar]').style.left = `${torqueScale.stockPercent}%`;
    root.querySelector('[data-torque-bar]').style.width = `${torqueScale.gainPercent}%`;
    root.querySelector('[data-torque-marker]').style.left = `${torqueScale.stockPercent}%`;
    root.querySelector('[data-torque-bar-label]').textContent = `+${torqueGain} Nm`;
    root.querySelector('[data-torque-stock-label]').textContent = `Original ${engine.stockTorque} Nm`;
    root.querySelector('[data-torque-tuned-label]').textContent = `Remap ${tunedTorque} Nm`;
  }

  async function fillEngines() {
    if (!brandSelect.value || !modelSelect.value) return;
    setLoading('A carregar motores...');
    engineSelect.disabled = true;
    engineSelect.innerHTML = placeholderOption('Escolhe o motor');
    resetResult('Escolhe o motor');
    engines = await fetchRemapApi('engines', {
      brand: brandSelect.value,
      model: modelSelect.value
    });
    engineSelect.innerHTML = placeholderOption('Escolhe o motor') + engines.map(item => option(item.name, item.id || item.name)).join('');
    engineSelect.disabled = false;
  }

  async function fillModels() {
    if (!brandSelect.value) return;
    setLoading('A carregar modelos...');
    modelSelect.disabled = true;
    engineSelect.disabled = true;
    modelSelect.innerHTML = placeholderOption('Escolhe o modelo');
    engineSelect.innerHTML = placeholderOption('Escolhe o motor');
    engines = [];
    resetResult('Escolhe o modelo');
    models = await fetchRemapApi('models', { brand: brandSelect.value });
    modelSelect.innerHTML = placeholderOption('Escolhe o modelo') + models.map(item => option(item.name)).join('');
    modelSelect.disabled = false;
  }

  async function fillBrands() {
    setLoading('A carregar marcas...');
    brandSelect.disabled = true;
    modelSelect.disabled = true;
    engineSelect.disabled = true;
    brandSelect.innerHTML = placeholderOption('A carregar marcas...');
    modelSelect.innerHTML = placeholderOption('Escolhe o modelo');
    engineSelect.innerHTML = placeholderOption('Escolhe o motor');
    resetResult();
    brands = await fetchRemapApi('brands');
    brandSelect.innerHTML = placeholderOption('Escolhe a marca') + brands.map(item => option(item.brand)).join('');
    brandSelect.disabled = false;
    resetResult();
  }

  brandSelect.addEventListener('change', () => fillModels().catch(handleApiError));
  modelSelect.addEventListener('change', () => fillEngines().catch(handleApiError));
  engineSelect.addEventListener('change', updateResult);
  modeButtons.forEach(button => {
    button.addEventListener('click', () => {
      mode = button.dataset.remapMode;
      modeButtons.forEach(item => item.classList.toggle('active', item === button));
      updateResult();
    });
  });

  function handleApiError(error) {
    console.warn(error);
    brandSelect.innerHTML = placeholderOption('Marca indisponivel');
    modelSelect.innerHTML = placeholderOption('Modelo indisponivel');
    engineSelect.innerHTML = placeholderOption('Motor indisponivel');
    brandSelect.disabled = true;
    modelSelect.disabled = true;
    engineSelect.disabled = true;
    resetResult('Nao foi possivel carregar a calculadora');
  }

  fillBrands().catch(handleApiError);
}

hydrateCreativePowerContent();
initPerformanceCalculatorApi();
