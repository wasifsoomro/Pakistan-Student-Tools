// ==========================================
// cgpa-calculator.js — CGPA Calculator
// Supports 4.0 and 5.0 grading scales
// Calculates semester and cumulative CGPA
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('courses-container');
  const addBtn = document.getElementById('add-course');
  const calcBtn = document.getElementById('calculate-btn');
  const resultBox = document.getElementById('result-box');
  const scaleSelect = document.getElementById('gpa-scale');
  let courseCount = 0;

  // Grade points mapping for 4.0 scale
  const gradePoints4 = {
    'A+': 4.0, 'A': 4.0, 'A-': 3.67,
    'B+': 3.33, 'B': 3.0, 'B-': 2.67,
    'C+': 2.33, 'C': 2.0, 'C-': 1.67,
    'D+': 1.33, 'D': 1.0, 'F': 0.0
  };

  // Grade points mapping for 5.0 scale
  const gradePoints5 = {
    'A+': 5.0, 'A': 4.0, 'B+': 3.5,
    'B': 3.0, 'B-': 2.5, 'C+': 2.0,
    'C': 1.5, 'C-': 1.0, 'D': 0.5, 'F': 0.0
  };

  // Returns grade options HTML based on selected scale
  function getGradeOptions() {
    const scale = scaleSelect.value;
    const grades = scale === '5' ? Object.keys(gradePoints5) : Object.keys(gradePoints4);
    return grades.map(g => `<option value="${g}">${g}</option>`).join('');
  }

  // Creates a new course input row
  function createCourseRow() {
    courseCount++;
    const row = document.createElement('div');
    row.className = 'subject-row';
    row.innerHTML = `
      <div class="form-group">
        <label>Course ${courseCount}</label>
        <input type="text" placeholder="e.g. Calculus" class="course-name">
      </div>
      <div class="form-group">
        <label>Credit Hours</label>
        <input type="number" min="1" max="6" value="3" class="credit-hours">
      </div>
      <div class="form-group">
        <label>Grade</label>
        <select class="grade">${getGradeOptions()}</select>
      </div>
      <button type="button" class="btn btn-secondary remove-btn">&times;</button>
    `;
    row.querySelector('.remove-btn').addEventListener('click', () => {
      row.remove();
      renumberCourses();
    });
    container.appendChild(row);
  }

  // Re-labels course rows after removal
  function renumberCourses() {
    const rows = container.querySelectorAll('.subject-row');
    courseCount = rows.length;
    rows.forEach((row, i) => {
      row.querySelector('label').textContent = `Course ${i + 1}`;
    });
  }

  // Rebuild grade dropdowns when scale changes
  scaleSelect.addEventListener('change', () => {
    container.querySelectorAll('.grade').forEach(sel => {
      const current = sel.value;
      sel.innerHTML = getGradeOptions();
      // Try to keep selected grade if it exists in new scale
      if ([...sel.options].some(o => o.value === current)) {
        sel.value = current;
      }
    });
  });

  // Start with 5 course rows
  for (let i = 0; i < 5; i++) createCourseRow();

  addBtn.addEventListener('click', createCourseRow);

  // Calculate CGPA: sum(credit * gradePoint) / sum(credits)
  calcBtn.addEventListener('click', () => {
    const scale = scaleSelect.value;
    const gradeMap = scale === '5' ? gradePoints5 : gradePoints4;
    const rows = container.querySelectorAll('.subject-row');
    let totalPoints = 0, totalCredits = 0;

    rows.forEach(row => {
      const credits = parseFloat(row.querySelector('.credit-hours').value) || 0;
      const grade = row.querySelector('.grade').value;
      const points = gradeMap[grade] ?? 0;
      totalPoints += credits * points;
      totalCredits += credits;
    });

    if (totalCredits === 0) return;

    const cgpa = (totalPoints / totalCredits).toFixed(2);
    const maxGpa = scale === '5' ? '5.00' : '4.00';

    document.getElementById('cgpa').textContent = cgpa;
    document.getElementById('max-gpa').textContent = maxGpa;
    document.getElementById('total-credits').textContent = totalCredits;
    document.getElementById('total-points').textContent = totalPoints.toFixed(2);

    // Percentage estimate (for 4.0 scale: CGPA * 25, for 5.0: CGPA * 20)
    const pctEstimate = scale === '5' ? (cgpa * 20).toFixed(1) : (cgpa * 25).toFixed(1);
    document.getElementById('pct-estimate').textContent = pctEstimate + '%';

    resultBox.classList.remove('hidden');
    resultBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });
});
