// ==========================================
// inter-calculator.js — Intermediate Percentage Calculator
// Calculates combined Part 1 + Part 2 HSSC percentage
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
  const calcBtn = document.getElementById('calculate-btn');
  const resultBox = document.getElementById('result-box');

  // Helper: validate obtained <= total and highlight errors
  function validateField(obtId, totId) {
    const obtEl = document.getElementById(obtId);
    const totEl = document.getElementById(totId);
    const obt = parseFloat(obtEl.value) || 0;
    const tot = parseFloat(totEl.value) || 0;
    obtEl.classList.remove('input-error');
    totEl.classList.remove('input-error');
    let valid = true;
    if (obt < 0) { obtEl.classList.add('input-error'); valid = false; }
    if (tot <= 0) { totEl.classList.add('input-error'); valid = false; }
    if (obt > tot && tot > 0) { obtEl.classList.add('input-error'); valid = false; }
    return valid;
  }

  // Calculate percentage when button is clicked
  calcBtn.addEventListener('click', () => {
    // Validate inputs
    const v1 = validateField('part1-obtained', 'part1-total');
    const v2 = validateField('part2-obtained', 'part2-total');
    if (!v1 || !v2) { if (window.showCalcError) window.showCalcError('Please check highlighted fields. Obtained marks cannot exceed total marks.'); return; }

    // Read Part 1 (HSSC-I) marks
    const part1Obtained = parseFloat(document.getElementById('part1-obtained').value) || 0;
    const part1Total = parseFloat(document.getElementById('part1-total').value) || 550;

    // Read Part 2 (HSSC-II) marks
    const part2Obtained = parseFloat(document.getElementById('part2-obtained').value) || 0;
    const part2Total = parseFloat(document.getElementById('part2-total').value) || 550;

    // Combine both parts
    const totalObtained = part1Obtained + part2Obtained;
    const totalMax = part1Total + part2Total;
    if (totalMax === 0) return; // Avoid division by zero

    // Calculate overall and individual percentages
    const pct = (totalObtained / totalMax * 100).toFixed(2);

    // Display results
    document.getElementById('obtained-marks').textContent = totalObtained;
    document.getElementById('total-marks').textContent = totalMax;
    document.getElementById('percentage').textContent = pct + '%';
    document.getElementById('part1-pct').textContent = (part1Obtained / part1Total * 100).toFixed(2) + '%';
    document.getElementById('part2-pct').textContent = (part2Obtained / part2Total * 100).toFixed(2) + '%';
    resultBox.classList.remove('hidden');
    resultBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });
});
