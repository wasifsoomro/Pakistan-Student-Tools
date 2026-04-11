// ==========================================
// required-marks-calculator.js — Required Marks Calculator
// Formula: Required = (Target% / 100 × Grand Total) − Obtained
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
  const calcBtn = document.getElementById('calculate-btn');
  const resultBox = document.getElementById('result-box');

  calcBtn.addEventListener('click', () => {
    const obtained = parseFloat(document.getElementById('marks-obtained').value);
    const completedTotal = parseFloat(document.getElementById('marks-total').value);
    const remainingTotal = parseFloat(document.getElementById('remaining-total').value);
    const targetPct = parseFloat(document.getElementById('target-percentage').value);

    // Clear previous errors
    document.querySelectorAll('.input-error').forEach(el => el.classList.remove('input-error'));

    // Validate
    let hasError = false;
    if (isNaN(obtained) || obtained < 0) {
      document.getElementById('marks-obtained').classList.add('input-error'); hasError = true;
    }
    if (isNaN(completedTotal) || completedTotal < 0) {
      document.getElementById('marks-total').classList.add('input-error'); hasError = true;
    }
    if (isNaN(remainingTotal) || remainingTotal <= 0) {
      document.getElementById('remaining-total').classList.add('input-error'); hasError = true;
    }
    if (isNaN(targetPct) || targetPct <= 0 || targetPct > 100) {
      document.getElementById('target-percentage').classList.add('input-error'); hasError = true;
    }
    if (!hasError && obtained > completedTotal) {
      document.getElementById('marks-obtained').classList.add('input-error');
      if (window.showCalcError) window.showCalcError('Obtained marks cannot exceed total marks of completed exams.');
      return;
    }
    if (hasError) {
      if (window.showCalcError) window.showCalcError('Please fill in all fields correctly.');
      return;
    }

    const grandTotal = completedTotal + remainingTotal;
    const targetMarks = (targetPct / 100) * grandTotal;
    const required = targetMarks - obtained;

    document.getElementById('remaining-display').textContent = remainingTotal;
    document.getElementById('target-display').textContent = targetPct + '%';

    const msgEl = document.getElementById('result-message');

    if (required <= 0) {
      document.getElementById('required-marks').textContent = '0';
      msgEl.style.color = '#16a34a';
      msgEl.textContent = 'You have already achieved your target of ' + targetPct + '%! Your current percentage is ' + (obtained / grandTotal * 100).toFixed(2) + '%.';
    } else if (required > remainingTotal) {
      document.getElementById('required-marks').textContent = Math.ceil(required);
      const maxPossible = ((obtained + remainingTotal) / grandTotal * 100).toFixed(2);
      msgEl.style.color = '#dc2626';
      msgEl.textContent = 'Your target of ' + targetPct + '% is not achievable. The maximum you can reach is ' + maxPossible + '%.';
    } else {
      document.getElementById('required-marks').textContent = Math.ceil(required);
      const requiredPctInRemaining = (required / remainingTotal * 100).toFixed(2);
      msgEl.style.color = '#2563eb';
      msgEl.textContent = 'You need ' + requiredPctInRemaining + '% in your remaining exams to achieve ' + targetPct + '% overall.';
    }

    resultBox.classList.remove('hidden');
    resultBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });
});
