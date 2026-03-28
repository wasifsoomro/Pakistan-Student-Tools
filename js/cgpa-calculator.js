// ==========================================
// cgpa-calculator.js — GPA & CGPA Calculator
// Tab 1: Semester GPA (courses → GPA)
// Tab 2: Cumulative CGPA (semester GPAs → CGPA)
// Supports 4.0 and 5.0 grading scales
// ==========================================

document.addEventListener('DOMContentLoaded', () => {

  // === Tab switching ===
  const tabs = document.querySelectorAll('.calc-tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
      tab.classList.add('active');
      document.getElementById(tab.dataset.tab).classList.add('active');
    });
  });

  // === Grade maps ===
  const gradePoints4 = {
    'A+': 4.0, 'A': 4.0, 'A-': 3.67,
    'B+': 3.33, 'B': 3.0, 'B-': 2.67,
    'C+': 2.33, 'C': 2.0, 'C-': 1.67,
    'D+': 1.33, 'D': 1.0, 'F': 0.0
  };
  const gradePoints5 = {
    'A+': 5.0, 'A': 4.0, 'B+': 3.5,
    'B': 3.0, 'B-': 2.5, 'C+': 2.0,
    'C': 1.5, 'C-': 1.0, 'D': 0.5, 'F': 0.0
  };

  // =============================================
  // TAB 1: Semester GPA Calculator
  // =============================================
  const container = document.getElementById('courses-container');
  const addBtn = document.getElementById('add-course');
  const calcBtn = document.getElementById('calculate-btn');
  const resultBox = document.getElementById('result-box');
  const scaleSelect = document.getElementById('gpa-scale');
  let courseCount = 0;

  function getGradeOptions() {
    const scale = scaleSelect.value;
    const grades = scale === '5' ? Object.keys(gradePoints5) : Object.keys(gradePoints4);
    return grades.map(g => `<option value="${g}">${g}</option>`).join('');
  }

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

  function renumberCourses() {
    const rows = container.querySelectorAll('.subject-row');
    courseCount = rows.length;
    rows.forEach((row, i) => {
      row.querySelector('label').textContent = `Course ${i + 1}`;
    });
  }

  scaleSelect.addEventListener('change', () => {
    container.querySelectorAll('.grade').forEach(sel => {
      const current = sel.value;
      sel.innerHTML = getGradeOptions();
      if ([...sel.options].some(o => o.value === current)) sel.value = current;
    });
  });

  for (let i = 0; i < 5; i++) createCourseRow();
  addBtn.addEventListener('click', createCourseRow);

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

    if (totalCredits === 0) {
      if (window.showCalcError) window.showCalcError('Please enter at least one course with credit hours.');
      return;
    }

    const gpa = (totalPoints / totalCredits).toFixed(2);
    const maxGpa = scale === '5' ? '5.00' : '4.00';

    document.getElementById('cgpa').textContent = gpa;
    document.getElementById('max-gpa').textContent = maxGpa;
    document.getElementById('total-credits').textContent = totalCredits;
    document.getElementById('total-points').textContent = totalPoints.toFixed(2);

    const pctEstimate = scale === '5' ? (gpa * 20).toFixed(1) : (gpa * 25).toFixed(1);
    document.getElementById('pct-estimate').textContent = pctEstimate + '%';

    resultBox.classList.remove('hidden');
    resultBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });

  // =============================================
  // TAB 2: Cumulative CGPA Calculator
  // =============================================
  const semContainer = document.getElementById('semesters-container');
  const addSemBtn = document.getElementById('add-semester');
  const calcCgpaBtn = document.getElementById('calculate-cgpa-btn');
  const cgpaResultBox = document.getElementById('cgpa-result-box');
  const cgpaScaleSelect = document.getElementById('cgpa-scale');
  let semCount = 0;

  function createSemesterRow() {
    semCount++;
    const row = document.createElement('div');
    row.className = 'semester-row';
    const maxGpa = cgpaScaleSelect.value === '5' ? '5.0' : '4.0';
    row.innerHTML = `
      <span class="sem-label">Semester ${semCount}</span>
      <div class="form-group">
        <label>GPA</label>
        <input type="number" min="0" max="${maxGpa}" step="0.01" placeholder="e.g. 3.45" class="sem-gpa">
      </div>
      <div class="form-group">
        <label>Credit Hours</label>
        <input type="number" min="1" max="30" placeholder="e.g. 18" class="sem-credits">
      </div>
      <button type="button" class="btn btn-secondary remove-btn">&times;</button>
    `;
    row.querySelector('.remove-btn').addEventListener('click', () => {
      row.remove();
      renumberSemesters();
    });
    semContainer.appendChild(row);
  }

  function renumberSemesters() {
    const rows = semContainer.querySelectorAll('.semester-row');
    semCount = rows.length;
    rows.forEach((row, i) => {
      row.querySelector('.sem-label').textContent = `Semester ${i + 1}`;
    });
  }

  // Update max GPA when scale changes
  cgpaScaleSelect.addEventListener('change', () => {
    const maxGpa = cgpaScaleSelect.value === '5' ? '5.0' : '4.0';
    semContainer.querySelectorAll('.sem-gpa').forEach(inp => {
      inp.max = maxGpa;
    });
  });

  // Start with 4 semester rows
  for (let i = 0; i < 4; i++) createSemesterRow();
  addSemBtn.addEventListener('click', createSemesterRow);

  calcCgpaBtn.addEventListener('click', () => {
    const scale = cgpaScaleSelect.value;
    const maxGpaVal = scale === '5' ? 5.0 : 4.0;
    const rows = semContainer.querySelectorAll('.semester-row');
    let totalWeighted = 0, totalCredits = 0, validSemesters = 0;
    let hasError = false;

    rows.forEach(row => {
      const gpaInput = row.querySelector('.sem-gpa');
      const credInput = row.querySelector('.sem-credits');
      const gpa = parseFloat(gpaInput.value);
      const credits = parseFloat(credInput.value);

      gpaInput.classList.remove('input-error');
      credInput.classList.remove('input-error');

      if (isNaN(gpa) && isNaN(credits)) return; // skip empty rows

      if (isNaN(gpa) || gpa < 0 || gpa > maxGpaVal) {
        gpaInput.classList.add('input-error');
        hasError = true;
      }
      if (isNaN(credits) || credits <= 0) {
        credInput.classList.add('input-error');
        hasError = true;
      }

      if (!hasError) {
        totalWeighted += gpa * credits;
        totalCredits += credits;
        validSemesters++;
      }
    });

    if (hasError) {
      if (window.showCalcError) window.showCalcError(`Please check highlighted fields. GPA must be between 0 and ${maxGpaVal}.`);
      return;
    }

    if (totalCredits === 0) {
      if (window.showCalcError) window.showCalcError('Please enter at least one semester with GPA and credit hours.');
      return;
    }

    const cgpa = (totalWeighted / totalCredits).toFixed(2);
    const pctEstimate = scale === '5' ? (cgpa * 20).toFixed(1) : (cgpa * 25).toFixed(1);

    document.getElementById('cumulative-cgpa').textContent = cgpa;
    document.getElementById('cgpa-max-gpa').textContent = maxGpaVal.toFixed(2);
    document.getElementById('total-semesters').textContent = validSemesters;
    document.getElementById('cgpa-total-credits').textContent = totalCredits;
    document.getElementById('cgpa-pct-estimate').textContent = pctEstimate + '%';

    cgpaResultBox.classList.remove('hidden');
    cgpaResultBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    // Show CGPA share sections (hardcoded in HTML)
    const cgpaShareResult = document.getElementById('cgpa-share-result');
    const cgpaShareTool = document.getElementById('cgpa-share-tool');
    const cgpaShareText = document.getElementById('cgpa-share-text');
    const pageName = document.title.split('—')[0].trim();
    const shareMsg = `I just calculated my result using ${pageName} and got ${cgpa} CGPA! Check yours here: ${window.location.href}`;

    if (cgpaShareResult) cgpaShareResult.classList.remove('hidden');
    if (cgpaShareTool) cgpaShareTool.classList.remove('hidden');
    if (cgpaShareText) cgpaShareText.textContent = `"${shareMsg}"`;

    // WhatsApp share result
    document.getElementById('cgpa-wa-btn').onclick = () => {
      window.open(`https://wa.me/?text=${encodeURIComponent(shareMsg)}`, '_blank');
    };
    // Copy result message
    document.getElementById('cgpa-copy-btn').onclick = function() {
      navigator.clipboard.writeText(shareMsg).then(() => {
        this.textContent = 'Copied!';
        this.classList.add('copied');
        setTimeout(() => { this.textContent = 'Copy Message'; this.classList.remove('copied'); }, 2000);
      });
    };
    // WhatsApp share tool
    document.getElementById('cgpa-wa-tool').onclick = () => {
      window.open(`https://wa.me/?text=${encodeURIComponent('I used this free student calculator, it\'s very useful: ' + window.location.href)}`, '_blank');
    };
    // Copy link
    document.getElementById('cgpa-copy-link').onclick = function() {
      navigator.clipboard.writeText(window.location.href).then(() => {
        this.textContent = 'Link copied!';
        this.classList.add('copied');
        setTimeout(() => { this.textContent = 'Copy Link'; this.classList.remove('copied'); }, 2000);
      });
    };
  });
});
