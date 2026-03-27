// ==========================================
// uni-aggregate.js — Universal university aggregate calculator
// Each university page defines its formula via data attributes
// on #aggregate-config element:
//   data-fields: JSON array of {id, label, placeholder, value}
//   data-weights: JSON array of {id, weight} matching field IDs (obtained ones)
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
  const config = document.getElementById('aggregate-config');
  if (!config) return;

  const fields = JSON.parse(config.dataset.fields);
  const weights = JSON.parse(config.dataset.weights);
  const container = document.getElementById('uni-fields');
  const calcBtn = document.getElementById('calculate-btn');
  const resultBox = document.getElementById('result-box');

  // Render input fields in pairs (obtained + total)
  let html = '';
  for (let i = 0; i < fields.length; i += 2) {
    html += '<div class="grid-2 mb-1">';
    html += `<div class="form-group"><label>${fields[i].label}</label><input type="number" id="${fields[i].id}" min="0" placeholder="${fields[i].placeholder || ''}" value="${fields[i].value || ''}"></div>`;
    if (fields[i + 1]) {
      html += `<div class="form-group"><label>${fields[i + 1].label}</label><input type="number" id="${fields[i + 1].id}" min="1" placeholder="${fields[i + 1].placeholder || ''}" value="${fields[i + 1].value || ''}"></div>`;
    }
    html += '</div>';
  }
  container.innerHTML = html;

  // Calculate aggregate using weighted percentages
  calcBtn.addEventListener('click', () => {
    let aggregate = 0;
    let breakdownHtml = '';
    let hasError = false;

    // Validate all inputs first
    weights.forEach(w => {
      const obtEl = document.getElementById(w.obtainedId);
      const totEl = document.getElementById(w.totalId);
      const obt = parseFloat(obtEl.value) || 0;
      const tot = parseFloat(totEl.value) || 0;
      obtEl.classList.remove('input-error');
      totEl.classList.remove('input-error');
      if (obt < 0) { obtEl.classList.add('input-error'); hasError = true; }
      if (tot <= 0) { totEl.classList.add('input-error'); hasError = true; }
      if (obt > tot && tot > 0) { obtEl.classList.add('input-error'); hasError = true; }
    });
    if (hasError) { if (window.showCalcError) window.showCalcError('Please check highlighted fields. Obtained marks cannot exceed total marks.'); return; }

    weights.forEach(w => {
      const obtained = parseFloat(document.getElementById(w.obtainedId).value) || 0;
      const total = parseFloat(document.getElementById(w.totalId).value) || 1;
      const pct = (obtained / total) * 100;
      const contribution = pct * w.weight;
      aggregate += contribution;
      breakdownHtml += `<p>${w.label}: <strong>${pct.toFixed(2)}%</strong> × ${(w.weight * 100).toFixed(0)}% = ${contribution.toFixed(2)}</p>`;
    });

    document.getElementById('aggregate').textContent = aggregate.toFixed(2) + '%';
    document.getElementById('breakdown').innerHTML = breakdownHtml;
    resultBox.classList.remove('hidden');
    resultBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });
});
