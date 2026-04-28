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

async function fetchSwapTuneData() {
  const endpoint = window.SWAPTUNE_API_URL;
  if (!endpoint) return swapTuneFallbackData;

  try {
    const response = await fetch(endpoint, { headers: { Accept: 'application/json' } });
    if (!response.ok) throw new Error('Swap Tune API unavailable');
    return await response.json();
  } catch (error) {
    console.warn(error);
    return swapTuneFallbackData;
  }
}

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

function initPerformanceCalculator(data) {
  const root = document.querySelector('[data-remap-calculator]');
  if (!root || !data.length) return;

  const brandSelect = root.querySelector('[data-remap-brand]');
  const modelSelect = root.querySelector('[data-remap-model]');
  const engineSelect = root.querySelector('[data-remap-engine]');
  const modeButtons = [...root.querySelectorAll('[data-remap-mode]')];
  let mode = 'stage1';

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
    const tunedPower = mode === 'eco' ? engine.ecoPower : engine.stage1Power;
    const tunedTorque = mode === 'eco' ? engine.ecoTorque : engine.stage1Torque;
    const powerGain = tunedPower - engine.stockPower;
    const torqueGain = tunedTorque - engine.stockTorque;
    const powerPercent = Math.min(100, Math.round((tunedPower / Math.max(engine.stockPower, tunedPower)) * 100));
    const torquePercent = Math.min(100, Math.round((tunedTorque / Math.max(engine.stockTorque, tunedTorque)) * 100));

    setText('[data-stock-power]', engine.stockPower);
    setText('[data-tuned-power]', tunedPower);
    setText('[data-power-gain]', `+${powerGain}`);
    setText('[data-stock-torque]', engine.stockTorque);
    setText('[data-tuned-torque]', tunedTorque);
    setText('[data-torque-gain]', `+${torqueGain}`);
    setText('[data-remap-title]', `${brand.brand} ${model.name}`);
    setText('[data-remap-copy]', `${engine.name} - ${engine.fuel} - ${mode === 'eco' ? 'Eco map' : 'Stage 1'} com ganhos estimados de +${powerGain} cv e +${torqueGain} Nm.`);
    root.querySelector('[data-remap-summary]').textContent = `${brand.brand} ${model.name} ${engine.name}`;
    root.querySelector('[data-power-bar]').style.width = `${powerPercent}%`;
    root.querySelector('[data-torque-bar]').style.width = `${torquePercent}%`;
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

hydrateCreativePowerContent();
fetchSwapTuneData().then(initPerformanceCalculator);
