// ==========================================
// merit-calculator.js — University Merit/Aggregate Calculator
// Supports FAST, COMSATS, UET, LUMS formulas
// Each university has different weightage criteria
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
  const uniSelect = document.getElementById('university');
  const formulaDesc = document.getElementById('formula-desc');
  const fieldsContainer = document.getElementById('dynamic-fields');
  const calcBtn = document.getElementById('calculate-btn');
  const resultBox = document.getElementById('result-box');

  // University formulas and field definitions
  const universities = {
    fast: {
      name: 'FAST-NUCES',
      formula: '10% Matric + 40% Inter + 50% NAT/NTS',
      fields: [
        { id: 'matric-obtained', label: 'Matric Obtained Marks', placeholder: 'e.g. 950' },
        { id: 'matric-total', label: 'Matric Total Marks', value: '1100' },
        { id: 'inter-obtained', label: 'Inter Obtained Marks', placeholder: 'e.g. 880' },
        { id: 'inter-total', label: 'Inter Total Marks', value: '1100' },
        { id: 'nat-obtained', label: 'NAT/NTS Obtained Marks', placeholder: 'e.g. 75' },
        { id: 'nat-total', label: 'NAT/NTS Total Marks', value: '100' },
      ],
      calc: (vals) => {
        const matric = (vals['matric-obtained'] / vals['matric-total']) * 100;
        const inter = (vals['inter-obtained'] / vals['inter-total']) * 100;
        const nat = (vals['nat-obtained'] / vals['nat-total']) * 100;
        return { aggregate: matric * 0.10 + inter * 0.40 + nat * 0.50, breakdown: { 'Matric': matric, 'Inter': inter, 'NAT/NTS': nat } };
      }
    },
    comsats: {
      name: 'COMSATS University',
      formula: '10% Matric + 40% Inter + 50% NTS/Entry Test',
      fields: [
        { id: 'matric-obtained', label: 'Matric Obtained Marks', placeholder: 'e.g. 950' },
        { id: 'matric-total', label: 'Matric Total Marks', value: '1100' },
        { id: 'inter-obtained', label: 'Inter Obtained Marks', placeholder: 'e.g. 880' },
        { id: 'inter-total', label: 'Inter Total Marks', value: '1100' },
        { id: 'nts-obtained', label: 'NTS Obtained Marks', placeholder: 'e.g. 70' },
        { id: 'nts-total', label: 'NTS Total Marks', value: '100' },
      ],
      calc: (vals) => {
        const matric = (vals['matric-obtained'] / vals['matric-total']) * 100;
        const inter = (vals['inter-obtained'] / vals['inter-total']) * 100;
        const nts = (vals['nts-obtained'] / vals['nts-total']) * 100;
        return { aggregate: matric * 0.10 + inter * 0.40 + nts * 0.50, breakdown: { 'Matric': matric, 'Inter': inter, 'NTS': nts } };
      }
    },
    uet: {
      name: 'UET Lahore',
      formula: '30% Inter/FSc + 70% ECAT Entry Test',
      fields: [
        { id: 'inter-obtained', label: 'Inter/FSc Obtained Marks', placeholder: 'e.g. 920' },
        { id: 'inter-total', label: 'Inter/FSc Total Marks', value: '1100' },
        { id: 'ecat-obtained', label: 'ECAT Obtained Marks', placeholder: 'e.g. 280' },
        { id: 'ecat-total', label: 'ECAT Total Marks', value: '400' },
      ],
      calc: (vals) => {
        const inter = (vals['inter-obtained'] / vals['inter-total']) * 100;
        const ecat = (vals['ecat-obtained'] / vals['ecat-total']) * 100;
        return { aggregate: inter * 0.30 + ecat * 0.70, breakdown: { 'Inter/FSc': inter, 'ECAT': ecat } };
      }
    },
    lums: {
      name: 'LUMS (Lahore University)',
      formula: '100% SAT or LUMS-specific test (LCAT/SBASSE). Merit is holistic — this estimates academic score.',
      fields: [
        { id: 'inter-obtained', label: 'Inter/A-Level Obtained Marks', placeholder: 'e.g. 920' },
        { id: 'inter-total', label: 'Inter/A-Level Total Marks', value: '1100' },
        { id: 'sat-obtained', label: 'SAT / LCAT Score', placeholder: 'e.g. 1350' },
        { id: 'sat-total', label: 'SAT / LCAT Total', value: '1600' },
      ],
      calc: (vals) => {
        const inter = (vals['inter-obtained'] / vals['inter-total']) * 100;
        const sat = (vals['sat-obtained'] / vals['sat-total']) * 100;
        // LUMS is holistic; estimate: 50% academics + 50% test
        return { aggregate: inter * 0.50 + sat * 0.50, breakdown: { 'Academics': inter, 'SAT/LCAT': sat } };
      }
    }
  };

  // Render input fields for selected university
  function renderFields() {
    const uni = universities[uniSelect.value];
    formulaDesc.innerHTML = `<strong>${uni.name} Formula:</strong> ${uni.formula}`;

    // Build fields in pairs (obtained + total side by side)
    let html = '';
    const fields = uni.fields;
    for (let i = 0; i < fields.length; i += 2) {
      html += '<div class="grid-2">';
      html += `<div class="form-group"><label>${fields[i].label}</label><input type="number" id="${fields[i].id}" min="0" placeholder="${fields[i].placeholder || ''}" value="${fields[i].value || ''}"></div>`;
      if (fields[i + 1]) {
        html += `<div class="form-group"><label>${fields[i + 1].label}</label><input type="number" id="${fields[i + 1].id}" min="1" placeholder="${fields[i + 1].placeholder || ''}" value="${fields[i + 1].value || ''}"></div>`;
      }
      html += '</div>';
    }
    fieldsContainer.innerHTML = html;
    resultBox.classList.add('hidden');
  }

  // Re-render fields when university changes
  uniSelect.addEventListener('change', renderFields);
  renderFields(); // Initial render

  // Calculate aggregate
  calcBtn.addEventListener('click', () => {
    const uni = universities[uniSelect.value];
    const vals = {};
    uni.fields.forEach(f => {
      vals[f.id] = parseFloat(document.getElementById(f.id).value) || 0;
    });

    const result = uni.calc(vals);
    document.getElementById('aggregate').textContent = result.aggregate.toFixed(2) + '%';
    document.getElementById('uni-name').textContent = uni.name;

    // Show breakdown
    const breakdownEl = document.getElementById('breakdown');
    breakdownEl.innerHTML = Object.entries(result.breakdown)
      .map(([label, pct]) => `<p>${label}: <strong>${pct.toFixed(2)}%</strong></p>`)
      .join('');

    resultBox.classList.remove('hidden');
    resultBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });
});
