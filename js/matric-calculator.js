// ==========================================
// matric-calculator.js — Matric Marks Calculator
// Handles dynamic subject rows and percentage calculation
// Reused by Punjab, Sindh, and FBISE board pages
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('subjects-container');
  const addBtn = document.getElementById('add-subject');
  const calcBtn = document.getElementById('calculate-btn');
  const resultBox = document.getElementById('result-box');
  const totalMarksEl = document.getElementById('total-marks');
  const obtainedMarksEl = document.getElementById('obtained-marks');
  const percentageEl = document.getElementById('percentage');
  let subjectCount = 0;

  // Creates a new subject input row with name, obtained marks, total marks, and remove button
  function createSubjectRow() {
    subjectCount++;
    const row = document.createElement('div');
    row.className = 'subject-row';
    row.innerHTML = `
      <div class="form-group">
        <label>Subject ${subjectCount}</label>
        <input type="text" placeholder="e.g. Mathematics" class="subject-name">
      </div>
      <div class="form-group">
        <label>Obtained</label>
        <input type="number" min="0" class="obtained" placeholder="0">
      </div>
      <div class="form-group">
        <label>Total</label>
        <input type="number" min="1" class="total" value="100">
      </div>
      <button type="button" class="btn btn-secondary remove-btn">&times;</button>
    `;
    // Attach remove handler to the X button
    row.querySelector('.remove-btn').addEventListener('click', () => {
      row.remove();
      renumberSubjects();
    });
    container.appendChild(row);
  }

  // Re-labels all subject rows after one is removed (keeps numbering sequential)
  function renumberSubjects() {
    const rows = container.querySelectorAll('.subject-row');
    subjectCount = rows.length;
    rows.forEach((row, i) => {
      row.querySelector('label').textContent = `Subject ${i + 1}`;
    });
  }

  // Initialize with 5 default subject rows
  for (let i = 0; i < 5; i++) createSubjectRow();

  // Add new subject row on button click
  addBtn.addEventListener('click', createSubjectRow);

  // Calculate total obtained, total marks, and percentage
  calcBtn.addEventListener('click', () => {
    const rows = container.querySelectorAll('.subject-row');
    if (rows.length === 0) { alert('Please add at least one subject.'); return; }

    let totalObtained = 0, totalMax = 0, hasError = false;

    // Validate and sum up obtained and total marks from all subject rows
    rows.forEach(row => {
      const obtainedInput = row.querySelector('.obtained');
      const totalInput = row.querySelector('.total');
      const obtained = parseFloat(obtainedInput.value) || 0;
      const total = parseFloat(totalInput.value) || 0;

      // Reset error styling
      obtainedInput.classList.remove('input-error');
      totalInput.classList.remove('input-error');

      // Validate: total must be > 0
      if (total <= 0) { totalInput.classList.add('input-error'); hasError = true; }
      // Validate: obtained must be >= 0 and <= total
      if (obtained < 0) { obtainedInput.classList.add('input-error'); hasError = true; }
      if (obtained > total && total > 0) { obtainedInput.classList.add('input-error'); hasError = true; }

      totalObtained += obtained;
      totalMax += total;
    });

    if (hasError) { alert('Please check highlighted fields. Obtained marks cannot exceed total marks.'); return; }
    if (totalMax === 0) return; // Avoid division by zero

    // Percentage formula: (obtained / total) × 100
    const pct = (totalObtained / totalMax * 100).toFixed(2);
    obtainedMarksEl.textContent = totalObtained;
    totalMarksEl.textContent = totalMax;
    percentageEl.textContent = pct + '%';
    resultBox.classList.remove('hidden');
    resultBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });
});
