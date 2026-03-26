// ==========================================
// nust-calculator.js — NUST Aggregate Calculator
// Formula: 10% Matric + 40% Inter + 50% NET (Entry Test)
// Based on commonly used NUST admission criteria
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
  const calcBtn = document.getElementById('calculate-btn');
  const resultBox = document.getElementById('result-box');

  // Calculate NUST aggregate when button is clicked
  // Validate a pair of obtained/total fields
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
    // Validate all inputs
    const v1 = validatePair('matric-obtained', 'matric-total');
    const v2 = validatePair('inter-obtained', 'inter-total');
    const v3 = validatePair('entry-obtained', 'entry-total');
    if (!v1 || !v2 || !v3) { alert('Please check highlighted fields. Obtained marks cannot exceed total marks.'); return; }

    // Read Matric (SSC) marks — 10% weightage
    const matricObtained = parseFloat(document.getElementById('matric-obtained').value) || 0;
    const matricTotal = parseFloat(document.getElementById('matric-total').value) || 1100;

    // Read Intermediate (HSSC) marks — 40% weightage
    const interObtained = parseFloat(document.getElementById('inter-obtained').value) || 0;
    const interTotal = parseFloat(document.getElementById('inter-total').value) || 1100;

    // Read NET Entry Test marks — 50% weightage
    const entryObtained = parseFloat(document.getElementById('entry-obtained').value) || 0;
    const entryTotal = parseFloat(document.getElementById('entry-total').value) || 200;

    // Convert each to percentage
    const matricPct = matricTotal > 0 ? (matricObtained / matricTotal * 100) : 0;
    const interPct = interTotal > 0 ? (interObtained / interTotal * 100) : 0;
    const entryPct = entryTotal > 0 ? (entryObtained / entryTotal * 100) : 0;

    // Apply NUST aggregate formula: 10% Matric + 40% Inter + 50% Entry Test
    const aggregate = (matricPct * 0.10) + (interPct * 0.40) + (entryPct * 0.50);

    // Display breakdown and final aggregate
    document.getElementById('matric-pct').textContent = matricPct.toFixed(2) + '%';
    document.getElementById('inter-pct').textContent = interPct.toFixed(2) + '%';
    document.getElementById('entry-pct').textContent = entryPct.toFixed(2) + '%';
    document.getElementById('aggregate').textContent = aggregate.toFixed(2) + '%';
    resultBox.classList.remove('hidden');
    resultBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });
});
