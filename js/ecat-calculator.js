// ==========================================
// ecat-calculator.js — ECAT Aggregate Calculator
// Formula: 25% Matric + 45% FSc + 30% ECAT (UET Standard)
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
  const calcBtn = document.getElementById('calculate-btn');
  const resultBox = document.getElementById('result-box');

  function validatePair(obtId, totId) {
    const obtEl = document.getElementById(obtId);
    const totEl = document.getElementById(totId);
    const obt = parseFloat(obtEl.value) || 0;
    const tot = parseFloat(totEl.value) || 0;
    obtEl.classList.remove('input-error');
    totEl.classList.remove('input-error');
    let ok = true;
    if (obt < 0) { obtEl.classList.add('input-error'); ok = false; }
    if (tot <= 0) { totEl.classList.add('input-error'); ok = false; }
    if (obt > tot && tot > 0) { obtEl.classList.add('input-error'); ok = false; }
    return ok;
  }

  calcBtn.addEventListener('click', () => {
    const v1 = validatePair('matric-obtained', 'matric-total');
    const v2 = validatePair('fsc-obtained', 'fsc-total');
    const v3 = validatePair('ecat-obtained', 'ecat-total');
    if (!v1 || !v2 || !v3) {
      if (window.showCalcError) window.showCalcError('Please check highlighted fields. Obtained marks cannot exceed total marks.');
      return;
    }

    const matricObt = parseFloat(document.getElementById('matric-obtained').value) || 0;
    const matricTot = parseFloat(document.getElementById('matric-total').value) || 1100;
    const fscObt = parseFloat(document.getElementById('fsc-obtained').value) || 0;
    const fscTot = parseFloat(document.getElementById('fsc-total').value) || 1100;
    const ecatObt = parseFloat(document.getElementById('ecat-obtained').value) || 0;
    const ecatTot = parseFloat(document.getElementById('ecat-total').value) || 400;

    const matricPct = matricTot > 0 ? (matricObt / matricTot * 100) : 0;
    const fscPct = fscTot > 0 ? (fscObt / fscTot * 100) : 0;
    const ecatPct = ecatTot > 0 ? (ecatObt / ecatTot * 100) : 0;

    // UET Formula: 25% Matric + 45% FSc + 30% ECAT
    const aggregate = (matricPct * 0.25) + (fscPct * 0.45) + (ecatPct * 0.30);

    document.getElementById('matric-pct').textContent = matricPct.toFixed(2) + '%';
    document.getElementById('fsc-pct').textContent = fscPct.toFixed(2) + '%';
    document.getElementById('ecat-pct').textContent = ecatPct.toFixed(2) + '%';
    document.getElementById('aggregate').textContent = aggregate.toFixed(2) + '%';

    // Merit message
    const msgEl = document.getElementById('merit-message');
    if (aggregate >= 80) {
      msgEl.style.color = '#16a34a';
      msgEl.textContent = 'Excellent! Highly competitive for top UET programs like CS and Electrical.';
    } else if (aggregate >= 75) {
      msgEl.style.color = '#2563eb';
      msgEl.textContent = 'Good aggregate. Competitive for most UET engineering programs.';
    } else if (aggregate >= 70) {
      msgEl.style.color = '#d97706';
      msgEl.textContent = 'Decent aggregate. May qualify for several engineering programs at UET campuses.';
    } else {
      msgEl.style.color = '#64748b';
      msgEl.textContent = 'Consider improving your scores. Check cut-offs for your preferred program and campus.';
    }

    resultBox.classList.remove('hidden');
    resultBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });
});
