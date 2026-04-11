// ==========================================
// mdcat-calculator.js — MDCAT Aggregate Calculator
// Formula: 10% Matric + 40% FSc + 50% MDCAT (PMC Standard)
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
    const v3 = validatePair('mdcat-obtained', 'mdcat-total');
    if (!v1 || !v2 || !v3) {
      if (window.showCalcError) window.showCalcError('Please check highlighted fields. Obtained marks cannot exceed total marks.');
      return;
    }

    const matricObt = parseFloat(document.getElementById('matric-obtained').value) || 0;
    const matricTot = parseFloat(document.getElementById('matric-total').value) || 1100;
    const fscObt = parseFloat(document.getElementById('fsc-obtained').value) || 0;
    const fscTot = parseFloat(document.getElementById('fsc-total').value) || 1100;
    const mdcatObt = parseFloat(document.getElementById('mdcat-obtained').value) || 0;
    const mdcatTot = parseFloat(document.getElementById('mdcat-total').value) || 200;

    const matricPct = matricTot > 0 ? (matricObt / matricTot * 100) : 0;
    const fscPct = fscTot > 0 ? (fscObt / fscTot * 100) : 0;
    const mdcatPct = mdcatTot > 0 ? (mdcatObt / mdcatTot * 100) : 0;

    // PMC Formula: 10% Matric + 40% FSc + 50% MDCAT
    const aggregate = (matricPct * 0.10) + (fscPct * 0.40) + (mdcatPct * 0.50);

    document.getElementById('matric-pct').textContent = matricPct.toFixed(2) + '%';
    document.getElementById('fsc-pct').textContent = fscPct.toFixed(2) + '%';
    document.getElementById('mdcat-pct').textContent = mdcatPct.toFixed(2) + '%';
    document.getElementById('aggregate').textContent = aggregate.toFixed(2) + '%';

    // Merit message
    const msgEl = document.getElementById('merit-message');
    if (aggregate >= 90) {
      msgEl.style.color = '#16a34a';
      msgEl.textContent = 'Excellent! Strong chance for top government medical colleges.';
    } else if (aggregate >= 85) {
      msgEl.style.color = '#2563eb';
      msgEl.textContent = 'Competitive aggregate for most public medical colleges.';
    } else if (aggregate >= 80) {
      msgEl.style.color = '#d97706';
      msgEl.textContent = 'Good aggregate. Eligible for many public and private medical colleges.';
    } else {
      msgEl.style.color = '#64748b';
      msgEl.textContent = 'May qualify for private medical/dental colleges. Consider improving MDCAT score.';
    }

    resultBox.classList.remove('hidden');
    resultBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });
});
